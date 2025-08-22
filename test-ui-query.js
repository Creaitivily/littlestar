import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ctiewkuervrxlajpjaaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo'
);

// Simulate exactly what the UI component does
async function simulateUIQuery(topic) {
  console.log(`\n🔍 Simulating UI query for topic: ${topic}`);
  
  const { data, error } = await supabase
    .from('fresh_topic_content')
    .select('*')
    .eq('topic', topic)
    .gte('quality_score', 0.4)
    .order('quality_score', { ascending: false })
    .order('publication_date', { ascending: false })
    .limit(12);
  
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('Full error:', error);
    return [];
  }
  
  console.log(`✅ Found ${data?.length || 0} articles`);
  return data || [];
}

async function testAllTopics() {
  console.log('🧪 Testing exactly what the UI ContentCurationSystem does...\n');
  
  // These are the exact IDs from contentCategories in ContentCurationSystem.tsx
  const uiTopics = [
    { id: 'feeding_nutrition', name: 'Feeding & Nutrition' },
    { id: 'sleep_patterns', name: 'Sleep & Rest' },
    { id: 'cognitive_development', name: 'Learning & Development' },
    { id: 'physical_development', name: 'Motor Skills' },
    { id: 'social_emotional', name: 'Emotions & Social' },
    { id: 'health_safety', name: 'Health & Safety' }
  ];
  
  for (const topic of uiTopics) {
    const results = await simulateUIQuery(topic.id);
    
    if (results.length === 0) {
      console.log(`⚠️ WARNING: ${topic.name} (${topic.id}) has NO content!`);
    } else {
      console.log(`👍 ${topic.name} (${topic.id}) has ${results.length} articles`);
      console.log(`   First article: "${results[0].title.substring(0, 50)}..."`);
    }
  }
  
  // Also check if there's any authentication issue
  console.log('\n🔐 Testing authentication state...');
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.log('❌ Not authenticated - using anon access');
  } else {
    console.log('✅ Authenticated as:', authUser?.user?.email || 'unknown');
  }
}

testAllTopics();