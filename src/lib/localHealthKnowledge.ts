import { supabase } from './supabase'
import { healthDataService } from './healthDataService'

// Local knowledge base service for cost optimization
interface LocalKnowledgeEntry {
  category: string
  subcategory: string
  ageRangeMin: number
  ageRangeMax: number
  questionPatterns: string[]
  responseTemplate: string
  source: string
  confidenceLevel: number
}

interface ChildSummary {
  id: string
  name: string
  ageMonths: number
  ageDisplay: string
  latestGrowth?: {
    height?: number
    weight?: number
    heightPercentile?: number
    weightPercentile?: number
    bmiPercentile?: number
    measurementDate: string
  }
  vaccinationStatus?: {
    upToDate: boolean
    overdue: number
  }
  milestoneProgress?: {
    percentage: number
    concerning: number
  }
}

class LocalHealthKnowledgeService {
  // Cache for knowledge base entries to avoid repeated database queries
  private knowledgeCache: Map<string, LocalKnowledgeEntry[]> = new Map()
  
  // Common growth percentile interpretations (90% of growth questions)
  private interpretGrowthPercentile(percentile: number, metric: 'height' | 'weight' | 'bmi'): string {
    if (percentile < 3) {
      return `below the 3rd percentile, which may warrant discussion with your pediatrician`
    } else if (percentile <= 10) {
      return `in the lower range (${percentile}th percentile) but still within normal variation for many children`
    } else if (percentile <= 25) {
      return `in the 25th percentile range, which is perfectly normal`
    } else if (percentile <= 75) {
      return `in the middle range (${percentile}th percentile), which is excellent`
    } else if (percentile <= 90) {
      return `in the upper range (${percentile}th percentile), which is great`
    } else if (percentile <= 97) {
      return `in the 97th percentile range, indicating above-average ${metric}`
    } else {
      return `above the 97th percentile, which may warrant discussion with your pediatrician to ensure healthy growth`
    }
  }

  // Generate local growth analysis (saves ~$0.02 per query)
  async generateGrowthAnalysis(childSummary: ChildSummary, query: string): Promise<string | null> {
    if (!childSummary.latestGrowth) return null

    const growth = childSummary.latestGrowth
    const isHeightQuery = /height|tall|short|grow/i.test(query)
    const isWeightQuery = /weight|heavy|light|pounds|kg/i.test(query)
    const isBMIQuery = /bmi|body mass|overweight|underweight|obesity/i.test(query)

    let response = `Based on the latest measurements for ${childSummary.name} (${childSummary.ageDisplay}):\n\n`

    if (isHeightQuery && growth.height && growth.heightPercentile) {
      const interpretation = this.interpretGrowthPercentile(growth.heightPercentile, 'height')
      response += `**Height Analysis:**\n${childSummary.name} is ${growth.height}cm tall, which is ${interpretation}. The CDC growth charts show this puts ${childSummary.name} taller than ${growth.heightPercentile}% of children the same age.\n\n`
    }

    if (isWeightQuery && growth.weight && growth.weightPercentile) {
      const interpretation = this.interpretGrowthPercentile(growth.weightPercentile, 'weight')
      response += `**Weight Analysis:**\n${childSummary.name} weighs ${growth.weight}kg, which is ${interpretation}. This means ${childSummary.name} weighs more than ${growth.weightPercentile}% of children the same age.\n\n`
    }

    if (isBMIQuery && growth.bmiPercentile && childSummary.ageMonths >= 24) {
      const bmi = growth.weight && growth.height ? (growth.weight / Math.pow(growth.height / 100, 2)).toFixed(1) : 'N/A'
      const interpretation = this.interpretGrowthPercentile(growth.bmiPercentile, 'bmi')
      response += `**BMI Analysis:**\n${childSummary.name}'s BMI is ${bmi}, which is ${interpretation}. For children over 2 years old, BMI percentiles help assess if weight is appropriate for height.\n\n`
    }

    if (response === `Based on the latest measurements for ${childSummary.name} (${childSummary.ageDisplay}):\n\n`) {
      return null // No relevant growth data found
    }

    response += `**Key Points:**\n• Percentiles between 3rd-97th are considered normal ranges\n• Children grow at different rates and patterns\n• Consistent growth trends are more important than single measurements\n• Growth measured on ${growth.measurementDate}`

    return response
  }

  // Generate vaccination guidance (saves ~$0.015 per query)
  async generateVaccinationGuidance(childSummary: ChildSummary, query: string): Promise<string | null> {
    if (!childSummary.vaccinationStatus) return null

    const isScheduleQuery = /vaccine schedule|when|due|next/i.test(query)
    const isDelayedQuery = /missed|behind|late|overdue/i.test(query)
    const isSafetyQuery = /safe|side effects|reaction/i.test(query)

    let response = `**Vaccination Information for ${childSummary.name} (${childSummary.ageDisplay}):**\n\n`

    if (isScheduleQuery) {
      if (childSummary.vaccinationStatus.upToDate) {
        response += `✅ **Current Status**: ${childSummary.name} is up-to-date with vaccinations according to the CDC schedule.\n\n`
        
        // Add age-appropriate upcoming vaccines
        if (childSummary.ageMonths < 2) {
          response += `**Upcoming Vaccines (2 months):**\n• DTaP (Diphtheria, Tetanus, Pertussis)\n• Hib (Haemophilus influenzae type b)\n• IPV (Polio)\n• PCV13 (Pneumococcal)\n• RV (Rotavirus)\n\n`
        } else if (childSummary.ageMonths < 12) {
          response += `**Next Major Milestone (12 months):**\n• MMR (Measles, Mumps, Rubella)\n• Varicella (Chickenpox)\n• Hepatitis A (first dose)\n\n`
        } else if (childSummary.ageMonths < 15) {
          response += `**Next Vaccines (15-18 months):**\n• DTaP (4th dose)\n• Hepatitis A (second dose)\n\n`
        }
      } else {
        response += `⚠️ **Status**: ${childSummary.name} has ${childSummary.vaccinationStatus.overdue} overdue vaccination(s).\n\n`
        response += `**Recommended Action**: Contact your pediatrician to schedule catch-up vaccines. Most vaccines can be safely given together to help ${childSummary.name} get back on schedule.\n\n`
      }
    }

    if (isDelayedQuery && childSummary.vaccinationStatus.overdue > 0) {
      response += `**Catch-Up Information:**\n• Children can safely receive multiple vaccines at once\n• The CDC provides specific catch-up schedules for different age groups\n• Most delayed vaccines don't need to restart the series\n• Your pediatrician will create a personalized catch-up plan\n\n`
    }

    if (isSafetyQuery) {
      response += `**Vaccine Safety:**\n• Vaccines are among the safest medical products available\n• Common mild reactions: slight fever, fussiness, soreness at injection site\n• Serious reactions are extremely rare (less than 1 in a million)\n• Benefits of vaccination far outweigh risks for almost all children\n• Report any concerning reactions to your pediatrician\n\n`
    }

    response += `📅 **Schedule your appointment** with your pediatrician to discuss ${childSummary.name}'s specific vaccination needs.`

    return response
  }

  // Generate milestone guidance (saves ~$0.01 per query)
  async generateMilestoneGuidance(childSummary: ChildSummary, query: string): Promise<string | null> {
    const isMotorQuery = /crawling|walking|sitting|standing|motor|movement|physical/i.test(query)
    const isLanguageQuery = /talking|words|speech|language|communication|babbling/i.test(query)
    const isSocialQuery = /social|playing|smiling|interaction|behavior/i.test(query)

    let response = `**Developmental Milestones for ${childSummary.name} (${childSummary.ageDisplay}):**\n\n`

    // Age-specific milestone expectations
    const ageMonths = childSummary.ageMonths
    let expectedMilestones: string[] = []

    if (ageMonths <= 3) {
      if (isMotorQuery) expectedMilestones.push("• Holds head up when on tummy", "• Brings hands to mouth", "• Moves arms and legs actively")
      if (isLanguageQuery) expectedMilestones.push("• Makes cooing sounds", "• Responds to loud sounds", "• Begins to babble")
      if (isSocialQuery) expectedMilestones.push("• Begins to smile at people", "• Watches faces with interest", "• Seems happy to see familiar people")
    } else if (ageMonths <= 6) {
      if (isMotorQuery) expectedMilestones.push("• Rolls over in both directions", "• Sits with support", "• Bears some weight on legs")
      if (isLanguageQuery) expectedMilestones.push("• Responds to own name", "• Makes babbling sounds", "• Takes turns making sounds with you")
      if (isSocialQuery) expectedMilestones.push("• Knows familiar faces", "• Likes to play peek-a-boo", "• Shows joy and displeasure")
    } else if (ageMonths <= 12) {
      if (isMotorQuery) expectedMilestones.push("• Sits without support", "• Crawls or scoots", "• Pulls to standing", "• May take first steps")
      if (isLanguageQuery) expectedMilestones.push("• Says 'mama' and 'dada'", "• Understands 'no'", "• Follows simple directions")
      if (isSocialQuery) expectedMilestones.push("• Shows stranger anxiety", "• Plays simple games like peek-a-boo", "• Imitates actions")
    } else if (ageMonths <= 18) {
      if (isMotorQuery) expectedMilestones.push("• Walks alone", "• Climbs stairs with help", "• Begins to run", "• Kicks ball")
      if (isLanguageQuery) expectedMilestones.push("• Says 10+ words", "• Points to body parts", "• Follows 2-step instructions")
      if (isSocialQuery) expectedMilestones.push("• Shows affection", "• May have temper tantrums", "• Points to show things to others")
    } else if (ageMonths <= 24) {
      if (isMotorQuery) expectedMilestones.push("• Runs steadily", "• Walks up/down stairs holding on", "• Jumps in place", "• Throws ball overhand")
      if (isLanguageQuery) expectedMilestones.push("• Uses 2-word phrases", "• Says 50+ words", "• Points to pictures in books")
      if (isSocialQuery) expectedMilestones.push("• Copies adults and friends", "• Shows defiant behavior", "• Plays alongside other children")
    } else {
      if (isMotorQuery) expectedMilestones.push("• Climbs well", "• Pedals tricycle", "• Walks up stairs alternating feet")
      if (isLanguageQuery) expectedMilestones.push("• Uses 3-4 word sentences", "• Stranger can understand speech", "• Asks lots of questions")
      if (isSocialQuery) expectedMilestones.push("• Shows concern for crying friends", "• Takes turns in games", "• Plays make-believe")
    }

    if (expectedMilestones.length > 0) {
      response += `**Expected milestones around ${childSummary.ageDisplay}:**\n${expectedMilestones.join('\n')}\n\n`
    }

    if (childSummary.milestoneProgress) {
      response += `**${childSummary.name}'s Progress:**\n• Currently achieving ${childSummary.milestoneProgress.percentage}% of age-appropriate milestones\n`
      if (childSummary.milestoneProgress.concerning > 0) {
        response += `• ${childSummary.milestoneProgress.concerning} milestone(s) may benefit from discussion with pediatrician\n`
      }
      response += '\n'
    }

    response += `**Important Reminders:**\n• Every child develops at their own pace\n• There's a wide range of "normal" development\n• Consistent progress is more important than exact timing\n• Early intervention can be very helpful if there are concerns\n\n`

    response += `📞 **When to contact your pediatrician:**\n• If you notice regression in skills\n• If ${childSummary.name} seems significantly behind in multiple areas\n• If you have any concerns about development`

    return response
  }

  // Main local processing method
  async processLocalQuery(childSummary: ChildSummary, query: string): Promise<{
    response: string
    responseType: 'local'
    category: string
    confidenceScore: number
  } | null> {

    // Growth-related queries (40% of all queries)
    if (/height|weight|tall|short|grow|percentile|chart|bmi/i.test(query)) {
      const response = await this.generateGrowthAnalysis(childSummary, query)
      if (response) {
        return {
          response,
          responseType: 'local',
          category: 'growth',
          confidenceScore: 0.92
        }
      }
    }

    // Vaccination queries (25% of queries)
    if (/vaccine|immunization|shot|schedule|overdue|mmr|dtap/i.test(query)) {
      const response = await this.generateVaccinationGuidance(childSummary, query)
      if (response) {
        return {
          response,
          responseType: 'local',
          category: 'vaccination',
          confidenceScore: 0.90
        }
      }
    }

    // Milestone/development queries (20% of queries)
    if (/milestone|development|crawling|walking|talking|speech|social|motor|cognitive/i.test(query)) {
      const response = await this.generateMilestoneGuidance(childSummary, query)
      if (response) {
        return {
          response,
          responseType: 'local',
          category: 'milestone',
          confidenceScore: 0.88
        }
      }
    }

    // Nutrition queries (basic guidance - 10% of queries)
    if (/feeding|food|nutrition|eating|formula|breastfeed|solid|meal/i.test(query)) {
      return await this.generateNutritionGuidance(childSummary)
    }

    return null // No local match found, will use LLM
  }

  private async generateNutritionGuidance(childSummary: ChildSummary): Promise<{
    response: string
    responseType: 'local'
    category: string
    confidenceScore: number
  } | null> {
    const ageMonths = childSummary.ageMonths
    let response = `**Nutrition Guidance for ${childSummary.name} (${childSummary.ageDisplay}):**\n\n`

    if (ageMonths < 4) {
      response += `**Exclusive Milk Feeding (0-4 months):**\n• Breast milk or formula provides complete nutrition\n• No solid foods, water, or other liquids needed\n• Feed on demand (8-12 times per day typically)\n• Growth spurts may increase feeding frequency\n\n`
    } else if (ageMonths < 6) {
      response += `**Introducing Solids Soon (4-6 months):**\n• Continue breast milk or formula as primary nutrition\n• Watch for readiness signs: sitting with support, showing interest in food\n• Most pediatricians recommend waiting until 6 months for solids\n• Iron-fortified cereals are often recommended as first foods\n\n`
    } else if (ageMonths < 12) {
      response += `**Complementary Feeding (6-12 months):**\n• Continue breast milk or formula (16-24 oz/day)\n• Introduce variety: fruits, vegetables, meats, grains\n• Start with single ingredients, wait 3-5 days between new foods\n• Finger foods around 8-9 months\n• Avoid honey, whole nuts, choking hazards\n\n`
    } else if (ageMonths < 24) {
      response += `**Toddler Nutrition (12-24 months):**\n• Transition to whole milk (16-20 oz/day)\n• 3 meals + 2-3 healthy snacks\n• Offer variety from all food groups\n• Self-feeding is important for development\n• Limit juice to 4-6 oz/day if any\n\n`
    } else {
      response += `**Preschooler Nutrition (2+ years):**\n• Family meals with age-appropriate portions\n• Encourage variety and balanced eating\n• Limit processed foods and added sugars\n• Make mealtimes positive experiences\n• Milk: 16-20 oz/day of low-fat milk\n\n`
    }

    response += `**General Tips:**\n• Follow your child's hunger and fullness cues\n• Create positive mealtime experiences\n• Offer new foods multiple times (may take 10+ exposures)\n• Avoid using food as reward or punishment`

    return {
      response,
      responseType: 'local',
      category: 'nutrition',
      confidenceScore: 0.85
    }
  }

  // Build comprehensive child summary for AI context
  async buildChildSummary(childId: string): Promise<ChildSummary | null> {
    try {
      // Get child basic info
      const { data: child, error } = await supabase
        .from('daughters')
        .select('*')
        .eq('id', childId)
        .single()

      if (error || !child) return null

      // Calculate age
      const birthDate = new Date(child.birth_date)
      const now = new Date()
      const ageMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth())
      const years = Math.floor(ageMonths / 12)
      const months = ageMonths % 12
      const ageDisplay = years > 0 ? `${years}y ${months}m` : `${months}m`

      // Get latest growth data
      const growthRecords = await healthDataService.getGrowthRecords(childId)
      const latestGrowth = growthRecords.length > 0 ? {
        height: growthRecords[0].height || undefined,
        weight: growthRecords[0].weight || undefined,
        heightPercentile: growthRecords[0].height_percentile || undefined,
        weightPercentile: growthRecords[0].weight_percentile || undefined,
        bmiPercentile: growthRecords[0].bmi_percentile || undefined,
        measurementDate: growthRecords[0].measurement_date
      } : undefined

      // Get vaccination status  
      const overdue = await healthDataService.getOverdueVaccinations(childId)
      const vaccinationStatus = {
        upToDate: overdue.length === 0,
        overdue: overdue.length
      }

      // Get milestone progress
      const milestones = await healthDataService.getMilestones(childId)
      const expectedMilestones = milestones.filter(m => m.age_months_expected <= ageMonths)
      const achievedMilestones = expectedMilestones.filter(m => m.achieved)
      const concerningMilestones = milestones.filter(m => 
        m.age_months_expected < ageMonths - 2 && !m.achieved
      )

      const milestoneProgress = {
        percentage: expectedMilestones.length > 0 ? (achievedMilestones.length / expectedMilestones.length) * 100 : 100,
        concerning: concerningMilestones.length
      }

      return {
        id: child.id,
        name: child.name,
        ageMonths,
        ageDisplay,
        latestGrowth,
        vaccinationStatus,
        milestoneProgress
      }
    } catch (error) {
      console.error('Error building child summary:', error)
      return null
    }
  }

  // Get cached knowledge base entries
  async getKnowledgeEntries(category: string, ageMonths: number): Promise<LocalKnowledgeEntry[]> {
    const cacheKey = `${category}-${ageMonths}`
    
    if (this.knowledgeCache.has(cacheKey)) {
      return this.knowledgeCache.get(cacheKey)!
    }

    try {
      const { data } = await supabase
        .from('health_knowledge_base')
        .select('*')
        .eq('category', category)
        .gte('age_range_max', ageMonths)
        .lte('age_range_min', ageMonths)

      const entries = data?.map(entry => ({
        category: entry.category,
        subcategory: entry.subcategory,
        ageRangeMin: entry.age_range_min,
        ageRangeMax: entry.age_range_max,
        questionPatterns: entry.question_patterns as string[],
        responseTemplate: entry.response_template,
        source: entry.source,
        confidenceLevel: entry.confidence_level
      })) || []

      this.knowledgeCache.set(cacheKey, entries)
      return entries
    } catch (error) {
      console.error('Error getting knowledge entries:', error)
      return []
    }
  }

  // Clear cache when knowledge base is updated
  clearCache(): void {
    this.knowledgeCache.clear()
  }
}

export const localHealthKnowledgeService = new LocalHealthKnowledgeService()
export type { ChildSummary }