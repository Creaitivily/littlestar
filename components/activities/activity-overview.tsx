import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Clock,
  Utensils,
  Moon,
  Baby,
  Smile,
  Frown,
  Meh,
  Plus,
  Edit
} from 'lucide-react'

interface ActivityOverviewProps {
  selectedDate: Date
}

// Sample activity data for the day
const timelineData = [
  { time: '6:30 AM', activity: 'Wake up', type: 'sleep', duration: '11h 30m', mood: 'happy' },
  { time: '7:00 AM', activity: 'Morning feeding', type: 'meal', duration: '25m', mood: 'happy' },
  { time: '8:00 AM', activity: 'Play time', type: 'play', duration: '45m', mood: 'happy' },
  { time: '9:30 AM', activity: 'Morning nap', type: 'sleep', duration: '1h 15m', mood: 'calm' },
  { time: '11:00 AM', activity: 'Snack time', type: 'meal', duration: '15m', mood: 'happy' },
  { time: '11:30 AM', activity: 'Outdoor play', type: 'play', duration: '1h', mood: 'excited' },
  { time: '12:30 PM', activity: 'Lunch', type: 'meal', duration: '30m', mood: 'happy' },
  { time: '1:30 PM', activity: 'Afternoon nap', type: 'sleep', duration: '2h', mood: 'calm' },
  { time: '3:30 PM', activity: 'Free play', type: 'play', duration: '1h', mood: 'happy' },
  { time: '5:00 PM', activity: 'Dinner', type: 'meal', duration: '35m', mood: 'content' },
  { time: '6:00 PM', activity: 'Bath time', type: 'care', duration: '20m', mood: 'playful' },
  { time: '7:00 PM', activity: 'Bedtime routine', type: 'sleep', duration: '30m', mood: 'calm' },
  { time: '7:30 PM', activity: 'Night sleep', type: 'sleep', duration: '11h', mood: 'peaceful' }
]

const moodDistribution = [
  { name: 'Happy', value: 45, color: '#10b981' },
  { name: 'Calm', value: 30, color: '#6366f1' },
  { name: 'Playful', value: 15, color: '#f59e0b' },
  { name: 'Fussy', value: 10, color: '#ef4444' }
]

const activityBreakdown = [
  { name: 'Sleep', hours: 11.5, color: '#6366f1' },
  { name: 'Meals', hours: 1.8, color: '#f59e0b' },
  { name: 'Play', hours: 3.2, color: '#10b981' },
  { name: 'Care', hours: 0.5, color: '#ec4899' },
  { name: 'Other', hours: 7, color: '#6b7280' }
]

const activityColors = {
  meal: 'from-warning/20 to-warning/40',
  sleep: 'from-primary/20 to-primary/40',
  play: 'from-success/20 to-success/40',
  care: 'from-accent/20 to-accent/40'
}

const activityIcons = {
  meal: Utensils,
  sleep: Moon,
  play: Baby,
  care: Smile
}

const moodIcons = {
  happy: { icon: Smile, color: 'text-success' },
  excited: { icon: Smile, color: 'text-warning' },
  content: { icon: Smile, color: 'text-secondary' },
  calm: { icon: Meh, color: 'text-primary' },
  playful: { icon: Baby, color: 'text-accent' },
  peaceful: { icon: Moon, color: 'text-primary' },
  fussy: { icon: Frown, color: 'text-destructive' }
}

function TimelineEvent({ event }: { event: typeof timelineData[0] }) {
  const Icon = activityIcons[event.type as keyof typeof activityIcons] || Clock
  const MoodIcon = moodIcons[event.mood as keyof typeof moodIcons]?.icon || Smile
  const moodColor = moodIcons[event.mood as keyof typeof moodIcons]?.color || 'text-muted-foreground'
  
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${activityColors[event.type as keyof typeof activityColors] || 'from-muted/20 to-muted/40'} flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-foreground">{event.activity}</h4>
          <div className="flex items-center space-x-2">
            <MoodIcon className={`w-4 h-4 ${moodColor}`} />
            <Badge variant="outline" className="text-xs">{event.duration}</Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{event.time}</div>
      </div>
    </div>
  )
}

export function ActivityOverview({ selectedDate }: ActivityOverviewProps) {
  const isToday = selectedDate.toDateString() === new Date().toDateString()
  
  return (
    <div className="space-y-6">
      {/* Day Summary */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {isToday ? "Today's Summary" : `Summary for ${selectedDate.toLocaleDateString()}`}
              </CardTitle>
              <CardDescription>
                Complete overview of Emma's day
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Day
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Breakdown Chart */}
            <div>
              <h4 className="font-medium mb-4">Time Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityBreakdown} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`${value} hours`, 'Duration']}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mood Distribution */}
            <div>
              <h4 className="font-medium mb-4">Mood Throughout Day</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Time']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {moodDistribution.map((mood) => (
                  <div key={mood.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: mood.color }}
                    />
                    <span className="text-sm">{mood.name}: {mood.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Timeline */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Daily Timeline</CardTitle>
              <CardDescription>Chronological view of activities</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {timelineData.map((event, index) => (
              <TimelineEvent key={index} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">12</div>
          <div className="text-sm text-muted-foreground">Total Activities</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">13h</div>
          <div className="text-sm text-muted-foreground">Sleep Duration</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">5</div>
          <div className="text-sm text-muted-foreground">Feeding Sessions</div>
        </Card>
      </div>
    </div>
  )
}