import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Heart, 
  Calendar, 
  Tag,
  Camera,
  Grid3X3,
  List
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AddMemoryForm } from '@/components/forms/AddMemoryForm'
import { useChild } from '@/contexts/ChildContext'
import { useAuth } from '@/contexts/AuthContext'

export function Memories() {
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [memories, setMemories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedChild } = useChild()
  const { fetchChildMemories } = useAuth()
  
  // Fetch memories when selected child changes
  useEffect(() => {
    const loadMemories = async () => {
      if (selectedChild?.id) {
        setLoading(true)
        try {
          const data = await fetchChildMemories(selectedChild.id)
          setMemories(data)
        } catch (error) {
          console.error('Error loading memories:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setMemories([])
        setLoading(false)
      }
    }

    loadMemories()
  }, [selectedChild, fetchChildMemories])

  const refreshMemories = async () => {
    if (selectedChild?.id) {
      try {
        const data = await fetchChildMemories(selectedChild.id)
        setMemories(data)
      } catch (error) {
        console.error('Error refreshing memories:', error)
      }
    }
  }
  
  const favoriteMemories = memories.filter(memory => memory.favorite)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Memories & Photos</h1>
          <p className="text-gray-600">
            {selectedChild ? 
              `Capture and cherish ${selectedChild.name}'s precious moments` : 
              'Capture and cherish your child\'s precious moments'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid View
          </Button>
          <Button onClick={() => setShowMemoryForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-pink-50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Memories</CardTitle>
            <Camera className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{memories.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{favoriteMemories.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">2</div>
          </CardContent>
        </Card>

        <Card className="bg-cream-100 border-cream-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Photos</CardTitle>
            <Camera className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">47</div>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Memories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Favorite Memories
          </CardTitle>
          <Button variant="outline" size="sm">
            View All Favorites
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="aspect-square bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : favoriteMemories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No favorite memories yet.</p>
              <p className="text-sm">Add some memories and mark them as favorites!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMemories.map((memory) => (
                <Card key={memory.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(memory.date)}
                      </Badge>
                      <Heart className="w-4 h-4 text-pink-500 fill-current" />
                    </div>
                    
                    {memory.attachment_url ? (
                      <div className="aspect-square bg-lavender-100 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={memory.attachment_url} 
                          alt={memory.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-lavender-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                        📷
                      </div>
                    )}
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{memory.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Memories Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">Memory Timeline</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button variant="ghost" size="sm">
              <Tag className="w-4 h-4 mr-2" />
              Filter by Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {memories.map((memory) => (
              <div key={memory.id} className="border-l-2 border-lavender-200 pl-6 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-lavender-300 rounded-full"></div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{memory.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(memory.date)}</p>
                    </div>
                    {memory.favorite && (
                      <Heart className="w-4 h-4 text-pink-500 fill-current" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{memory.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {memory.photos.map((photo, index) => (
                      <div key={index} className="w-12 h-12 bg-lavender-100 rounded-lg flex items-center justify-center text-lg">
                        {photo}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <AddMemoryForm 
        open={showMemoryForm} 
        onOpenChange={setShowMemoryForm}
        onSuccess={refreshMemories}
      />
    </div>
  )
}