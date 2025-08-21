import axios, { AxiosInstance } from 'axios'

interface AnyCrawlConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

interface ScrapeOptions {
  url: string
  engine?: 'cheerio' | 'playwright' | 'puppeteer'
  waitFor?: string
  screenshot?: boolean
}

interface CrawlOptions {
  url: string
  engine?: 'cheerio' | 'playwright' | 'puppeteer'
  maxDepth?: number
  limit?: number
  allowedDomains?: string[]
  excludePatterns?: string[]
}

interface SearchOptions {
  query: string
  engine?: 'google' | 'bing' | 'duckduckgo'
  limit?: number
  country?: string
  language?: string
}

interface ScrapedContent {
  url: string
  title: string
  content: string
  publishedDate?: string
  author?: string
  description?: string
  keywords?: string[]
}

interface SearchResult {
  title: string
  url: string
  description: string
  publishedDate?: string
}

export class AnyCrawlClient {
  private client: AxiosInstance
  private apiKey: string

  constructor(config: AnyCrawlConfig) {
    this.apiKey = config.apiKey
    
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.anycrawl.dev/v1',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'MilestoneBee/1.0'
      }
    })

    // Add request interceptor for rate limiting
    this.client.interceptors.request.use(async (config) => {
      // Add small delay between requests
      await this.delay(1000)
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making more requests.')
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key or unauthorized access.')
        }
        throw error
      }
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async scrape(options: ScrapeOptions): Promise<ScrapedContent> {
    try {
      const response = await this.client.post('/scrape', {
        url: options.url,
        engine: options.engine || 'cheerio',
        waitFor: options.waitFor,
        screenshot: options.screenshot || false
      })

      return this.parseScrapedContent(response.data)
    } catch (error) {
      console.error(`Failed to scrape ${options.url}:`, error)
      throw error
    }
  }

  async crawl(options: CrawlOptions): Promise<ScrapedContent[]> {
    try {
      const response = await this.client.post('/crawl', {
        url: options.url,
        engine: options.engine || 'cheerio',
        max_depth: options.maxDepth || 2,
        limit: options.limit || 10,
        allowed_domains: options.allowedDomains,
        exclude_patterns: options.excludePatterns
      })

      return response.data.map((item: any) => this.parseScrapedContent(item))
    } catch (error) {
      console.error(`Failed to crawl ${options.url}:`, error)
      throw error
    }
  }

  async search(options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await this.client.post('/search', {
        query: options.query,
        engine: options.engine || 'google',
        limit: options.limit || 10,
        country: options.country || 'US',
        language: options.language || 'en'
      })

      return response.data.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        description: item.description || '',
        publishedDate: item.publishedDate
      }))
    } catch (error) {
      console.error(`Failed to search for "${options.query}":`, error)
      throw error
    }
  }

  private parseScrapedContent(data: any): ScrapedContent {
    return {
      url: data.url || '',
      title: data.title || 'Untitled',
      content: data.content || '',
      publishedDate: data.publishedDate,
      author: data.author,
      description: data.description || data.meta?.description,
      keywords: data.keywords || data.meta?.keywords
    }
  }

  // Batch scraping with rate limiting
  async batchScrape(urls: string[], options: Partial<ScrapeOptions> = {}): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = []
    const batchSize = 5 // Process 5 URLs at a time
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize)
      const batchPromises = batch.map(url => 
        this.scrape({ ...options, url }).catch(error => {
          console.error(`Failed to scrape ${url}:`, error)
          return null
        })
      )
      
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.filter(result => result !== null) as ScrapedContent[])
      
      // Rate limiting between batches
      if (i + batchSize < urls.length) {
        await this.delay(2000)
      }
    }
    
    return results
  }
}

// Create singleton instance with environment variables
export const anyCrawlClient = new AnyCrawlClient({
  apiKey: process.env.VITE_ANYCRAWL_API_KEY || '',
  timeout: 45000
})

// Export types for use in other files
export type { ScrapedContent, SearchResult, ScrapeOptions, CrawlOptions, SearchOptions }