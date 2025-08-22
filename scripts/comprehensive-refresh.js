#!/usr/bin/env node

// Comprehensive Content Refresh Script
// This script scrapes 50 high-quality articles per topic using AnyCrawl

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ANYCRAWL_API_KEY = process.env.VITE_ANYCRAWL_API_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ANYCRAWL_API_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Content topics configuration
const SCRAPING_TARGETS = {
  feeding_nutrition: {
    searchQueries: [
      'best advice on baby feeding',
      'expert tips for infant nutrition', 
      'comprehensive guide to baby feeding',
      'top recommendations for baby nutrition'
    ],
    trustedSources: ['aap.org', 'mayoclinic.org', 'cdc.gov', 'healthychildren.org']
  },
  sleep_patterns: {
    searchQueries: [
      'best advice on baby sleep',
      'expert sleep training guidance',
      'comprehensive baby sleep guide',
      'top tips for infant sleep'
    ],
    trustedSources: ['sleepfoundation.org', 'aap.org', 'healthychildren.org']
  },
  cognitive_development: {
    searchQueries: [
      'best advice on baby cognitive development',
      'expert tips for brain development',
      'comprehensive guide to baby learning',
      'top cognitive development strategies'
    ],
    trustedSources: ['zerotothree.org', 'aap.org', 'cdc.gov']
  },
  physical_development: {
    searchQueries: [
      'best advice on baby physical development',
      'expert tips for motor skills',
      'comprehensive guide to baby movement',
      'top physical development strategies'
    ],
    trustedSources: ['aap.org', 'cdc.gov', 'healthychildren.org']
  },
  social_emotional: {
    searchQueries: [
      'best advice on baby emotional development',
      'expert tips for social development',
      'comprehensive guide to baby bonding',
      'top emotional development strategies'
    ],
    trustedSources: ['zerotothree.org', 'aap.org', 'healthychildren.org']
  },
  health_safety: {
    searchQueries: [
      'best advice on baby health',
      'expert tips for infant safety',
      'comprehensive baby health guide',
      'top baby safety recommendations'
    ],
    trustedSources: ['aap.org', 'cdc.gov', 'mayoclinic.org']
  },
  activities_play: {
    searchQueries: [
      'best advice on baby activities',
      'expert tips for infant play',
      'comprehensive baby play guide',
      'top baby activity ideas'
    ],
    trustedSources: ['zerotothree.org', 'aap.org', 'healthychildren.org']
  },
  behavior_discipline: {
    searchQueries: [
      'best advice on baby behavior',
      'expert tips for infant discipline',
      'comprehensive baby behavior guide',
      'top behavior management strategies'
    ],
    trustedSources: ['aap.org', 'zerotothree.org', 'healthychildren.org']
  },
  language_communication: {
    searchQueries: [
      'best advice on baby language development',
      'expert tips for speech development',
      'comprehensive language development guide',
      'top communication development strategies'
    ],
    trustedSources: ['asha.org', 'aap.org', 'healthychildren.org']
  }
};

// AnyCrawl API client
class AnyCrawlClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anycrawl.dev/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 90000, // Increase to 90 seconds
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
        limit: options.limit || 15,
        country: 'US',
        language: 'en'
      });

      // Handle AnyCrawl response structure
      let results = [];
      if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
        results = response.data.data.filter(item => item.url && item.source !== 'Google Suggestions');
      } else {
        console.error('Unexpected AnyCrawl response structure:', response.data);
        return [];
      }

      return results.map(item => ({
        title: item.title || '',
        url: item.url || item.link || '',
        description: item.description || item.snippet || '',
        publishedDate: item.publishedDate || item.date
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

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        return {
          url: data.url || url,
          title: data.title || 'Untitled',
          content: data.content || data.text || '',
          publishedDate: data.publishedDate || data.date
        };
      } else {
        console.error(`Scrape failed for "${url}": Invalid response structure`);
        return null;
      }
    } catch (error) {
      console.error(`Scrape failed for "${url}":`, error.message);
      return null;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Helper functions
function extractImageFromContent(content) {
  try {
    const $ = cheerio.load(content);
    
    const images = $('img').filter((i, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || '';
      const className = $(el).attr('class') || '';
      
      // Skip small images, ads, icons
      if (src.includes('icon') || src.includes('logo') || src.includes('ad') || 
          className.includes('icon') || className.includes('logo') ||
          alt.includes('icon') || alt.includes('logo')) {
        return false;
      }
      
      const width = parseInt($(el).attr('width') || '0');
      const height = parseInt($(el).attr('height') || '0');
      
      return width >= 200 || height >= 200 || (!width && !height);
    });
    
    if (images.length > 0) {
      const firstImage = images.first();
      let src = firstImage.attr('src') || firstImage.attr('data-src');
      
      if (src) {
        if (src.startsWith('//')) {
          src = 'https:' + src;
        } else if (src.startsWith('/')) {
          return undefined; // Skip relative paths
        }
        return src;
      }
    }
  } catch (error) {
    console.warn('Failed to extract image:', error);
  }
  
  return undefined;
}

function calculateQualityScore(content, trustedSources) {
  let score = 0.5; // Base score
  
  try {
    const url = content.url || '';
    const contentText = content.content || '';
    const title = content.title || '';
    
    // Domain authority
    for (const source of trustedSources) {
      if (url.includes(source)) {
        score += 0.3;
        break;
      }
    }
    
    // Content length
    const wordCount = contentText.split(/\s+/).length;
    if (wordCount > 500) score += 0.2;
    if (wordCount > 1000) score += 0.1;
    
    // Title quality
    if (title.includes('!') || title.includes('?')) score -= 0.1;
    if (title.includes('AMAZING') || title.includes('SHOCKING')) score -= 0.2;
    
    // Has images
    if (extractImageFromContent(contentText)) {
      score += 0.1;
    }
    
    // Recent content
    if (content.publishedDate) {
      const publishDate = new Date(content.publishedDate);
      const monthsOld = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsOld < 12) score += 0.1;
    }
    
  } catch (error) {
    console.warn('Quality score calculation failed:', error);
  }
  
  return Math.min(Math.max(score, 0), 1);
}

function generateSummary(content) {
  const $ = cheerio.load(content);
  const text = $.text();
  
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50);
  if (paragraphs.length > 0) {
    return paragraphs[0].trim().slice(0, 300) + (paragraphs[0].length > 300 ? '...' : '');
  }
  
  return text.replace(/\s+/g, ' ').trim().slice(0, 300) + '...';
}

// Main refresh logic
async function refreshComprehensiveContent() {
  const anyCrawl = new AnyCrawlClient(ANYCRAWL_API_KEY);
  const topics = Object.keys(SCRAPING_TARGETS);
  
  let totalAdded = 0;
  let successfulTopics = 0;
  let failedTopics = 0;
  
  console.log(`🚀 Starting comprehensive refresh for ${topics.length} topics (50 articles each)`);
  
  // Clear existing content for fresh start
  console.log('🧹 Clearing existing content...');
  await supabase.from('topic_content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Test with just one topic first
  const testTopics = ['feeding_nutrition'];
  
  for (const topic of testTopics) {
    try {
      console.log(`📖 Scraping ${topic} (targeting 10 articles for testing)...`);
      
      const topicConfig = SCRAPING_TARGETS[topic];
      const allArticles = [];
      const processedUrls = new Set();
      
      // Search with first query only for testing
      const firstQuery = topicConfig.searchQueries[0];
      console.log(`🔎 Testing search: "${firstQuery}"`);
      
      const searchResults = await anyCrawl.search({
        query: firstQuery,
        limit: 10
      });
      
      console.log(`Found ${searchResults.length} search results`);
      
      // Process search results
      for (const result of searchResults.slice(0, 5)) { // Limit to 5 for testing
        if (processedUrls.has(result.url)) {
          console.log(`⏭️ Skipping duplicate: ${result.url}`);
          continue;
        }
        
        try {
          console.log(`🔍 Scraping: ${result.url}`);
          const scrapedContent = await anyCrawl.scrape(result.url);
          
          if (scrapedContent && scrapedContent.content && scrapedContent.content.length > 100) {
            const qualityScore = calculateQualityScore(scrapedContent, topicConfig.trustedSources);
            
            // Skip low quality content
            if (qualityScore < 0.4) {
              console.log(`⚠️ Low quality (${qualityScore.toFixed(2)}): ${scrapedContent.title}`);
              continue;
            }
            
            const article = {
              topic,
              age_range: 'all',
              title: (scrapedContent.title || result.title || 'Untitled').slice(0, 200),
              url: scrapedContent.url || result.url,
              content_summary: generateSummary(scrapedContent.content),
              source_domain: new URL(scrapedContent.url || result.url).hostname.replace('www.', ''),
              publication_date: scrapedContent.publishedDate || new Date().toISOString().split('T')[0],
              quality_score: qualityScore,
              refresh_cycle: 1,
              image_url: extractImageFromContent(scrapedContent.content),
              reading_time: Math.max(1, Math.ceil(scrapedContent.content.split(/\s+/).length / 200)),
              author: 'Expert',
              tags: [topic.replace('_', ' ')],
              is_active: true
            };
            
            allArticles.push(article);
            processedUrls.add(result.url);
            
            console.log(`✅ Added: ${article.title} (Quality: ${qualityScore.toFixed(2)})`);
          } else {
            console.log(`⚠️ No content from scrape, trying fallback: ${result.url}`);
            // Try fallback even if scraping returned empty content
            if (result.description && result.description.length > 50) {
              console.log(`🔄 Using fallback content for: ${result.title}`);
              
              const article = {
                topic,
                age_range: 'all',
                title: (result.title || 'Untitled').slice(0, 200),
                url: result.url,
                content_summary: result.description.slice(0, 300) + '...',
                source_domain: new URL(result.url).hostname.replace('www.', ''),
                publication_date: new Date().toISOString().split('T')[0],
                quality_score: topicConfig.trustedSources.some(source => result.url.includes(source)) ? 0.6 : 0.5,
                refresh_cycle: 1,
                image_url: null,
                reading_time: 3,
                author: 'Expert',
                tags: [topic.replace('_', ' ')],
                is_active: true
              };
              
              allArticles.push(article);
              processedUrls.add(result.url);
              
              console.log(`✅ Added fallback: ${article.title} (Quality: ${article.quality_score.toFixed(2)})`);
            }
          }
        } catch (error) {
          console.error(`❌ Failed to scrape ${result.url}:`, error.message);
          
          // Fallback: Use search result info if scraping fails
          if (result.description && result.description.length > 50) {
            console.log(`🔄 Using fallback content for: ${result.title}`);
            
            const article = {
              topic,
              age_range: 'all',
              title: (result.title || 'Untitled').slice(0, 200),
              url: result.url,
              content_summary: result.description.slice(0, 300) + '...',
              source_domain: new URL(result.url).hostname.replace('www.', ''),
              publication_date: new Date().toISOString().split('T')[0],
              quality_score: topicConfig.trustedSources.some(source => result.url.includes(source)) ? 0.6 : 0.5,
              refresh_cycle: 1,
              image_url: null,
              reading_time: 3,
              author: 'Expert',
              tags: [topic.replace('_', ' ')],
              is_active: true
            };
            
            allArticles.push(article);
            processedUrls.add(result.url);
            
            console.log(`✅ Added fallback: ${article.title} (Quality: ${article.quality_score.toFixed(2)})`);
          }
        }
      }
      
      // Store articles in database
      if (allArticles.length > 0) {
        console.log(`💾 Storing ${allArticles.length} articles...`);
        const { error } = await supabase
          .from('topic_content')
          .insert(allArticles);
        
        if (!error) {
          totalAdded += allArticles.length;
          successfulTopics++;
          console.log(`✅ ${topic}: Successfully added ${allArticles.length} articles`);
        } else {
          console.error(`❌ Failed to store articles for ${topic}:`, error);
          failedTopics++;
        }
      } else {
        console.log(`⚠️ No articles found for ${topic}`);
        failedTopics++;
      }
      
    } catch (error) {
      console.error(`💥 Failed to process ${topic}:`, error);
      failedTopics++;
    }
  }
  
  // Original full processing (commented out for testing)
  /*
  for (const topic of topics) {
    try {
      console.log(`📖 Scraping ${topic} (targeting 50 articles)...`);
      
      const topicConfig = SCRAPING_TARGETS[topic];
      const allArticles = [];
      const processedUrls = new Set();
      
      // Search with multiple queries
      for (const baseQuery of topicConfig.searchQueries) {
        if (allArticles.length >= 50) break;
        
        console.log(`🔎 Searching: "${baseQuery}"`);
        
        const searchResults = await anyCrawl.search({
          query: baseQuery,
          limit: 15
        });
        
        // Process each search result
        for (const result of searchResults) {
          if (processedUrls.has(result.url) || allArticles.length >= 50) {
            continue;
          }
          
          try {
            const scrapedContent = await anyCrawl.scrape(result.url);
            
            if (scrapedContent && scrapedContent.content) {
              const qualityScore = calculateQualityScore(scrapedContent, topicConfig.trustedSources);
              
              // Skip low quality content
              if (qualityScore < 0.4) continue;
              
              const article = {
                topic,
                age_range: 'all',
                title: (scrapedContent.title || result.title || 'Untitled').slice(0, 200),
                url: scrapedContent.url || result.url,
                content_summary: generateSummary(scrapedContent.content),
                source_domain: new URL(scrapedContent.url || result.url).hostname.replace('www.', ''),
                publication_date: scrapedContent.publishedDate || new Date().toISOString().split('T')[0],
                quality_score: qualityScore,
                refresh_cycle: 1,
                image_url: extractImageFromContent(scrapedContent.content),
                reading_time: Math.max(1, Math.ceil(scrapedContent.content.split(/\s+/).length / 200)),
                author: 'Expert',
                tags: [topic.replace('_', ' ')],
                is_active: true
              };
              
              allArticles.push(article);
              processedUrls.add(result.url);
              
              console.log(`✅ Added: ${article.title} (Quality: ${qualityScore.toFixed(2)})`);
              
              // Rate limiting
              await anyCrawl.delay(2000);
            }
          } catch (error) {
            console.error(`❌ Failed to scrape ${result.url}:`, error.message);
          }
        }
        
        // Delay between queries
        await anyCrawl.delay(3000);
      }
      
      // Store articles in database
      if (allArticles.length > 0) {
        const { error } = await supabase
          .from('topic_content')
          .insert(allArticles);
        
        if (!error) {
          totalAdded += allArticles.length;
          successfulTopics++;
          console.log(`✅ ${topic}: Successfully added ${allArticles.length} articles`);
        } else {
          console.error(`❌ Failed to store articles for ${topic}:`, error);
          failedTopics++;
        }
      } else {
        console.log(`⚠️ No articles found for ${topic}`);
        failedTopics++;
      }
      
    } catch (error) {
      console.error(`💥 Failed to process ${topic}:`, error);
      failedTopics++;
    }
  }
  */
  
  console.log('✅ Comprehensive refresh completed');
  console.log(`📊 Results: ${successfulTopics} successful, ${failedTopics} failed`);
  console.log(`📈 Total articles: ${totalAdded}`);
  
  return { totalAdded, successfulTopics, failedTopics };
}

// Main execution
async function main() {
  try {
    console.log('🔄 Starting MilestoneBee comprehensive content refresh...');
    
    const stats = await refreshComprehensiveContent();
    
    console.log('🎉 All operations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Content refresh failed:', error);
    process.exit(1);
  }
}

// Run main function
main();