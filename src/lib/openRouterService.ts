import { supabase } from './supabase'
import { createMilestoneBotPrompt } from '@/chatbotprompts/milestoneBotAssistant'

// OpenRouter API configuration
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1'
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

// Cost-optimized model selection based on NPI agent recommendations
const MODELS = {
  PRIMARY: {
    name: 'meta-llama/llama-3.1-8b-instruct',
    costPer1M: 0.18, // $0.18 per 1M tokens
    maxTokens: 8192,
    description: 'Primary cost-efficient model for health guidance'
  },
  FALLBACK: {
    name: 'anthropic/claude-3-haiku',
    costPer1M: 0.25, // $0.25 per 1M tokens  
    maxTokens: 4096,
    description: 'Fallback for complex medical reasoning'
  },
  EMERGENCY: {
    name: 'openai/gpt-4o-mini',
    costPer1M: 0.15, // $0.15 per 1M tokens
    maxTokens: 4096,
    description: 'Emergency detection and safety-critical queries'
  }
} as const

// Cost control settings
const COST_LIMITS = {
  DAILY_USER_LIMIT_CENTS: parseInt(import.meta.env.VITE_AI_DAILY_COST_LIMIT_CENTS || '100'), // $1.00 default
  SINGLE_QUERY_LIMIT_CENTS: 50, // $0.50 max per query
  TOKEN_BUFFER: 200 // Buffer tokens for response
}

// Child health context interface
export interface ChildHealthContext {
  id: string
  name: string
  ageMonths: number
  ageDisplay: string
  userCountry?: string
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
    recent: Array<{ name: string; date: string }>
  }
  milestoneProgress?: {
    percentage: number
    recentAchievements: Array<{ name: string; category: string }>
    concerning: Array<{ name: string; expectedAge: number }>
  }
}

// API Response interfaces
interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

interface AIResponse {
  content: string
  responseType: 'local' | 'llm' | 'hybrid'
  modelUsed?: string
  tokensUsed?: number
  costCents?: number
  processingTimeMs: number
  confidenceScore: number
  emergencyDetected: boolean
  safetyFlags: Record<string, any>
  childContextUsed: Partial<ChildHealthContext>
}

class OpenRouterService {
  private async makeAPIRequest(
    messages: Array<{ role: string; content: string }>,
    model: keyof typeof MODELS = 'PRIMARY',
    temperature: number = 0.3
  ): Promise<OpenRouterResponse> {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured')
    }

    const selectedModel = MODELS[model]
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://milestonebee.com',
        'X-Title': 'MilestoneBee AI Assistant'
      },
      body: JSON.stringify({
        model: selectedModel.name,
        messages,
        temperature,
        max_tokens: Math.min(selectedModel.maxTokens - COST_LIMITS.TOKEN_BUFFER, 1000),
        stream: false
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} ${error}`)
    }

    return response.json()
  }

  private calculateCost(tokens: number, model: keyof typeof MODELS): number {
    const modelInfo = MODELS[model]
    return Math.round((tokens * modelInfo.costPer1M) / 1000000 * 100) // Convert to cents
  }

  private async checkDailyCostLimit(userId: string): Promise<boolean> {
    try {
      const { data } = await supabase.rpc('check_daily_cost_limit', {
        user_uuid: userId,
        cost_limit_cents: COST_LIMITS.DAILY_USER_LIMIT_CENTS
      })
      return data === true
    } catch (error) {
      console.error('Error checking daily cost limit:', error)
      return false // Fail safe - don't allow if can't check
    }
  }

  private async incrementUsageTracking(
    userId: string,
    isApiQuery: boolean,
    costCents: number = 0,
    tokens: number = 0
  ): Promise<void> {
    try {
      await supabase.rpc('increment_usage_tracking', {
        user_uuid: userId,
        is_api_query: isApiQuery,
        cost_cents: costCents,
        tokens
      })
    } catch (error) {
      console.error('Error tracking usage:', error)
    }
  }

  // Emergency pattern detection
  private detectEmergencyPatterns(query: string): { detected: boolean; patterns: string[]; severity: string } {
    const emergencyKeywords = [
      { pattern: /difficulty breathing|can't breathe|gasping/i, severity: 'high' },
      { pattern: /unconscious|unresponsive|won't wake up/i, severity: 'high' },
      { pattern: /fever (10[4-9]|11\d)|temperature (10[4-9]|11\d)/i, severity: 'high' },
      { pattern: /severe allergic reaction|anaphylaxis|widespread rash/i, severity: 'high' },
      { pattern: /head injury|hit head|fell on head/i, severity: 'high' },
      { pattern: /poisoning|swallowed|ate something toxic/i, severity: 'high' },
      { pattern: /persistent vomiting|won't stop throwing up/i, severity: 'medium' },
      { pattern: /severe diarrhea|blood in stool/i, severity: 'medium' }
    ]

    const detected: string[] = []
    let highestSeverity = 'low'

    for (const keyword of emergencyKeywords) {
      if (keyword.pattern.test(query)) {
        detected.push(keyword.pattern.source)
        if (keyword.severity === 'high') highestSeverity = 'high'
        else if (keyword.severity === 'medium' && highestSeverity !== 'high') {
          highestSeverity = 'medium'
        }
      }
    }

    return {
      detected: detected.length > 0,
      patterns: detected,
      severity: highestSeverity
    }
  }

  // Create system prompt with child context
  private createSystemPrompt(childContext: ChildHealthContext): string {
    return createMilestoneBotPrompt(childContext, childContext.userCountry || 'US')
  }

  // Compress context for cost optimization
  private compressChildContext(childContext: ChildHealthContext): ChildHealthContext {
    return {
      id: childContext.id,
      name: childContext.name,
      ageMonths: childContext.ageMonths,
      ageDisplay: childContext.ageDisplay,
      userCountry: childContext.userCountry,
      latestGrowth: childContext.latestGrowth ? {
        heightPercentile: childContext.latestGrowth.heightPercentile,
        weightPercentile: childContext.latestGrowth.weightPercentile,
        measurementDate: childContext.latestGrowth.measurementDate
      } : undefined,
      vaccinationStatus: childContext.vaccinationStatus ? {
        upToDate: childContext.vaccinationStatus.upToDate,
        overdue: childContext.vaccinationStatus.overdue,
        recent: childContext.vaccinationStatus.recent.slice(0, 2) // Only most recent 2
      } : undefined,
      milestoneProgress: childContext.milestoneProgress ? {
        percentage: childContext.milestoneProgress.percentage,
        recentAchievements: childContext.milestoneProgress.recentAchievements.slice(0, 3),
        concerning: childContext.milestoneProgress.concerning.slice(0, 2)
      } : undefined
    }
  }

  // Main query processing method
  async processHealthQuery(
    query: string,
    userId: string,
    childContext: ChildHealthContext,
  ): Promise<AIResponse> {
    const startTime = Date.now()
    
    // Check for emergency patterns first (always handle emergencies)
    const emergencyCheck = this.detectEmergencyPatterns(query)
    if (emergencyCheck.detected) {
      // Handle emergency with immediate response
      const emergencyResponse = await this.handleEmergencyQuery(emergencyCheck, childContext)
      await this.incrementUsageTracking(userId, false, 0, 0).catch(() => {}) // Emergency responses are free
      
      return {
        ...emergencyResponse,
        processingTimeMs: Date.now() - startTime,
        childContextUsed: this.compressChildContext(childContext)
      }
    }

    // Try local knowledge base first (cost optimization)
    const localResponse = await this.tryLocalKnowledgeBase(query, childContext)
    if (localResponse) {
      await this.incrementUsageTracking(userId, false, 0, 0).catch(() => {})
      return {
        ...localResponse,
        processingTimeMs: Date.now() - startTime,
        childContextUsed: this.compressChildContext(childContext)
      }
    }

    // Check if API key is available
    if (!OPENROUTER_API_KEY) {
      return await this.getFallbackResponse(query, childContext, startTime)
    }

    // Check daily cost limit only if API is available
    try {
      const withinLimit = await this.checkDailyCostLimit(userId)
      if (!withinLimit) {
        return await this.getFallbackResponse(query, childContext, startTime)
      }
    } catch (error) {
      console.warn('Could not check cost limit, proceeding with local response')
      return await this.getFallbackResponse(query, childContext, startTime)
    }

    // Try LLM with compressed context, fall back to local if it fails
    try {
      return await this.processWithLLM(query, userId, childContext, startTime)
    } catch (error) {
      console.warn('LLM processing failed, using fallback response:', error)
      return await this.getFallbackResponse(query, childContext, startTime)
    }
  }

  private async handleEmergencyQuery(
    emergencyCheck: { detected: boolean; patterns: string[]; severity: string },
    childContext: ChildHealthContext
  ): Promise<Omit<AIResponse, 'processingTimeMs' | 'childContextUsed'>> {
    let emergencyResponse = ''
    
    if (emergencyCheck.severity === 'high') {
      emergencyResponse = `🚨 **EMERGENCY - CALL 911 IMMEDIATELY** 🚨

Based on your description, this may be a medical emergency requiring immediate professional attention.

**IMMEDIATE ACTIONS:**
1. **Call 911 right now**
2. Stay calm and follow the operator's instructions
3. Do not try home remedies
4. If possible, have someone else call while you stay with ${childContext.name}

**While waiting for help:**
- Keep ${childContext.name} comfortable
- Monitor their breathing and consciousness
- Be prepared to provide information to emergency responders

This is not the time for online advice - professional emergency care is needed immediately.`
    } else {
      emergencyResponse = `⚠️ **URGENT - CONTACT YOUR PEDIATRICIAN IMMEDIATELY** ⚠️

Your description suggests ${childContext.name} needs prompt medical evaluation.

**IMMEDIATE ACTIONS:**
1. **Call your pediatrician's office now** (or after-hours line)
2. If you can't reach them, consider urgent care or ER
3. Monitor ${childContext.name} closely while seeking care

**What to tell the healthcare provider:**
- ${childContext.name}'s age: ${childContext.ageDisplay}
- Specific symptoms you're seeing
- When symptoms started
- Any recent changes in behavior, eating, or sleeping

Don't wait to see if symptoms improve - seek professional medical advice now.`
    }

    return {
      content: emergencyResponse,
      responseType: 'local',
      confidenceScore: 1.0,
      emergencyDetected: true,
      safetyFlags: { 
        emergencyPatterns: emergencyCheck.patterns,
        severity: emergencyCheck.severity 
      }
    }
  }

  private async getFallbackResponse(
    query: string,
    childContext: ChildHealthContext,
    startTime: number
  ): Promise<AIResponse> {
    const queryLower = query.toLowerCase()
    let response = ''

    // Check for emergency patterns first
    const emergencyKeywords = ['fever', 'breathing', 'unconscious', 'unresponsive', 'emergency', 'urgent']
    const hasEmergencyKeyword = emergencyKeywords.some(keyword => queryLower.includes(keyword))
    
    // More specific emergency patterns (not just "help")
    const criticalHelp = queryLower.includes('help') && (
      queryLower.includes('urgent') || 
      queryLower.includes('emergency') || 
      queryLower.includes('serious') ||
      queryLower.includes('hospital') ||
      queryLower.includes('911')
    )
    
    const isEmergency = hasEmergencyKeyword || criticalHelp
    
    if (isEmergency) {
      response = `I see you're concerned about ${childContext.name}—parenting can be really tough when worrying about their health! 😊

Based on what you've shared, this sounds like it could be serious. **Please contact your pediatrician or emergency services right away** for ${childContext.name}'s safety.

While you're getting professional help, keep ${childContext.name} comfortable and monitor their symptoms closely. Trust your instincts—you know ${childContext.name} best!

You're doing exactly the right thing by seeking help. What else can I help with for ${childContext.name}?`
    }
    // Sleep-related questions
    else if (
      queryLower.includes('sleep') || 
      queryLower.includes('nap') || 
      queryLower.includes('bedtime') || 
      queryLower.includes('wake') ||
      queryLower.includes('nighttime') ||
      queryLower.includes('night') ||
      queryLower.includes('sleeping') ||
      queryLower.includes('tired')
    ) {
      console.log('🛏️ Detected sleep-related query:', query)
      const ageSpecificSleep = childContext.ageMonths <= 3 ? 
        '14-17 hours per day with frequent night wakings (completely normal!)' :
        childContext.ageMonths <= 12 ?
        '12-15 hours per day, may start sleeping longer stretches' :
        '11-14 hours per day with 1-2 naps'

      response = `I understand sleep challenges with ${childContext.name} can be exhausting—you're definitely not alone in this! 😊

**For ${childContext.name} at ${childContext.ageDisplay}:**
Sleep needs: ${ageSpecificSleep}

**Gentle strategies that work well:**
- Consistent bedtime routine (bath, story, quiet time)
- Room environment: cool (68-70°F), dark, quiet
- ${childContext.ageMonths <= 6 ? 'Safe swaddling or sleep sack' : 'Comfortable sleep sack'}
- ${childContext.ageMonths <= 3 ? 'Remember: frequent wakings are normal for newborns!' : 'Practice putting down awake to encourage self-soothing'}

Every family's sleep journey is unique, and with patience and consistency, you'll find what works best for ${childContext.name}! You're doing an amazing job.

What else can I help with for ${childContext.name}?`
    }
    // Feeding-related questions  
    else if (
      queryLower.includes('food') || 
      queryLower.includes('eat') || 
      queryLower.includes('feed') || 
      queryLower.includes('milk') || 
      queryLower.includes('solid') || 
      queryLower.includes('breast') || 
      queryLower.includes('bottle') ||
      queryLower.includes('formula') ||
      queryLower.includes('hunger') ||
      queryLower.includes('nutrition')
    ) {
      console.log('🍼 Detected feeding-related query:', query)
      let feedingGuidance = ''
      
      if (childContext.ageMonths <= 6) {
        feedingGuidance = `**Feeding for ${childContext.name} at ${childContext.ageDisplay}:**
- Exclusive breastfeeding or formula is perfect right now
- On-demand feeding every 2-3 hours is typical
- Watch for hunger cues (rooting, lip smacking, fist to mouth)
- Growth spurts may increase appetite temporarily`
      } else if (childContext.ageMonths <= 12) {
        feedingGuidance = `**Feeding for ${childContext.name} at ${childContext.ageDisplay}:**
- Continue breast milk/formula as primary nutrition
- Introduce solids gradually: single ingredients, 3-5 days apart
- Start with iron-rich foods (baby cereal, pureed meats)
- Let ${childContext.name} explore textures and self-feed when ready
- Signs of readiness: sits up well, good head control, reaches for food`
      } else {
        feedingGuidance = `**Feeding for ${childContext.name} at ${childContext.ageDisplay}:**
- Transition to more table foods and family meals
- Offer variety: fruits, vegetables, proteins, whole grains
- ${childContext.name} can use utensils and cup drinking
- Continue breast milk/formula if desired, but food becomes primary nutrition
- Avoid choking hazards (whole grapes, nuts, hard candies)`
      }

      response = `Feeding questions are so common—you're being such a thoughtful parent to ${childContext.name}! 😊

${feedingGuidance}

**Remember:** Every child's appetite varies day to day. Follow ${childContext.name}'s cues, offer variety, and make mealtimes positive experiences. You're doing great!

Always check with your pediatrician about ${childContext.name}'s specific nutritional needs and any concerns.

What else can I help with for ${childContext.name}?`
    }
    // Development and milestone questions
    else if (
      queryLower.includes('develop') || 
      queryLower.includes('milestone') || 
      queryLower.includes('crawl') || 
      queryLower.includes('walk') || 
      queryLower.includes('talk') || 
      queryLower.includes('roll') || 
      queryLower.includes('sit') ||
      queryLower.includes('growth') ||
      queryLower.includes('skills') ||
      queryLower.includes('abilities') ||
      queryLower.includes('play') ||
      queryLower.includes('activities') ||
      queryLower.includes('toys') ||
      queryLower.includes('games') ||
      queryLower.includes('stimulation')
    ) {
      console.log('👶 Detected development-related query:', query)
      let developmentGuidance = ''
      
      if (childContext.ageMonths <= 3) {
        developmentGuidance = `**Development for ${childContext.name} at ${childContext.ageDisplay}:**
- Social smiling (around 2 months) 
- Following objects with eyes
- Holding head up during tummy time
- Making cooing sounds
- Starting to reach for objects

**Great activities for ${childContext.name}:**
- Tummy time (3-5 minutes, several times daily)
- High-contrast black & white pictures
- Gentle talking and singing
- Rattles and soft toys for grasping practice
- Face-to-face interaction and peek-a-boo`
      } else if (childContext.ageMonths <= 6) {
        developmentGuidance = `**Development for ${childContext.name} at ${childContext.ageDisplay}:**
- Rolling over (both ways)
- Sitting with support, working toward independent sitting
- Reaching and grasping toys
- Babbling sounds
- Showing interest in solid foods

**Perfect activities for ${childContext.name}:**
- Colorful toys they can grasp and mouth
- Baby-safe mirrors for self-discovery
- Cause-and-effect toys (rattles, crinkly books)
- Supported sitting with pillows
- Different textures to explore safely`
      } else if (childContext.ageMonths <= 12) {
        developmentGuidance = `**Development for ${childContext.name} at ${childContext.ageDisplay}:**
- Sitting independently
- Crawling or moving around
- Pulling to stand
- First words may appear
- Responding to their name
- Playing peek-a-boo and pat-a-cake

**Engaging activities for ${childContext.name}:**
- Stacking cups and soft blocks
- Push-and-pull toys for cruising
- Simple cause-and-effect toys (pop-up toys)
- Board books with simple pictures
- Music and dancing together
- Hide-and-seek games`
      } else {
        developmentGuidance = `**Development for ${childContext.name} at ${childContext.ageDisplay}:**
- Walking independently or with support
- Vocabulary growth (10+ words by 18 months)
- Following simple instructions
- Showing independence and preferences
- Climbing and exploring actively

**Fun activities for ${childContext.name}:**
- Shape sorters and simple puzzles
- Crayons and large paper for scribbling
- Playground visits (slides, swings, climbing)
- Pretend play with dolls or stuffed animals
- Simple songs with actions
- Building with blocks or Duplo`
      }

      response = `Development questions show how much you care about ${childContext.name}—that's wonderful! 😊

${developmentGuidance}

**Important reminder:** Every child develops at their own unique pace! Some babies crawl early, others skip it entirely. Some talk early, others focus on physical skills first. ${childContext.name} is following their own perfect timeline.

**Supporting ${childContext.name}'s development:**
- Lots of loving interaction and talking
- Age-appropriate toys and safe exploration
- Reading together daily
- Tummy time (if under 12 months)
- Celebrating every small progress!

Contact your pediatrician if you have specific concerns about ${childContext.name}'s development—they can provide personalized guidance.

What else can I help with for ${childContext.name}?`
    }
    // Health and safety questions
    else if (
      queryLower.includes('health') || 
      queryLower.includes('sick') || 
      queryLower.includes('temperature') || 
      queryLower.includes('rash') || 
      queryLower.includes('cough') || 
      queryLower.includes('safety') ||
      queryLower.includes('doctor') ||
      queryLower.includes('pediatrician') ||
      queryLower.includes('symptoms')
    ) {
      console.log('🏥 Detected health-related query:', query)
      response = `I see you're concerned about ${childContext.name}'s health—that shows what a caring parent you are! 😊

**General health guidance for ${childContext.name} at ${childContext.ageDisplay}:**
- Normal temperature: 98.6°F (100.4°F+ is fever, contact pediatrician)
- Common concerns: teething, minor colds, growth spurts
- ${childContext.ageMonths <= 6 ? 'Newborns: Watch for feeding changes, unusual fussiness, fever' : 'Watch for changes in appetite, sleep, or behavior'}

**When to contact your pediatrician:**
- Fever (especially in babies under 3 months)
- Persistent crying or unusual behavior  
- Changes in eating or sleeping patterns
- Any symptoms that worry you

**Safety tips for ${childContext.name}'s age:**
${childContext.ageMonths <= 6 ? '- Safe sleep practices (back sleeping, firm mattress)\n- Never leave unattended on elevated surfaces\n- Car seat safety' : ''}
${childContext.ageMonths > 6 ? '- Childproofing as mobility increases\n- Small object choking hazards\n- Stair gates and outlet covers' : ''}

Trust your instincts—you know ${childContext.name} best! When in doubt, your pediatrician is always the best resource.

What else can I help with for ${childContext.name}?`
    }
    // General/catch-all response
    else {
      console.log('❓ Using general response for query:', query)
      response = `Hi! I'm MilestoneBot, your parenting sidekick! I'm here to help with ${childContext.name}'s care and development. 😊

**I can provide guidance on:**
- Sleep routines and challenges
- Feeding and nutrition (breast, bottle, solids)
- Development milestones and activities  
- General health and safety topics
- Parenting support and encouragement

**For ${childContext.name} at ${childContext.ageDisplay}**, I focus on age-appropriate advice that fits their current developmental stage.

**For this specific question about ${childContext.name}**, I'd recommend:
1. **Your pediatrician** for personalized medical guidance
2. **Trusted resources** like AAP (American Academy of Pediatrics)
3. **Your parental instincts**—you know ${childContext.name} best!

Remember, every child is unique, and parenting looks different for every family. You're doing an amazing job with ${childContext.name}! ❤️

What else can I help with for ${childContext.name}?`
    }

    return {
      content: response,
      responseType: 'local',
      confidenceScore: 0.85,
      emergencyDetected: isEmergency,
      safetyFlags: { source: 'enhanced_fallback', category: 'comprehensive_guidance' },
      processingTimeMs: Date.now() - startTime,
      childContextUsed: this.compressChildContext(childContext)
    }
  }

  private async tryLocalKnowledgeBase(
    query: string,
    childContext: ChildHealthContext
  ): Promise<Omit<AIResponse, 'processingTimeMs' | 'childContextUsed'> | null> {
    try {
      // Query local knowledge base for matching patterns
      const { data: knowledgeEntries } = await supabase
        .from('health_knowledge_base')
        .select('*')
        .gte('age_range_max', childContext.ageMonths)
        .lte('age_range_min', childContext.ageMonths)

      if (!knowledgeEntries?.length) return null

      // Simple pattern matching (can be enhanced with NLP)
      const queryLower = query.toLowerCase()
      
      for (const entry of knowledgeEntries) {
        const patterns = entry.question_patterns as string[]
        const hasMatch = patterns.some(pattern => queryLower.includes(pattern.toLowerCase()))
        
        if (hasMatch) {
          // Template replacement with actual child data
          let response = entry.response_template
          
          // Replace template variables
          response = response.replace(/{age}/g, childContext.ageDisplay)
          response = response.replace(/{name}/g, childContext.name)
          
          if (childContext.latestGrowth) {
            response = response.replace(/{percentile}/g, childContext.latestGrowth.heightPercentile?.toString() || 'N/A')
            response = response.replace(/{bmi}/g, 
              childContext.latestGrowth.weight && childContext.latestGrowth.height 
                ? (childContext.latestGrowth.weight / Math.pow(childContext.latestGrowth.height / 100, 2)).toFixed(1)
                : 'N/A'
            )
          }


          return {
            content: response,
            responseType: 'local',
            confidenceScore: entry.confidence_level,
            emergencyDetected: false,
            safetyFlags: { source: entry.source, category: entry.category }
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error querying local knowledge base:', error)
      return null
    }
  }

  private async processWithLLM(
    query: string,
    userId: string,
    childContext: ChildHealthContext,
    startTime: number,
    model: keyof typeof MODELS = 'PRIMARY'
  ): Promise<AIResponse> {
    try {
      const compressedContext = this.compressChildContext(childContext)
      const systemPrompt = this.createSystemPrompt(compressedContext)
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ]

      const response = await this.makeAPIRequest(messages, model)
      const costCents = this.calculateCost(response.usage.total_tokens, model)

      // Check if cost exceeds single query limit
      if (costCents > COST_LIMITS.SINGLE_QUERY_LIMIT_CENTS) {
        throw new Error('Query too complex. Please try asking a more specific question.')
      }

      await this.incrementUsageTracking(userId, true, costCents, response.usage.total_tokens)

      const content = response.choices[0]?.message.content || 'Sorry, I could not generate a response.'

      return {
        content,
        responseType: 'llm',
        modelUsed: MODELS[model].name,
        tokensUsed: response.usage.total_tokens,
        costCents,
        processingTimeMs: Date.now() - startTime,
        confidenceScore: 0.85, // Default confidence for LLM responses
        emergencyDetected: false,
        safetyFlags: { model: MODELS[model].name },
        childContextUsed: compressedContext
      }
    } catch (error) {
      console.error(`Error with ${model} model:`, error)
      
      // Try fallback model if primary fails
      if (model === 'PRIMARY') {
        console.log('Trying fallback model...')
        return await this.processWithLLM(query, userId, childContext, startTime, 'FALLBACK')
      }
      
      throw new Error('Unable to process your question at this time. Please try again later.')
    }
  }

  // Get user's daily usage statistics
  async getDailyUsageStats(userId: string): Promise<{
    totalQueries: number
    localQueries: number
    apiQueries: number
    totalCostCents: number
    remainingBudgetCents: number
  }> {
    try {
      const { data } = await supabase
        .from('ai_usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single()

      const totalCostCents = data?.total_cost_cents || 0
      
      return {
        totalQueries: data?.total_queries || 0,
        localQueries: data?.local_queries || 0,
        apiQueries: data?.api_queries || 0,
        totalCostCents,
        remainingBudgetCents: COST_LIMITS.DAILY_USER_LIMIT_CENTS - totalCostCents
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      return {
        totalQueries: 0,
        localQueries: 0,
        apiQueries: 0,
        totalCostCents: 0,
        remainingBudgetCents: COST_LIMITS.DAILY_USER_LIMIT_CENTS
      }
    }
  }
}

export const openRouterService = new OpenRouterService()
export type { AIResponse, ChildHealthContext }