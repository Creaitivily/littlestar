import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  Baby,
  Utensils,
  Moon,
  Heart,
  Camera,
  Calendar,
  Plus,
  ChevronRight
} from 'lucide-react'

interface Activity {
  id: string
  type: 'meal' | 'sleep' | 'health' | 'milestone' | 'photo'
  title: string
  description: string
  time: Date
  badge?: string
  icon: React.ReactNode
}

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'First Words!',
    description: 'Emma said "mama" clearly for the first time',
    time: new Date(2024, 7, 18, 10, 30),
    badge: 'Milestone',
    icon: <Baby className="w-4 h-4" />
  },
  {
    id: '2',
    type: 'meal',
    title: 'Lunch',
    description: 'Ate all vegetables, loved the carrots',
    time: new Date(2024, 7, 18, 12, 15),
    badge: 'Great Appetite',
    icon: <Utensils className="w-4 h-4" />
  },
  {
    id: '3',
    type: 'sleep',
    title: 'Afternoon Nap',
    description: '2 hours peaceful sleep',
    time: new Date(2024, 7, 18, 13, 0),
    icon: <Moon className="w-4 h-4" />
  },
  {
    id: '4',
    type: 'health',
    title: 'Temperature Check',
    description: '98.6°F - normal and healthy',
    time: new Date(2024, 7, 18, 8, 0),
    badge: 'Healthy',
    icon: <Heart className="w-4 h-4" />
  },
  {
    id: '5',
    type: 'photo',
    title: 'Playing with Toys',
    description: 'Captured some adorable moments',
    time: new Date(2024, 7, 17, 16, 45),
    icon: <Camera className="w-4 h-4" />
  }
]

const activityColors = {
  meal: 'from-warning/20 to-warning/40',
  sleep: 'from-primary/20 to-primary/40',
  health: 'from-destructive/20 to-destructive/30',
  milestone: 'from-success/20 to-success/40',
  photo: 'from-accent/20 to-accent/40'
}

const badgeColors = {
  'Milestone': 'success',
  'Great Appetite': 'warning',
  'Healthy': 'destructive'
} as const

export function RecentActivities() {
  return (
    <Card className="card-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
            <CardDescription>Latest updates and milestones</CardDescription>
          </div>
          <Button size="sm" className="h-8">
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${activityColors[activity.type]} flex-shrink-0`}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-foreground">{activity.title}</h4>
                <div className="flex items-center space-x-2">
                  {activity.badge && (
                    <Badge 
                      variant={badgeColors[activity.badge as keyof typeof badgeColors] || 'default'}
                      className="text-xs"
                    >
                      {activity.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {activity.time.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button variant="ghost" className="w-full justify-center">
            View All Activities
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}