import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Stethoscope,
  Syringe,
  Baby,
  AlertCircle,
  Plus
} from 'lucide-react'

interface UpcomingEvent {
  id: string
  title: string
  description: string
  date: Date
  type: 'appointment' | 'vaccination' | 'milestone' | 'reminder'
  priority: 'high' | 'medium' | 'low'
  icon: React.ReactNode
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Pediatric Checkup',
    description: 'Regular 6-month examination',
    date: new Date(2024, 7, 25, 10, 0),
    type: 'appointment',
    priority: 'high',
    icon: <Stethoscope className="w-4 h-4" />
  },
  {
    id: '2',
    title: 'MMR Vaccination',
    description: 'Second dose scheduled',
    date: new Date(2024, 7, 28, 14, 30),
    type: 'vaccination',
    priority: 'high',
    icon: <Syringe className="w-4 h-4" />
  },
  {
    id: '3',
    title: 'Expected Milestone',
    description: 'May start walking independently',
    date: new Date(2024, 8, 5),
    type: 'milestone',
    priority: 'medium',
    icon: <Baby className="w-4 h-4" />
  },
  {
    id: '4',
    title: 'Vitamin D Reminder',
    description: 'Daily supplement due',
    date: new Date(2024, 7, 19, 9, 0),
    type: 'reminder',
    priority: 'low',
    icon: <AlertCircle className="w-4 h-4" />
  }
]

const eventColors = {
  appointment: 'from-destructive/20 to-destructive/30',
  vaccination: 'from-warning/20 to-warning/40',
  milestone: 'from-success/20 to-success/40',
  reminder: 'from-primary/20 to-primary/40'
}

const priorityColors = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary'
} as const

function formatEventDate(date: Date): string {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
  
  return date.toLocaleDateString()
}

export function UpcomingEvents() {
  return (
    <Card className="card-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            <CardDescription>Appointments and reminders</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${eventColors[event.type]} flex-shrink-0`}>
              {event.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {event.title}
                </h4>
                <Badge 
                  variant={priorityColors[event.priority]}
                  className="text-xs ml-2 flex-shrink-0"
                >
                  {event.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {event.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {formatEventDate(event.date)}
                {event.date.getHours() > 0 && (
                  <>
                    <Clock className="w-3 h-3 ml-2 mr-1" />
                    {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}