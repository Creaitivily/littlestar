import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Heart, 
  Activity, 
  Camera,
  Calendar,
  Baby,
  Smile,
  Moon
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  color: string
}

function MetricCard({ title, value, description, icon, trend, color }: MetricCardProps) {
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className="flex items-center pt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${trend.isPositive ? 'text-success' : 'text-destructive'}`} />
            <span className={`text-xs ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Current Height"
        value="92 cm"
        description="95th percentile for age"
        icon={<Baby className="w-4 h-4 text-white" />}
        trend={{ value: "+2 cm this month", isPositive: true }}
        color="from-primary/20 to-primary/40"
      />
      
      <MetricCard
        title="Current Weight"
        value="14.2 kg"
        description="90th percentile for age"
        icon={<TrendingUp className="w-4 h-4 text-white" />}
        trend={{ value: "+0.5 kg this month", isPositive: true }}
        color="from-secondary/20 to-secondary/40"
      />
      
      <MetricCard
        title="Health Status"
        value="Excellent"
        description="Last checkup: 2 weeks ago"
        icon={<Heart className="w-4 h-4 text-white" />}
        color="from-destructive/20 to-destructive/30"
      />
      
      <MetricCard
        title="Sleep Quality"
        value="9.2 hrs"
        description="Average last 7 days"
        icon={<Moon className="w-4 h-4 text-white" />}
        trend={{ value: "+30 min from last week", isPositive: true }}
        color="from-accent/20 to-accent/40"
      />
    </div>
  )
}