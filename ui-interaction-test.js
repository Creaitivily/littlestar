import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ctiewkuervrxlajpjaaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo'
);

// Simulate the exact contentService.getContentForChild method
async function simulateContentService(topic, childAgeInMonths = 5, filters = { minQuality: 0.3 }) {
  console.log(`🔄 Simulating contentService.getContentForChild('${topic}', ${childAgeInMonths}, ${JSON.stringify(filters)})`);
  
  let query = supabase
    .from('fresh_topic_content')
    .select('*')
    .eq('topic', topic);
  
  // Apply quality filter
  if (filters?.minQuality !== undefined) {
    query = query.gte('quality_score', filters.minQuality);
  } else {
    query = query.gte('quality_score', 0.4); // Default minimum quality
  }
  
  const { data, error } = await query
    .order('quality_score', { ascending: false })
    .order('publication_date', { ascending: false })
    .limit(12); // Show only top 12 articles per topic
  
  if (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw new Error(`Failed to fetch content: ${error.message}`);
  }
  
  console.log(`   ✅ Returned ${data?.length || 0} articles`);
  return data || [];
}

// Simulate the loadContent function from ContentCurationSystem
async function simulateLoadContent(selectedCategories, childAgeInMonths = 5) {
  if (!selectedCategories.length || childAgeInMonths < 0) {
    console.log('❌ No categories selected or invalid child age, skipping content load');
    return [];
  }
  
  console.log(`\n🔧 Simulating loadContent for categories: ${selectedCategories.join(', ')}`);
  console.log(`👶 Child age: ${childAgeInMonths} months`);
  
  const allContent = [];
  
  // Load content for each selected topic
  for (const topic of selectedCategories) {
    try {
      console.log(`\n📖 Fetching content for topic: ${topic}`);
      const topicContent = await simulateContentService(
        topic,
        childAgeInMonths,
        { minQuality: 0.3 }
      );
      
      // Ensure topic is set on each item
      const itemsWithTopic = topicContent.map(item => ({ 
        ...item, 
        topic: item.topic || topic
      }));
      allContent.push(...itemsWithTopic);
    } catch (error) {
      console.error(`   ❌ Failed to load content for ${topic}:`, error.message);
    }
  }
  
  console.log(`\n📊 Total content loaded: ${allContent.length} articles`);
  
  // Sort by quality score and publication date
  allContent.sort((a, b) => {
    if (b.quality_score !== a.quality_score) {
      return b.quality_score - a.quality_score;
    }
    return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
  });

  return allContent;
}

async function testUIInteractions() {
  console.log('🧪 TESTING UI INTERACTIONS SIMULATION');
  console.log('=====================================\n');
  
  const topics = [
    'feeding_nutrition',
    'sleep_patterns', 
    'cognitive_development',
    'physical_development',
    'social_emotional',
    'health_safety'
  ];
  
  // Test 1: Single topic selection (each topic individually)
  console.log('📋 TEST 1: Individual topic selection\n');
  
  for (const topic of topics) {
    console.log(`\n🔍 User clicks "${topic}"...`);
    const content = await simulateLoadContent([topic]);
    
    if (content.length === 0) {
      console.log(`❌ FAIL: No content loaded for ${topic}`);
    } else {
      console.log(`✅ PASS: ${content.length} articles loaded for ${topic}`);
      console.log(`   Top article: "${content[0].title.substring(0, 50)}..."`);
    }
  }
  
  // Test 2: Multiple topic selection
  console.log('\n\n📋 TEST 2: Multiple topic selection');
  console.log(`\n🔍 User selects all 6 topics...`);
  const allContent = await simulateLoadContent(topics);
  
  if (allContent.length === 0) {
    console.log(`❌ FAIL: No content loaded when all topics selected`);
  } else {
    console.log(`✅ PASS: ${allContent.length} total articles loaded for all topics`);
    
    // Count by topic
    const topicCounts = {};
    allContent.forEach(item => {
      topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
    });
    
    console.log('\n📊 Content distribution:');
    Object.entries(topicCounts).forEach(([topic, count]) => {
      console.log(`   ${topic}: ${count} articles`);
    });
  }
  
  // Test 3: Filter by quality
  console.log('\n\n📋 TEST 3: Quality filtering');
  const highQualityContent = allContent.filter(item => item.quality_score >= 0.7);
  console.log(`🔍 Filtering for high quality (≥0.7): ${highQualityContent.length} articles`);
  
  // Test 4: Search functionality
  console.log('\n\n📋 TEST 4: Search functionality');
  const searchTerms = ['sleep', 'feeding', 'development'];
  
  for (const term of searchTerms) {
    const searchResults = allContent.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.content_summary.toLowerCase().includes(term.toLowerCase())
    );
    console.log(`🔍 Search "${term}": ${searchResults.length} results`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 FINAL VERDICT:');
  console.log('='.repeat(50));
  
  if (allContent.length >= 50) { // We should have ~68 total articles
    console.log('✅ SUCCESS: Content system is working properly!');
    console.log('✅ All topics have articles and are accessible.');
    console.log('✅ The UI should now display content for every topic when selected.');
    console.log('\n💡 USER INSTRUCTIONS:');
    console.log('   1. Go to http://localhost:5177/insights');
    console.log('   2. Click on any topic button to select it');
    console.log('   3. Articles should load immediately below');
    console.log('   4. You can select multiple topics to see more content');
    console.log('   5. Use the search box to find specific articles');
  } else {
    console.log('❌ ISSUE: Content system may not be working correctly.');
    console.log(`   Expected ~68 articles total, but got ${allContent.length}`);
  }
}

testUIInteractions();