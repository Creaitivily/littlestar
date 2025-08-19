import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MealsSection } from './meals-section'
import { SleepSection } from './sleep-section'
import { PlaySection } from './play-section'
import { ActivityOverview } from './activity-overview'
import {
  Utensils,
  Moon,
  Baby,
  Activity,
  Plus,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react'

export function ActivitiesTracking() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Daily Activities</h1>
          <p className="text-muted-foreground">
            Track Emma's daily activities, meals, and sleep patterns
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Quick Log
          </Button>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Meals Today</p>
              <p className="text-2xl font-bold text-foreground">5</p>
              <Badge variant="success" className="text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Good appetite
              </Badge>
            </div>
            <Utensils className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sleep Today</p>
              <p className="text-2xl font-bold text-foreground">11.5h</p>
              <Badge variant="success" className="text-xs mt-1">
                <Clock className="w-3 h-3 mr-1" />
                Good rest
              </Badge>
            </div>
            <Moon className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Play Time</p>
              <p className="text-2xl font-bold text-foreground">3.2h</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Activity className="w-3 h-3 mr-1" />
                Active day
              </Badge>
            </div>
            <Baby className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/20 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Mood Score</p>
              <p className="text-2xl font-bold text-foreground">9.2</p>
              <Badge variant="success" className="text-xs mt-1">
                <span className="mr-1">😊</span>
                Happy
              </Badge>
            </div>
            <Activity className="w-8 h-8 text-secondary" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center space-x-2">
            <Utensils className="w-4 h-4" />
            <span>Meals</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center space-x-2">
            <Moon className="w-4 h-4" />
            <span>Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="play" className="flex items-center space-x-2">
            <Baby className="w-4 h-4" />
            <span>Play & Learning</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ActivityOverview selectedDate={selectedDate} />
        </TabsContent>

        <TabsContent value="meals" className="space-y-6">
          <MealsSection selectedDate={selectedDate} />
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <SleepSection selectedDate={selectedDate} />
        </TabsContent>

        <TabsContent value="play" className="space-y-6">
          <PlaySection selectedDate={selectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}