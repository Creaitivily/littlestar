import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  TrendingUp,
  Utensils,
  Moon,
  Camera,
  Heart,
  Thermometer,
  Scale
} from 'lucide-react'

interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

function QuickActionButton({ title, description, icon, color, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-all duration-200"
      onClick={onClick}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color} self-start`}>
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </Button>
  )
}

export function QuickActions() {
  const quickActions = [
    {
      title: 'Log Meal',
      description: 'Record feeding time',
      icon: <Utensils className="w-4 h-4 text-white" />,
      color: 'from-warning/20 to-warning/40',
      onClick: () => console.log('Log meal')
    },
    {
      title: 'Track Sleep',
      description: 'Record nap or sleep',
      icon: <Moon className="w-4 h-4 text-white" />,
      color: 'from-primary/20 to-primary/40',
      onClick: () => console.log('Track sleep')
    },
    {
      title: 'Add Photo',
      description: 'Capture a moment',
      icon: <Camera className="w-4 h-4 text-white" />,
      color: 'from-accent/20 to-accent/40',
      onClick: () => console.log('Add photo')
    },
    {
      title: 'Health Check',
      description: 'Log temperature, etc.',
      icon: <Thermometer className="w-4 h-4 text-white" />,
      color: 'from-destructive/20 to-destructive/30',
      onClick: () => console.log('Health check')
    },
    {
      title: 'Record Growth',
      description: 'Height & weight',
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      color: 'from-secondary/20 to-secondary/40',
      onClick: () => console.log('Record growth')
    },
    {
      title: 'Milestone',
      description: 'Special achievement',
      icon: <Heart className="w-4 h-4 text-white" />,
      color: 'from-success/20 to-success/40',
      onClick: () => console.log('Add milestone')
    }
  ]

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Fast logging for daily activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              {...action}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}