import { openRouterService } from './openRouterService'
import type { ChildHealthContext } from './openRouterService'

// Test function to verify MilestoneBot integration
export async function testMilestoneBotIntegration() {
  const testChildContext: ChildHealthContext = {
    id: 'test-child',
    name: 'Test Baby',
    ageMonths: 6,
    ageDisplay: '6 months'
  }

  const testUserId = 'test-user'
  const testQuery = 'When should my baby start solid foods?'

  try {
    console.log('🧪 Testing MilestoneBot integration...')
    console.log('Query:', testQuery)
    console.log('Child context:', testChildContext)

    const response = await openRouterService.processHealthQuery(
      testQuery,
      testUserId,
      testChildContext
    )

    console.log('✅ MilestoneBot response:', response)
    return response
  } catch (error) {
    console.error('❌ MilestoneBot test failed:', error)
    throw error
  }
}

// Run test if called directly
if (typeof window !== 'undefined') {
  (window as any).testMilestoneBot = testMilestoneBotIntegration
  console.log('💡 Test function available: window.testMilestoneBot()')
}