// Test the balanced 80% clinical + 20% compassionate tone
console.log('🧪 TESTING BALANCED TONE (80% Clinical + 20% Compassionate)\n');

// Mock validation function with updated criteria
function validateBalancedTone(content) {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Allow compassionate acknowledgments
  const allowedCompassionate = [
    'common', 'concerning', 'understandable', 'challenging', 'difficult',
    'seeking guidance', 'shows care', 'this concern', 'disruptions', 'struggles',
    'I understand', 'parenting concerns', 'can be concerning'
  ];
  
  // Still block excessive emotional language
  const excessiveEmotional = [
    'amazing', 'wonderful', 'great job', 'you\'re doing great', 'don\'t worry',
    '😊', '❤️', '🎉', '😄', '💝', '🐝', 'excited', 'celebration', 'fantastic'
  ];
  
  const hasCompassionate = allowedCompassionate.some(phrase =>
    content.toLowerCase().includes(phrase.toLowerCase())
  );
  
  const hasExcessiveEmotional = excessiveEmotional.some(phrase => 
    content.toLowerCase().includes(phrase.toLowerCase())
  );
  
  // Count evidence citations
  const evidencePatterns = [
    /AAP|American Academy of Pediatrics/gi,
    /WHO|World Health Organization/gi,
    /CDC|Centers for Disease Control/gi,
    /\\b\\d+\\s*(hours?|minutes?|ml|oz|months?|weeks?)\\b/gi,
    /studies? show|research indicates|according to/gi
  ];
  const evidenceCitations = evidencePatterns.reduce((count, pattern) => {
    const matches = content.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  const professionalTone = !hasExcessiveEmotional && (evidenceCitations > 0 || hasCompassionate);
  const qualityScore = (professionalTone ? 0.5 : 0) + 
                      (evidenceCitations * 0.1) + 
                      (hasCompassionate ? 0.1 : 0) +
                      (wordCount <= 150 ? 0.3 : 0);
  
  return {
    wordCount,
    professionalTone,
    evidenceCitations,
    hasCompassionate,
    hasExcessiveEmotional,
    qualityScore: Math.min(1, qualityScore)
  };
}

// Test different response examples
const responses = [
  {
    type: 'IDEAL BALANCED',
    content: `Sleep disruptions at this age are common and concerning for parents. For Emma at 6 months, sleep requirements are 12-15 hours per day (AAP guidelines).

**Evidence-based recommendations:**
- Sleep environment: 68-70°F, dark, quiet
- Consistent bedtime routine 30-45 minutes
- Sleep consolidation typically begins 4-6 months

Monitor patterns and consult your pediatrician if significant deviations occur. Seeking guidance shows good care for Emma.`
  },
  {
    type: 'TOO CLINICAL (no compassion)',
    content: `For Emma at 6 months, sleep requirements: 12-15 hours per day (AAP guidelines).

**Evidence-based interventions:**
- Sleep environment: 68-70°F, dark, quiet  
- Consistent bedtime routine 30-45 minutes
- Sleep consolidation typically begins 4-6 months

Monitor sleep patterns and consult pediatrician if deviations from norms occur.`
  },
  {
    type: 'TOO EMOTIONAL (excessive)',
    content: `I understand sleep challenges with Emma can be so exhausting—you're doing an amazing job! 😊 Don't worry, you're not alone in this wonderful parenting journey!

For Emma at 6 months, sleep needs are 12-15 hours per day. Every family's sleep journey is unique, and with patience you'll find what works best for Emma!

You're being such a caring parent by seeking help! 🎉`
  },
  {
    type: 'GOOD WELCOME MESSAGE',
    content: `I understand that parenting questions can be concerning. I provide evidence-based guidance using AAP, WHO, and CDC standards for developmental milestones, nutrition, sleep patterns, and health. What can I help you with today?`
  }
];

console.log('📋 TESTING BALANCED TONE EXAMPLES:\n');

responses.forEach((response, index) => {
  console.log(`${index + 1}. ${response.type}`);
  const analysis = validateBalancedTone(response.content);
  
  console.log(`   Word Count: ${analysis.wordCount} ${analysis.wordCount <= 150 ? '✅' : '❌'}`);
  console.log(`   Professional Tone: ${analysis.professionalTone ? '✅' : '❌'}`);
  console.log(`   Evidence Citations: ${analysis.evidenceCitations} ${analysis.evidenceCitations > 0 ? '✅' : '📊'}`);
  console.log(`   Has Compassion: ${analysis.hasCompassionate ? '💙' : '❌'}`);
  console.log(`   Excessive Emotional: ${analysis.hasExcessiveEmotional ? '❌' : '✅'}`);
  console.log(`   Quality Score: ${(analysis.qualityScore * 100).toFixed(0)}%`);
  
  // Assess balance
  const clinicalPercent = analysis.evidenceCitations > 0 ? 80 : 60;
  const compassionPercent = analysis.hasCompassionate ? 20 : 0;
  const isBalanced = analysis.hasCompassionate && !analysis.hasExcessiveEmotional && analysis.evidenceCitations > 0;
  
  console.log(`   Tone Balance: Clinical ${clinicalPercent}% + Compassion ${compassionPercent}% = ${isBalanced ? '🎯 IDEAL' : '⚖️ Needs adjustment'}`);
  console.log('');
});

console.log('-'.repeat(60));
console.log('\n🎯 TONE BALANCE CRITERIA:\n');
console.log('✅ GOOD BALANCED RESPONSES SHOULD HAVE:');
console.log('   • Brief empathetic acknowledgment (1 sentence)');
console.log('   • Clinical evidence and specific metrics'); 
console.log('   • Compassionate phrases like "concerning", "common", "I understand"');
console.log('   • NO emojis, excessive praise, or celebratory language');
console.log('   • Under 150 words total');

console.log('\n❌ AVOID:');
console.log('   • Pure clinical responses with no empathy');
console.log('   • Excessive emotional language and praise');
console.log('   • Emojis and celebratory phrases');
console.log('   • Responses over 150 words');

console.log('\n🏆 PERFECT FORMULA:');
console.log('   1. Brief acknowledgment: "This concern is understandable"');
console.log('   2. Clinical evidence: "For [child] at [age], [AAP guidelines]..."');
console.log('   3. Specific recommendations with metrics');
console.log('   4. Professional close acknowledging parent effort');

console.log('\n✅ BALANCED TONE IMPLEMENTATION COMPLETE!');