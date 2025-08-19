import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Heart,
  Calendar,
  Camera,
  BookOpen,
  Share,
  Download,
  Plus,
  Gift,
  Star,
  Eye,
  Lock,
  Users
} from 'lucide-react'

interface MemoryBookProps {
  searchQuery: string
  filter: string
}

interface MemoryBook {
  id: string
  title: string
  description: string
  coverImage: string
  theme: string
  privacy: 'private' | 'family' | 'public'
  createdDate: Date
  lastUpdated: Date
  photoCount: number
  milestoneCount: number
  pageCount: number
  contributors: string[]
  views: number
  likes: number
  isShared: boolean
  downloadCount: number
  tags: string[]
}

const memoryBooks: MemoryBook[] = [
  {
    id: '1',
    title: 'Emma\'s First Year',
    description: 'A beautiful collection of Emma\'s first 12 months - from newborn snuggles to first steps.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Pastel Dreams',
    privacy: 'family',
    createdDate: new Date(2023, 8, 1),
    lastUpdated: new Date(2024, 6, 15),
    photoCount: 147,
    milestoneCount: 12,
    pageCount: 32,
    contributors: ['Mom', 'Dad', 'Grandma'],
    views: 234,
    likes: 89,
    isShared: true,
    downloadCount: 15,
    tags: ['first year', 'milestones', 'baby', 'memories']
  },
  {
    id: '2',
    title: 'Second Birthday Celebration',
    description: 'Emma\'s magical second birthday party with family and friends.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Rainbow Fun',
    privacy: 'family',
    createdDate: new Date(2024, 6, 10),
    lastUpdated: new Date(2024, 6, 12),
    photoCount: 68,
    milestoneCount: 1,
    pageCount: 16,
    contributors: ['Mom', 'Dad', 'Aunt Sarah'],
    views: 156,
    likes: 43,
    isShared: true,
    downloadCount: 8,
    tags: ['birthday', 'party', 'celebration', 'two years']
  },
  {
    id: '3',
    title: 'Walking Adventures',
    description: 'Emma\'s journey from first steps to confident walking and running.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Adventure Time',
    privacy: 'private',
    createdDate: new Date(2024, 7, 15),
    lastUpdated: new Date(2024, 7, 18),
    photoCount: 42,
    milestoneCount: 3,
    pageCount: 12,
    contributors: ['Mom', 'Dad'],
    views: 78,
    likes: 25,
    isShared: false,
    downloadCount: 3,
    tags: ['walking', 'physical development', 'outdoors']
  },
  {
    id: '4',
    title: 'Bath Time Fun',
    description: 'Splashing, playing, and growing - Emma\'s cutest bath time moments.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Bubble Bliss',
    privacy: 'family',
    createdDate: new Date(2024, 5, 20),
    lastUpdated: new Date(2024, 7, 10),
    photoCount: 89,
    milestoneCount: 0,
    pageCount: 20,
    contributors: ['Mom'],
    views: 92,
    likes: 31,
    isShared: true,
    downloadCount: 5,
    tags: ['bath time', 'daily life', 'play', 'water']
  },
  {
    id: '5',
    title: 'Family Moments',
    description: 'Special times with family - holidays, visits, and everyday love.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Family Love',
    privacy: 'family',
    createdDate: new Date(2024, 0, 1),
    lastUpdated: new Date(2024, 7, 16),
    photoCount: 203,
    milestoneCount: 5,
    pageCount: 45,
    contributors: ['Mom', 'Dad', 'Grandma', 'Grandpa', 'Aunt Sarah'],
    views: 412,
    likes: 127,
    isShared: true,
    downloadCount: 22,
    tags: ['family', 'holidays', 'grandparents', 'love']
  },
  {
    id: '6',
    title: 'Sleep & Dreams',
    description: 'Peaceful sleeping moments and bedtime routines that melt your heart.',
    coverImage: '/api/placeholder/400/600',
    theme: 'Sweet Dreams',
    privacy: 'private',
    createdDate: new Date(2024, 3, 10),
    lastUpdated: new Date(2024, 7, 5),
    photoCount: 34,
    milestoneCount: 2,
    pageCount: 10,
    contributors: ['Mom', 'Dad'],
    views: 45,
    likes: 18,
    isShared: false,
    downloadCount: 1,
    tags: ['sleep', 'bedtime', 'peaceful', 'routines']
  }
]

const privacyIcons = {
  private: Lock,
  family: Users,
  public: Eye
}

const privacyColors = {
  private: 'destructive',
  family: 'warning',
  public: 'success'
} as const

function MemoryBookCard({ book }: { book: MemoryBook }) {
  const PrivacyIcon = privacyIcons[book.privacy]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-accent/60" />
        </div>
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" className="bg-white/90 text-black hover:bg-white">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90 border-white/90 hover:bg-white">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Privacy Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={privacyColors[book.privacy]} className="text-xs bg-white/90">
            <PrivacyIcon className="w-3 h-3 mr-1" />
            {book.privacy}
          </Badge>
        </div>
        
        {/* Page Count */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs bg-white/90">
            {book.pageCount} pages
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Theme */}
          <div>
            <h3 className="font-semibold text-foreground">{book.title}</h3>
            <p className="text-xs text-muted-foreground">{book.theme} theme</p>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Camera className="w-3 h-3 text-muted-foreground" />
              <span>{book.photoCount} photos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-muted-foreground" />
              <span>{book.milestoneCount} milestones</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span>{book.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 text-muted-foreground" />
              <span>{book.likes} likes</span>
            </div>
          </div>
          
          {/* Contributors */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Contributors:</div>
            <div className="flex flex-wrap gap-1">
              {book.contributors.slice(0, 3).map((contributor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {contributor}
                </Badge>
              ))}
              {book.contributors.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{book.contributors.length - 3}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {book.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{book.tags.length - 2}
              </Badge>
            )}
          </div>
          
          {/* Dates */}
          <div className="text-xs text-muted-foreground">
            <div>Created: {formatDate(book.createdDate)}</div>
            <div>Updated: {formatDate(book.lastUpdated)}</div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-2">
            <div className="flex space-x-1">
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <Heart className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <Share className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MemoryBook({ searchQuery, filter }: MemoryBookProps) {
  const filteredBooks = memoryBooks.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filter === 'all' ||
      (filter === 'favorites' && book.likes > 40) ||
      (filter === 'recent' && (new Date().getTime() - book.lastUpdated.getTime()) < 30 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Memory Books</h2>
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} memory books created
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Book
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="text-2xl font-bold text-foreground mb-1">{memoryBooks.length}</div>
          <div className="text-sm text-muted-foreground">Total Books</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="text-2xl font-bold text-foreground mb-1">
            {memoryBooks.reduce((acc, book) => acc + book.photoCount, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Photos</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="text-2xl font-bold text-foreground mb-1">
            {memoryBooks.reduce((acc, book) => acc + book.views, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="text-2xl font-bold text-foreground mb-1">
            {memoryBooks.reduce((acc, book) => acc + book.downloadCount, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Downloads</div>
        </Card>
      </div>

      {/* Memory Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <MemoryBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No memory books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No memory books match your search for "${searchQuery}"`
              : "No memory books match the selected filter"
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Memory Book
          </Button>
        </Card>
      )}

      {/* Template Suggestions */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Memory Book Templates</CardTitle>
          <CardDescription>Quick start templates for common themes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center hover:border-primary transition-colors cursor-pointer">
              <Gift className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-medium">Monthly Highlights</h4>
              <p className="text-sm text-muted-foreground">Best moments from this month</p>
            </div>
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center hover:border-primary transition-colors cursor-pointer">
              <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-medium">Firsts & Milestones</h4>
              <p className="text-sm text-muted-foreground">Special achievements and firsts</p>
            </div>
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center hover:border-primary transition-colors cursor-pointer">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-medium">Year in Review</h4>
              <p className="text-sm text-muted-foreground">Complete year summary</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}