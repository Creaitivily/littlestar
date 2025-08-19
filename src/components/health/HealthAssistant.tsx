import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { openRouterService, type AIResponse, type ChildHealthContext } from '@/lib/openRouterService'
import { localHealthKnowledgeService, type ChildSummary } from '@/lib/localHealthKnowledge'
import { createWelcomeMessage } from '@/chatbotprompts/healthAssistant'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Brain,
  Zap,
  Phone,
  Baby
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  responseType?: 'local' | 'llm' | 'hybrid'
  modelUsed?: string
  tokensUsed?: number
  costCents?: number
  processingTimeMs?: number
  confidenceScore?: number
  emergencyDetected?: boolean
  safetyFlags?: Record<string, any>
}

interface QuickQuestion {
  text: string
  category: 'growth' | 'vaccination' | 'milestone' | 'nutrition' | 'general'
  icon: React.ComponentType<{ className?: string }>
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  { text: "Is my child's height normal for their age?", category: 'growth', icon: Baby },
  { text: "When is my child's next vaccine due?", category: 'vaccination', icon: AlertTriangle },
  { text: "What milestones should my child have reached?", category: 'milestone', icon: Brain },
  { text: "What foods should I introduce now?", category: 'nutrition', icon: Zap },
  { text: "How much should my child be eating?", category: 'nutrition', icon: Zap },
  { text: "Is my child's weight concerning?", category: 'growth', icon: Baby }
]

interface HealthAssistantProps {
  childId: string
}

export function HealthAssistant({ childId }: HealthAssistantProps) {
  const { user, children } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState({
    totalQueries: 0,
    localQueries: 0,
    apiQueries: 0,
    totalCostCents: 0,
    remainingBudgetCents: 100
  })
  const [childSummary, setChildSummary] = useState<ChildSummary | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadChildSummary()
    loadUsageStats()
    initializeConversation()
  }, [childId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getCurrentChild = () => {
    return children.find(child => child.id === childId)
  }

  const loadChildSummary = async () => {
    try {
      const summary = await localHealthKnowledgeService.buildChildSummary(childId)
      setChildSummary(summary)
    } catch (error) {
      console.error('Error loading child summary:', error)
    }
  }

  const loadUsageStats = async () => {
    if (!user) return
    try {
      const stats = await openRouterService.getDailyUsageStats(user.id)
      setUsageStats(stats)
    } catch (error) {
      console.error('Error loading usage stats:', error)
    }
  }

  const initializeConversation = async () => {
    if (!user || !childId) return

    try {
      // Create new conversation
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([{
          user_id: user.id,
          daughter_id: childId,
          conversation_title: `Health Chat - ${new Date().toLocaleDateString()}`,
          conversation_type: 'general'
        }])
        .select()
        .single()

      if (error) throw error
      setConversationId(data.id)

      // Add welcome message
      const currentChild = getCurrentChild()
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: currentChild ? createWelcomeMessage(currentChild.name, childSummary?.ageDisplay || 'unknown age') : 'Welcome to the health assistant!',
        timestamp: new Date(),
        responseType: 'local',
        confidenceScore: 1.0,
        emergencyDetected: false
      }
      
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Error initializing conversation:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text || !user || !childSummary || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // Try local processing first
      const localResponse = await localHealthKnowledgeService.processLocalQuery(childSummary, text)
      
      let aiResponse: AIResponse

      if (localResponse) {
        // Use local response
        aiResponse = {
          content: localResponse.response,
          responseType: localResponse.responseType,
          processingTimeMs: 100, // Fast local response
          confidenceScore: localResponse.confidenceScore,
          emergencyDetected: false,
          safetyFlags: { category: localResponse.category },
          childContextUsed: {
            name: childSummary.name,
            ageDisplay: childSummary.ageDisplay
          }
        }
      } else {
        // Convert child summary to full context for LLM
        const childContext: ChildHealthContext = {
          id: childSummary.id,
          name: childSummary.name,
          ageMonths: childSummary.ageMonths,
          ageDisplay: childSummary.ageDisplay,
          latestGrowth: childSummary.latestGrowth,
          vaccinationStatus: childSummary.vaccinationStatus ? {
            ...childSummary.vaccinationStatus,
            recent: []
          } : undefined,
          milestoneProgress: childSummary.milestoneProgress ? {
            ...childSummary.milestoneProgress,
            recentAchievements: [],
            concerning: []
          } : undefined
        }

        // Process with LLM
        aiResponse = await openRouterService.processHealthQuery(
          text,
          user.id,
          childContext
        )
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        responseType: aiResponse.responseType,
        modelUsed: aiResponse.modelUsed,
        tokensUsed: aiResponse.tokensUsed,
        costCents: aiResponse.costCents,
        processingTimeMs: aiResponse.processingTimeMs,
        confidenceScore: aiResponse.confidenceScore,
        emergencyDetected: aiResponse.emergencyDetected,
        safetyFlags: aiResponse.safetyFlags
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save messages to database if conversation exists
      if (conversationId) {
        await Promise.all([
          supabase.from('ai_messages').insert([{
            conversation_id: conversationId,
            role: 'user',
            content: text,
            response_type: 'user',
            emergency_detected: false,
            child_context_used: { name: childSummary.name, age: childSummary.ageDisplay }
          }]),
          supabase.from('ai_messages').insert([{
            conversation_id: conversationId,
            role: 'assistant',
            content: aiResponse.content,
            response_type: aiResponse.responseType,
            model_used: aiResponse.modelUsed,
            confidence_score: aiResponse.confidenceScore,
            tokens_used: aiResponse.tokensUsed || 0,
            cost_cents: aiResponse.costCents || 0,
            processing_time_ms: aiResponse.processingTimeMs,
            safety_flags: aiResponse.safetyFlags,
            emergency_detected: aiResponse.emergencyDetected,
            child_context_used: aiResponse.childContextUsed
          }])
        ])
      }

      // Refresh usage stats
      await loadUsageStats()

    } catch (error) {
      console.error('Error processing message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error processing your question: ${error instanceof Error ? error.message : 'Unknown error'}. Please try asking your question in a different way, or contact your pediatrician directly for urgent health concerns.`,
        timestamp: new Date(),
        responseType: 'local',
        emergencyDetected: false,
        confidenceScore: 0
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question: QuickQuestion) => {
    handleSendMessage(question.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatCost = (cents: number): string => {
    return `$${(cents / 100).toFixed(3)}`
  }

  const currentChild = getCurrentChild()
  if (!currentChild || !childSummary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Health Assistant</h3>
            <p className="text-sm text-gray-600">
              Chat about {currentChild.name}'s health • {childSummary.ageDisplay} old
            </p>
          </div>
        </div>
        
        {/* Usage Stats */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-gray-600">
              {formatCost(usageStats.remainingBudgetCents)} left today
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {usageStats.totalQueries} questions today
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {/* Emergency Alert */}
                  {message.emergencyDetected && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <Phone className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 font-medium">
                        This appears to be a medical emergency. Call 911 or your pediatrician immediately.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Response Metadata */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        {message.responseType === 'local' && <Zap className="h-3 w-3 text-green-500" />}
                        {message.responseType === 'llm' && <Brain className="h-3 w-3 text-blue-500" />}
                        <span className="capitalize">{message.responseType}</span>
                      </div>
                      
                      {message.processingTimeMs && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatProcessingTime(message.processingTimeMs)}</span>
                        </div>
                      )}
                      
                      {message.costCents && message.costCents > 0 && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span>{formatCost(message.costCents)}</span>
                        </div>
                      )}
                      
                      {message.confidenceScore && (
                        <Badge variant="outline" className="text-xs">
                          {Math.round(message.confidenceScore * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && ( // Only show on welcome message
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map((question, index) => {
              const IconComponent = question.icon
              return (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="flex items-center space-x-2 p-2 text-sm bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                  disabled={loading}
                >
                  <IconComponent className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{question.text}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about ${currentChild.name}'s health...`}
              className="min-h-[44px] max-h-32 resize-none"
              disabled={loading || usageStats.remainingBudgetCents <= 0}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || loading || usageStats.remainingBudgetCents <= 0}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {usageStats.remainingBudgetCents <= 0 && (
          <div className="mt-2 text-sm text-orange-600">
            Daily usage limit reached. Resets tomorrow or upgrade for unlimited access.
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send • {usageStats.localQueries} local, {usageStats.apiQueries} AI responses today
        </div>
      </div>
    </div>
  )
}