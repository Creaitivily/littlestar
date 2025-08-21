// Note: Actual cron scheduling should be handled by a backend service or serverless function
// This frontend service focuses on manual refresh capabilities and status tracking
import { contentScraperService, SCRAPING_TARGETS, AGE_RANGES } from './contentScraper'
import { supabase } from '@/lib/supabase'

interface RefreshStats {
  totalTopics: number
  totalAgeRanges: number
  successfulRefreshes: number
  failedRefreshes: number
  articlesAdded: number
  articlesRemoved: number
  startTime: Date
  endTime?: Date
  errors: string[]
}

export class ContentRefreshScheduler {
  private isRunning = false
  private currentStats: RefreshStats | null = null

  constructor() {
    console.log('📅 Content refresh service initialized')
    console.log('ℹ️  Note: Scheduled refreshes should be configured in your backend/serverless functions')
  }

  async refreshAllContent(): Promise<RefreshStats> {
    if (this.isRunning) {
      throw new Error('Content refresh is already running')
    }

    this.isRunning = true
    const topics = Object.keys(SCRAPING_TARGETS)
    const ageRanges = Object.keys(AGE_RANGES)
    
    this.currentStats = {
      totalTopics: topics.length,
      totalAgeRanges: ageRanges.length,
      successfulRefreshes: 0,
      failedRefreshes: 0,
      articlesAdded: 0,
      articlesRemoved: 0,
      startTime: new Date(),
      errors: []
    }

    console.log(`🚀 Starting refresh for ${topics.length} topics × ${ageRanges.length} age ranges`)

    try {
      // Cleanup old content first
      const removedCount = await this.cleanupOldContent()
      this.currentStats.articlesRemoved = removedCount

      // Refresh content for each topic/age combination
      for (const topic of topics) {
        for (const ageRange of ageRanges) {
          try {
            console.log(`📖 Refreshing ${topic}/${ageRange}...`)
            
            const newContent = await contentScraperService.scrapeTopicContent(topic, ageRange, {
              maxResults: 15
            })
            
            if (newContent.length > 0) {
              await contentScraperService.storeContent(newContent)
              this.currentStats.articlesAdded += newContent.length
              
              // Log successful refresh
              await this.logRefreshResult(topic, ageRange, newContent.length, 0, 'success')
              this.currentStats.successfulRefreshes++
              
              console.log(`✅ ${topic}/${ageRange}: Added ${newContent.length} articles`)
            } else {
              console.log(`⚠️ ${topic}/${ageRange}: No new content found`)
              await this.logRefreshResult(topic, ageRange, 0, 0, 'partial', 'No new content found')
            }
            
            // Rate limiting between requests
            await this.delay(10000) // 10 second delay
            
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            console.error(`❌ Failed to refresh ${topic}/${ageRange}:`, errorMsg)
            
            this.currentStats.failedRefreshes++
            this.currentStats.errors.push(`${topic}/${ageRange}: ${errorMsg}`)
            
            await this.logRefreshResult(topic, ageRange, 0, 0, 'failed', errorMsg)
            
            // Continue with next topic/age combination
            await this.delay(5000) // Shorter delay after error
          }
        }
      }
      
      this.currentStats.endTime = new Date()
      await this.logSystemRefreshComplete()
      
      console.log('✅ Monthly content refresh completed')
      console.log(`📊 Stats: ${this.currentStats.successfulRefreshes} successful, ${this.currentStats.failedRefreshes} failed`)
      console.log(`📈 Content: +${this.currentStats.articlesAdded} added, -${this.currentStats.articlesRemoved} removed`)
      
    } catch (error) {
      console.error('❌ Critical error during content refresh:', error)
      this.currentStats.errors.push(`System error: ${error}`)
      throw error
    } finally {
      this.isRunning = false
    }

    return this.currentStats
  }

  async checkStaleContent(): Promise<void> {
    console.log('🔍 Checking for stale content...')
    
    const { data: staleContent } = await supabase
      .from('topic_content')
      .select('topic, age_range, COUNT(*) as count')
      .eq('is_active', true)
      .lt('last_refreshed', new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()) // 45 days old
      .group('topic, age_range')
    
    if (staleContent && staleContent.length > 0) {
      console.log(`⚠️ Found stale content in ${staleContent.length} topic/age combinations`)
      
      for (const item of staleContent) {
        if (item.count < 8) { // Less than minimum threshold
          console.log(`🚨 Emergency refresh needed for ${item.topic}/${item.age_range}`)
          await this.emergencyRefresh(item.topic, item.age_range)
        }
      }
    } else {
      console.log('✅ No stale content found')
    }
  }

  async emergencyRefresh(topic: string, ageRange: string): Promise<void> {
    console.log(`🚨 Emergency refresh for ${topic}/${ageRange}`)
    
    try {
      const newContent = await contentScraperService.scrapeTopicContent(topic, ageRange, {
        maxResults: 20,
        urgentMode: true
      })
      
      if (newContent.length > 0) {
        await contentScraperService.storeContent(newContent)
        await this.logRefreshResult(topic, ageRange, newContent.length, 0, 'success', 'Emergency refresh')
        console.log(`✅ Emergency refresh: Added ${newContent.length} articles for ${topic}/${ageRange}`)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`❌ Emergency refresh failed for ${topic}/${ageRange}:`, errorMsg)
      await this.logRefreshResult(topic, ageRange, 0, 0, 'failed', `Emergency refresh failed: ${errorMsg}`)
    }
  }

  async healthCheck(): Promise<void> {
    console.log('💊 Running content health check...')
    
    const topics = Object.keys(SCRAPING_TARGETS)
    const ageRanges = Object.keys(AGE_RANGES)
    let lowContentCount = 0
    
    for (const topic of topics) {
      for (const ageRange of ageRanges) {
        const { count } = await supabase
          .from('topic_content')
          .select('id', { count: 'exact' })
          .eq('topic', topic)
          .eq('age_range', ageRange)
          .eq('is_active', true)
        
        if ((count || 0) < 5) { // Less than minimum threshold
          console.log(`⚠️ Low content warning: ${topic}/${ageRange} has only ${count} articles`)
          lowContentCount++
          
          if ((count || 0) < 2) {
            // Critical: schedule immediate refresh
            console.log(`🚨 Critical: Scheduling emergency refresh for ${topic}/${ageRange}`)
            setTimeout(() => this.emergencyRefresh(topic, ageRange), 1000)
          }
        }
      }
    }
    
    if (lowContentCount === 0) {
      console.log('✅ Content health check passed')
    } else {
      console.log(`⚠️ Content health check: ${lowContentCount} topic/age combinations need attention`)
    }
  }

  private async cleanupOldContent(): Promise<number> {
    console.log('🧹 Cleaning up old content...')
    
    try {
      const { data } = await supabase.rpc('cleanup_old_content')
      const removedCount = data || 0
      
      if (removedCount > 0) {
        console.log(`🗑️ Removed ${removedCount} old articles`)
      }
      
      return removedCount
    } catch (error) {
      console.error('❌ Failed to cleanup old content:', error)
      return 0
    }
  }

  private async logRefreshResult(
    topic: string,
    ageRange: string,
    articlesAdded: number,
    articlesRemoved: number,
    status: 'success' | 'partial' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    const currentCycle = await this.getCurrentRefreshCycle()
    
    await supabase.from('content_refresh_log').insert({
      topic,
      age_range: ageRange,
      articles_added: articlesAdded,
      articles_removed: articlesRemoved,
      status,
      error_message: errorMessage,
      refresh_cycle: currentCycle
    })
  }

  private async logSystemRefreshComplete(): Promise<void> {
    if (!this.currentStats) return
    
    const duration = this.currentStats.endTime 
      ? this.currentStats.endTime.getTime() - this.currentStats.startTime.getTime()
      : 0
    
    const currentCycle = await this.getCurrentRefreshCycle()
    
    await supabase.from('content_refresh_log').insert({
      topic: 'SYSTEM_COMPLETE',
      age_range: 'all',
      articles_added: this.currentStats.articlesAdded,
      articles_removed: this.currentStats.articlesRemoved,
      status: this.currentStats.failedRefreshes > 0 ? 'partial' : 'success',
      error_message: this.currentStats.errors.length > 0 
        ? `${this.currentStats.errors.length} errors occurred. Duration: ${Math.round(duration / 1000)}s`
        : `Completed successfully in ${Math.round(duration / 1000)}s`,
      refresh_cycle: currentCycle
    })
  }

  private async getCurrentRefreshCycle(): Promise<number> {
    const { data } = await supabase.rpc('get_current_refresh_cycle')
    return data || 0
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Manual trigger methods for admin use
  async triggerManualRefresh(topic?: string, ageRange?: string): Promise<void> {
    if (this.isRunning) {
      throw new Error('Content refresh is already running')
    }

    if (topic && ageRange) {
      console.log(`🔄 Manual refresh triggered for ${topic}/${ageRange}`)
      await this.emergencyRefresh(topic, ageRange)
    } else {
      console.log('🔄 Manual full refresh triggered')
      await this.refreshAllContent()
    }
  }

  getRefreshStatus(): {
    isRunning: boolean
    currentStats: RefreshStats | null
  } {
    return {
      isRunning: this.isRunning,
      currentStats: this.currentStats
    }
  }

  async getRefreshHistory(limit = 10): Promise<any[]> {
    const { data } = await supabase
      .from('content_refresh_log')
      .select('*')
      .order('refresh_date', { ascending: false })
      .limit(limit)
    
    return data || []
  }

  async getContentStats(): Promise<any> {
    const { data: contentStats } = await supabase
      .from('topic_content')
      .select(`
        topic,
        age_range,
        count(*),
        avg(quality_score) as avg_quality,
        max(last_refreshed) as last_refreshed
      `)
      .eq('is_active', true)
      .group(['topic', 'age_range'])
    
    const { data: totalStats } = await supabase
      .from('topic_content')
      .select('count(*)')
      .eq('is_active', true)
      .single()
    
    return {
      totalArticles: totalStats?.count || 0,
      byTopicAge: contentStats || [],
      lastSystemRefresh: await this.getLastSystemRefresh()
    }
  }

  private async getLastSystemRefresh(): Promise<string | null> {
    const { data } = await supabase
      .from('content_refresh_log')
      .select('refresh_date')
      .eq('topic', 'SYSTEM_COMPLETE')
      .order('refresh_date', { ascending: false })
      .limit(1)
      .single()
    
    return data?.refresh_date || null
  }
}

// Create singleton instance
export const contentRefreshScheduler = new ContentRefreshScheduler()

// Export types
export type { RefreshStats }