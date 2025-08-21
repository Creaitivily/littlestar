import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Database,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  BookOpen,
  Users,
  Zap
} from 'lucide-react'
import { contentRefreshScheduler, type RefreshStats } from '@/services/contentRefreshScheduler'
import { contentService } from '@/services/contentService'

interface ContentStats {
  totalArticles: number
  topicBreakdown: Record<string, number>
  qualityDistribution: { high: number; medium: number; low: number }
  sourceBreakdown: Record<string, number>
  averageQuality: number
  lastRefresh: string | null
}

export function ContentManagement() {
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [refreshStatus, setRefreshStatus] = useState({ isRunning: false, currentStats: null })
  const [refreshHistory, setRefreshHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    
    // Refresh data every 30 seconds when refresh is running
    const interval = setInterval(() => {
      if (refreshStatus.isRunning) {
        loadData()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [refreshStatus.isRunning])

  const loadData = async () => {
    try {
      const [stats, status, history] = await Promise.all([
        contentService.getContentStats(),
        Promise.resolve(contentRefreshScheduler.getRefreshStatus()),
        contentRefreshScheduler.getRefreshHistory(20)
      ])
      
      setContentStats(stats)
      setRefreshStatus(status)
      setRefreshHistory(history)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerManualRefresh = async () => {
    try {
      setLoading(true)
      await contentRefreshScheduler.triggerManualRefresh()
      await loadData()
    } catch (error) {
      console.error('Manual refresh failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'partial': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle
      case 'partial': return AlertTriangle
      case 'failed': return AlertTriangle
      default: return Clock
    }
  }

  if (loading && !contentStats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
          <p className="text-gray-600">Manage scraped content and refresh schedules</p>
        </div>
        <Button 
          onClick={triggerManualRefresh} 
          disabled={refreshStatus.isRunning || loading}
          className="bg-sage-500 hover:bg-sage-600 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshStatus.isRunning ? 'animate-spin' : ''}`} />
          {refreshStatus.isRunning ? 'Refreshing...' : 'Manual Refresh'}
        </Button>
      </div>

      {/* Refresh Status */}
      {refreshStatus.isRunning && refreshStatus.currentStats && (
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sage-700">
              <Zap className="w-5 h-5 animate-pulse" />
              Content Refresh in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {refreshStatus.currentStats.successfulRefreshes}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {refreshStatus.currentStats.failedRefreshes}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {refreshStatus.currentStats.articlesAdded}
                  </div>
                  <div className="text-sm text-gray-600">Articles Added</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {refreshStatus.currentStats.articlesRemoved}
                  </div>
                  <div className="text-sm text-gray-600">Articles Removed</div>
                </div>
              </div>
              
              <Progress 
                value={(refreshStatus.currentStats.successfulRefreshes + refreshStatus.currentStats.failedRefreshes) / 
                       (refreshStatus.currentStats.totalTopics * refreshStatus.currentStats.totalAgeRanges) * 100} 
                className="w-full" 
              />
              
              {refreshStatus.currentStats.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-600 mb-2">Recent Errors:</h4>
                  <div className="bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {refreshStatus.currentStats.errors.slice(-3).map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentStats?.totalArticles.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentStats ? Math.round(contentStats.averageQuality * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-honey-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-honey-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Sources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentStats ? Object.keys(contentStats.sourceBreakdown).length : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-mint-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Refresh</p>
                <p className="text-sm font-bold text-gray-900">
                  {contentStats?.lastRefresh 
                    ? new Date(contentStats.lastRefresh).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-peach-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-peach-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Distribution */}
      {contentStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Content Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Quality (70%+)</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(contentStats.qualityDistribution.high / contentStats.totalArticles) * 100} 
                    className="w-32"
                  />
                  <span className="text-sm font-bold text-green-600">
                    {contentStats.qualityDistribution.high}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Quality (40-70%)</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(contentStats.qualityDistribution.medium / contentStats.totalArticles) * 100} 
                    className="w-32"
                  />
                  <span className="text-sm font-bold text-yellow-600">
                    {contentStats.qualityDistribution.medium}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Quality (&lt;40%)</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(contentStats.qualityDistribution.low / contentStats.totalArticles) * 100} 
                    className="w-32"
                  />
                  <span className="text-sm font-bold text-red-600">
                    {contentStats.qualityDistribution.low}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topic Breakdown */}
      {contentStats && Object.keys(contentStats.topicBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Content by Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(contentStats.topicBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([topic, count]) => {
                  const metadata = contentService.getTopicMetadata()[topic]
                  return (
                    <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{metadata?.icon || '📄'}</span>
                        <span className="text-sm font-medium">{metadata?.label || topic}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  )
                })
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Recent Refresh Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {refreshHistory.slice(0, 10).map((refresh, index) => {
              const StatusIcon = getStatusIcon(refresh.status)
              return (
                <div key={refresh.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-4 h-4 ${getStatusColor(refresh.status)}`} />
                    <div>
                      <div className="font-medium">
                        {refresh.topic === 'SYSTEM_COMPLETE' ? 'System Refresh' : `${refresh.topic} / ${refresh.age_range}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(refresh.refresh_date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      +{refresh.articles_added} / -{refresh.articles_removed}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(refresh.status)} border-current`}
                    >
                      {refresh.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}