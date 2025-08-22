import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ANYCRAWL_API_KEY = process.env.VITE_ANYCRAWL_API_KEY;

const TOPICS = {
  feeding_nutrition: {
    query: 'best advice on baby feeding',
    trustedSources: ['aap.org', 'mayoclinic.org', 'cdc.gov', 'healthychildren.org']
  },
  sleep_patterns: {
    query: 'best advice on baby sleep',
    trustedSources: ['sleepfoundation.org', 'aap.org', 'healthychildren.org']
  },
  cognitive_development: {
    query: 'best advice on baby cognitive development',
    trustedSources: ['zerotothree.org', 'aap.org', 'cdc.gov']
  },
  physical_development: {
    query: 'best advice on baby physical development',
    trustedSources: ['aap.org', 'cdc.gov', 'healthychildren.org']
  },
  social_emotional: {
    query: 'best advice on baby emotional development',
    trustedSources: ['zerotothree.org', 'aap.org', 'healthychildren.org']
  },
  health_safety: {
    query: 'best advice on baby health',
    trustedSources: ['aap.org', 'cdc.gov', 'mayoclinic.org']
  }
};

async function searchAndAddContent(topic, config) {
  console.log(`🔎 Searching for ${topic}...`);
  
  try {
    const response = await axios.post('https://api.anycrawl.dev/v1/search', {
      query: config.query,
      engine: 'google',
      limit: 8,
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
        item.source !== 'Google Suggestions'
      );

      console.log(`Found ${results.length} valid results for ${topic}`);

      const articles = results.map(result => ({
        topic,
        age_range: 'all',
        title: result.title.slice(0, 200),
        url: result.url,
        content_summary: result.description.slice(0, 300) + '...',
        source_domain: new URL(result.url).hostname.replace('www.', ''),
        publication_date: new Date().toISOString().split('T')[0],
        quality_score: config.trustedSources.some(source => result.url.includes(source)) ? 0.8 : 0.6,
        refresh_cycle: 1,
        is_active: true,
        image_url: null,
        reading_time: 4,
        author: 'Expert',
        tags: [topic.replace('_', ' ')]
      }));

      if (articles.length > 0) {
        const { error } = await supabase
          .from('topic_content')
          .insert(articles);

        if (error) {
          console.error(`❌ Failed to insert ${topic}:`, error.message);
          return 0;
        } else {
          console.log(`✅ Added ${articles.length} articles for ${topic}`);
          return articles.length;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Failed to process ${topic}:`, error.message);
    return 0;
  }
  
  return 0;
}

async function main() {
  console.log('🚀 Quick populating content database...');
  
  // Clear existing content
  await supabase.from('topic_content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  let totalAdded = 0;
  
  for (const [topic, config] of Object.entries(TOPICS)) {
    const added = await searchAndAddContent(topic, config);
    totalAdded += added;
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Completed! Added ${totalAdded} total articles`);
  
  // Show summary
  const { data: summary } = await supabase
    .from('topic_content')
    .select('topic')
    .eq('is_active', true);
  
  const topicCounts = {};
  summary?.forEach(item => {
    topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
  });
  
  console.log('📊 Content by topic:');
  Object.entries(topicCounts).forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} articles`);
  });
}

main();