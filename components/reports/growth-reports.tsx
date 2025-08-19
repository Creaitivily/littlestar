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
  TrendingUp,
  Download,
  Share,
  Calendar,
  Target,
  Award,
  FileText,
  Printer
} from 'lucide-react'

interface GrowthReportsProps {
  dateRange: string
}

const growthSummary = {
  currentHeight: { value: 92, unit: 'cm', percentile: 95, change: '+2.5cm' },
  currentWeight: { value: 14.2, unit: 'kg', percentile: 90, change: '+1.1kg' },
  bmi: { value: 16.8, status: 'healthy', change: '+0.3' },
  headCircumference: { value: 48.5, unit: 'cm', percentile: 92, change: '+1.2cm' }
}

const milestoneProgress = {
  physical: { achieved: 8, total: 10, percentage: 80 },
  cognitive: { achieved: 6, total: 8, percentage: 75 },
  language: { achieved: 4, total: 6, percentage: 67 },
  social: { achieved: 5, total: 7, percentage: 71 }
}

const monthlyGrowth = [
  { month: 'Jan', height: 85, weight: 11.5, percentileH: 92, percentileW: 88 },
  { month: 'Feb', height: 86, weight: 12.1, percentileH: 93, percentileW: 89 },
  { month: 'Mar', height: 87.5, weight: 12.6, percentileH: 94, percentileW: 89 },
  { month: 'Apr', height: 88.5, weight: 13.2, percentileH: 94, percentileW: 90 },
  { month: 'May', height: 89.5, weight: 13.6, percentileH: 95, percentileW: 90 },
  { month: 'Jun', height: 90.5, weight: 14.0, percentileH: 95, percentileW: 90 },
  { month: 'Jul', height: 92, weight: 14.2, percentileH: 95, percentileW: 90 }
]

const reportTemplates = [
  {
    id: '1',
    name: 'Pediatrician Report',
    description: 'Comprehensive growth summary for doctor visits',
    includes: ['Growth charts', 'Percentile tracking', 'Milestone progress', 'Health notes'],
    format: 'PDF',
    pages: '4-6 pages'
  },
  {
    id: '2',
    name: 'Monthly Progress',
    description: 'Monthly growth and development summary',
    includes: ['Height/weight changes', 'New milestones', 'Photo highlights'],
    format: 'PDF',
    pages: '2-3 pages'
  },
  {
    id: '3',
    name: 'Growth Data Export',
    description: 'Raw data export for personal records',
    includes: ['All measurements', 'Milestone dates', 'Notes'],
    format: 'CSV/Excel',
    pages: 'Data file'
  }
]

function MetricCard({ title, value, unit, percentile, change, icon }: any) {
  return (
    <Card className="card-soft">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <Badge variant="success" className="text-xs">
            {percentile}th percentile
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
          <div className="text-sm text-success">
            {change} this period
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MilestoneCard({ category, data }: any) {
  return (
    <Card className="card-soft">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">{category}</span>
            <Badge variant="secondary" className="text-xs">
              {data.achieved}/{data.total}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{data.percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function GrowthReports({ dateRange }: GrowthReportsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Growth Reports</h2>
          <p className="text-sm text-muted-foreground">
            Physical development and milestone tracking reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Current Metrics */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Current Growth Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Height"
            value={growthSummary.currentHeight.value}
            unit={growthSummary.currentHeight.unit}
            percentile={growthSummary.currentHeight.percentile}
            change={growthSummary.currentHeight.change}
            icon={<TrendingUp className="w-4 h-4 text-success" />}
          />
          <MetricCard
            title="Weight"
            value={growthSummary.currentWeight.value}
            unit={growthSummary.currentWeight.unit}
            percentile={growthSummary.currentWeight.percentile}
            change={growthSummary.currentWeight.change}
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
          />
          <MetricCard
            title="BMI"
            value={growthSummary.bmi.value}
            unit=""
            percentile={null}
            change={growthSummary.bmi.change}
            icon={<Target className="w-4 h-4 text-warning" />}
          />
          <MetricCard
            title="Head Circumference"
            value={growthSummary.headCircumference.value}
            unit={growthSummary.headCircumference.unit}
            percentile={growthSummary.headCircumference.percentile}
            change={growthSummary.headCircumference.change}
            icon={<Award className="w-4 h-4 text-accent" />}
          />
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Height & Weight Trend */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Growth Trend</CardTitle>
            <CardDescription>Height and weight progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    dataKey="height"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    name="Height (cm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Percentile Tracking */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Percentile Tracking</CardTitle>
            <CardDescription>Growth percentiles compared to peers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="percentileH" fill="hsl(var(--success))" name="Height Percentile" />
                  <Bar dataKey="percentileW" fill="hsl(var(--primary))" name="Weight Percentile" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Progress */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Milestone Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(milestoneProgress).map(([category, data]) => (
            <MilestoneCard key={category} category={category} data={data} />
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Report Templates</CardTitle>
          <CardDescription>Pre-configured growth reports for different purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="border border-border hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.format}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Includes:</div>
                      <ul className="text-sm space-y-1">
                        {template.includes.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">{template.pages}</span>
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Key Insights</CardTitle>
          <CardDescription>Automated analysis of Emma's growth patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">Excellent Growth Trajectory</h4>
              <p className="text-sm text-muted-foreground">
                Emma is consistently maintaining her position in the 90-95th percentile for both height and weight, 
                indicating healthy and steady growth.
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Milestone Achievement</h4>
              <p className="text-sm text-muted-foreground">
                Physical milestones are being achieved ahead of schedule, with 80% completion rate. 
                This indicates strong motor development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}