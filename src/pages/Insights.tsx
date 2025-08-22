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
        </div>

        {/* Content Library Section */}
        <ContentCurationSystem selectedChild={selectedChild} />
      </div>
    </div>
  )
}