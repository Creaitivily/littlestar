import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Download,
  Printer,
  Utensils,
  Moon,
  Baby,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react'

interface ActivityReportsProps {
  dateRange: string
}

const activitySummary = {
  avgSleepDuration: 13.2,
  avgMealsPerDay: 5.2,
  avgPlayTime: 3.8,
  sleepQuality: 9.1,
  activityLevel: 'High'
}

export function ActivityReports({ dateRange }: ActivityReportsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Activity Reports</h2>
          <p className="text-sm text-muted-foreground">
            Daily activities, sleep patterns, and developmental play reports
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

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Sleep</p>
              <p className="text-2xl font-bold text-foreground">{activitySummary.avgSleepDuration}h</p>
              <Badge variant="success" className="text-xs mt-1">Excellent</Badge>
            </div>
            <Moon className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Meals</p>
              <p className="text-2xl font-bold text-foreground">{activitySummary.avgMealsPerDay}</p>
              <Badge variant="secondary" className="text-xs mt-1">Good appetite</Badge>
            </div>
            <Utensils className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Play Time</p>
              <p className="text-2xl font-bold text-foreground">{activitySummary.avgPlayTime}h</p>
              <Badge variant="success" className="text-xs mt-1">Very active</Badge>
            </div>
            <Baby className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sleep Quality</p>
              <p className="text-2xl font-bold text-foreground">{activitySummary.sleepQuality}/10</p>
              <Badge variant="secondary" className="text-xs mt-1">Peaceful</Badge>
            </div>
            <Activity className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity Report Templates</CardTitle>
          <CardDescription>Generate detailed activity and development reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">Sleep Pattern Analysis</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed sleep tracking with quality metrics and improvement suggestions
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">PDF • 3-4 pages</Badge>
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-success" />
                    <h4 className="font-medium">Development Activities</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Play activities, skill development, and learning progress summary
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">PDF • 4-6 pages</Badge>
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}