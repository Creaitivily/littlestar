import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  BookOpen, 
  Sparkles, 
  Heart,
  Target,
  Lightbulb,
  Users,
  Award,
  MessageCircle,
  Baby
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ContentCurationSystem } from '../components/insights/ContentCurationSystem'

export function Insights() {
  const { children, hasChildren } = useAuth()
  const [selectedChild, setSelectedChild] = useState<any>(null)

  useEffect(() => {
    if (hasChildren && children.length > 0) {
      setSelectedChild(children[0])
    }
  }, [hasChildren, children])

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

  const insightStats = [
    {
      icon: Bot,
      title: 'AI Conversations',
      value: '24/7',
      subtitle: 'Always available',
      color: 'sage'
    },
    {
      icon: BookOpen,
      title: 'Content Library',
      value: '1,200+',
      subtitle: 'Curated articles & videos',
      color: 'honey'
    },
    {
      icon: Award,
      title: 'Expert Sources',
      value: '25+',
      subtitle: 'Healthcare organizations',
      color: 'peach'
    },
    {
      icon: Users,
      title: 'Parent Community',
      value: '50K+',
      subtitle: 'Active users',
      color: 'mint'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      sage: 'bg-sage-100 text-sage-700 border-sage-300',
      honey: 'bg-honey-100 text-honey-700 border-honey-300',
      mint: 'bg-mint-100 text-mint-700 border-mint-300',
      peach: 'bg-peach-100 text-peach-700 border-peach-300'
    }
    return colors[color as keyof typeof colors] || colors.sage
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-50 via-white to-sage-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Insights & Resources</h1>
              <p className="text-gray-600">AI-powered guidance and curated content for your parenting journey</p>
            </div>
          </div>

          {selectedChild && (
            <Card className="bg-gradient-to-r from-sage-100 to-honey-100 border-sage-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedChild.name}</h3>
                    <p className="text-gray-600">{calculateAge(selectedChild.birth_date)} old</p>
                    <Badge variant="outline" className="mt-1 border-sage-400 text-sage-700">
                      <Target className="w-3 h-3 mr-1" />
                      Personalized content active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {insightStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* MilestoneBot Floating Widget Info */}
        <Card className="mb-8 border-sage-200 bg-gradient-to-r from-sage-50 to-honey-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sage-700">
              <MessageCircle className="w-5 h-5" />
              MilestoneBot is Always Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-3">
                  Look for the floating chat icon in the bottom-right corner of your screen! MilestoneBot is now available on every page to answer your parenting questions instantly.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { icon: Baby, text: "Sleep & Development" },
                    { icon: Heart, text: "Health Questions" },
                    { icon: BookOpen, text: "Feeding Guidance" },
                    { icon: Sparkles, text: "Activity Ideas" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-sage-200">
                      <item.icon className="w-4 h-4 text-sage-600" />
                      <span className="text-sm text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Library Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-sage-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Content Library</h2>
              <p className="text-gray-600">Expert-curated resources from trusted healthcare organizations</p>
            </div>
          </div>
          
          <ContentCurationSystem selectedChild={selectedChild} />
        </div>

        {/* Call to Action */}
        {!hasChildren && (
          <Card className="mt-8 bg-gradient-to-r from-sage-100 to-honey-100 border-sage-200">
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 text-sage-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Get Personalized Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Add your child's information to receive age-appropriate content and personalized guidance from MilestoneBot.
              </p>
              <Button className="bg-sage-500 hover:bg-sage-600 text-white">
                <Heart className="w-4 h-4 mr-2" />
                Add Child Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}