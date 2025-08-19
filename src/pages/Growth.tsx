import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Plus, Award } from 'lucide-react'
import { growthData, milestones } from '@/data/mockData'
import { formatDate, getCategoryIcon } from '@/lib/utils'
import { AddGrowthForm } from '@/components/forms/AddGrowthForm'

export function Growth() {
  const [showGrowthForm, setShowGrowthForm] = useState(false)
  
  const achievedMilestones = milestones.filter(m => m.isAchieved)
  const upcomingMilestones = milestones.filter(m => !m.isAchieved)

  const handleAddGrowth = (data: any) => {
    console.log('New growth measurement:', data)
    // In a real app, this would update the database
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Growth Tracking</h1>
          <p className="text-gray-600">Monitor Emma's physical development and milestones</p>
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
            <div className="text-3xl font-bold text-gray-800 mb-2">102 cm</div>
            <div className="flex items-center gap-2">
              <Badge variant="success">76th percentile</Badge>
              <span className="text-sm text-gray-600">+1 cm this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">16.3 kg</div>
            <div className="flex items-center gap-2">
              <Badge variant="success">72nd percentile</Badge>
              <span className="text-sm text-gray-600">+0.3 kg this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">Healthy</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">On track for age</span>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
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
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Achieved Milestones</CardTitle>
            <Award className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievedMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-mint-50 rounded-lg">
                  <span className="text-2xl">{getCategoryIcon(milestone.category)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(milestone.achievedDate)}</p>
                  </div>
                  <Badge variant="success">✓</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Upcoming Milestones</CardTitle>
            <Button variant="outline" size="sm" onClick={() => alert('Milestone form coming soon!')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-lavender-50 rounded-lg">
                  <span className="text-2xl">{getCategoryIcon(milestone.category)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms */}
      <AddGrowthForm 
        open={showGrowthForm} 
        onOpenChange={setShowGrowthForm}
        onSubmit={handleAddGrowth}
      />
    </div>
  )
}