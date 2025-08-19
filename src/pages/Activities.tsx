import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Plus, 
  Moon, 
  Utensils, 
  Play, 
  BookOpen, 
  Trees,
  Clock
} from 'lucide-react'
import { activities } from '@/data/mockData'
import { formatDate, getMoodEmoji, getCategoryIcon } from '@/lib/utils'
import { AddActivityForm } from '@/components/forms/AddActivityForm'

export function Activities() {
  const [showActivityForm, setShowActivityForm] = useState(false)
  
  const todayActivities = activities.filter(activity => 
    activity.date === new Date().toISOString().split('T')[0]
  )

  const handleAddActivity = (data: any) => {
    console.log('New activity:', data)
    // In a real app, this would update the database
  }

  const activityStats = activities.reduce((acc, activity) => {
    const type = activity.type
    if (!acc[type]) {
      acc[type] = { type, count: 0, totalDuration: 0 }
    }
    acc[type].count++
    acc[type].totalDuration += activity.duration || 0
    return acc
  }, {} as Record<string, { type: string; count: number; totalDuration: number }>)

  const chartData = Object.values(activityStats)

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <Moon className="w-5 h-5" />
      case 'meal':
        return <Utensils className="w-5 h-5" />
      case 'play':
        return <Play className="w-5 h-5" />
      case 'learning':
        return <BookOpen className="w-5 h-5" />
      case 'outdoor':
        return <Trees className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Activities</h1>
          <p className="text-gray-600">Track Emma's daily routines, meals, sleep, and playtime</p>
        </div>
        <Button onClick={() => setShowActivityForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sleep</CardTitle>
            <Moon className="h-4 w-4 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">10.5h</div>
            <p className="text-xs text-gray-600 mt-1">Great night!</p>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Meals</CardTitle>
            <Utensils className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">3/3</div>
            <p className="text-xs text-gray-600 mt-1">All meals eaten</p>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Play Time</CardTitle>
            <Play className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">2.5h</div>
            <p className="text-xs text-gray-600 mt-1">Active day</p>
          </CardContent>
        </Card>

        <Card className="bg-cream-100 border-cream-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Learning</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">45m</div>
            <p className="text-xs text-gray-600 mt-1">Story & puzzles</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Outdoor</CardTitle>
            <Trees className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">2h</div>
            <p className="text-xs text-gray-600 mt-1">Park visit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? `${value} activities` : `${value} minutes`,
                    name === 'count' ? 'Total Activities' : 'Total Duration'
                  ]}
                />
                <Bar dataKey="count" fill="#a78bfa" name="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getMoodEmoji(activity.mood)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{formatDate(activity.date)}</span>
                      {activity.duration && <span>{activity.duration} min</span>}
                      <div className="flex items-center">
                        {'⭐'.repeat(activity.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Activity Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(activityStats).map(([type, stats]) => (
              <div key={type} className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                <div className="flex justify-center mb-2">
                  {getActivityTypeIcon(type)}
                </div>
                <h3 className="font-medium text-gray-800 capitalize mb-1">{type}</h3>
                <p className="text-sm text-gray-600">{stats.count} activities</p>
                <p className="text-xs text-gray-500">{Math.round(stats.totalDuration / 60)}h total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <AddActivityForm 
        open={showActivityForm} 
        onOpenChange={setShowActivityForm}
        onSubmit={handleAddActivity}
      />
    </div>
  )
}