import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Send, 
  Bot, 
  Sparkles, 
  MessageCircle, 
  X,
  Minimize2,
  Maximize2,
  Heart,
  Baby,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { openRouterService } from '../../lib/openRouterService'
import type { ChildHealthContext } from '../../lib/openRouterService'

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

interface FloatingMilestoneBotWidgetProps {
  className?: string
}

export function FloatingMilestoneBotWidget({ className }: FloatingMilestoneBotWidgetProps) {
  const { children, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedChild = children && children.length > 0 ? children[0] : null
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm MilestoneBot, your warm and supportive parenting companion! 😊 I'm here to help with all your childcare questions—from feeding and sleep to development and health. I provide evidence-based guidance in a caring, jargon-free way. What would you like to know?`,
      isBot: true,
      timestamp: new Date()
    }
  ])

  // Update welcome message when child data is available
  useEffect(() => {
    if (selectedChild) {
      setMessages([{
        id: '1',
        content: `Hi! I'm MilestoneBot, your parenting sidekick! 😊 I'm here to help with ${selectedChild.name}'s care and development. From sleep challenges to feeding questions, developmental milestones to health concerns—I've got evidence-based guidance tailored just for ${selectedChild.name} at ${calculateAge(selectedChild.birth_date)}. What can I help you with today?`,
        isBot: true,
        timestamp: new Date()
      }])
    }
  }, [selectedChild])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
    }
  }, [isOpen])

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

  const quickPrompts = [
    { icon: Baby, text: "Sleep training tips", topic: "sleep" },
    { icon: Heart, text: "Developmental milestones", topic: "development" },
    { icon: BookOpen, text: "Feeding guidance", topic: "nutrition" },
    { icon: Sparkles, text: "Activity ideas", topic: "activities" }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return

    // Handle case when no child is selected
    if (!selectedChild) {
      const noChildMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Hi there! 🐝 I'd love to help you with personalized advice, but I don't see any child profiles yet. Please add your child's information first, then I can give you age-appropriate guidance!",
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: inputMessage,
        isBot: false,
        timestamp: new Date()
      }, noChildMessage])
      setInputMessage('')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
      context: {
        childAge: selectedChild ? calculateAge(selectedChild.birth_date) : undefined
      }
    }

    const currentInput = inputMessage
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Create child health context for the AI
      const childAge = selectedChild.birth_date ? 
        Math.floor((Date.now() - new Date(selectedChild.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0

      const childContext: ChildHealthContext = {
        id: selectedChild.id,
        name: selectedChild.name,
        ageMonths: childAge,
        ageDisplay: calculateAge(selectedChild.birth_date),
        // Note: You could enhance this with actual growth/health data from your database
        latestGrowth: undefined,
        vaccinationStatus: undefined,
        milestoneProgress: undefined
      }

      // Call the OpenRouter service directly
      const aiResponse = await openRouterService.processHealthQuery(
        currentInput,
        user.id,
        childContext
      )
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isBot: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      
      // Show notification if widget is closed
      if (!isOpen) {
        setHasNewMessage(true)
      }
    } catch (error) {
      console.error('MilestoneBot error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error && error.message.includes('limit') 
          ? "I've reached my daily chat limit! 🐝 Please try again tomorrow or check your usage in settings."
          : "Oops! I'm having a tiny bee-sized hiccup. Please try again in a moment! 🐝",
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (!isOpen) {
      setIsOpen(true)
    }
    
    // Set the input message temporarily for the send process
    setInputMessage(prompt)
    
    // Trigger the send process directly
    if (!isLoading && user) {
      // Handle case when no child is selected
      if (!selectedChild) {
        const noChildMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Hi there! 🐝 I'd love to help you with personalized advice, but I don't see any child profiles yet. Please add your child's information first, then I can give you age-appropriate guidance!",
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: prompt,
          isBot: false,
          timestamp: new Date()
        }, noChildMessage])
        setInputMessage('')
        return
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: prompt,
        isBot: false,
        timestamp: new Date(),
        context: {
          childAge: selectedChild ? calculateAge(selectedChild.birth_date) : undefined
        }
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      setIsLoading(true)

      try {
        // Create child health context for the AI
        const childAge = selectedChild.birth_date ? 
          Math.floor((Date.now() - new Date(selectedChild.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0

        const childContext: ChildHealthContext = {
          id: selectedChild.id,
          name: selectedChild.name,
          ageMonths: childAge,
          ageDisplay: calculateAge(selectedChild.birth_date),
          latestGrowth: undefined,
          vaccinationStatus: undefined,
          milestoneProgress: undefined
        }

        // Call the OpenRouter service directly
        const aiResponse = await openRouterService.processHealthQuery(
          prompt,
          user.id,
          childContext
        )
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          isBot: true,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, botMessage])
        
        // Show notification if widget is closed
        if (!isOpen) {
          setHasNewMessage(true)
        }
      } catch (error) {
        console.error('MilestoneBot error:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: error instanceof Error && error.message.includes('limit') 
            ? "I've reached my daily chat limit! 🐝 Please try again tomorrow or check your usage in settings."
            : "Oops! I'm having a tiny bee-sized hiccup. Please try again in a moment! 🐝",
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Floating chat button
  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <Bot className="w-8 h-8 text-white" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className={cn(
        "w-96 bg-gradient-to-br from-honey-50 to-sage-50 border-sage-200 shadow-2xl transition-all duration-300",
        isMinimized ? "h-16" : "h-[600px]"
      )}>
        <CardHeader className="bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-t-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-honey-400 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-sage-800" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-1">
                  MilestoneBot
                  <Sparkles className="w-3 h-3 text-honey-300" />
                </CardTitle>
                <p className="text-sage-100 text-xs">Your AI parenting companion</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-sage-600 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-sage-600 h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {selectedChild && !isMinimized && (
            <div className="mt-2 p-2 bg-sage-600/30 rounded-lg">
              <p className="text-xs text-sage-100">
                💝 Personalized for <strong>{selectedChild.name}</strong> 
                <span className="ml-1">({calculateAge(selectedChild.birth_date)})</span>
              </p>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-96">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    message.isBot ? "flex-row" : "flex-row-reverse ml-auto"
                  )}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg p-2 shadow-sm",
                      message.isBot
                        ? "bg-white border border-sage-200 text-gray-800"
                        : "bg-sage-500 text-white"
                    )}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.isBot ? "text-gray-500" : "text-sage-100"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {!message.isBot && (
                    <div className="w-6 h-6 bg-honey-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-3 h-3 text-sage-800" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border border-sage-200 rounded-lg p-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-sage-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-sage-200 bg-honey-50/50">
              <div className="flex flex-wrap gap-1">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="border-sage-300 text-sage-700 hover:bg-sage-100 hover:border-sage-400 h-7 px-2 text-xs"
                  >
                    <prompt.icon className="w-2 h-2 mr-1" />
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-sage-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask MilestoneBot..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-sage-300 focus:border-sage-500 focus:ring-sage-500 text-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-sage-500 hover:bg-sage-600 text-white h-8 w-8 p-0"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Educational information only. Consult healthcare professionals.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}