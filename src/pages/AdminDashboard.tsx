import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Users, 
  Baby, 
  Calendar,
  Activity,
  TrendingUp,
  Heart,
  Camera,
  Shield,
  Database,
  RefreshCw,
  ArrowLeft,
  Eye,
  UserCheck,
  Clock,
  LogOut
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

interface AdminStats {
  totalUsers: number
  totalChildren: number
  totalActivities: number
  totalGrowthRecords: number
  totalHealthRecords: number
  totalMemories: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  activeUsersThisWeek: number
}

interface UserData {
  id: string
  email: string
  full_name: string | null
  created_at: string
  last_sign_in_at: string | null
  children_count: number
}

interface ChildData {
  id: string
  name: string
  birth_date: string
  birth_time: string | null
  created_at: string
  user_email: string
  user_name: string | null
  activities_count: number
  growth_records_count: number
  health_records_count: number
  memories_count: number
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [children, setChildren] = useState<ChildData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'children'>('overview')

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_email')
    navigate('/admin')
  }

  const getAdminEmail = () => {
    return localStorage.getItem('admin_email') || 'Admin'
  }

  const fetchAdminData = async () => {
    setLoading(true)
    
    try {
      // Fetch basic statistics
      const [
        { count: totalUsers },
        { count: totalChildren },
        { count: totalActivities },
        { count: totalGrowthRecords },
        { count: totalHealthRecords },
        { count: totalMemories }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('daughters').select('*', { count: 'exact', head: true }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
        supabase.from('growth_records').select('*', { count: 'exact', head: true }),
        supabase.from('health_records').select('*', { count: 'exact', head: true }),
        supabase.from('memories').select('*', { count: 'exact', head: true })
      ])

      // Fetch users created in the last week and month
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const [
        { count: newUsersThisWeek },
        { count: newUsersThisMonth },
        { count: activeUsersThisWeek }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('last_sign_in_at', oneWeekAgo)
      ])

      setStats({
        totalUsers: totalUsers || 0,
        totalChildren: totalChildren || 0,
        totalActivities: totalActivities || 0,
        totalGrowthRecords: totalGrowthRecords || 0,
        totalHealthRecords: totalHealthRecords || 0,
        totalMemories: totalMemories || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeUsersThisWeek: activeUsersThisWeek || 0
      })

      // Fetch detailed user data
      console.log('Fetching users data...')
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Users data result:', { usersData, usersError })

      if (usersError) {
        console.error('Error fetching users:', usersError)
        throw usersError
      }

      // Get children count for each user
      const formattedUsers: UserData[] = []
      
      if (usersData) {
        for (const user of usersData) {
          const { count: childrenCount } = await supabase
            .from('daughters')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

          formattedUsers.push({
            ...user,
            children_count: childrenCount || 0
          })
        }
      }

      console.log('Formatted users:', formattedUsers)
      setUsers(formattedUsers)

      // Fetch detailed children data with simpler approach
      console.log('Fetching children data...')
      const { data: childrenData, error: childrenError } = await supabase
        .from('daughters')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Children data result:', { childrenData, childrenError })

      if (childrenError) {
        console.error('Error fetching children:', childrenError)
        throw childrenError
      }

      // Fetch user data separately for each child
      const formattedChildren: ChildData[] = []
      
      if (childrenData) {
        for (const child of childrenData) {
          // Get user info for this child
          const { data: userData } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', child.user_id)
            .single()

          // Get activity counts
          const [
            { count: activitiesCount },
            { count: growthCount }, 
            { count: healthCount },
            { count: memoriesCount }
          ] = await Promise.all([
            supabase.from('activities').select('*', { count: 'exact', head: true }).eq('daughter_id', child.id),
            supabase.from('growth_records').select('*', { count: 'exact', head: true }).eq('daughter_id', child.id),
            supabase.from('health_records').select('*', { count: 'exact', head: true }).eq('daughter_id', child.id),
            supabase.from('memories').select('*', { count: 'exact', head: true }).eq('daughter_id', child.id)
          ])

          formattedChildren.push({
            id: child.id,
            name: child.name,
            birth_date: child.birth_date,
            birth_time: child.birth_time,
            created_at: child.created_at,
            user_email: userData?.email || 'Unknown',
            user_name: userData?.full_name || null,
            activities_count: activitiesCount || 0,
            growth_records_count: growthCount || 0,
            health_records_count: healthCount || 0,
            memories_count: memoriesCount || 0
          })
        }
      }

      console.log('Formatted children:', formattedChildren)
      setChildren(formattedChildren)

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-50 via-cream-50 to-mint-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-lavender-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream-50 to-mint-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Star className="w-8 h-8 text-lavender-500" />
                <span className="text-xl font-bold text-gray-800">Little Star</span>
              </Link>
              <Badge variant="destructive" className="bg-red-600">
                <Shield className="w-3 h-3 mr-1" />
                Admin Dashboard
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAdminData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link to="/landing">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 p-1 rounded-lg mb-8 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'children', label: 'Children', icon: Baby }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                activeTab === id
                  ? 'bg-lavender-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Comprehensive analytics for Little Star application • 
                Signed in as: <span className="font-medium text-red-600">{getAdminEmail()}</span>
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{stats?.totalUsers}</div>
                  <p className="text-xs text-blue-600 mt-1">Registered accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-pink-700 flex items-center gap-2">
                    <Baby className="w-4 h-4" />
                    Total Children
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-900">{stats?.totalChildren}</div>
                  <p className="text-xs text-pink-600 mt-1">Children being tracked</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Total Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{stats?.totalActivities}</div>
                  <p className="text-xs text-green-600 mt-1">Logged activities</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {(stats?.totalGrowthRecords || 0) + (stats?.totalHealthRecords || 0) + (stats?.totalMemories || 0)}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Growth, health & memories</p>
                </CardContent>
              </Card>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    New Users This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900">{stats?.newUsersThisWeek}</div>
                  <p className="text-xs text-gray-600 mt-1">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    New Users This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900">{stats?.newUsersThisMonth}</div>
                  <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Active This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900">{stats?.activeUsersThisWeek}</div>
                  <p className="text-xs text-gray-600 mt-1">Signed in recently</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Growth Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-orange-900">{stats?.totalGrowthRecords}</div>
                  <p className="text-xs text-orange-600 mt-1">Height & weight entries</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Health Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-red-900">{stats?.totalHealthRecords}</div>
                  <p className="text-xs text-red-600 mt-1">Medical appointments</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Memories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-yellow-900">{stats?.totalMemories}</div>
                  <p className="text-xs text-yellow-600 mt-1">Photos & milestones</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-indigo-700 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Avg per Child
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-indigo-900">
                    {stats?.totalChildren ? Math.round((stats.totalActivities + stats.totalGrowthRecords + stats.totalHealthRecords + stats.totalMemories) / stats.totalChildren) : 0}
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">Data points per child</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">User Management</h2>
              <p className="text-gray-600">All registered users and their account information</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2">User</th>
                        <th className="text-left py-3 px-2">Email</th>
                        <th className="text-left py-3 px-2">Children</th>
                        <th className="text-left py-3 px-2">Joined</th>
                        <th className="text-left py-3 px-2">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.full_name || 'No name provided'}
                              </div>
                              <div className="text-xs text-gray-500">{user.id.slice(0, 8)}...</div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-700">{user.email}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">
                              {user.children_count} {user.children_count === 1 ? 'child' : 'children'}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-gray-600">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-2 text-gray-600">{formatDateTime(user.last_sign_in_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Children Tab */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Children Overview</h2>
              <p className="text-gray-600">All children being tracked in the application</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  All Children ({children.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <Card key={child.id} className="bg-gradient-to-br from-lavender-50 to-cream-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-gray-800">{child.name}</CardTitle>
                          <Baby className="w-5 h-5 text-lavender-500" />
                        </div>
                        <CardDescription className="text-sm">
                          Born: {formatDate(child.birth_date)}
                          {child.birth_time && <span className="ml-2">at {child.birth_time}</span>}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Parent:</p>
                          <p className="font-medium text-sm text-gray-800">
                            {child.user_name || 'No name'}
                          </p>
                          <p className="text-xs text-gray-600">{child.user_email}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/60 p-2 rounded">
                            <div className="font-medium text-green-700">{child.activities_count}</div>
                            <div className="text-gray-600">Activities</div>
                          </div>
                          <div className="bg-white/60 p-2 rounded">
                            <div className="font-medium text-blue-700">{child.growth_records_count}</div>
                            <div className="text-gray-600">Growth</div>
                          </div>
                          <div className="bg-white/60 p-2 rounded">
                            <div className="font-medium text-red-700">{child.health_records_count}</div>
                            <div className="text-gray-600">Health</div>
                          </div>
                          <div className="bg-white/60 p-2 rounded">
                            <div className="font-medium text-purple-700">{child.memories_count}</div>
                            <div className="text-gray-600">Memories</div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Added: {formatDate(child.created_at)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}