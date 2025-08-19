import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar,
  Share,
  Printer
} from 'lucide-react'
import { growthData, activities, healthRecords, milestones } from '@/data/mockData'
import { formatDate } from '@/lib/utils'

export function Reports() {
  const recentGrowth = growthData.slice(-6)
  const achievedMilestones = milestones.filter(m => m.isAchieved).length
  const totalMilestones = milestones.length
  const completedAppointments = healthRecords.filter(r => r.status === 'completed').length

  const reportTypes = [
    {
      title: 'Growth Progress Report',
      description: 'Comprehensive height and weight tracking with percentiles',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'lavender',
      lastGenerated: '2024-08-01'
    },
    {
      title: 'Health Summary',
      description: 'Medical appointments, vaccinations, and health records',
      icon: <FileText className="w-5 h-5" />,
      color: 'mint',
      lastGenerated: '2024-07-15'
    },
    {
      title: 'Activity Analysis',
      description: 'Daily routines, sleep patterns, and activity trends',
      icon: <Calendar className="w-5 h-5" />,
      color: 'pink',
      lastGenerated: '2024-08-10'
    },
    {
      title: 'Milestone Report',
      description: 'Development milestones and achievement timeline',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'cream',
      lastGenerated: '2024-06-20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports and track Emma's progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Growth Measurements</CardTitle>
            <TrendingUp className="h-4 w-4 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{growthData.length}</div>
            <p className="text-xs text-gray-600 mt-1">Data points recorded</p>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Milestones Achieved</CardTitle>
            <TrendingUp className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{achievedMilestones}/{totalMilestones}</div>
            <p className="text-xs text-gray-600 mt-1">{Math.round((achievedMilestones / totalMilestones) * 100)}% complete</p>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Health Records</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{healthRecords.length}</div>
            <p className="text-xs text-gray-600 mt-1">{completedAppointments} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-cream-100 border-cream-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Activities Logged</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{activities.length}</div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Growth Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={recentGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value, name) => [
                  name === 'height' ? `${value} cm` : `${value} kg`,
                  name === 'height' ? 'Height' : 'Weight'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="height" 
                stroke="#a78bfa" 
                fill="#ddd6fe" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#22c55e" 
                fill="#bbf7d0" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => (
              <Card key={index} className={`bg-${report.color}-50 border-${report.color}-200 hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-${report.color}-100 rounded-lg`}>
                      {report.icon}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Last generated: {formatDate(report.lastGenerated)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      PDF
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Download className="w-5 h-5" />
              <span>Export to PDF</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span>Export to CSV</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Printer className="w-5 h-5" />
              <span>Print Report</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-lavender-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Custom Report Builder</h4>
            <p className="text-sm text-gray-600 mb-3">
              Create personalized reports by selecting specific date ranges and data types.
            </p>
            <Button size="sm">
              Build Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}