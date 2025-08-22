import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ANYCRAWL_API_KEY = process.env.VITE_ANYCRAWL_API_KEY;

async function addHealthSafetyContent() {
  console.log('🔎 Adding health_safety articles...');
  
  // First check existing URLs to avoid duplicates
  const { data: existing } = await supabase
    .from('topic_content')
    .select('url');
  
  const existingUrls = new Set(existing?.map(item => item.url) || []);
  console.log(`Found ${existingUrls.size} existing URLs in database`);
  
  const queries = [
    'newborn health checkup schedule',
    'baby illness warning signs',
    'safe sleep practices for infants',
    'baby first aid basics',
    'childproofing home checklist'
  ];
  
  let allArticles = [];
  
  for (const query of queries) {
    console.log(`  → Searching: "${query}"`);
    
    try {
      const response = await axios.post('https://api.anycrawl.dev/v1/search', {
        query,
        engine: 'google',
        limit: 10,
        country: 'US',
        language: 'en'
      }, {
        headers: {
          'Authorization': `Bearer ${ANYCRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data.success && response.data.data) {
        const results = response.data.data.filter(item => 
          item.url && 
          item.description && 
          item.description.length > 50 &&
          item.source !== 'Google Suggestions' &&
          !item.url.includes('youtube.com') &&
          !item.url.includes('facebook.com') &&
          !item.url.includes('pinterest.com') &&
          !existingUrls.has(item.url)  // Skip URLs already in database
        );

        console.log(`    Found ${results.length} new valid results`);

        const articles = results.slice(0, 3).map((result) => ({
          topic: 'health_safety',
          age_range: 'all',
          title: result.title.slice(0, 200),
          url: result.url,
          content_summary: result.description.slice(0, 300) + '...',
          source_domain: new URL(result.url).hostname.replace('www.', ''),
          publication_date: new Date().toISOString().split('T')[0],
          quality_score: ['aap.org', 'cdc.gov', 'mayoclinic.org', 'healthychildren.org'].some(source => result.url.includes(source)) ? 0.9 : 0.7,
          refresh_cycle: 1,
          is_active: true,
          image_url: null,
          reading_time: 6,
          author: 'Medical Expert',
          tags: ['health', 'safety', query.split(' ')[0]]
        }));

        // Add to existing URLs set to avoid duplicates within this run
        articles.forEach(article => existingUrls.add(article.url));
        
        allArticles = allArticles.concat(articles);
      }
    } catch (error) {
      console.error(`    ❌ Failed to search "${query}":`, error.message);
    }
    
    // Rate limit between queries
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Final duplicate check
  const uniqueArticles = Array.from(
    new Map(allArticles.map(item => [item.url, item])).values()
  );

  if (uniqueArticles.length > 0) {
    console.log(`\n💾 Inserting ${uniqueArticles.length} unique articles...`);
    
    const { data, error } = await supabase
      .from('topic_content')
      .insert(uniqueArticles)
      .select();

    if (error) {
      console.error(`❌ Failed to insert health_safety:`, error.message);
      return 0;
    } else {
      console.log(`✅ Successfully added ${data.length} articles for health_safety`);
      return data.length;
    }
  } else {
    console.log('⚠️ No new unique articles found to add');
    return 0;
  }
}

async function main() {
  console.log('🚀 Fixing health_safety topic content...\n');
  
  const added = await addHealthSafetyContent();
  
  console.log(`\n🎉 Completed! Added ${added} articles`);
  
  // Show final summary
  const { data: summary } = await supabase
    .from('topic_content')
    .select('topic')
    .eq('is_active', true);
  
  const topicCounts = {};
  summary?.forEach(item => {
    topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
  });
  
  console.log('\n📊 Final content by topic:');
  Object.entries(topicCounts).forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} articles`);
  });
}

main();