import { supabase } from '@/lib/supabase'
import { SCRAPING_TARGETS, AGE_RANGES } from './contentScraper'

export interface TopicContent {
  id: string
  topic: string
  age_range: string
  title: string
  url: string
  content_summary: string
  source_domain: string
  publication_date: string
  quality_score: number
  days_since_refresh: number
  scraped_at: string
  last_refreshed: string
}

export interface ContentFilters {
  minQuality?: number
  maxAge?: number // days since publication
  sourceDomains?: string[]
  excludeDomains?: string[]
}

export interface UserContentPreferences {
  id?: string
  user_id: string
  preferred_topics: string[]
  content_difficulty: 'beginner' | 'moderate' | 'advanced'
  created_at?: string
  updated_at?: string
}

export class ContentService {
  
  // Main method to get top content for a topic (simplified - no age filtering)
  async getContentForChild(
    topic: string, 
    childAgeInMonths: number, 
    filters?: ContentFilters
  ): Promise<TopicContent[]> {
    console.log(`📖 Getting top content for topic: ${topic}`)
    
    let query = supabase
      .from('fresh_topic_content')
      .select('*')
      .eq('topic', topic)
    
    // Apply quality filter
    if (filters?.minQuality !== undefined) {
      query = query.gte('quality_score', filters.minQuality)
    } else {
      query = query.gte('quality_score', 0.4) // Default minimum quality
    }
    
    // Apply source domain filters
    if (filters?.sourceDomains && filters.sourceDomains.length > 0) {
      query = query.in('source_domain', filters.sourceDomains)
    }
    
    if (filters?.excludeDomains && filters.excludeDomains.length > 0) {
      query = query.not('source_domain', 'in', `(${filters.excludeDomains.join(',')})`)
    }
    
    // Apply publication date filter
    if (filters?.maxAge) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - filters.maxAge)
      query = query.gte('publication_date', cutoffDate.toISOString().split('T')[0])
    }
    
    const { data, error } = await query
      .order('quality_score', { ascending: false })
      .order('publication_date', { ascending: false })
      .limit(12) // Show only top 12 articles per topic
    
    if (error) {
      console.error('Failed to fetch content:', error)
      throw new Error(`Failed to fetch content: ${error.message}`)
    }
    
    return data || []
  }
  
  // Get content for multiple related age ranges (for transition periods)
  async getContentForAgeTransition(
    topic: string, 
    childAgeInMonths: number
  ): Promise<TopicContent[]> {
    const currentAgeRange = this.getAgeRangeForChild(childAgeInMonths)
    const relatedRanges = this.getRelatedAgeRanges(childAgeInMonths)
    
    console.log(`📖 Getting transition content for ${topic}, ranges: ${[currentAgeRange, ...relatedRanges].join(', ')}`)
    
    const { data, error } = await supabase
      .from('fresh_topic_content')
      .select('*')
      .eq('topic', topic)
      .in('age_range', [currentAgeRange, ...relatedRanges])
      .gte('quality_score', 0.5)
      .order('quality_score', { ascending: false })
      .order('publication_date', { ascending: false })
      .limit(30)
    
    if (error) {
      console.error('Failed to fetch transition content:', error)
      throw error
    }
    
    // Group by age range and limit per range
    const grouped = this.groupContentByAgeRange(data || [])
    const result: TopicContent[] = []
    
    // Prioritize current age range, then related ranges
    if (grouped[currentAgeRange]) {
      result.push(...grouped[currentAgeRange].slice(0, 15))
    }
    
    for (const range of relatedRanges) {
      if (grouped[range]) {
        result.push(...grouped[range].slice(0, 5))
      }
    }
    
    return result.slice(0, 25) // Final limit
  }
  
  // Get personalized content based on user preferences
  async getPersonalizedContent(
    userId: string,
    childAgeInMonths: number,
    topicCount = 3
  ): Promise<{ topic: string; content: TopicContent[] }[]> {
    // Get user preferences
    const preferences = await this.getUserContentPreferences(userId)
    
    // Determine topics to show
    let topicsToShow: string[]
    if (preferences?.preferred_topics && preferences.preferred_topics.length > 0) {
      topicsToShow = preferences.preferred_topics.slice(0, topicCount)
    } else {
      // Default topics based on age
      topicsToShow = this.getDefaultTopicsForAge(childAgeInMonths).slice(0, topicCount)
    }
    
    // Get content for each topic
    const result = []
    for (const topic of topicsToShow) {
      const content = await this.getContentForChild(topic, childAgeInMonths, {
        minQuality: this.getMinQualityForDifficulty(preferences?.content_difficulty || 'moderate')
      })
      
      if (content.length > 0) {
        result.push({ topic, content: content.slice(0, 8) })
      }
    }
    
    return result
  }
  
  // Search content across all topics and age ranges
  async searchContent(
    query: string,
    childAgeInMonths?: number,
    limit = 20
  ): Promise<TopicContent[]> {
    let supabaseQuery = supabase
      .from('fresh_topic_content')
      .select('*')
      .or(`title.ilike.%${query}%,content_summary.ilike.%${query}%`)
      .gte('quality_score', 0.4)
    
    // If child age provided, prioritize relevant age range
    if (childAgeInMonths !== undefined) {
      const ageRange = this.getAgeRangeForChild(childAgeInMonths)
      const relatedRanges = this.getRelatedAgeRanges(childAgeInMonths)
      supabaseQuery = supabaseQuery.in('age_range', [ageRange, ...relatedRanges])
    }
    
    const { data, error } = await supabaseQuery
      .order('quality_score', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Search failed:', error)
      throw error
    }
    
    return data || []
  }
  
  // User preferences management
  async getUserContentPreferences(userId: string): Promise<UserContentPreferences | null> {
    const { data, error } = await supabase
      .from('user_content_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // Not found error is ok
      console.error('Failed to fetch user preferences:', error)
      throw error
    }
    
    return data
  }
  
  async updateUserContentPreferences(preferences: UserContentPreferences): Promise<void> {
    const { error } = await supabase
      .from('user_content_preferences')
      .upsert({
        ...preferences,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Failed to update preferences:', error)
      throw error
    }
  }
  
  // Content analytics and stats
  async getContentStats(): Promise<{
    totalArticles: number
    topicBreakdown: Record<string, number>
    qualityDistribution: { high: number; medium: number; low: number }
    sourceBreakdown: Record<string, number>
    averageQuality: number
    lastRefresh: string | null
  }> {
    const { data: contentData } = await supabase
      .from('topic_content')
      .select('topic, quality_score, source_domain, last_refreshed')
      .eq('is_active', true)
    
    if (!contentData) {
      return {
        totalArticles: 0,
        topicBreakdown: {},
        qualityDistribution: { high: 0, medium: 0, low: 0 },
        sourceBreakdown: {},
        averageQuality: 0,
        lastRefresh: null
      }
    }
    
    const stats = {
      totalArticles: contentData.length,
      topicBreakdown: {} as Record<string, number>,
      qualityDistribution: { high: 0, medium: 0, low: 0 },
      sourceBreakdown: {} as Record<string, number>,
      averageQuality: 0,
      lastRefresh: null as string | null
    }
    
    let totalQuality = 0
    let lastRefreshTime = 0
    
    for (const item of contentData) {
      // Topic breakdown
      stats.topicBreakdown[item.topic] = (stats.topicBreakdown[item.topic] || 0) + 1
      
      // Quality distribution
      if (item.quality_score >= 0.7) stats.qualityDistribution.high++
      else if (item.quality_score >= 0.4) stats.qualityDistribution.medium++
      else stats.qualityDistribution.low++
      
      // Source breakdown
      stats.sourceBreakdown[item.source_domain] = (stats.sourceBreakdown[item.source_domain] || 0) + 1
      
      // Average quality
      totalQuality += item.quality_score
      
      // Last refresh
      const refreshTime = new Date(item.last_refreshed).getTime()
      if (refreshTime > lastRefreshTime) {
        lastRefreshTime = refreshTime
        stats.lastRefresh = item.last_refreshed
      }
    }
    
    stats.averageQuality = totalQuality / contentData.length
    
    return stats
  }
  
  // Helper methods
  private getAgeRangeForChild(ageInMonths: number): string {
    // Find the appropriate age range from AGE_RANGES
    for (const [range, config] of Object.entries(AGE_RANGES)) {
      if (ageInMonths >= config.min && ageInMonths < config.max) {
        return range
      }
    }
    
    // Default to oldest range if child is very old
    return '30-36_months'
  }
  
  private getRelatedAgeRanges(ageInMonths: number): string[] {
    const currentRange = this.getAgeRangeForChild(ageInMonths)
    const related: string[] = []
    
    // For monthly ranges in first year
    if (ageInMonths < 12) {
      // Include previous and next month ranges
      if (ageInMonths > 0) {
        const prevMonth = ageInMonths - 1
        related.push(`${prevMonth}-${ageInMonths}_months`)
      }
      if (ageInMonths < 11) {
        const nextStart = ageInMonths + 1
        const nextEnd = ageInMonths + 2
        related.push(`${nextStart}-${nextEnd}_months`)
      }
    } else {
      // For semester ranges, include adjacent semesters
      const ranges = Object.keys(AGE_RANGES).filter(key => 
        key !== currentRange && key.includes('-') && !key.match(/^\d+-\d+_months$/)
      )
      
      const currentConfig = AGE_RANGES[currentRange as keyof typeof AGE_RANGES]
      for (const range of ranges) {
        const config = AGE_RANGES[range as keyof typeof AGE_RANGES]
        if (Math.abs(config.min - currentConfig.min) <= 6) {
          related.push(range)
        }
      }
    }
    
    return related.slice(0, 2) // Limit to 2 related ranges
  }
  
  private groupContentByAgeRange(content: TopicContent[]): Record<string, TopicContent[]> {
    return content.reduce((groups, item) => {
      if (!groups[item.age_range]) {
        groups[item.age_range] = []
      }
      groups[item.age_range].push(item)
      return groups
    }, {} as Record<string, TopicContent[]>)
  }
  
  private getDefaultTopicsForAge(ageInMonths: number): string[] {
    if (ageInMonths < 3) {
      return ['feeding_nutrition', 'sleep_patterns', 'health_safety', 'social_emotional']
    } else if (ageInMonths < 6) {
      return ['cognitive_development', 'physical_development', 'feeding_nutrition', 'activities_play']
    } else if (ageInMonths < 12) {
      return ['physical_development', 'cognitive_development', 'feeding_nutrition', 'activities_play', 'language_communication']
    } else if (ageInMonths < 24) {
      return ['language_communication', 'behavior_discipline', 'activities_play', 'cognitive_development']
    } else {
      return ['behavior_discipline', 'language_communication', 'social_emotional', 'activities_play']
    }
  }
  
  private getMinQualityForDifficulty(difficulty: 'beginner' | 'moderate' | 'advanced'): number {
    switch (difficulty) {
      case 'beginner': return 0.6
      case 'moderate': return 0.5
      case 'advanced': return 0.4
      default: return 0.5
    }
  }
  
  // Topic metadata
  getTopicMetadata(): Record<string, { label: string; icon: string; description: string }> {
    return {
      feeding_nutrition: {
        label: 'Feeding & Nutrition',
        icon: '🍼',
        description: 'Feeding schedules, nutrition, and meal planning'
      },
      sleep_patterns: {
        label: 'Sleep & Rest',
        icon: '😴',
        description: 'Sleep training, schedules, and bedtime routines'
      },
      cognitive_development: {
        label: 'Learning & Development',
        icon: '🧠',
        description: 'Cognitive milestones and mental development'
      },
      physical_development: {
        label: 'Motor Skills',
        icon: '🏃',
        description: 'Physical milestones and motor skill development'
      },
      social_emotional: {
        label: 'Emotions & Social',
        icon: '😊',
        description: 'Emotional development and social skills'
      },
      health_safety: {
        label: 'Health & Safety',
        icon: '🏥',
        description: 'Medical care, safety, and health monitoring'
      },
      activities_play: {
        label: 'Activities & Play',
        icon: '🎯',
        description: 'Age-appropriate activities and play ideas'
      },
      behavior_discipline: {
        label: 'Behavior & Discipline',
        icon: '📋',
        description: 'Behavior management and positive discipline'
      },
      language_communication: {
        label: 'Speech & Language',
        icon: '💬',
        description: 'Language development and communication skills'
      }
    }
  }
  
  // Age range utilities
  getAgeRangeLabel(ageRange: string): string {
    const config = AGE_RANGES[ageRange as keyof typeof AGE_RANGES]
    if (!config) return ageRange
    
    if (config.max <= 12) {
      return config.max === config.min + 1 
        ? `${config.min} month${config.min !== 1 ? 's' : ''}`
        : `${config.min}-${config.max} months`
    } else {
      const minYears = Math.floor(config.min / 12)
      const maxYears = Math.floor(config.max / 12)
      const minMonths = config.min % 12
      const maxMonths = config.max % 12
      
      if (minYears === maxYears) {
        return `${minYears} year${minYears !== 1 ? 's' : ''}`
      } else {
        return `${minYears}-${maxYears} years`
      }
    }
  }
  
  formatChildAge(ageInMonths: number): string {
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`
      } else {
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`
      }
    }
  }
}

// Create singleton instance
export const contentService = new ContentService()

// Helper function to calculate child age from birth date
export function calculateChildAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  
  const diffTime = Math.abs(now.getTime() - birth.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.floor(diffDays / 30.44) // Average days per month
}