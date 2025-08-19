import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PhotoGrid } from './photo-grid'
import { MilestoneTimeline } from './milestone-timeline'
import { MemoryBook } from './memory-book'
import {
  Camera,
  Heart,
  Calendar,
  Search,
  Plus,
  Filter,
  Download,
  Share,
  Star,
  Baby,
  Gift
} from 'lucide-react'

export function MemoriesTimeline() {
  const [activeTab, setActiveTab] = useState('photos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Photos & Memories</h1>
          <p className="text-muted-foreground">
            Capture and cherish Emma's precious moments and milestones
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* Memory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Photos</p>
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Camera className="w-3 h-3 mr-1" />
                This month: 43
              </Badge>
            </div>
            <Camera className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Milestones</p>
              <p className="text-2xl font-bold text-foreground">25</p>
              <Badge variant="success" className="text-xs mt-1">
                <Star className="w-3 h-3 mr-1" />
                Special moments
              </Badge>
            </div>
            <Baby className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Memory Books</p>
              <p className="text-2xl font-bold text-foreground">8</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Gift className="w-3 h-3 mr-1" />
                Collections
              </Badge>
            </div>
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Shared</p>
              <p className="text-2xl font-bold text-foreground">89</p>
              <Badge variant="warning" className="text-xs mt-1">
                <Share className="w-3 h-3 mr-1" />
                With family
              </Badge>
            </div>
            <Share className="w-8 h-8 text-warning" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memories by date, milestone, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option value="all">All Memories</option>
                <option value="photos">Photos Only</option>
                <option value="milestones">Milestones</option>
                <option value="favorites">Favorites</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="photos" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Photos</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Milestones</span>
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Memory Books</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-6">
          <PhotoGrid searchQuery={searchQuery} filter={selectedFilter} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <MilestoneTimeline searchQuery={searchQuery} filter={selectedFilter} />
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <MemoryBook searchQuery={searchQuery} filter={selectedFilter} />
        </TabsContent>
      </Tabs>
    </div>
  )
}