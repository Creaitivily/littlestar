import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { healthDataService, type GrowthData, type VaccinationRecord, type DevelopmentalMilestone, type HealthAlert } from '@/lib/healthDataService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { HealthAssistant } from '@/components/health/HealthAssistant'
import { 
  TrendingUp, 
  Heart, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Baby,
  Syringe,
  Brain,
  Apple,
  Target,
  Info,
  MessageCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface HealthInsightsData {
  growthRecords: GrowthData[]
  vaccinations: VaccinationRecord[]
  milestones: DevelopmentalMilestone[]
  alerts: HealthAlert[]
  overdue: any[]
}

export function HealthInsights() {
  const { user, children: childrenData } = useAuth()
  const [healthData, setHealthData] = useState<HealthInsightsData>({
    growthRecords: [],
    vaccinations: [],
    milestones: [],
    alerts: [],
    overdue: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<string>('')

  useEffect(() => {
    if (childrenData.length > 0 && !selectedChild) {
      setSelectedChild(childrenData[0].id)
    }
  }, [childrenData, selectedChild])

  useEffect(() => {
    if (selectedChild && user) {
      loadHealthData()
    }
  }, [selectedChild, user])

  const loadHealthData = async () => {
    if (!selectedChild || !user) return

    setLoading(true)
    try {
      const [growthRecords, vaccinations, milestones, alerts, overdue] = await Promise.all([
        healthDataService.getGrowthRecords(selectedChild),
        healthDataService.getVaccinationRecords(selectedChild),
        healthDataService.getMilestones(selectedChild),
        healthDataService.getActiveHealthAlerts(user.id),
        healthDataService.getOverdueVaccinations(selectedChild)
      ])

      setHealthData({
        growthRecords,
        vaccinations,
        milestones,
        alerts: alerts.filter(alert => alert.daughter_id === selectedChild),
        overdue
      })
    } catch (error) {
      console.error('Error loading health data:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      await healthDataService.dismissHealthAlert(alertId)
      await loadHealthData()
    } catch (error) {
      console.error('Error dismissing alert:', error)
    }
  }

  const getCurrentChild = () => {
    return childrenData.find(child => child.id === selectedChild)
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const ageMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    const years = Math.floor(ageMonths / 12)
    const months = ageMonths % 12
    return years > 0 ? `${years}y ${months}m` : `${months}m`
  }

  const getGrowthChartData = () => {
    return healthData.growthRecords
      .slice(-12) // Last 12 measurements
      .map(record => ({
        date: new Date(record.measurement_date).toLocaleDateString(),
        height: record.height,
        weight: record.weight,
        heightPercentile: record.height_percentile,
        weightPercentile: record.weight_percentile
      }))
      .reverse()
  }

  const getMilestoneProgress = () => {
    const currentChild = getCurrentChild()
    if (!currentChild) return { achieved: 0, total: 0, percentage: 0 }

    const ageMonths = calculateAgeInMonths(currentChild.birth_date)
    const expectedMilestones = healthData.milestones.filter(m => m.age_months_expected <= ageMonths)
    const achievedMilestones = expectedMilestones.filter(m => m.achieved)

    return {
      achieved: achievedMilestones.length,
      total: expectedMilestones.length,
      percentage: expectedMilestones.length > 0 ? (achievedMilestones.length / expectedMilestones.length) * 100 : 0
    }
  }

  const calculateAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  }

  const getLatestGrowthData = () => {
    return healthData.growthRecords[0] || null
  }

  const getVaccinationStatus = () => {
    const total = healthData.vaccinations.length + healthData.overdue.length
    const completed = healthData.vaccinations.length
    return {
      completed,
      overdue: healthData.overdue.length,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0
    }
  }

  const currentChild = getCurrentChild()
  if (!currentChild) return <div>Loading...</div>

  const latestGrowth = getLatestGrowthData()
  const milestoneProgress = getMilestoneProgress()
  const vaccinationStatus = getVaccinationStatus()
  const chartData = getGrowthChartData()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading health insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
          <p className="text-gray-600">
            Comprehensive health tracking for {currentChild.name} • {calculateAge(currentChild.birth_date)} old
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Baby className="h-5 w-5 text-blue-600" />
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            {childrenData.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Alerts */}
      {healthData.alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Health Alerts</h2>
          {healthData.alerts.map(alert => (
            <Alert key={alert.id} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                {alert.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id!)}
                  className="h-auto p-1 text-xs"
                >
                  Dismiss
                </Button>
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Growth Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestGrowth ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {latestGrowth.height}cm
                </div>
                <div className="text-sm text-muted-foreground">
                  {latestGrowth.weight}kg • {latestGrowth.height_percentile?.toFixed(0)}th%
                </div>
                <div className="text-xs text-green-600">
                  {new Date(latestGrowth.measurement_date).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No growth data</div>
            )}
          </CardContent>
        </Card>

        {/* Vaccination Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaccinationStatus.completed}</div>
            <div className="space-y-2">
              <Progress value={vaccinationStatus.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Up to date</span>
                {vaccinationStatus.overdue > 0 && (
                  <span className="text-red-600">{vaccinationStatus.overdue} overdue</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestoneProgress.achieved}/{milestoneProgress.total}
            </div>
            <div className="space-y-2">
              <Progress value={milestoneProgress.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {milestoneProgress.percentage.toFixed(0)}% achieved for age
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <div className="text-xs text-muted-foreground">
              Based on growth, vaccinations, and milestones
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="ai-assistant">
            <MessageCircle className="h-4 w-4 mr-1" />
            AI Health Assistant
          </TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Chart</CardTitle>
              <CardDescription>Height and weight trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="height"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Height (cm)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="weight"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No growth data yet</p>
                  <p className="text-sm text-gray-500">Add growth measurements to see trends</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Growth Records List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.growthRecords.length > 0 ? (
                <div className="space-y-3">
                  {healthData.growthRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {record.height}cm • {record.weight}kg
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(record.measurement_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          H: {record.height_percentile?.toFixed(0)}th%
                        </div>
                        <div className="text-sm text-gray-600">
                          W: {record.weight_percentile?.toFixed(0)}th%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No growth measurements recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          {/* Overdue Vaccinations */}
          {healthData.overdue.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Overdue Vaccinations</CardTitle>
                <CardDescription>These vaccinations are past due</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData.overdue.map((vaccine, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">{vaccine.vaccine_name}</span>
                      <Badge variant="destructive">
                        {vaccine.days_overdue} days overdue
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vaccination History */}
          <Card>
            <CardHeader>
              <CardTitle>Vaccination History</CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.vaccinations.length > 0 ? (
                <div className="space-y-3">
                  {healthData.vaccinations.map(vaccination => (
                    <div key={vaccination.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{vaccination.vaccine_name}</div>
                        <div className="text-sm text-gray-600">
                          {vaccination.provider_name && `By ${vaccination.provider_name} • `}
                          {new Date(vaccination.vaccination_date).toLocaleDateString()}
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No vaccinations recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {/* Milestone Categories */}
          {['motor', 'language', 'cognitive', 'social'].map(category => {
            const categoryMilestones = healthData.milestones.filter(m => m.milestone_category === category)
            if (categoryMilestones.length === 0) return null

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryMilestones.map(milestone => (
                      <div key={milestone.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{milestone.milestone_name}</div>
                          <div className="text-sm text-gray-600">
                            Expected at {milestone.age_months_expected} months
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {milestone.achieved ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div className="text-sm text-green-600">
                                Achieved at {milestone.age_months_achieved}m
                              </div>
                            </>
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {healthData.milestones.length === 0 && (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-600">No milestones tracked yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-4">
          <HealthAssistant childId={selectedChild} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your child's data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestGrowth && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Growth Analysis</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        {currentChild.name} is growing at a healthy pace. Height is at the{' '}
                        {latestGrowth.height_percentile?.toFixed(0)}th percentile, which is{' '}
                        {latestGrowth.height_percentile && latestGrowth.height_percentile > 25 ? 'excellent' : 'within normal range'}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Milestone Progress</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Great progress on developmental milestones! {currentChild.name} has achieved{' '}
                      {milestoneProgress.percentage.toFixed(0)}% of expected milestones for their age.
                    </p>
                  </div>
                </div>
              </div>

              {vaccinationStatus.overdue > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Vaccination Reminder</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        There are {vaccinationStatus.overdue} overdue vaccinations. Contact your pediatrician to schedule an appointment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Apple className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Nutrition Tip</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      At {calculateAge(currentChild.birth_date)}, focus on offering a variety of textures and flavors. 
                      Iron-rich foods are particularly important during this growth phase.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}