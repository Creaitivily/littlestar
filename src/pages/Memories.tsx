import React, { useState } from 'react'
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
import { memories } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { AddMemoryForm } from '@/components/forms/AddMemoryForm'

export function Memories() {
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  
  const favoriteMemories = memories.filter(memory => memory.favorite)

  const handleAddMemory = (data: any) => {
    console.log('New memory:', data)
    // In a real app, this would update the database
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Memories & Photos</h1>
          <p className="text-gray-600">Capture and cherish Emma's precious moments</p>
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
                  
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {memory.photos.slice(0, 3).map((photo, index) => (
                      <div key={index} className="aspect-square bg-lavender-100 rounded-lg flex items-center justify-center text-2xl">
                        {photo}
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2">{memory.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        onSubmit={handleAddMemory}
      />
    </div>
  )
}