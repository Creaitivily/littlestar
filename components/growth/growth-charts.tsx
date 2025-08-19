import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

// Sample growth data
const heightData = [
  { age: '0m', height: 50, percentile: 75 },
  { age: '3m', height: 61, percentile: 80 },
  { age: '6m', height: 68, percentile: 85 },
  { age: '9m', height: 74, percentile: 90 },
  { age: '12m', height: 80, percentile: 90 },
  { age: '15m', height: 84, percentile: 92 },
  { age: '18m', height: 87, percentile: 93 },
  { age: '21m', height: 90, percentile: 94 },
  { age: '24m', height: 92, percentile: 95 }
]

const weightData = [
  { age: '0m', weight: 3.2, percentile: 70 },
  { age: '3m', weight: 5.8, percentile: 75 },
  { age: '6m', weight: 7.9, percentile: 80 },
  { age: '9m', weight: 9.1, percentile: 85 },
  { age: '12m', weight: 10.5, percentile: 88 },
  { age: '15m', weight: 11.8, percentile: 89 },
  { age: '18m', weight: 12.9, percentile: 90 },
  { age: '21m', weight: 13.7, percentile: 90 },
  { age: '24m', weight: 14.2, percentile: 90 }
]

const combinedData = heightData.map((item, index) => ({
  ...item,
  weight: weightData[index].weight,
  weightPercentile: weightData[index].percentile
}))

interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
  currentValue: string
  percentile: number
}

function ChartCard({ title, description, children, currentValue, percentile }: ChartCardProps) {
  const getPercentileColor = (p: number) => {
    if (p >= 90) return 'success'
    if (p >= 75) return 'warning'
    if (p >= 50) return 'secondary'
    return 'destructive'
  }

  return (
    <Card className="card-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{currentValue}</div>
            <Badge variant={getPercentileColor(percentile)} className="text-xs">
              {percentile}th percentile
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export function GrowthCharts() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Growth Tracking</h1>
        <p className="text-muted-foreground">
          Monitor Emma's physical development and milestones
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Height Chart */}
        <ChartCard
          title="Height Progress"
          description="Height measurements over time"
          currentValue="92 cm"
          percentile={95}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={heightData}>
              <defs>
                <linearGradient id="heightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="age" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} cm`, 'Height']}
              />
              <Area
                type="monotone"
                dataKey="height"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                fill="url(#heightGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weight Chart */}
        <ChartCard
          title="Weight Progress"
          description="Weight measurements over time"
          currentValue="14.2 kg"
          percentile={90}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="age" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#weightGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Combined Growth Chart */}
        <div className="lg:col-span-2">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Growth Percentiles</CardTitle>
              <CardDescription>Height and weight percentiles over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="age" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      domain={[0, 100]}
                      label={{ value: 'Percentile', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="percentile"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={3}
                      name="Height Percentile"
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weightPercentile"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Weight Percentile"
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}