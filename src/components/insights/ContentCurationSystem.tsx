import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Video, 
  ExternalLink, 
  Heart, 
  Star, 
  Clock, 
  Search,
  Filter,
  Bookmark,
  FileText,
  Globe,
  TrendingUp,
  Utensils,
  Moon,
  Activity,
  Brain,
  Stethoscope,
  Users,
  Baby,
  MessageSquare,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { contentService, calculateChildAgeInMonths, type TopicContent } from '@/services/contentService'

// Use TopicContent from contentService instead of custom ContentItem

interface ContentCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  color: string
  subcategories: string[]
}

const contentCategories: ContentCategory[] = [
  {
    id: 'feeding_nutrition',
    name: 'Feeding & Nutrition',
    icon: Utensils,
    description: 'Feeding schedules, nutrition, and meal planning',
    color: 'honey',
    subcategories: ['breastfeeding', 'formula', 'solid foods', 'nutrition', 'weaning']
  },
  {
    id: 'sleep_patterns',
    name: 'Sleep & Rest',
    icon: Moon,
    description: 'Sleep training, schedules, and bedtime routines',
    color: 'mint',
    subcategories: ['sleep training', 'bedtime routine', 'safe sleep', 'naps', 'sleep regression']
  },
  {
    id: 'cognitive_development',
    name: 'Learning & Development',
    icon: Brain,
    description: 'Cognitive milestones and mental development',
    color: 'sage',
    subcategories: ['learning', 'brain development', 'milestones', 'early education']
  },
  {
    id: 'physical_development',
    name: 'Physical Growth',
    icon: Activity,
    description: 'Physical milestones and motor skill development',
    color: 'peach',
    subcategories: ['gross motor', 'fine motor', 'crawling', 'walking', 'coordination']
  },
  {
    id: 'social_emotional',
    name: 'Social & Emotional',
    icon: Heart,
    description: 'Emotional development and social skills',
    color: 'sage',
    subcategories: ['bonding', 'attachment', 'emotions', 'social skills']
  },
  {
    id: 'health_safety',
    name: 'Health & Safety',
    icon: Shield,
    description: 'Medical care, safety, and health monitoring',
    color: 'peach',
    subcategories: ['vaccinations', 'illness', 'safety', 'first aid', 'checkups']
  }
]

interface ContentCurationSystemProps {
  selectedChild?: any
  className?: string
}

export function ContentCurationSystem({ selectedChild, className }: ContentCurationSystemProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [contentItems, setContentItems] = useState<TopicContent[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'quality'>('all')
  const [childAgeInMonths, setChildAgeInMonths] = useState<number>(0)

  useEffect(() => {
    if (selectedChild?.birth_date) {
      const age = calculateChildAgeInMonths(selectedChild.birth_date)
      console.log(`Child age calculated: ${age} months from birth date ${selectedChild.birth_date}`)
      setChildAgeInMonths(age)
    } else {
      console.log('No child selected, defaulting to 3 months for demo')
      setChildAgeInMonths(3) // Default to 3 months if no child selected
    }
  }, [selectedChild])

  useEffect(() => {
    if (selectedCategories.length > 0 && childAgeInMonths >= 0) {
      loadContent()
    }
  }, [selectedCategories, childAgeInMonths])

  const loadContent = async () => {
    if (!selectedCategories.length || childAgeInMonths < 0) {
      console.log('No categories selected or invalid child age, skipping content load')
      setContentItems([])
      return
    }
    
    console.log(`Loading content for categories: ${selectedCategories.join(', ')}`)
    setLoading(true)
    try {
      const allContent: TopicContent[] = []
      
      // Load content for each selected topic
      for (const topic of selectedCategories) {
        try {
          console.log(`Fetching content for topic: ${topic}`)
          const topicContent = await contentService.getContentForChild(
            topic,
            childAgeInMonths,
            { minQuality: 0.3 } // Lower threshold to ensure we get content
          )
          console.log(`Got ${topicContent.length} articles for ${topic}`)
          
          // Ensure topic is set on each item
          const itemsWithTopic = topicContent.map(item => ({ 
            ...item, 
            topic: item.topic || topic // Use existing topic or fallback to current topic
          }))
          allContent.push(...itemsWithTopic)
        } catch (error) {
          console.error(`Failed to load content for ${topic}:`, error)
        }
      }
      
      console.log(`Total content loaded: ${allContent.length} articles`)
      
      // Sort by quality score and publication date
      allContent.sort((a, b) => {
        if (b.quality_score !== a.quality_score) {
          return b.quality_score - a.quality_score
        }
        return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime()
      })

      setContentItems(allContent)
    } catch (error) {
      console.error('Error loading content:', error)
      setContentItems([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getContentIcon = () => {
    return FileText // All content is articles for now
  }

  const getColorClasses = (color: string) => {
    const colors = {
      sage: 'bg-sage-100 text-sage-700 border-sage-300',
      honey: 'bg-honey-100 text-honey-700 border-honey-300',
      mint: 'bg-mint-100 text-mint-700 border-mint-300',
      peach: 'bg-peach-100 text-peach-700 border-peach-300'
    }
    return colors[color as keyof typeof colors] || colors.sage
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content_summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = activeFilter === 'all' ||
                         (activeFilter === 'quality' && item.quality_score >= 0.7)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className={cn("space-y-6", className)}>
      {/* Category Selection */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sage-700">
            <Filter className="w-5 h-5" />
            Choose Your Interests
          </CardTitle>
          <p className="text-gray-600">Select topics you'd like to explore. We'll curate relevant content for you.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contentCategories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategories.includes(category.id)
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-auto p-4 flex flex-col items-center gap-2 transition-all",
                    isSelected 
                      ? "bg-sage-500 text-white border-sage-500 hover:bg-sage-600" 
                      : "border-sage-200 hover:border-sage-300 hover:bg-sage-50"
                  )}
                  onClick={() => toggleCategory(category.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-sage-300 focus:border-sage-500"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'quality'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                activeFilter === filter 
                  ? "bg-sage-500 text-white" 
                  : "border-sage-300 hover:bg-sage-50"
              )}
            >
              {filter === 'all' && 'All Content'}
              {filter === 'quality' && (
                <>
                  <Star className="w-3 h-3 mr-1" />
                  High Quality
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const ContentIcon = getContentIcon()
            const topicMetadata = contentService.getTopicMetadata()[item.topic]
            
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-all border-sage-200 hover:border-sage-300">
                <div className="relative">
                  {item.image_url ? (
                    <div className="w-full h-48 rounded-t-lg overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-48 bg-gradient-to-br from-sage-100 to-honey-100 rounded-t-lg flex items-center justify-center" style={{display: 'none'}}>
                        <ContentIcon className="w-16 h-16 text-sage-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-sage-100 to-honey-100 rounded-t-lg flex items-center justify-center">
                      <ContentIcon className="w-16 h-16 text-sage-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      Quality: {Math.round(item.quality_score * 100)}%
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <ContentIcon className="w-3 h-3 mr-1" />
                      Article
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 leading-tight group-hover:text-sage-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.quality_score >= 0.8 && (
                      <Badge variant="outline" className="ml-2 border-sage-300 text-sage-600">
                        <Star className="w-3 h-3 mr-1" />
                        Trusted
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.content_summary}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                      {topicMetadata?.icon} {topicMetadata?.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-honey-100 text-honey-700">
                      {contentService.getAgeRangeLabel(item.age_range)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="font-medium">{item.source_domain}</span>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(item.publication_date).toLocaleDateString()}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-sage-500 hover:bg-sage-600 text-white"
                    onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredContent.length === 0 && !loading && (
        <Card className="text-center py-8 border-sage-200">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {selectedCategories.length === 0 ? 'Select topics to explore' : 'No content found'}
            </h3>
            <p className="text-gray-500">
              {selectedCategories.length === 0 
                ? 'Click on the topics above to see curated articles for each category.'
                : 'Try adjusting your search terms or selecting different categories.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}