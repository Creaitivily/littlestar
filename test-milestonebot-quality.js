/**
 * MilestoneBot Professional Transformation Test Suite
 * Tests the quality and compliance of the new professional, evidence-based AI assistant
 */

const { openRouterService } = require('./src/lib/openRouterService.ts');

// Mock child context for testing
const mockChildContext = {
  id: 'test-child-1',
  name: 'Emma',
  ageMonths: 6,
  ageDisplay: '6 months',
  userCountry: 'US',
  latestGrowth: {
    heightPercentile: 75,
    weightPercentile: 80,
    measurementDate: '2024-08-15'
  },
  vaccinationStatus: {
    upToDate: true,
    overdue: 0,
    recent: []
  },
  milestoneProgress: {
    percentage: 85,
    recentAchievements: [],
    concerning: []
  }
};

// Test cases covering the key transformation requirements
const testCases = [
  // EMERGENCY DETECTION TESTS
  {
    category: 'Emergency Detection',
    query: 'Emma is having difficulty breathing and won\'t wake up',
    expectedType: 'emergency',
    requirements: ['immediate action', 'call emergency', 'no emotional language']
  },
  {
    category: 'Emergency Detection',
    query: 'My baby has a fever of 105 degrees',
    expectedType: 'emergency',
    requirements: ['urgent care', 'professional evaluation', 'specific instructions']
  },

  // PROFESSIONAL TONE TESTS
  {
    category: 'Professional Tone',
    query: 'How much should Emma be sleeping at 6 months?',
    expectedType: 'professional',
    requirements: ['no emojis', 'evidence citations', 'specific metrics', '<150 words']
  },
  {
    category: 'Professional Tone',
    query: 'What milestones should Emma have reached by now?',
    expectedType: 'professional',
    requirements: ['clinical terminology', 'AAP/CDC references', 'specific timelines']
  },

  // NUTRITIONAL GUIDANCE TESTS
  {
    category: 'Nutritional Assessment',
    query: 'How much should Emma be eating at 6 months?',
    expectedType: 'professional',
    requirements: ['specific volumes', 'WHO/AAP guidelines', 'nutritional requirements']
  },

  // CONCISENESS TESTS
  {
    category: 'Response Length',
    query: 'Tell me about sleep training methods for Emma',
    expectedType: 'professional',
    requirements: ['<150 words', 'evidence-based', 'specific recommendations']
  },

  // EVIDENCE-BASED RESPONSES
  {
    category: 'Evidence Citations',
    query: 'Is Emma\'s development on track?',
    expectedType: 'professional',
    requirements: ['CDC milestones', 'percentile references', 'clinical assessment']
  }
];

// Response quality validation functions
function validateResponseQuality(response, requirements) {
  const content = response.content;
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  const results = {
    wordCount,
    passedRequirements: [],
    failedRequirements: [],
    overallScore: 0
  };

  // Check word count requirement
  if (requirements.includes('<150 words')) {
    if (wordCount <= 150) {
      results.passedRequirements.push('Word count ≤150');
    } else {
      results.failedRequirements.push(`Word count ${wordCount} > 150`);
    }
  }

  // Check for no emojis
  if (requirements.includes('no emojis')) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    if (!emojiRegex.test(content)) {
      results.passedRequirements.push('No emojis detected');
    } else {
      results.failedRequirements.push('Contains emojis');
    }
  }

  // Check for evidence citations
  if (requirements.includes('evidence citations') || requirements.includes('AAP/CDC references')) {
    const evidencePatterns = [
      /AAP|American Academy of Pediatrics/gi,
      /WHO|World Health Organization/gi,
      /CDC|Centers for Disease Control/gi,
      /studies show|research indicates|according to/gi
    ];
    const hasEvidence = evidencePatterns.some(pattern => pattern.test(content));
    if (hasEvidence) {
      results.passedRequirements.push('Evidence citations present');
    } else {
      results.failedRequirements.push('Missing evidence citations');
    }
  }

  // Check for specific metrics
  if (requirements.includes('specific metrics')) {
    const metricsPattern = /\b\d+\s*(hours?|minutes?|ml|oz|months?|weeks?|grams?|pounds?)\b/gi;
    if (metricsPattern.test(content)) {
      results.passedRequirements.push('Specific metrics included');
    } else {
      results.failedRequirements.push('Missing specific metrics');
    }
  }

  // Check for professional language (absence of emotional phrases)
  if (requirements.includes('clinical terminology')) {
    const emotionalPhrases = ['amazing', 'wonderful', 'great job', 'you\'re doing', 'don\'t worry'];
    const hasEmotionalLanguage = emotionalPhrases.some(phrase => 
      content.toLowerCase().includes(phrase.toLowerCase())
    );
    if (!hasEmotionalLanguage) {
      results.passedRequirements.push('Professional tone maintained');
    } else {
      results.failedRequirements.push('Contains emotional language');
    }
  }

  // Calculate overall score
  const totalRequirements = results.passedRequirements.length + results.failedRequirements.length;
  results.overallScore = totalRequirements > 0 ? 
    results.passedRequirements.length / totalRequirements : 0;

  return results;
}

// Main test execution function
async function runQualityTests() {
  console.log('🔬 MILESTONEBOT PROFESSIONAL TRANSFORMATION TEST SUITE\n');
  console.log('Testing new professional, evidence-based AI assistant...\n');
  
  const results = {
    totalTests: testCases.length,
    passed: 0,
    failed: 0,
    details: []
  };

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.category}`);
    console.log(`Query: "${testCase.query}"`);
    console.log('Requirements:', testCase.requirements.join(', '));

    try {
      // Process the query using the updated system
      const response = await openRouterService.processHealthQuery(
        testCase.query,
        'test-user-id',
        mockChildContext
      );

      console.log(`\n📤 Response (${response.wordCount || 'N/A'} words):`);
      console.log(response.content);
      console.log(`\n📊 Response Type: ${response.responseType}`);
      console.log(`Emergency Detected: ${response.emergencyDetected}`);
      console.log(`Professional Tone: ${response.professionalTone ?? 'N/A'}`);
      console.log(`Evidence Citations: ${response.evidenceCitations ?? 'N/A'}`);

      // Validate response quality
      const validation = validateResponseQuality(response, testCase.requirements);
      
      console.log('\n✅ PASSED REQUIREMENTS:');
      validation.passedRequirements.forEach(req => console.log(`  ✓ ${req}`));
      
      if (validation.failedRequirements.length > 0) {
        console.log('\n❌ FAILED REQUIREMENTS:');
        validation.failedRequirements.forEach(req => console.log(`  ✗ ${req}`));
      }

      console.log(`\n📈 Quality Score: ${(validation.overallScore * 100).toFixed(1)}%`);
      
      // Determine test result
      const testPassed = validation.overallScore >= 0.7; // 70% threshold
      if (testPassed) {
        results.passed++;
        console.log('🟢 TEST PASSED');
      } else {
        results.failed++;
        console.log('🔴 TEST FAILED');
      }

      results.details.push({
        category: testCase.category,
        query: testCase.query,
        passed: testPassed,
        score: validation.overallScore,
        wordCount: response.wordCount,
        response: response.content.substring(0, 100) + '...'
      });

    } catch (error) {
      console.error(`\n❌ TEST ERROR: ${error.message}`);
      results.failed++;
      results.details.push({
        category: testCase.category,
        query: testCase.query,
        passed: false,
        error: error.message
      });
    }

    console.log('\n' + '='.repeat(80));
  }

  // Print final results
  console.log('\n🎯 FINAL TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.totalTests}`);
  console.log(`Passed: ${results.passed} (${(results.passed/results.totalTests*100).toFixed(1)}%)`);
  console.log(`Failed: ${results.failed} (${(results.failed/results.totalTests*100).toFixed(1)}%)`);
  
  const overallSuccess = results.passed / results.totalTests >= 0.8;
  console.log(`\n${overallSuccess ? '🎉' : '⚠️'} Overall Result: ${overallSuccess ? 'SUCCESS' : 'NEEDS IMPROVEMENT'}`);

  if (overallSuccess) {
    console.log('\n✅ MilestoneBot transformation SUCCESSFUL!');
    console.log('✓ Professional tone implemented');
    console.log('✓ Response length optimized');
    console.log('✓ Evidence-based guidance active');
    console.log('✓ Emergency detection preserved');
  } else {
    console.log('\n⚠️ MilestoneBot transformation needs refinement:');
    results.details
      .filter(result => !result.passed)
      .forEach(result => {
        console.log(`- ${result.category}: ${result.error || 'Quality standards not met'}`);
      });
  }

  return results;
}

// Export for potential CLI usage
if (require.main === module) {
  runQualityTests().catch(console.error);
}

module.exports = { runQualityTests, validateResponseQuality };