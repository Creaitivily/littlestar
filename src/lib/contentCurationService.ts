import { supabase } from './supabase'

// Types for content management
export interface ContentItem {
  id: string
  title: string
  description: string
  contentType: 'video' | 'article' | 'webpage' | 'pdf'
  sourceUrl: string
  thumbnailUrl?: string
  categories: string[]
  tags: string[]
  sourceName: string
  author?: string
  publishedDate?: string
  readingTimeMinutes?: number
  qualityScore: number
  isVerified: boolean
  ageGroup?: string
  isSaved?: boolean
  isFavorite?: boolean
}

export interface UserInterest {
  id: string
  userId: string
  interestCategory: string
  subcategories: string[]
  isActive: boolean
}

export interface ContentSource {
  name: string
  baseUrl: string
  apiKey?: string
  rateLimit: number
  categories: string[]
}

// Healthcare content sources configuration
const CONTENT_SOURCES: ContentSource[] = [
  {
    name: 'American Academy of Pediatrics',
    baseUrl: 'https://www.healthychildren.org',
    categories: ['health', 'development', 'safety', 'nutrition'],
    rateLimit: 100
  },
  {
    name: 'CDC',
    baseUrl: 'https://www.cdc.gov',
    categories: ['health', 'vaccination', 'development'],
    rateLimit: 50
  },
  {
    name: 'Zero to Three',
    baseUrl: 'https://www.zerotothree.org',
    categories: ['development', 'early-learning', 'social-emotional'],
    rateLimit: 50
  },
  {
    name: 'La Leche League',
    baseUrl: 'https://www.llli.org',
    categories: ['breastfeeding', 'nutrition'],
    rateLimit: 30
  }
]

class ContentCurationService {
  // Get user's interests
  async getUserInterests(userId: string): Promise<UserInterest[]> {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user interests:', error)
      return []
    }
  }

  // Update user interests
  async updateUserInterests(userId: string, interests: { category: string; subcategories: string[] }[]): Promise<boolean> {
    try {
      // First, deactivate all existing interests
      await supabase
        .from('user_interests')
        .update({ is_active: false })
        .eq('user_id', userId)

      // Then insert/update new interests
      for (const interest of interests) {
        await supabase
          .from('user_interests')
          .upsert({
            user_id: userId,
            interest_category: interest.category,
            subcategories: interest.subcategories,
            is_active: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,interest_category'
          })
      }

      return true
    } catch (error) {
      console.error('Error updating user interests:', error)
      return false
    }
  }

  // Get curated content based on user interests
  async getCuratedContent(userId: string, categories: string[] = [], limit: number = 20): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_library')
        .select('*')
        .eq('is_verified', true)
        .order('quality_score', { ascending: false })
        .limit(limit)

      // Filter by categories if provided
      if (categories.length > 0) {
        query = query.overlaps('categories', categories)
      }

      const { data: content, error } = await query

      if (error) throw error

      // Get user's saved and favorite status
      const { data: savedContent } = await supabase
        .from('user_saved_content')
        .select('content_id, is_favorite')
        .eq('user_id', userId)

      const savedMap = new Map(savedContent?.map(item => [item.content_id, item]) || [])

      // Enhance content with user-specific data
      const enhancedContent = content?.map(item => ({
        ...item,
        isSaved: savedMap.has(item.id),
        isFavorite: savedMap.get(item.id)?.is_favorite || false
      })) || []

      return enhancedContent
    } catch (error) {
      console.error('Error fetching curated content:', error)
      return []
    }
  }

  // Search content
  async searchContent(query: string, categories: string[] = [], limit: number = 20): Promise<ContentItem[]> {
    try {
      let searchQuery = supabase
        .from('content_library')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .eq('is_verified', true)
        .order('quality_score', { ascending: false })
        .limit(limit)

      if (categories.length > 0) {
        searchQuery = searchQuery.overlaps('categories', categories)
      }

      const { data, error } = await searchQuery

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching content:', error)
      return []
    }
  }

  // Save content for user
  async saveContent(userId: string, contentId: string, isFavorite: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_saved_content')
        .upsert({
          user_id: userId,
          content_id: contentId,
          is_favorite: isFavorite,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_id'
        })

      if (error) throw error

      // Track interaction
      await this.trackContentInteraction(userId, contentId, 'save')
      return true
    } catch (error) {
      console.error('Error saving content:', error)
      return false
    }
  }

  // Remove saved content
  async removeSavedContent(userId: string, contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_saved_content')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing saved content:', error)
      return false
    }
  }

  // Toggle favorite status
  async toggleFavorite(userId: string, contentId: string): Promise<boolean> {
    try {
      // First check if content is saved
      const { data: existing } = await supabase
        .from('user_saved_content')
        .select('is_favorite')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single()

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_saved_content')
          .update({ is_favorite: !existing.is_favorite })
          .eq('user_id', userId)
          .eq('content_id', contentId)

        if (error) throw error
      } else {
        // Create new record as favorite
        const { error } = await supabase
          .from('user_saved_content')
          .insert({
            user_id: userId,
            content_id: contentId,
            is_favorite: true
          })

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return false
    }
  }

  // Track content interactions for recommendations
  async trackContentInteraction(userId: string, contentId: string, interactionType: string, value?: number): Promise<void> {
    try {
      await supabase
        .from('content_interactions')
        .insert({
          user_id: userId,
          content_id: contentId,
          interaction_type: interactionType,
          interaction_value: value,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  // Get recommended content based on user behavior
  async getRecommendedContent(userId: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      // Get user's interaction history to understand preferences
      const { data: interactionData } = await supabase
        .from('content_interactions')
        .select('content_id, interaction_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      // Get user's interests
      const interests = await this.getUserInterests(userId)
      const userCategories = interests.map(i => i.interestCategory)

      // Get content similar to previously interacted content
      let query = supabase
        .from('content_library')
        .select('*')
        .eq('is_verified', true)
        .order('quality_score', { ascending: false })
        .limit(limit)

      if (userCategories.length > 0) {
        query = query.overlaps('categories', userCategories)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return []
    }
  }

  // Web scraping methods for external content (simplified examples)
  async scrapeHealthyChildrenContent(category: string): Promise<Partial<ContentItem>[]> {
    // This would implement actual web scraping
    // For now, return mock data structure
    console.log(`Would scrape HealthyChildren.org for ${category} content`)
    
    // In a real implementation, this would:
    // 1. Use a scraping library like Puppeteer or Cheerio
    // 2. Respect robots.txt and rate limits
    // 3. Parse structured data
    // 4. Quality check and verify content
    
    return []
  }

  async scrapeCDCContent(category: string): Promise<Partial<ContentItem>[]> {
    console.log(`Would scrape CDC.gov for ${category} content`)
    return []
  }

  // Content quality scoring algorithm
  calculateQualityScore(content: Partial<ContentItem>): number {
    let score = 50 // Base score

    // Source reliability (verified sources get higher scores)
    const reliableSources = ['CDC', 'AAP', 'WHO', 'NIH', 'Mayo Clinic']
    if (reliableSources.some(source => content.sourceName?.includes(source))) {
      score += 30
    }

    // Content completeness
    if (content.description && content.description.length > 100) score += 10
    if (content.author) score += 5
    if (content.publishedDate) score += 5
    if (content.tags && content.tags.length > 2) score += 5

    // Recency (newer content scores higher)
    if (content.publishedDate) {
      const publishDate = new Date(content.publishedDate)
      const now = new Date()
      const monthsOld = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      
      if (monthsOld < 12) score += 10
      else if (monthsOld < 24) score += 5
    }

    return Math.min(100, Math.max(0, score))
  }

  // Bulk content import from external APIs
  async importContentFromAPIs(): Promise<void> {
    try {
      console.log('Starting content import from external APIs...')
      
      // This would implement actual API calls to various healthcare databases
      // For example:
      // - PubMed API for research articles
      // - YouTube API for educational videos
      // - CDC API for health guidelines
      // - AAP API for pediatric content
      
      console.log('Content import completed')
    } catch (error) {
      console.error('Error importing content:', error)
    }
  }
}

// Export singleton instance
export const contentCurationService = new ContentCurationService()

// Utility functions for content categories
export const CONTENT_CATEGORIES = {
  DEVELOPMENT: 'development',
  FEEDING: 'feeding',
  SLEEP: 'sleep',
  HEALTH: 'health',
  ACTIVITIES: 'activities',
  BEHAVIOR: 'behavior',
  MENTAL_HEALTH: 'mental-health',
  FAMILY: 'family'
} as const

export const AGE_GROUPS = {
  NEWBORN: 'newborn',
  INFANT_0_3: '0-3months',
  INFANT_3_6: '3-6months',
  INFANT_6_12: '6-12months',
  TODDLER_1_2: '1-2years',
  TODDLER_2_3: '2-3years',
  PRESCHOOL: '3-5years',
  ALL_AGES: 'all-ages',
  PARENTS: 'parents'
} as const

// Helper function to get age group from child's birth date
export function getAgeGroup(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  const monthsOld = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44))

  if (monthsOld < 1) return AGE_GROUPS.NEWBORN
  if (monthsOld < 3) return AGE_GROUPS.INFANT_0_3
  if (monthsOld < 6) return AGE_GROUPS.INFANT_3_6
  if (monthsOld < 12) return AGE_GROUPS.INFANT_6_12
  if (monthsOld < 24) return AGE_GROUPS.TODDLER_1_2
  if (monthsOld < 36) return AGE_GROUPS.TODDLER_2_3
  if (monthsOld < 60) return AGE_GROUPS.PRESCHOOL
  
  return AGE_GROUPS.ALL_AGES
}