#!/usr/bin/env node

// Content refresh script for GitHub Actions
// This script runs the content refresh process in a Node.js environment

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ANYCRAWL_API_KEY = process.env.VITE_ANYCRAWL_API_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ANYCRAWL_API_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('  - VITE_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('  - VITE_SUPABASE_ANON_KEY:', !!SUPABASE_ANON_KEY);
  console.error('  - VITE_ANYCRAWL_API_KEY:', !!ANYCRAWL_API_KEY);
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Content topics and age ranges (same as in TypeScript files)
const SCRAPING_TARGETS = {
  feeding_nutrition: {
    keywords: ['baby feeding', 'infant nutrition', 'breastfeeding', 'formula feeding', 'solid foods', 'weaning'],
    trustedSources: ['aap.org', 'mayoclinic.org', 'cdc.gov', 'healthychildren.org'],
    searchQueries: ['baby feeding guidelines', 'infant nutrition recommendations', 'when to start solid foods']
  },
  sleep_patterns: {
    keywords: ['baby sleep', 'infant sleep', 'sleep training', 'nap schedule', 'safe sleep'],
    trustedSources: ['sleepfoundation.org', 'aap.org', 'healthychildren.org'],
    searchQueries: ['baby sleep patterns', 'infant sleep safety', 'sleep training methods']
  },
  cognitive_development: {
    keywords: ['cognitive development', 'brain development', 'learning milestones'],
    trustedSources: ['zerotothree.org', 'aap.org', 'cdc.gov'],
    searchQueries: ['infant cognitive development', 'baby brain development', 'early learning milestones']
  },
  physical_development: {
    keywords: ['motor skills', 'physical development', 'gross motor', 'fine motor'],
    trustedSources: ['aap.org', 'cdc.gov', 'healthychildren.org'],
    searchQueries: ['baby motor skills development', 'infant physical milestones']
  },
  social_emotional: {
    keywords: ['social development', 'emotional development', 'attachment', 'bonding'],
    trustedSources: ['zerotothree.org', 'aap.org', 'healthychildren.org'],
    searchQueries: ['baby social development', 'infant emotional development']
  },
  health_safety: {
    keywords: ['baby health', 'infant safety', 'vaccinations', 'childproofing'],
    trustedSources: ['aap.org', 'cdc.gov', 'mayoclinic.org'],
    searchQueries: ['baby health checkups', 'infant safety guidelines']
  },
  activities_play: {
    keywords: ['baby activities', 'infant play', 'developmental play', 'toys'],
    trustedSources: ['zerotothree.org', 'aap.org', 'healthychildren.org'],
    searchQueries: ['age appropriate baby activities', 'infant play ideas']
  },
  behavior_discipline: {
    keywords: ['baby behavior', 'infant behavior', 'discipline', 'crying'],
    trustedSources: ['aap.org', 'zerotothree.org', 'healthychildren.org'],
    searchQueries: ['baby behavior patterns', 'infant crying']
  },
  language_communication: {
    keywords: ['language development', 'speech development', 'communication'],
    trustedSources: ['asha.org', 'aap.org', 'healthychildren.org'],
    searchQueries: ['baby language development', 'speech development milestones']
  }
};

const AGE_RANGES = [
  '0-1_months', '1-2_months', '2-3_months', '3-4_months', '4-5_months', '5-6_months',
  '6-7_months', '7-8_months', '8-9_months', '9-10_months', '10-11_months', '11-12_months',
  '12-18_months', '18-24_months', '24-30_months', '30-36_months'
];

// AnyCrawl API client
class AnyCrawlClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anycrawl.dev/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'MilestoneBee/1.0'
      }
    });
  }

  async search(options) {
    try {
      await this.delay(1000); // Rate limiting
      
      const response = await this.axiosInstance.post('/search', {
        query: options.query,
        engine: options.engine || 'google',
        limit: options.limit || 10,
        country: 'US',
        language: 'en'
      });

      return response.data.map(item => ({
        title: item.title || '',
        url: item.url || '',
        description: item.description || '',
        publishedDate: item.publishedDate
      }));
    } catch (error) {
      console.error(`Search failed for "${options.query}":`, error.message);
      return [];
    }
  }

  async scrape(url) {
    try {
      await this.delay(2000); // Rate limiting
      
      const response = await this.axiosInstance.post('/scrape', {
        url: url,
        engine: 'cheerio'
      });

      return {
        url: response.data.url || url,
        title: response.data.title || 'Untitled',
        content: response.data.content || '',
        publishedDate: response.data.publishedDate
      };
    } catch (error) {
      console.error(`Scrape failed for "${url}":`, error.message);
      return null;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Content refresh logic
async function refreshAllContent() {
  const anyCrawl = new AnyCrawlClient(ANYCRAWL_API_KEY);
  const topics = Object.keys(SCRAPING_TARGETS);
  
  let totalAdded = 0;
  let successfulRefreshes = 0;
  let failedRefreshes = 0;
  
  console.log(`🚀 Starting refresh for ${topics.length} topics × ${AGE_RANGES.length} age ranges`);
  
  // Get current refresh cycle
  const { data: currentCycleData } = await supabase.rpc('get_current_refresh_cycle');
  const newCycle = (currentCycleData || 0) + 1;
  
  // Clean up old content first
  console.log('🧹 Cleaning up old content...');
  await supabase.rpc('cleanup_old_content');
  
  for (const topic of topics) {
    for (const ageRange of AGE_RANGES) {
      try {
        console.log(`📖 Refreshing ${topic}/${ageRange}...`);
        
        const topicConfig = SCRAPING_TARGETS[topic];
        const searchQuery = `${topicConfig.searchQueries[0]} ${ageRange.replace('_', ' ')}`;
        
        // Search for content
        const searchResults = await anyCrawl.search({
          query: searchQuery,
          limit: 5
        });
        
        if (searchResults.length === 0) {
          console.log(`⚠️ No search results for ${topic}/${ageRange}`);
          continue;
        }
        
        // Get existing URLs to avoid duplicates
        const { data: existingContent } = await supabase
          .from('topic_content')
          .select('url')
          .eq('topic', topic)
          .eq('age_range', ageRange)
          .eq('is_active', true);
        
        const existingUrls = new Set(existingContent?.map(item => item.url) || []);
        
        // Filter and scrape new content
        const newUrls = searchResults
          .filter(result => !existingUrls.has(result.url))
          .slice(0, 3); // Limit to 3 new articles per topic/age
        
        const newContent = [];
        
        for (const result of newUrls) {
          const scrapedContent = await anyCrawl.scrape(result.url);
          if (scrapedContent && scrapedContent.content) {
            // Calculate quality score
            let qualityScore = 0.5;
            if (topicConfig.trustedSources.some(source => result.url.includes(source))) {
              qualityScore += 0.3;
            }
            if (scrapedContent.content.split(/\s+/).length > 200) {
              qualityScore += 0.2;
            }
            
            newContent.push({
              topic,
              age_range: ageRange,
              title: scrapedContent.title.slice(0, 200),
              url: scrapedContent.url,
              content_summary: scrapedContent.content.slice(0, 300) + '...',
              source_domain: new URL(scrapedContent.url).hostname.replace('www.', ''),
              publication_date: scrapedContent.publishedDate || new Date().toISOString().split('T')[0],
              quality_score: Math.min(qualityScore, 1.0),
              refresh_cycle: newCycle
            });
          }
        }
        
        // Store new content
        if (newContent.length > 0) {
          const { error } = await supabase
            .from('topic_content')
            .insert(newContent);
          
          if (!error) {
            totalAdded += newContent.length;
            console.log(`✅ ${topic}/${ageRange}: Added ${newContent.length} articles`);
          } else {
            console.error(`❌ Failed to store content for ${topic}/${ageRange}:`, error);
            failedRefreshes++;
            continue;
          }
        }
        
        // Log successful refresh
        await supabase.from('content_refresh_log').insert({
          topic,
          age_range: ageRange,
          articles_added: newContent.length,
          status: 'success',
          refresh_cycle: newCycle
        });
        
        successfulRefreshes++;
        
        // Rate limiting between requests
        await anyCrawl.delay(10000); // 10 second delay
        
      } catch (error) {
        console.error(`❌ Failed to refresh ${topic}/${ageRange}:`, error.message);
        failedRefreshes++;
        
        // Log failed refresh
        await supabase.from('content_refresh_log').insert({
          topic,
          age_range: ageRange,
          status: 'failed',
          error_message: error.message,
          refresh_cycle: newCycle
        });
      }
    }
  }
  
  // Log system completion
  await supabase.from('content_refresh_log').insert({
    topic: 'SYSTEM_COMPLETE',
    age_range: 'all',
    articles_added: totalAdded,
    status: successfulRefreshes > 0 ? 'success' : 'failed',
    error_message: `Completed: ${successfulRefreshes} successful, ${failedRefreshes} failed`,
    refresh_cycle: newCycle
  });
  
  console.log('✅ Content refresh completed');
  console.log(`📊 Stats: ${successfulRefreshes} successful, ${failedRefreshes} failed`);
  console.log(`📈 Content: +${totalAdded} articles added`);
  
  return {
    totalAdded,
    successfulRefreshes,
    failedRefreshes
  };
}

// Health check
async function runHealthCheck() {
  try {
    const { count } = await supabase
      .from('topic_content')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    console.log(`📊 Total active articles: ${count || 0}`);
    
    if ((count || 0) === 0) {
      console.log('⚠️ No content found in database');
      return false;
    }
    
    console.log('✅ Database health check passed');
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('🔄 Starting MilestoneBee content refresh...');
    
    const stats = await refreshAllContent();
    
    console.log('🔍 Running post-refresh health check...');
    await runHealthCheck();
    
    console.log('🎉 All operations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Content refresh failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}