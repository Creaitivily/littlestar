import { anyCrawlClient, ScrapedContent, SearchResult } from './anyCrawlClient'
import { supabase } from '@/lib/supabase'
import * as cheerio from 'cheerio'

// Topic configuration for targeted scraping
export const SCRAPING_TARGETS = {
  feeding_nutrition: {
    keywords: ['baby feeding', 'infant nutrition', 'breastfeeding', 'formula feeding', 'solid foods', 'weaning', 'baby food'],
    trustedSources: [
      'aap.org',
      'mayoclinic.org', 
      'cdc.gov',
      'healthychildren.org',
      'nutritionaustralia.org'
    ],
    searchQueries: [
      'baby feeding guidelines',
      'infant nutrition recommendations', 
      'when to start solid foods',
      'breastfeeding tips'
    ]
  },
  sleep_patterns: {
    keywords: ['baby sleep', 'infant sleep', 'sleep training', 'nap schedule', 'safe sleep', 'bedtime routine'],
    trustedSources: [
      'sleepfoundation.org',
      'aap.org',
      'babysleep.com',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby sleep patterns',
      'infant sleep safety',
      'sleep training methods',
      'newborn sleep schedule'
    ]
  },
  cognitive_development: {
    keywords: ['cognitive development', 'brain development', 'learning milestones', 'mental development', 'intellectual growth'],
    trustedSources: [
      'zerotothree.org',
      'aap.org',
      'cdc.gov',
      'healthychildren.org'
    ],
    searchQueries: [
      'infant cognitive development',
      'baby brain development',
      'early learning milestones',
      'cognitive development stages'
    ]
  },
  physical_development: {
    keywords: ['motor skills', 'physical development', 'gross motor', 'fine motor', 'crawling', 'walking', 'sitting'],
    trustedSources: [
      'aap.org',
      'cdc.gov',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby motor skills development',
      'infant physical milestones',
      'when babies crawl walk',
      'physical development stages'
    ]
  },
  social_emotional: {
    keywords: ['social development', 'emotional development', 'attachment', 'bonding', 'temperament'],
    trustedSources: [
      'zerotothree.org',
      'aap.org',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby social development',
      'infant emotional development',
      'parent child bonding',
      'social emotional milestones'
    ]
  },
  health_safety: {
    keywords: ['baby health', 'infant safety', 'vaccinations', 'childproofing', 'safety guidelines', 'medical care'],
    trustedSources: [
      'aap.org',
      'cdc.gov',
      'mayoclinic.org',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby health checkups',
      'infant safety guidelines',
      'vaccination schedule',
      'childproofing tips'
    ]
  },
  activities_play: {
    keywords: ['baby activities', 'infant play', 'developmental play', 'toys', 'sensory play', 'tummy time'],
    trustedSources: [
      'zerotothree.org',
      'aap.org',
      'healthychildren.org'
    ],
    searchQueries: [
      'age appropriate baby activities',
      'infant play ideas',
      'developmental toys',
      'baby sensory play'
    ]
  },
  behavior_discipline: {
    keywords: ['baby behavior', 'infant behavior', 'discipline', 'behavior management', 'crying', 'tantrums'],
    trustedSources: [
      'aap.org',
      'zerotothree.org',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby behavior patterns',
      'infant crying',
      'toddler discipline',
      'behavior management'
    ]
  },
  language_communication: {
    keywords: ['language development', 'speech development', 'communication', 'talking', 'babbling', 'vocabulary'],
    trustedSources: [
      'asha.org',
      'aap.org',
      'healthychildren.org'
    ],
    searchQueries: [
      'baby language development',
      'speech development milestones',
      'when babies start talking',
      'language development stages'
    ]
  }
}

// Age range mapping for search refinement
export const AGE_RANGES = {
  '0-1_months': { min: 0, max: 1, keywords: ['newborn', '0-1 month', 'first month'] },
  '1-2_months': { min: 1, max: 2, keywords: ['1-2 months', '2 month old'] },
  '2-3_months': { min: 2, max: 3, keywords: ['2-3 months', '3 month old'] },
  '3-4_months': { min: 3, max: 4, keywords: ['3-4 months', '4 month old'] },
  '4-5_months': { min: 4, max: 5, keywords: ['4-5 months', '5 month old'] },
  '5-6_months': { min: 5, max: 6, keywords: ['5-6 months', '6 month old'] },
  '6-7_months': { min: 6, max: 7, keywords: ['6-7 months', '7 month old'] },
  '7-8_months': { min: 7, max: 8, keywords: ['7-8 months', '8 month old'] },
  '8-9_months': { min: 8, max: 9, keywords: ['8-9 months', '9 month old'] },
  '9-10_months': { min: 9, max: 10, keywords: ['9-10 months', '10 month old'] },
  '10-11_months': { min: 10, max: 11, keywords: ['10-11 months', '11 month old'] },
  '11-12_months': { min: 11, max: 12, keywords: ['11-12 months', '12 month old', '1 year'] },
  '12-18_months': { min: 12, max: 18, keywords: ['12-18 months', '1-1.5 years', 'toddler'] },
  '18-24_months': { min: 18, max: 24, keywords: ['18-24 months', '1.5-2 years', 'toddler'] },
  '24-30_months': { min: 24, max: 30, keywords: ['2-2.5 years', '24-30 months', 'toddler'] },
  '30-36_months': { min: 30, max: 36, keywords: ['2.5-3 years', '30-36 months', 'toddler'] }
}

interface ContentItem {
  topic: string
  age_range: string
  title: string
  url: string
  content_summary: string
  source_domain: string
  publication_date: string
  quality_score: number
  refresh_cycle: number
}

export class ContentScraperService {
  
  async scrapeTopicContent(
    topic: string, 
    ageRange: string, 
    options: { maxResults?: number; urgentMode?: boolean } = {}
  ): Promise<ContentItem[]> {
    const { maxResults = 20, urgentMode = false } = options
    
    console.log(`🔍 Scraping content for ${topic}/${ageRange}...`)
    
    try {
      // Get existing URLs to avoid duplicates
      const existingUrls = await this.getExistingUrls(topic, ageRange)
      
      // Build search queries
      const searchQueries = this.buildSearchQueries(topic, ageRange)
      const searchResults: SearchResult[] = []
      
      // Search for content using multiple queries
      for (const query of searchQueries) {
        try {
          console.log(`Searching: "${query}"`)
          const results = await anyCrawlClient.search({
            query,
            limit: Math.ceil(maxResults / searchQueries.length),
            engine: 'google'
          })
          
          searchResults.push(...results)
          await this.delay(2000) // Rate limiting
        } catch (error) {
          console.error(`Search failed for "${query}":`, error)
        }
      }
      
      // Filter and deduplicate results
      const uniqueResults = this.deduplicateResults(searchResults, existingUrls)
      const relevantResults = this.filterRelevantResults(uniqueResults, topic, ageRange)
      
      // Scrape full content from URLs
      const scrapedContent = await this.scrapeUrls(relevantResults.slice(0, maxResults))
      
      // Process and score content
      const processedContent = await this.processContent(scrapedContent, topic, ageRange)
      
      console.log(`✅ Scraped ${processedContent.length} articles for ${topic}/${ageRange}`)
      return processedContent
      
    } catch (error) {
      console.error(`❌ Scraping failed for ${topic}/${ageRange}:`, error)
      throw error
    }
  }
  
  private async getExistingUrls(topic: string, ageRange: string): Promise<Set<string>> {
    const { data } = await supabase
      .from('topic_content')
      .select('url')
      .eq('topic', topic)
      .eq('age_range', ageRange)
      .eq('is_active', true)
    
    return new Set(data?.map(item => item.url) || [])
  }
  
  private buildSearchQueries(topic: string, ageRange: string): string[] {
    const topicConfig = SCRAPING_TARGETS[topic as keyof typeof SCRAPING_TARGETS]
    const ageConfig = AGE_RANGES[ageRange as keyof typeof AGE_RANGES]
    
    if (!topicConfig || !ageConfig) {
      throw new Error(`Invalid topic (${topic}) or age range (${ageRange})`)
    }
    
    const queries: string[] = []
    
    // Combine topic queries with age keywords
    for (const baseQuery of topicConfig.searchQueries) {
      for (const ageKeyword of ageConfig.keywords) {
        queries.push(`${baseQuery} ${ageKeyword}`)
      }
    }
    
    // Add site-specific searches for trusted sources
    for (const source of topicConfig.trustedSources.slice(0, 2)) { // Limit to top 2 sources
      queries.push(`site:${source} ${topicConfig.keywords[0]} ${ageConfig.keywords[0]}`)
    }
    
    return queries.slice(0, 5) // Limit total queries
  }
  
  private deduplicateResults(results: SearchResult[], existingUrls: Set<string>): SearchResult[] {
    const seen = new Set<string>()
    const unique: SearchResult[] = []
    
    for (const result of results) {
      if (!seen.has(result.url) && !existingUrls.has(result.url)) {
        seen.add(result.url)
        unique.push(result)
      }
    }
    
    return unique
  }
  
  private filterRelevantResults(results: SearchResult[], topic: string, ageRange: string): SearchResult[] {
    const topicConfig = SCRAPING_TARGETS[topic as keyof typeof SCRAPING_TARGETS]
    const ageConfig = AGE_RANGES[ageRange as keyof typeof AGE_RANGES]
    
    return results.filter(result => {
      // Check if URL is from trusted sources
      const isTrustedSource = topicConfig.trustedSources.some(source => 
        result.url.includes(source)
      )
      
      // Check if title/description contains relevant keywords
      const text = `${result.title} ${result.description}`.toLowerCase()
      const hasTopicKeywords = topicConfig.keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      )
      const hasAgeKeywords = ageConfig.keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      )
      
      return isTrustedSource || (hasTopicKeywords && hasAgeKeywords)
    })
  }
  
  private async scrapeUrls(results: SearchResult[]): Promise<ScrapedContent[]> {
    const urls = results.map(r => r.url)
    return await anyCrawlClient.batchScrape(urls, { engine: 'cheerio' })
  }
  
  private async processContent(
    scrapedContent: ScrapedContent[], 
    topic: string, 
    ageRange: string
  ): Promise<ContentItem[]> {
    const currentCycle = await this.getCurrentRefreshCycle()
    
    return scrapedContent
      .filter(content => content.content && content.title)
      .map(content => ({
        topic,
        age_range: ageRange,
        title: this.cleanTitle(content.title),
        url: content.url,
        content_summary: this.generateSummary(content.content),
        source_domain: this.extractDomain(content.url),
        publication_date: content.publishedDate || new Date().toISOString().split('T')[0],
        quality_score: this.calculateQualityScore(content, topic),
        refresh_cycle: currentCycle + 1
      }))
      .filter(item => item.quality_score > 0.3) // Filter low quality content
  }
  
  private cleanTitle(title: string): string {
    return title
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-,.()]/g, '')
      .trim()
      .slice(0, 200)
  }
  
  private generateSummary(content: string): string {
    // Extract first meaningful paragraph or first 200 characters
    const $ = cheerio.load(content)
    const text = $.text()
    
    // Find first paragraph with substantial content
    const paragraphs = text.split('\n').filter(p => p.trim().length > 50)
    if (paragraphs.length > 0) {
      return paragraphs[0].trim().slice(0, 300) + (paragraphs[0].length > 300 ? '...' : '')
    }
    
    return text.replace(/\s+/g, ' ').trim().slice(0, 300) + '...'
  }
  
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return 'unknown'
    }
  }
  
  private calculateQualityScore(content: ScrapedContent, topic: string): number {
    let score = 0.5 // Base score
    
    // Domain authority (trusted sources get higher scores)
    const topicConfig = SCRAPING_TARGETS[topic as keyof typeof SCRAPING_TARGETS]
    if (topicConfig.trustedSources.some(source => content.url.includes(source))) {
      score += 0.3
    }
    
    // Content length (longer articles generally better)
    const wordCount = content.content.split(/\s+/).length
    if (wordCount > 500) score += 0.1
    if (wordCount > 1000) score += 0.1
    
    // Has publication date
    if (content.publishedDate) score += 0.1
    
    // Title quality
    if (content.title && content.title.length > 20 && content.title.length < 100) {
      score += 0.1
    }
    
    // Keyword relevance
    const text = `${content.title} ${content.content}`.toLowerCase()
    const relevantKeywords = topicConfig.keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    )
    score += Math.min(relevantKeywords.length * 0.05, 0.2)
    
    return Math.min(score, 1.0)
  }
  
  private async getCurrentRefreshCycle(): Promise<number> {
    const { data } = await supabase
      .rpc('get_current_refresh_cycle')
    
    return data || 0
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Store scraped content in database
  async storeContent(content: ContentItem[]): Promise<void> {
    if (content.length === 0) return
    
    const { error } = await supabase
      .from('topic_content')
      .insert(content)
    
    if (error) {
      console.error('Failed to store content:', error)
      throw error
    }
    
    console.log(`✅ Stored ${content.length} articles in database`)
  }
  
  // Get content for display
  async getTopicContent(topic: string, childAgeInMonths: number): Promise<any[]> {
    const ageRange = this.getAgeRangeForChild(childAgeInMonths)
    
    const { data, error } = await supabase
      .from('fresh_topic_content')
      .select('*')
      .eq('topic', topic)
      .eq('age_range', ageRange)
      .order('quality_score', { ascending: false })
      .order('publication_date', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('Failed to fetch content:', error)
      throw error
    }
    
    return data || []
  }
  
  private getAgeRangeForChild(ageInMonths: number): string {
    if (ageInMonths < 12) {
      return `${ageInMonths}-${ageInMonths + 1}_months`
    }
    
    // Find appropriate semester range for older children
    const ranges = Object.keys(AGE_RANGES).filter(range => range.includes('_months') && !range.match(/^\d+-\d+_months$/))
    for (const range of ranges) {
      const config = AGE_RANGES[range as keyof typeof AGE_RANGES]
      if (ageInMonths >= config.min && ageInMonths < config.max) {
        return range
      }
    }
    
    return '30-36_months' // Default to oldest range
  }
}

export const contentScraperService = new ContentScraperService()