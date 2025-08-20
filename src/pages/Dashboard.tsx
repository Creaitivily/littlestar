import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Heart, 
  Moon, 
  Utensils, 
  Calendar, 
  Camera,
  Plus
} from 'lucide-react'
import { daughterProfile, dashboardStats, activities, healthRecords } from '@/data/mockData'
import { formatDate, getMoodEmoji } from '@/lib/utils'
import { AddActivityForm } from '@/components/forms/AddActivityForm'
import { AddGrowthForm } from '@/components/forms/AddGrowthForm'
import { AddMemoryForm } from '@/components/forms/AddMemoryForm'
import { ChildOnboardingModal } from '../components/auth/ChildOnboardingModal'
import { ChildSelector } from '../components/ui/ChildSelector'
import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showGrowthForm, setShowGrowthForm] = useState(false)
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [childActivities, setChildActivities] = useState<any[]>([])
  const [childGrowthRecords, setChildGrowthRecords] = useState<any[]>([])
  const [childHealthRecords, setChildHealthRecords] = useState<any[]>([])
  
  const { hasChildren, children, createChild, fetchChildren, user, fetchChildActivities, fetchChildGrowthRecords, fetchChildHealthRecords, loading } = useAuth()
  
  // Use child-specific data or fall back to mock data
  const recentActivities = childActivities.slice(0, 3).length > 0 ? childActivities.slice(0, 3) : activities.slice(0, 3)
  const upcomingAppointments = childHealthRecords.filter(record => record.date > new Date().toISOString()).slice(0, 2)
  const latestGrowth = childGrowthRecords[0] // Most recent growth record

  useEffect(() => {
    // Show onboarding modal only if user has no children and auth is fully loaded
    // Only check after loading is complete to ensure we have the actual children data
    if (!loading && user && !hasChildren) {
      console.log('User has no children, showing onboarding modal for user:', user.id)
      setShowOnboarding(true)
    } else if (!loading && user && hasChildren) {
      // User has children, ensure modal is closed
      console.log('User has children, ensuring onboarding modal is closed')
      setShowOnboarding(false)
    }
  }, [user, hasChildren, loading])

  // Auto-select first child when children are loaded
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0])
    }
  }, [children, selectedChild])

  // Fetch child-specific data when selected child changes
  useEffect(() => {
    if (selectedChild?.id) {
      console.log('Fetching data for selected child:', selectedChild.name)
      
      // Fetch all child-specific data
      const loadChildData = async () => {
        try {
          const [activities, growthRecords, healthRecords] = await Promise.all([
            fetchChildActivities(selectedChild.id),
            fetchChildGrowthRecords(selectedChild.id),
            fetchChildHealthRecords(selectedChild.id)
          ])
          
          setChildActivities(activities)
          setChildGrowthRecords(growthRecords)
          setChildHealthRecords(healthRecords)
          
          console.log('Child data loaded:', {
            activities: activities.length,
            growth: growthRecords.length,
            health: healthRecords.length
          })
        } catch (error) {
          console.error('Error loading child data:', error)
        }
      }
      
      loadChildData()
    }
  }, [selectedChild, fetchChildActivities, fetchChildGrowthRecords, fetchChildHealthRecords])

  const handleAddActivity = (data: any) => {
    console.log('New activity:', data)
    // In a real app, this would update the database
  }

  const handleAddGrowth = (data: any) => {
    console.log('New growth measurement:', data)
    // In a real app, this would update the database
  }

  const handleAddMemory = (data: any) => {
    console.log('New memory:', data)
    // In a real app, this would update the database
  }

  const handleChildOnboardingComplete = async (childData: { name: string; birthDate: string; birthTime: string; profileImageUrl?: string | null }) => {
    try {
      const { error } = await createChild(childData)
      if (error) {
        console.error('Error creating child:', error)
        throw error
      }
      
      console.log('Child created successfully, closing modals and refreshing data')
      setShowOnboarding(false)
      
      // Clear the onboarding flag since child was successfully created
      if (user?.id) {
        localStorage.removeItem(`onboarding_shown_${user.id}`)
      }
      
      // Refresh children data to update the dashboard
      await fetchChildren()
      console.log('Dashboard updated with new child data')
    } catch (error) {
      console.error('Failed to create child:', error)
      throw error
    }
  }

  // Get the selected child for display, or fall back to mock data for empty state
  const currentChild = selectedChild || daughterProfile
  
  const handleChildSelect = (child: any) => {
    setSelectedChild(child)
    console.log('Selected child:', child.name)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">
              {hasChildren ? 
                (selectedChild ? 
                  `Here's what's happening with ${selectedChild.name} today` :
                  `Managing ${children.length} precious milestones`
                ) : 
                'Ready to start tracking your child\'s milestones?'
              }
            </p>
          </div>
        </div>

        {/* Child Selector */}
        {hasChildren && (
          <div className="max-w-md">
            <ChildSelector
              children={children}
              selectedChild={selectedChild}
              onChildSelect={handleChildSelect}
            />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Height</CardTitle>
            <TrendingUp className="h-4 w-4 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {latestGrowth?.height ? `${latestGrowth.height} cm` : `${dashboardStats.currentHeight} cm`}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {latestGrowth?.measurement_date ? 
                `Recorded ${new Date(latestGrowth.measurement_date).toLocaleDateString()}` : 
                '75th percentile'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 border-mint-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Weight</CardTitle>
            <Heart className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {latestGrowth?.weight ? `${latestGrowth.weight} kg` : `${dashboardStats.currentWeight} kg`}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {latestGrowth?.measurement_date ? 
                `Recorded ${new Date(latestGrowth.measurement_date).toLocaleDateString()}` : 
                '72nd percentile'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sleep Last Night</CardTitle>
            <Moon className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboardStats.sleepLastNight} hours</div>
            <p className="text-xs text-gray-600 mt-1">Great sleep! 😴</p>
          </CardContent>
        </Card>

        <Card className="bg-cream-100 border-cream-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Meals Today</CardTitle>
            <Utensils className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{dashboardStats.mealsToday}/3</div>
            <p className="text-xs text-gray-600 mt-1">Dinner time soon!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Activities</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowActivityForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-lavender-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(activity.mood || 'neutral')}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{activity.type || 'Activity'}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                    {activity.duration && (
                      <Badge variant="secondary">
                        {activity.duration} min
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {selectedChild ? `No activities for ${selectedChild.name} yet` : 'No recent activities'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedChild ? `Start tracking ${selectedChild.name}'s activities!` : 'Add your first activity to get started!'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Upcoming Appointments</CardTitle>
            <Calendar className="w-5 h-5 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-mint-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{appointment.type}</h4>
                      <p className="text-sm text-gray-600">{appointment.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(appointment.date)}</p>
                    </div>
                    <Badge variant="secondary">
                      Health
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {selectedChild ? `No upcoming appointments for ${selectedChild.name}` : 'No upcoming appointments'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedChild ? `Schedule ${selectedChild.name}'s next checkup!` : 'Schedule your first appointment!'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => setShowGrowthForm(true)}>
              <TrendingUp className="w-6 h-6" />
              <span>Log Growth</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => setShowActivityForm(true)}>
              <Utensils className="w-6 h-6" />
              <span>Add Meal</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => setShowActivityForm(true)}>
              <Moon className="w-6 h-6" />
              <span>Log Sleep</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => setShowMemoryForm(true)}>
              <Camera className="w-6 h-6" />
              <span>Add Memory</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <AddActivityForm 
        open={showActivityForm} 
        onOpenChange={setShowActivityForm}
        onSubmit={handleAddActivity}
      />
      <AddGrowthForm 
        open={showGrowthForm} 
        onOpenChange={setShowGrowthForm}
        onSubmit={handleAddGrowth}
      />
      <AddMemoryForm 
        open={showMemoryForm} 
        onOpenChange={setShowMemoryForm}
        onSubmit={handleAddMemory}
      />

      {/* Child Onboarding Modal (First-time users only) */}
      <ChildOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleChildOnboardingComplete}
      />
    </div>
  )
}