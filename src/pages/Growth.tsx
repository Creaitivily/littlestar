import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Plus, Award } from 'lucide-react'
import { formatDate, getCategoryIcon } from '@/lib/utils'
import { AddGrowthForm } from '@/components/forms/AddGrowthForm'
import { useChild } from '@/contexts/ChildContext'
import { useAuth } from '@/contexts/AuthContext'

export function Growth() {
  const [showGrowthForm, setShowGrowthForm] = useState(false)
  const [growthData, setGrowthData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedChild } = useChild()
  const { fetchChildGrowthRecords } = useAuth()
  
  // Fetch growth data when selected child changes
  useEffect(() => {
    const loadGrowthData = async () => {
      if (selectedChild?.id) {
        setLoading(true)
        try {
          const data = await fetchChildGrowthRecords(selectedChild.id)
          setGrowthData(data)
        } catch (error) {
          console.error('Error loading growth data:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setGrowthData([])
        setLoading(false)
      }
    }

    loadGrowthData()
  }, [selectedChild, fetchChildGrowthRecords])

  const refreshGrowthData = async () => {
    if (selectedChild?.id) {
      try {
        const data = await fetchChildGrowthRecords(selectedChild.id)
        setGrowthData(data)
      } catch (error) {
        console.error('Error refreshing growth data:', error)
      }
    }
  }

  // Get current stats from latest measurements
  const latestGrowth = growthData[0] // Most recent
  const previousGrowth = growthData[1] // Previous measurement
  
  // Calculate growth since last measurement
  const heightGrowth = latestGrowth && previousGrowth ? 
    (latestGrowth.height - previousGrowth.height).toFixed(1) : null
  const weightGrowth = latestGrowth && previousGrowth ? 
    (latestGrowth.weight - previousGrowth.weight).toFixed(1) : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Growth Tracking</h1>
          <p className="text-gray-600">
            {selectedChild ? 
              `Monitor ${selectedChild.name}'s physical development and milestones` : 
              'Monitor your child\'s physical development and milestones'
            }
          </p>
        </div>
        <Button onClick={() => setShowGrowthForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Measurement
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Current Height</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestGrowth ? `${latestGrowth.height} cm` : 'No data'}
            </div>
            <div className="flex items-center gap-2">
              {heightGrowth && (
                <span className="text-sm text-gray-600">
                  {heightGrowth > 0 ? '+' : ''}{heightGrowth} cm since last measurement
                </span>
              )}
              {!heightGrowth && latestGrowth && (
                <span className="text-sm text-gray-600">
                  Recorded {new Date(latestGrowth.measurement_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestGrowth ? `${latestGrowth.weight} kg` : 'No data'}
            </div>
            <div className="flex items-center gap-2">
              {weightGrowth && (
                <span className="text-sm text-gray-600">
                  {weightGrowth > 0 ? '+' : ''}{weightGrowth} kg since last measurement
                </span>
              )}
              {!weightGrowth && latestGrowth && (
                <span className="text-sm text-gray-600">
                  Recorded {new Date(latestGrowth.measurement_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {growthData.length >= 2 ? 'Tracking' : 'Need More Data'}
            </div>
            <div className="flex items-center gap-2">
              {growthData.length >= 2 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">{growthData.length} measurements recorded</span>
                </>
              ) : (
                <span className="text-sm text-gray-600">Add more measurements to track growth</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Height Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            ) : growthData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <TrendingUp className="w-12 h-12 mb-4 text-gray-300" />
                <p>No height data yet</p>
                <p className="text-sm">Add measurements to see your child's height progress</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="measurement_date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [`${value} cm`, 'Height']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="height" 
                    stroke="#a78bfa" 
                    strokeWidth={3}
                    dot={{ fill: '#a78bfa', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            ) : growthData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <TrendingUp className="w-12 h-12 mb-4 text-gray-300" />
                <p>No weight data yet</p>
                <p className="text-sm">Add measurements to see your child's weight progress</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="measurement_date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [`${value} kg`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Forms */}
      <AddGrowthForm 
        open={showGrowthForm} 
        onOpenChange={setShowGrowthForm}
        onSuccess={refreshGrowthData}
      />
    </div>
  )
}