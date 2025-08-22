import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ctiewkuervrxlajpjaaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo'
);

async function testTopics() {
  console.log('🔍 Testing each topic in fresh_topic_content view...\n');
  
  const topics = [
    'feeding_nutrition',
    'sleep_patterns',
    'cognitive_development',
    'physical_development',
    'social_emotional',
    'health_safety'
  ];
  
  for (const topic of topics) {
    console.log(`\n📊 Testing ${topic}:`);
    
    // Test direct query
    const { data, error } = await supabase
      .from('fresh_topic_content')
      .select('*')
      .eq('topic', topic)
      .gte('quality_score', 0.4)
      .order('quality_score', { ascending: false })
      .limit(12);
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else {
      console.log(`  ✅ Found ${data?.length || 0} articles`);
      if (data && data.length > 0) {
        console.log(`  📋 Sample titles:`);
        data.slice(0, 3).forEach(item => {
          console.log(`     - ${item.title.substring(0, 60)}...`);
        });
      }
    }
  }
  
  // Also test the raw table
  console.log('\n\n📊 Testing raw topic_content table:');
  const { data: rawData } = await supabase
    .from('topic_content')
    .select('topic, COUNT(*)')
    .eq('is_active', true);
    
  const counts = {};
  for (const topic of topics) {
    const { data, error } = await supabase
      .from('topic_content')
      .select('id')
      .eq('topic', topic)
      .eq('is_active', true);
    
    counts[topic] = data?.length || 0;
  }
  
  console.log('\nRaw table counts:');
  Object.entries(counts).forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} articles`);
  });
}

testTopics();