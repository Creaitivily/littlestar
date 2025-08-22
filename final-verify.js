import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ctiewkuervrxlajpjaaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo'
);

async function verifyAllTopics() {
  console.log('🔍 FINAL VERIFICATION - Testing all 6 topics\n');
  
  const topics = [
    'feeding_nutrition',
    'sleep_patterns', 
    'cognitive_development',
    'physical_development',
    'social_emotional',
    'health_safety'
  ];
  
  let allWorking = true;
  const results = {};
  
  for (const topic of topics) {
    console.log(`\n📊 Testing ${topic}:`);
    
    try {
      // Query exactly like the UI does
      const { data, error } = await supabase
        .from('fresh_topic_content')
        .select('*')
        .eq('topic', topic)
        .gte('quality_score', 0.3)
        .order('quality_score', { ascending: false })
        .order('publication_date', { ascending: false })
        .limit(12);
      
      if (error) {
        console.log(`  ❌ DATABASE ERROR: ${error.message}`);
        allWorking = false;
        results[topic] = { status: 'error', error: error.message };
      } else if (!data || data.length === 0) {
        console.log(`  ❌ NO CONTENT FOUND`);
        allWorking = false;
        results[topic] = { status: 'empty', count: 0 };
      } else {
        console.log(`  ✅ SUCCESS: ${data.length} articles found`);
        console.log(`     First article: "${data[0].title.substring(0, 50)}..."`);
        console.log(`     Quality scores: ${data.slice(0,3).map(a => a.quality_score.toFixed(2)).join(', ')}`);
        results[topic] = { status: 'success', count: data.length };
      }
    } catch (err) {
      console.log(`  ❌ NETWORK ERROR: ${err.message}`);
      allWorking = false;
      results[topic] = { status: 'network_error', error: err.message };
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL RESULTS:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([topic, result]) => {
    const icon = result.status === 'success' ? '✅' : '❌';
    const count = result.count ? ` (${result.count} articles)` : '';
    console.log(`${icon} ${topic}${count}`);
  });
  
  if (allWorking) {
    console.log('\n🎉 SUCCESS: All topics have content and are working properly!');
    console.log('The UI should now display articles for every topic.');
  } else {
    console.log('\n⚠️ ISSUES FOUND: Some topics are not working correctly.');
  }
  
  return allWorking;
}

verifyAllTopics();