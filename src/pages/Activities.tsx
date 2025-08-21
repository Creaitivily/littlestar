import React, { useState, useEffect } from 'react'
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
  Clock,
  Baby
} from 'lucide-react'
import { formatDate, getMoodEmoji, getCategoryIcon, calculateAgeInMonths } from '@/lib/utils'
import { AddActivityForm } from '@/components/forms/AddActivityForm'
import { useChild } from '@/contexts/ChildContext'
import { useAuth } from '@/contexts/AuthContext'

export function Activities() {
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedChild } = useChild()
  const { fetchChildActivities } = useAuth()
  
  // Calculate child's age in months to determine appropriate activities
  const ageInMonths = selectedChild ? calculateAgeInMonths(selectedChild.birth_date) : 12
  const isInfant = ageInMonths <= 6 // 0-6 months
  
  // Fetch activities when selected child changes
  useEffect(() => {
    const loadActivities = async () => {
      if (selectedChild?.id) {
        setLoading(true)
        try {
          const data = await fetchChildActivities(selectedChild.id)
          setActivities(data)
        } catch (error) {
          console.error('Error loading activities:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setActivities([])
        setLoading(false)
      }
    }

    loadActivities()
  }, [selectedChild, fetchChildActivities])

  const refreshActivities = async () => {
    if (selectedChild?.id) {
      try {
        const data = await fetchChildActivities(selectedChild.id)
        setActivities(data)
      } catch (error) {
        console.error('Error refreshing activities:', error)
      }
    }
  }
  
  const todayActivities = activities.filter(activity => 
    activity.date === new Date().toISOString().split('T')[0]
  )

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
      case 'feeding':
        return <Utensils className="w-5 h-5" />
      case 'diaper':
        return <Baby className="w-5 h-5" />
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
      <div className={`grid grid-cols-1 gap-6 ${isInfant ? 'md:grid-cols-6' : 'md:grid-cols-5'}`}>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              {isInfant ? 'Feeding' : 'Meals'}
            </CardTitle>
            <Utensils className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{isInfant ? '8/8' : '3/3'}</div>
            <p className="text-xs text-gray-600 mt-1">
              {isInfant ? 'All feedings done' : 'All meals eaten'}
            </p>
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

        {/* Diaper Changes - Only show for infants */}
        {isInfant && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Diapers</CardTitle>
              <Baby className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">6</div>
              <p className="text-xs text-gray-600 mt-1">Changes today</p>
            </CardContent>
          </Card>
        )}
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
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Baby className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No activities logged yet.</p>
                <p className="text-sm">Start by adding your first activity!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{getMoodEmoji(activity.mood || 'neutral')}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{activity.title || activity.type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{formatDate(activity.date)}</span>
                        {activity.duration && <span>{activity.duration} min</span>}
                        {activity.rating && (
                          <div className="flex items-center">
                            {'⭐'.repeat(activity.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        onSuccess={refreshActivities}
      />
    </div>
  )
}