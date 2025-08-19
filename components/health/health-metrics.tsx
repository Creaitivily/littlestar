import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Thermometer,
  Heart,
  Activity,
  Droplets,
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

// Sample health data
const temperatureData = [
  { date: 'Aug 10', temp: 98.6, status: 'normal' },
  { date: 'Aug 12', temp: 99.2, status: 'elevated' },
  { date: 'Aug 14', temp: 98.4, status: 'normal' },
  { date: 'Aug 16', temp: 98.7, status: 'normal' },
  { date: 'Aug 18', temp: 98.5, status: 'normal' }
]

interface MetricCardProps {
  title: string
  value: string
  unit: string
  status: 'normal' | 'elevated' | 'low'
  lastUpdated: string
  icon: React.ReactNode
  trend?: {
    direction: 'up' | 'down' | 'stable'
    value: string
  }
}

function MetricCard({ title, value, unit, status, lastUpdated, icon, trend }: MetricCardProps) {
  const statusColors = {
    normal: 'success',
    elevated: 'warning',
    low: 'destructive'
  } as const

  const statusLabels = {
    normal: 'Normal',
    elevated: 'Elevated',
    low: 'Low'
  }

  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </div>
          </div>
          <Badge variant={statusColors[status]} className="text-xs">
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className={`w-3 h-3 ${
                trend.direction === 'up' ? 'text-success rotate-0' :
                trend.direction === 'down' ? 'text-destructive rotate-180' :
                'text-muted-foreground'
              }`} />
              <span className="text-muted-foreground">{trend.value}</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HealthMetrics() {
  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Temperature"
          value="98.5"
          unit="°F"
          status="normal"
          lastUpdated="2 hours ago"
          icon={<Thermometer className="w-4 h-4 text-white" />}
          trend={{ direction: 'stable', value: 'Stable' }}
        />
        
        <MetricCard
          title="Heart Rate"
          value="110"
          unit="bpm"
          status="normal"
          lastUpdated="1 day ago"
          icon={<Heart className="w-4 h-4 text-white" />}
          trend={{ direction: 'stable', value: 'Normal range' }}
        />
        
        <MetricCard
          title="Oxygen Sat"
          value="99"
          unit="%"
          status="normal"
          lastUpdated="1 day ago"
          icon={<Droplets className="w-4 h-4 text-white" />}
          trend={{ direction: 'stable', value: 'Excellent' }}
        />
        
        <MetricCard
          title="Activity Level"
          value="High"
          unit=""
          status="normal"
          lastUpdated="Today"
          icon={<Activity className="w-4 h-4 text-white" />}
          trend={{ direction: 'up', value: 'Very active' }}
        />
      </div>

      {/* Temperature Trend Chart */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Temperature Trend</CardTitle>
              <CardDescription>Last 7 days temperature readings</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Reading
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  domain={[97, 101]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}°F`, 'Temperature']}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
                {/* Normal range reference lines */}
                <Line
                  type="monotone"
                  data={[{ date: 'Aug 10', temp: 100.4 }, { date: 'Aug 18', temp: 100.4 }]}
                  dataKey="temp"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Normal temperature range: 97.0°F - 100.4°F
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Health Notes */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Health Notes</CardTitle>
          <CardDescription>Doctor observations and parent notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">Routine Checkup</h4>
                <Badge variant="secondary" className="text-xs">Aug 4, 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Emma is developing excellently. Height and weight are in the 95th percentile. 
                Recommend continuing current diet and vitamin D supplementation.
              </p>
              <div className="text-xs text-muted-foreground">
                Dr. Sarah Johnson, Pediatrician
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">Parent Observation</h4>
                <Badge variant="outline" className="text-xs">Aug 17, 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Emma had a slight fever yesterday evening (99.2°F) but is back to normal today. 
                She's eating well and very active.
              </p>
              <div className="text-xs text-muted-foreground">
                Parent note
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}