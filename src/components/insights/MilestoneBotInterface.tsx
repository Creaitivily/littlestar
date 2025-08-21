import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  Sparkles, 
  MessageCircle, 
  RefreshCw,
  Heart,
  Baby,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserSettings } from '@/hooks/useUserSettings'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  context?: {
    childAge?: string
    topic?: string
  }
}

interface MilestoneBotInterfaceProps {
  className?: string
  selectedChild?: any
}

export function MilestoneBotInterface({ className, selectedChild }: MilestoneBotInterfaceProps) {
  const { settings } = useUserSettings()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi there! 🐝 I'm MilestoneBot, your friendly parenting companion! I'm here to help you navigate your child's development journey with expert guidance, tips, and personalized advice. What would you like to know about today?`,
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickPrompts = [
    { icon: Baby, text: "Sleep training tips", topic: "sleep" },
    { icon: Heart, text: "Developmental milestones", topic: "development" },
    { icon: BookOpen, text: "Feeding guidance", topic: "nutrition" },
    { icon: Sparkles, text: "Activity ideas", topic: "activities" }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
      context: {
        childAge: selectedChild ? calculateAge(selectedChild.birth_date) : undefined,
        userCountry: settings.country
      }
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // TODO: Integrate with enhanced MilestoneBot API
      const response = await fetch('/api/milestonebot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            ...userMessage.context,
            selectedChild,
            userCountry: settings.country
          },
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      })

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm still learning! 🐝 Could you try rephrasing your question?",
        isBot: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('MilestoneBot error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! I'm having a tiny bee-sized hiccup. Please try again in a moment! 🐝",
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const months = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    
    if (months < 1) return 'newborn'
    if (months < 12) return `${months} months`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
  }

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        content: `Hi there! 🐝 I'm MilestoneBot, your friendly parenting companion! I'm here to help you navigate your child's development journey with expert guidance, tips, and personalized advice. What would you like to know about today?`,
        isBot: true,
        timestamp: new Date()
      }
    ])
  }

  return (
    <Card className={cn("h-full flex flex-col bg-gradient-to-br from-honey-50 to-sage-50 border-sage-200", className)}>
      <CardHeader className="bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-honey-400 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-sage-800" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                MilestoneBot
                <Sparkles className="w-4 h-4 text-honey-300" />
              </CardTitle>
              <p className="text-sage-100 text-sm">Your AI parenting companion</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearConversation}
            className="text-white hover:bg-sage-600"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        {selectedChild && (
          <div className="mt-3 p-2 bg-sage-600/30 rounded-lg">
            <p className="text-sm text-sage-100">
              💝 Personalized for <strong>{selectedChild.name}</strong> 
              <span className="ml-2 text-xs">({calculateAge(selectedChild.birth_date)})</span>
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.isBot ? "flex-row" : "flex-row-reverse ml-auto"
              )}
            >
              {message.isBot && (
                <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "rounded-lg p-3 shadow-sm",
                  message.isBot
                    ? "bg-white border border-sage-200 text-gray-800"
                    : "bg-sage-500 text-white"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  "text-xs mt-1",
                  message.isBot ? "text-gray-500" : "text-sage-100"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {!message.isBot && (
                <div className="w-8 h-8 bg-honey-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-sage-800" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="bg-white border border-sage-200 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-4 border-t border-sage-200 bg-honey-50/50">
          <p className="text-sm text-gray-600 mb-2 font-medium">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt.text)}
                className="border-sage-300 text-sage-700 hover:bg-sage-100 hover:border-sage-400"
              >
                <prompt.icon className="w-3 h-3 mr-1" />
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-sage-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask MilestoneBot anything about parenting..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-sage-300 focus:border-sage-500 focus:ring-sage-500"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-sage-500 hover:bg-sage-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            MilestoneBot provides educational information. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}