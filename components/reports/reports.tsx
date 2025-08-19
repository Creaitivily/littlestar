import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GrowthReports } from './growth-reports'
import { HealthReports } from './health-reports'
import { ActivityReports } from './activity-reports'
import { CustomReports } from './custom-reports'
import {
  FileText,
  Download,
  Share,
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Settings,
  Plus,
  Filter,
  Mail
} from 'lucide-react'

export function Reports() {
  const [activeTab, setActiveTab] = useState('growth')
  const [dateRange, setDateRange] = useState('last-month')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate insights and export Emma's data and progress reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-3months">Last 3 Months</option>
            <option value="last-6months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
            <option value="all-time">All Time</option>
          </select>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Growth Progress</p>
              <p className="text-2xl font-bold text-foreground">Excellent</p>
              <Badge variant="success" className="text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                95th percentile
              </Badge>
            </div>
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold text-foreground">9.8/10</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Heart className="w-3 h-3 mr-1" />
                Outstanding
              </Badge>
            </div>
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activity Level</p>
              <p className="text-2xl font-bold text-foreground">High</p>
              <Badge variant="warning" className="text-xs mt-1">
                <Activity className="w-3 h-3 mr-1" />
                Very active
              </Badge>
            </div>
            <Activity className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
              <p className="text-2xl font-bold text-foreground">24</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <FileText className="w-3 h-3 mr-1" />
                This month
              </Badge>
            </div>
            <FileText className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
              <CardDescription>Your latest generated reports and downloads</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/40">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Monthly Growth Report</h4>
                  <p className="text-sm text-muted-foreground">July 2024 • Height, weight, and milestones</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" className="text-xs">PDF</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Health Summary</h4>
                  <p className="text-sm text-muted-foreground">Q2 2024 • Vaccinations, checkups, medications</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">PDF</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-warning/40">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Activity & Development Report</h4>
                  <p className="text-sm text-muted-foreground">July 2024 • Sleep, meals, play activities</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="warning" className="text-xs">PDF</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="growth" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Growth</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Health</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <GrowthReports dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <HealthReports dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityReports dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <CustomReports dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}