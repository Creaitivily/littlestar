import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Baby,
  Gamepad2,
  Music,
  BookOpen,
  Car,
  Building,
  TreePine,
  Blocks,
  Puzzle,
  Paintbrush,
  Plus,
  Clock,
  Star,
  Smile
} from 'lucide-react'

interface PlaySectionProps {
  selectedDate: Date
}

interface PlayActivity {
  id: string
  name: string
  category: 'physical' | 'cognitive' | 'creative' | 'social' | 'sensory'
  startTime: string
  endTime: string
  duration: string
  location: 'indoor' | 'outdoor' | 'both'
  engagement: 'high' | 'medium' | 'low'
  skills: string[]
  notes?: string
  toys?: string[]
}

const playActivities: PlayActivity[] = [
  {
    id: '1',
    name: 'Block Stacking',
    category: 'cognitive',
    startTime: '8:00 AM',
    endTime: '8:45 AM',
    duration: '45 minutes',
    location: 'indoor',
    engagement: 'high',
    skills: ['Fine motor', 'Problem solving', 'Hand-eye coordination'],
    toys: ['Wooden blocks', 'Stacking rings'],
    notes: 'Built a tower of 6 blocks! Very focused today.'
  },
  {
    id: '2',
    name: 'Outdoor Walk',
    category: 'physical',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    duration: '1 hour',
    location: 'outdoor',
    engagement: 'high',
    skills: ['Gross motor', 'Balance', 'Exploration'],
    notes: 'Walked holding hands, explored leaves and flowers'
  },
  {
    id: '3',
    name: 'Music & Dancing',
    category: 'creative',
    startTime: '3:30 PM',
    endTime: '4:00 PM',
    duration: '30 minutes',
    location: 'indoor',
    engagement: 'high',
    skills: ['Rhythm', 'Coordination', 'Language'],
    toys: ['Musical instruments', 'Dance scarves'],
    notes: 'Loved the drums! Danced to favorite songs.'
  },
  {
    id: '4',
    name: 'Reading Time',
    category: 'cognitive',
    startTime: '6:00 PM',
    endTime: '6:30 PM',
    duration: '30 minutes',
    location: 'indoor',
    engagement: 'medium',
    skills: ['Language', 'Attention', 'Vocabulary'],
    toys: ['Picture books', 'Soft books'],
    notes: 'Pointed at pictures and tried to name animals'
  }
]

const weeklyActivities = [
  { day: 'Mon', physical: 2, cognitive: 3, creative: 1, social: 1, sensory: 2 },
  { day: 'Tue', physical: 3, cognitive: 2, creative: 2, social: 1, sensory: 1 },
  { day: 'Wed', physical: 2, cognitive: 3, creative: 1, social: 2, sensory: 1 },
  { day: 'Thu', physical: 3, cognitive: 2, creative: 2, social: 1, sensory: 2 },
  { day: 'Fri', physical: 2, cognitive: 4, creative: 1, social: 1, sensory: 1 },
  { day: 'Sat', physical: 4, cognitive: 2, creative: 2, social: 2, sensory: 2 },
  { day: 'Sun', physical: 3, cognitive: 3, creative: 2, social: 1, sensory: 2 }
]

const skillDevelopment = [
  { skill: 'Fine Motor', value: 35, color: '#10b981' },
  { skill: 'Gross Motor', value: 25, color: '#6366f1' },
  { skill: 'Language', value: 20, color: '#f59e0b' },
  { skill: 'Problem Solving', value: 15, color: '#ec4899' },
  { skill: 'Social', value: 5, color: '#8b5cf6' }
]

const categoryColors = {
  physical: 'from-success/20 to-success/40',
  cognitive: 'from-primary/20 to-primary/40',
  creative: 'from-warning/20 to-warning/40',
  social: 'from-accent/20 to-accent/40',
  sensory: 'from-secondary/20 to-secondary/40'
}

const categoryIcons = {
  physical: Baby,
  cognitive: Puzzle,
  creative: Paintbrush,
  social: Smile,
  sensory: Star
}

const engagementColors = {
  high: 'success',
  medium: 'warning',
  low: 'destructive'
} as const

const locationIcons = {
  indoor: Building,
  outdoor: TreePine,
  both: Car
}

function PlayActivityCard({ activity }: { activity: PlayActivity }) {
  const Icon = categoryIcons[activity.category]
  const LocationIcon = locationIcons[activity.location]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryColors[activity.category]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span>{activity.name}</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{activity.startTime} - {activity.endTime}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.duration}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={engagementColors[activity.engagement]} className="text-xs">
              {activity.engagement} engagement
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              {activity.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm">
          <LocationIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Location:</span>
          <span className="capitalize">{activity.location}</span>
        </div>

        {/* Skills Developed */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">Skills developed:</div>
          <div className="flex flex-wrap gap-1">
            {activity.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Toys Used */}
        {activity.toys && activity.toys.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Toys used:</div>
            <div className="flex flex-wrap gap-1">
              {activity.toys.map((toy, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {toy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {activity.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground font-medium">Notes:</span>
              <p className="mt-1">{activity.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PlaySection({ selectedDate }: PlaySectionProps) {
  const totalPlayTime = playActivities.reduce((acc, activity) => {
    const duration = parseFloat(activity.duration.split(' ')[0])
    const unit = activity.duration.includes('hour') ? 60 : 1
    return acc + duration * unit
  }, 0)

  const highEngagementCount = playActivities.filter(a => a.engagement === 'high').length
  const uniqueSkills = new Set(playActivities.flatMap(a => a.skills)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Play & Learning</h2>
          <p className="text-sm text-muted-foreground">
            Track Emma's play activities and skill development
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="text-2xl font-bold text-foreground mb-1">{Math.round(totalPlayTime)}m</div>
          <div className="text-sm text-muted-foreground">Total Play Time</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="text-2xl font-bold text-foreground mb-1">{playActivities.length}</div>
          <div className="text-sm text-muted-foreground">Activities Today</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="text-2xl font-bold text-foreground mb-1">{highEngagementCount}</div>
          <div className="text-sm text-muted-foreground">High Engagement</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="text-2xl font-bold text-foreground mb-1">{uniqueSkills}</div>
          <div className="text-sm text-muted-foreground">Skills Practiced</div>
        </Card>
      </div>

      {/* Today's Activities */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today's Play Activities</CardTitle>
          <CardDescription>
            {selectedDate.toLocaleDateString()} learning and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playActivities.map((activity) => (
              <PlayActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Distribution */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Activity Balance</CardTitle>
            <CardDescription>Distribution of activity types over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivities}>
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
                  />
                  <Bar dataKey="physical" stackId="a" fill="hsl(var(--success))" name="Physical" />
                  <Bar dataKey="cognitive" stackId="a" fill="hsl(var(--primary))" name="Cognitive" />
                  <Bar dataKey="creative" stackId="a" fill="hsl(var(--warning))" name="Creative" />
                  <Bar dataKey="social" stackId="a" fill="hsl(var(--accent))" name="Social" />
                  <Bar dataKey="sensory" stackId="a" fill="hsl(var(--secondary))" name="Sensory" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm">Physical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Cognitive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm">Creative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm">Social</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm">Sensory</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Development Focus */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Skill Development Focus</CardTitle>
            <CardDescription>Time spent on different skill areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDevelopment}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {skillDevelopment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Time']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {skillDevelopment.map((skill) => (
                <div key={skill.skill} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="text-sm">{skill.skill}: {skill.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Insights */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5 text-warning" />
            <span>Development Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">Excellent Progress!</h4>
              <p className="text-sm text-muted-foreground">
                Emma shows high engagement in cognitive activities and is developing fine motor skills rapidly.
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Recommended Focus</h4>
              <p className="text-sm text-muted-foreground">
                Consider adding more social play activities to balance her development across all areas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}