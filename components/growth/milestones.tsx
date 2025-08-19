import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  CheckCircle2,
  Circle,
  Clock,
  Baby,
  Footprints,
  MessageCircle,
  Utensils,
  Hand,
  Eye,
  Plus
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  expectedAge: string
  actualAge?: string
  completed: boolean
  category: 'motor' | 'cognitive' | 'language' | 'social'
  completedDate?: Date
  icon: React.ReactNode
}

const milestones: Milestone[] = [
  {
    id: '1',
    title: 'First Smile',
    description: 'Social smile in response to others',
    expectedAge: '2-3 months',
    actualAge: '2 months',
    completed: true,
    category: 'social',
    completedDate: new Date(2022, 7, 15),
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: '2',
    title: 'Sitting Without Support',
    description: 'Can sit upright without assistance',
    expectedAge: '6-8 months',
    actualAge: '6.5 months',
    completed: true,
    category: 'motor',
    completedDate: new Date(2023, 1, 10),
    icon: <Baby className="w-4 h-4" />
  },
  {
    id: '3',
    title: 'First Words',
    description: 'Says "mama" or "dada" meaningfully',
    expectedAge: '10-14 months',
    actualAge: '11 months',
    completed: true,
    category: 'language',
    completedDate: new Date(2023, 6, 20),
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: '4',
    title: 'Walking Independently',
    description: 'Takes several steps without support',
    expectedAge: '12-18 months',
    actualAge: '13 months',
    completed: true,
    category: 'motor',
    completedDate: new Date(2023, 8, 5),
    icon: <Footprints className="w-4 h-4" />
  },
  {
    id: '5',
    title: 'Using Spoon',
    description: 'Can feed themselves with a spoon',
    expectedAge: '15-18 months',
    actualAge: '16 months',
    completed: true,
    category: 'motor',
    completedDate: new Date(2023, 11, 12),
    icon: <Utensils className="w-4 h-4" />
  },
  {
    id: '6',
    title: 'Two-Word Phrases',
    description: 'Combines two words meaningfully',
    expectedAge: '18-24 months',
    completed: false,
    category: 'language',
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: '7',
    title: 'Running',
    description: 'Can run with coordination',
    expectedAge: '20-24 months',
    completed: false,
    category: 'motor',
    icon: <Footprints className="w-4 h-4" />
  },
  {
    id: '8',
    title: 'Pointing to Body Parts',
    description: 'Can identify and point to body parts',
    expectedAge: '18-24 months',
    completed: false,
    category: 'cognitive',
    icon: <Hand className="w-4 h-4" />
  }
]

const categoryColors = {
  motor: 'from-primary/20 to-primary/40',
  cognitive: 'from-secondary/20 to-secondary/40',
  language: 'from-accent/20 to-accent/40',
  social: 'from-warning/20 to-warning/40'
}

const categoryLabels = {
  motor: 'Motor Skills',
  cognitive: 'Cognitive',
  language: 'Language',
  social: 'Social & Emotional'
}

export function Milestones() {
  const completedCount = milestones.filter(m => m.completed).length
  const totalCount = milestones.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Milestone Progress</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} milestones achieved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const categoryMilestones = milestones.filter(m => m.category === key)
                const completed = categoryMilestones.filter(m => m.completed).length
                
                return (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-foreground">{completed}/{categoryMilestones.length}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones List */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Development Milestones</CardTitle>
              <CardDescription>Track Emma's developmental achievements</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                  milestone.completed 
                    ? 'bg-success/5 border-success/20' 
                    : 'bg-muted/30 border-border hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryColors[milestone.category]} flex-shrink-0`}>
                  {milestone.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground flex items-center">
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground mr-2" />
                        )}
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-4 flex-shrink-0">
                      {categoryLabels[milestone.category]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Expected: {milestone.expectedAge}
                      </div>
                      {milestone.actualAge && (
                        <div className="flex items-center text-success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Achieved: {milestone.actualAge}
                        </div>
                      )}
                    </div>
                    {milestone.completedDate && (
                      <div className="text-muted-foreground">
                        {formatDate(milestone.completedDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}