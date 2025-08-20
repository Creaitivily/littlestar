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
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentItem {
  id: string
  title: string
  description: string
  contentType: 'video' | 'article' | 'webpage' | 'pdf'
  sourceUrl: string
  thumbnailUrl?: string
  categories: string[]
  tags: string[]
  sourceName: string
  author?: string
  publishedDate?: string
  readingTimeMinutes?: number
  qualityScore: number
  isVerified: boolean
  ageGroup?: string
  isSaved?: boolean
  isFavorite?: boolean
}

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
    id: 'development',
    name: 'Development',
    icon: TrendingUp,
    description: 'Milestones, growth, and developmental stages',
    color: 'sage',
    subcategories: ['motor skills', 'cognitive', 'social', 'language', 'milestones']
  },
  {
    id: 'feeding',
    name: 'Feeding & Nutrition',
    icon: Utensils,
    description: 'Breastfeeding, formula, and solid food introduction',
    color: 'honey',
    subcategories: ['breastfeeding', 'formula', 'solid foods', 'nutrition', 'weaning']
  },
  {
    id: 'sleep',
    name: 'Sleep',
    icon: Moon,
    description: 'Sleep training, routines, and safe sleep practices',
    color: 'mint',
    subcategories: ['sleep training', 'bedtime routine', 'safe sleep', 'naps', 'sleep regression']
  },
  {
    id: 'health',
    name: 'Health & Safety',
    icon: Stethoscope,
    description: 'Medical care, vaccinations, and safety guidelines',
    color: 'peach',
    subcategories: ['vaccinations', 'illness', 'safety', 'first aid', 'checkups']
  },
  {
    id: 'activities',
    name: 'Activities & Play',
    icon: Activity,
    description: 'Age-appropriate activities and educational play',
    color: 'sage',
    subcategories: ['sensory play', 'educational toys', 'outdoor activities', 'crafts', 'reading']
  },
  {
    id: 'behavior',
    name: 'Behavior & Discipline',
    icon: Brain,
    description: 'Positive discipline and behavioral guidance',
    color: 'honey',
    subcategories: ['positive discipline', 'tantrums', 'boundaries', 'emotional regulation']
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: Heart,
    description: 'Parental wellbeing and family mental health',
    color: 'peach',
    subcategories: ['postpartum', 'anxiety', 'stress management', 'bonding', 'support']
  },
  {
    id: 'family',
    name: 'Family Life',
    icon: Users,
    description: 'Parenting tips, family dynamics, and relationships',
    color: 'mint',
    subcategories: ['sibling relationships', 'work-life balance', 'parenting styles', 'communication']
  }
]

interface ContentCurationSystemProps {
  selectedChild?: any
  className?: string
}

export function ContentCurationSystem({ selectedChild, className }: ContentCurationSystemProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['development'])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved' | 'favorites'>('all')

  useEffect(() => {
    loadContent()
  }, [selectedCategories, selectedChild])

  const loadContent = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Understanding Newborn Sleep Patterns',
          description: 'Expert guidance on establishing healthy sleep routines for newborns and understanding their natural sleep cycles.',
          contentType: 'article',
          sourceUrl: 'https://healthychildren.org/sleep-guide',
          categories: ['sleep', 'newborn'],
          tags: ['sleep training', 'safe sleep', 'SIDS prevention'],
          sourceName: 'American Academy of Pediatrics',
          author: 'Dr. Sarah Johnson',
          readingTimeMinutes: 8,
          qualityScore: 95,
          isVerified: true,
          ageGroup: 'newborn',
          isSaved: false,
          isFavorite: false
        },
        {
          id: '2',
          title: 'Baby Development Milestones: 0-6 Months',
          description: 'A comprehensive video guide covering what to expect in your baby\'s first six months of development.',
          contentType: 'video',
          sourceUrl: 'https://youtube.com/watch?v=example',
          thumbnailUrl: '/api/placeholder/300/200',
          categories: ['development', 'milestones'],
          tags: ['motor skills', 'cognitive development', 'social development'],
          sourceName: 'Zero to Three',
          readingTimeMinutes: 15,
          qualityScore: 92,
          isVerified: true,
          ageGroup: '0-6months',
          isSaved: true,
          isFavorite: false
        },
        {
          id: '3',
          title: 'Breastfeeding Basics: Getting Started',
          description: 'Complete guide to successful breastfeeding for new mothers, including common challenges and solutions.',
          contentType: 'article',
          sourceUrl: 'https://cdc.gov/breastfeeding',
          categories: ['feeding', 'newborn'],
          tags: ['breastfeeding', 'latch', 'milk supply'],
          sourceName: 'CDC',
          author: 'Lactation Consultant Team',
          readingTimeMinutes: 12,
          qualityScore: 98,
          isVerified: true,
          ageGroup: 'newborn',
          isSaved: false,
          isFavorite: true
        }
      ]

      // Filter by selected categories
      const filtered = mockContent.filter(item =>
        item.categories.some(cat => selectedCategories.includes(cat))
      )

      setContentItems(filtered)
    } catch (error) {
      console.error('Error loading content:', error)
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

  const toggleSaved = (contentId: string) => {
    setContentItems(prev => prev.map(item =>
      item.id === contentId ? { ...item, isSaved: !item.isSaved } : item
    ))
  }

  const toggleFavorite = (contentId: string) => {
    setContentItems(prev => prev.map(item =>
      item.id === contentId ? { ...item, isFavorite: !item.isFavorite } : item
    ))
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'article': return FileText
      case 'webpage': return Globe
      case 'pdf': return BookOpen
      default: return FileText
    }
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
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = activeFilter === 'all' ||
                         (activeFilter === 'saved' && item.isSaved) ||
                         (activeFilter === 'favorites' && item.isFavorite)
    
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
          {(['all', 'saved', 'favorites'] as const).map((filter) => (
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
              {filter === 'all' && 'All'}
              {filter === 'saved' && (
                <>
                  <Bookmark className="w-3 h-3 mr-1" />
                  Saved
                </>
              )}
              {filter === 'favorites' && (
                <>
                  <Heart className="w-3 h-3 mr-1" />
                  Favorites
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
            const ContentIcon = getContentIcon(item.contentType)
            
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-all border-sage-200 hover:border-sage-300">
                <div className="relative">
                  {item.thumbnailUrl ? (
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-sage-100 to-honey-100 rounded-t-lg flex items-center justify-center">
                      <ContentIcon className="w-16 h-16 text-sage-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white w-8 h-8 p-0"
                      onClick={() => toggleSaved(item.id)}
                    >
                      <Bookmark className={cn("w-3 h-3", item.isSaved ? "text-sage-600" : "text-gray-400")} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white w-8 h-8 p-0"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Heart className={cn("w-3 h-3", item.isFavorite ? "text-red-500" : "text-gray-400")} />
                    </Button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <ContentIcon className="w-3 h-3 mr-1" />
                      {item.contentType}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 leading-tight group-hover:text-sage-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.isVerified && (
                      <Badge variant="outline" className="ml-2 border-sage-300 text-sage-600">
                        <Star className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="font-medium">{item.sourceName}</span>
                    {item.readingTimeMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readingTimeMinutes} min
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-sage-500 hover:bg-sage-600 text-white"
                    onClick={() => window.open(item.sourceUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read More
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No content found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or selecting different categories.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}