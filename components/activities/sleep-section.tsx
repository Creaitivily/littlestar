import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import {
  Moon,
  Sun,
  Clock,
  Plus,
  Bed,
  Eye,
  EyeOff,
  Star
} from 'lucide-react'

interface SleepSectionProps {
  selectedDate: Date
}

interface SleepSession {
  id: string
  type: 'night' | 'nap'
  startTime: string
  endTime: string
  duration: string
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  location: 'crib' | 'stroller' | 'car' | 'parent_bed'
  notes?: string
}

const sleepSessions: SleepSession[] = [
  {
    id: '1',
    type: 'night',
    startTime: '7:30 PM',
    endTime: '6:30 AM',
    duration: '11h 0m',
    quality: 'excellent',
    location: 'crib',
    notes: 'Slept through the night without waking'
  },
  {
    id: '2',
    type: 'nap',
    startTime: '9:30 AM',
    endTime: '10:45 AM',
    duration: '1h 15m',
    quality: 'good',
    location: 'crib'
  },
  {
    id: '3',
    type: 'nap',
    startTime: '1:30 PM',
    endTime: '3:30 PM',
    duration: '2h 0m',
    quality: 'excellent',
    location: 'crib',
    notes: 'Very peaceful afternoon nap'
  }
]

const weeklySleep = [
  { day: 'Mon', nightSleep: 10.5, napSleep: 2.5, total: 13 },
  { day: 'Tue', nightSleep: 11, napSleep: 2, total: 13 },
  { day: 'Wed', nightSleep: 10, napSleep: 3, total: 13 },
  { day: 'Thu', nightSleep: 11.5, napSleep: 1.5, total: 13 },
  { day: 'Fri', nightSleep: 10.5, napSleep: 2.5, total: 13 },
  { day: 'Sat', nightSleep: 11, napSleep: 2, total: 13 },
  { day: 'Sun', nightSleep: 11, napSleep: 3.25, total: 14.25 }
]

const sleepQualityTrend = [
  { date: 'Aug 12', quality: 8.5, duration: 13 },
  { date: 'Aug 13', quality: 9, duration: 12.5 },
  { date: 'Aug 14', quality: 7.5, duration: 12 },
  { date: 'Aug 15', quality: 9.5, duration: 13.5 },
  { date: 'Aug 16', quality: 8, duration: 12.5 },
  { date: 'Aug 17', quality: 9, duration: 13 },
  { date: 'Aug 18', quality: 9.5, duration: 14.25 }
]

const sleepTypeColors = {
  night: 'from-primary/20 to-primary/40',
  nap: 'from-accent/20 to-accent/40'
}

const sleepTypeIcons = {
  night: Moon,
  nap: Bed
}

const qualityColors = {
  excellent: 'success',
  good: 'secondary',
  fair: 'warning',
  poor: 'destructive'
} as const

const locationIcons = {
  crib: Bed,
  stroller: Bed,
  car: Bed,
  parent_bed: Bed
}

function SleepSessionCard({ session }: { session: SleepSession }) {
  const Icon = sleepTypeIcons[session.type]
  const LocationIcon = locationIcons[session.location]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${sleepTypeColors[session.type]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="capitalize">{session.type} Sleep</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <EyeOff className="w-4 h-4" />
                <span>{session.startTime}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{session.endTime}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={qualityColors[session.quality]} className="text-xs">
              {session.quality}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {session.duration}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm">
          <LocationIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Location:</span>
          <span className="capitalize">{session.location.replace('_', ' ')}</span>
        </div>

        {/* Notes */}
        {session.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground font-medium">Notes:</span>
              <p className="mt-1">{session.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SleepSection({ selectedDate }: SleepSectionProps) {
  const totalSleep = sleepSessions.reduce((acc, session) => {
    const hours = parseFloat(session.duration.split('h')[0])
    const minutes = session.duration.includes('m') ? parseFloat(session.duration.split('h')[1].split('m')[0]) / 60 : 0
    return acc + hours + minutes
  }, 0)

  const nightSleep = sleepSessions
    .filter(s => s.type === 'night')
    .reduce((acc, session) => {
      const hours = parseFloat(session.duration.split('h')[0])
      const minutes = session.duration.includes('m') ? parseFloat(session.duration.split('h')[1].split('m')[0]) / 60 : 0
      return acc + hours + minutes
    }, 0)

  const napCount = sleepSessions.filter(s => s.type === 'nap').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sleep Tracking</h2>
          <p className="text-sm text-muted-foreground">
            Monitor Emma's sleep patterns and quality
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Sleep
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="text-2xl font-bold text-foreground mb-1">{totalSleep.toFixed(1)}h</div>
          <div className="text-sm text-muted-foreground">Total Sleep Today</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="text-2xl font-bold text-foreground mb-1">{nightSleep.toFixed(1)}h</div>
          <div className="text-sm text-muted-foreground">Night Sleep</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="text-2xl font-bold text-foreground mb-1">{napCount}</div>
          <div className="text-sm text-muted-foreground">Naps Today</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="text-2xl font-bold text-foreground mb-1">9.2</div>
          <div className="text-sm text-muted-foreground">Sleep Quality</div>
        </Card>
      </div>

      {/* Today's Sleep Sessions */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today's Sleep Sessions</CardTitle>
          <CardDescription>
            {selectedDate.toLocaleDateString()} sleep schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sleepSessions.map((session) => (
              <SleepSessionCard key={session.id} session={session} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sleep Duration */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Sleep Duration</CardTitle>
            <CardDescription>Night sleep vs naps over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySleep}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value}h`, '']}
                  />
                  <Bar dataKey="nightSleep" stackId="a" fill="hsl(var(--primary))" name="Night Sleep" />
                  <Bar dataKey="napSleep" stackId="a" fill="hsl(var(--accent))" name="Nap Sleep" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Night Sleep</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm">Nap Sleep</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Quality Trend */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sleep Quality Trend</CardTitle>
            <CardDescription>Quality score and duration over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepQualityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 15]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    name="Quality (0-10)"
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    name="Duration (hours)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm">Quality Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Duration (hours)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Tips */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5 text-warning" />
            <span>Sleep Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">Great Sleep Pattern!</h4>
              <p className="text-sm text-muted-foreground">
                Emma is getting excellent sleep duration and quality. Keep up the consistent bedtime routine.
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Recommended Schedule</h4>
              <p className="text-sm text-muted-foreground">
                For her age, 11-14 hours total sleep is ideal. Current average of 13+ hours is perfect.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}