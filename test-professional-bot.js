import { openRouterService } from './src/lib/openRouterService.js';

// Test new professional MilestoneBot responses
async function testProfessionalBot() {
  console.log('🧪 TESTING PROFESSIONAL MILESTONEBOT\n');

  const childContext = {
    id: 'test-child',
    name: 'Emma',
    ageMonths: 6,
    ageDisplay: '6 months',
    userCountry: 'US'
  };

  const testCases = [
    {
      name: 'Sleep Question',
      query: 'My baby is not sleeping well at night',
      expectedFeatures: ['6 months', 'sleep requirements', 'AAP', 'hours per day']
    },
    {
      name: 'Feeding Question', 
      query: 'When should I start solid foods?',
      expectedFeatures: ['6 months', 'solid foods', 'AAP', 'WHO', 'iron-rich']
    },
    {
      name: 'Development Question',
      query: 'Is my baby developing normally?',
      expectedFeatures: ['6 months', 'milestones', 'motor skills', 'CDC']
    },
    {
      name: 'Emergency Question',
      query: 'My baby has a high fever and difficulty breathing',
      expectedFeatures: ['emergency', '911', 'immediate', 'contact']
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 TEST: ${testCase.name}`);
    console.log(`Query: "${testCase.query}"`);
    
    try {
      const response = await openRouterService.processHealthQuery(
        testCase.query,
        'test-user-id',
        childContext
      );

      console.log(`\n✅ RESPONSE (${response.wordCount || 'N/A'} words):`);
      console.log(`"${response.content}"`);
      
      console.log(`\n📊 QUALITY METRICS:`);
      console.log(`- Word Count: ${response.wordCount || 'N/A'}`);
      console.log(`- Professional Tone: ${response.professionalTone ? '✅' : '❌'}`);
      console.log(`- Evidence Citations: ${response.evidenceCitations || 0}`);
      console.log(`- Emergency Detected: ${response.emergencyDetected ? '⚠️' : '✅'}`);
      console.log(`- Response Type: ${response.responseType}`);

      // Check expected features
      console.log(`\n🔍 FEATURE CHECK:`);
      testCase.expectedFeatures.forEach(feature => {
        const found = response.content.toLowerCase().includes(feature.toLowerCase());
        console.log(`- ${feature}: ${found ? '✅' : '❌'}`);
      });

      // Quality validation
      const isUnder150Words = !response.wordCount || response.wordCount <= 150;
      const hasProfessionalTone = response.professionalTone !== false;
      const hasEvidence = !response.evidenceCitations || response.evidenceCitations > 0;

      console.log(`\n📈 QUALITY SCORE:`);
      console.log(`- Length (≤150 words): ${isUnder150Words ? '✅' : '❌'}`);
      console.log(`- Professional tone: ${hasProfessionalTone ? '✅' : '❌'}`);
      console.log(`- Evidence-based: ${hasEvidence ? '✅' : '❌'}`);

    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n' + '-'.repeat(60));
  }

  console.log('\n🎉 PROFESSIONAL BOT TESTING COMPLETE');
}

testProfessionalBot();