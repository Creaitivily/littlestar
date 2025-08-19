import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Heart,
  MessageCircle,
  Download,
  Share,
  MoreHorizontal,
  Calendar,
  Camera,
  Star,
  Eye
} from 'lucide-react'

interface PhotoGridProps {
  searchQuery: string
  filter: string
}

interface Photo {
  id: string
  url: string
  thumbnail: string
  title: string
  description?: string
  date: Date
  location?: string
  tags: string[]
  isFavorite: boolean
  isShared: boolean
  views: number
  likes: number
  comments: number
  milestone?: string
  ageAtPhoto: string
}

// Sample photo data - in a real app, these would be actual image URLs
const photos: Photo[] = [
  {
    id: '1',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'First Steps!',
    description: 'Emma took her very first steps today! She walked from the couch to daddy.',
    date: new Date(2024, 7, 15, 14, 30),
    location: 'Living Room',
    tags: ['milestone', 'walking', 'first'],
    isFavorite: true,
    isShared: true,
    views: 45,
    likes: 23,
    comments: 8,
    milestone: 'First Steps',
    ageAtPhoto: '13 months'
  },
  {
    id: '2',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'Bath Time Fun',
    description: 'Splashing and playing with rubber duckies',
    date: new Date(2024, 7, 18, 18, 0),
    location: 'Bathroom',
    tags: ['bath', 'play', 'daily'],
    isFavorite: false,
    isShared: false,
    views: 12,
    likes: 5,
    comments: 2,
    ageAtPhoto: '13 months'
  },
  {
    id: '3',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'Birthday Party',
    description: 'Emma\'s second birthday celebration with family',
    date: new Date(2024, 6, 10, 15, 0),
    location: 'Backyard',
    tags: ['birthday', 'party', 'family', 'celebration'],
    isFavorite: true,
    isShared: true,
    views: 87,
    likes: 34,
    comments: 15,
    milestone: 'Second Birthday',
    ageAtPhoto: '2 years'
  },
  {
    id: '4',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'Reading Together',
    description: 'Bedtime story with mommy',
    date: new Date(2024, 7, 17, 19, 30),
    location: 'Nursery',
    tags: ['reading', 'bedtime', 'books'],
    isFavorite: false,
    isShared: false,
    views: 8,
    likes: 3,
    comments: 1,
    ageAtPhoto: '13 months'
  },
  {
    id: '5',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'Park Adventure',
    description: 'Playing on the swings at the local park',
    date: new Date(2024, 7, 16, 11, 0),
    location: 'Sunny Park',
    tags: ['outdoor', 'park', 'swings', 'play'],
    isFavorite: true,
    isShared: true,
    views: 29,
    likes: 12,
    comments: 4,
    ageAtPhoto: '13 months'
  },
  {
    id: '6',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/300/300',
    title: 'Messy Eating',
    description: 'Spaghetti everywhere! Emma loves to explore her food.',
    date: new Date(2024, 7, 14, 12, 30),
    location: 'Kitchen',
    tags: ['eating', 'messy', 'spaghetti', 'lunch'],
    isFavorite: false,
    isShared: true,
    views: 41,
    likes: 18,
    comments: 6,
    ageAtPhoto: '13 months'
  }
]

function PhotoCard({ photo }: { photo: Photo }) {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300 overflow-hidden">
      {/* Photo */}
      <div className="relative group">
        <div className="aspect-square bg-muted/30 rounded-t-lg overflow-hidden">
          {/* Placeholder for actual image */}
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
            <Camera className="w-12 h-12 text-accent/60" />
          </div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button size="sm" className="bg-white/90 text-black hover:bg-white">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {photo.isFavorite && (
            <Badge variant="secondary" className="text-xs bg-white/90">
              <Heart className="w-3 h-3 mr-1 text-red-500" />
              Favorite
            </Badge>
          )}
          {photo.milestone && (
            <Badge variant="success" className="text-xs bg-white/90">
              <Star className="w-3 h-3 mr-1" />
              Milestone
            </Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="absolute top-2 right-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Date */}
          <div>
            <h3 className="font-semibold text-foreground text-sm">{photo.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(photo.date)}</span>
              <span>•</span>
              <span>{photo.ageAtPhoto}</span>
            </div>
          </div>
          
          {/* Description */}
          {photo.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {photo.description}
            </p>
          )}
          
          {/* Location */}
          {photo.location && (
            <div className="text-xs text-muted-foreground">
              📍 {photo.location}
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {photo.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {photo.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{photo.tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{photo.views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{photo.likes}</span>
              </span>
              {photo.comments > 0 && (
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{photo.comments}</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Share className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PhotoGrid({ searchQuery, filter }: PhotoGridProps) {
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchQuery === '' || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filter === 'all' ||
      (filter === 'favorites' && photo.isFavorite) ||
      (filter === 'milestones' && photo.milestone) ||
      (filter === 'recent' && (new Date().getTime() - photo.date.getTime()) < 7 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Photo Gallery
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredPhotos.length} photos {searchQuery && `matching "${searchQuery}"`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Selected
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share Album
          </Button>
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No photos found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No photos match your search for "${searchQuery}"`
              : "No photos match the selected filter"
            }
          </p>
          <Button>
            <Camera className="w-4 h-4 mr-2" />
            Add Your First Photo
          </Button>
        </Card>
      )}

      {/* Recent Uploads */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recently Added</CardTitle>
          <CardDescription>Your latest photo uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {photos.slice(0, 6).map((photo) => (
              <div key={photo.id} className="aspect-square bg-muted/30 rounded-lg overflow-hidden group cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/50 transition-colors">
                  <Camera className="w-6 h-6 text-accent/60" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}