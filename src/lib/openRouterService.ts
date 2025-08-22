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
  wordCount?: number
  professionalTone?: boolean
  evidenceCitations?: number
}

class OpenRouterService {
  // Response validation and quality control
  private validateResponseQuality(content: string): {
    wordCount: number
    professionalTone: boolean
    evidenceCitations: number
    needsTruncation: boolean
    qualityScore: number
  } {
    const words = content.split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    const needsTruncation = wordCount > 150
    
    // Check for unprofessional language patterns (allow compassionate acknowledgments)
    const allowedCompassionate = [
      'common', 'concerning', 'understandable', 'challenging', 'difficult',
      'seeking guidance', 'shows care', 'this concern', 'disruptions', 'struggles'
    ]
    
    const excessiveEmotional = [
      'amazing', 'wonderful', 'great job', 'you\'re doing great', 'don\'t worry',
      '😊', '❤️', '🎉', '😄', '💝', '🐝', 'excited', 'celebration', 'fantastic'
    ]
    
    const hasExcessiveEmotional = excessiveEmotional.some(phrase => 
      content.toLowerCase().includes(phrase.toLowerCase())
    )
    
    const hasCompassionate = allowedCompassionate.some(phrase =>
      content.toLowerCase().includes(phrase.toLowerCase())
    )
    
    // Count evidence citations
    const evidencePatterns = [
      /AAP|American Academy of Pediatrics/gi,
      /WHO|World Health Organization/gi,
      /CDC|Centers for Disease Control/gi,
      /\b\d+\s*(hours?|minutes?|ml|oz|months?|weeks?)\b/gi,
      /studies? show|research indicates|according to/gi
    ]
    const evidenceCitations = evidencePatterns.reduce((count, pattern) => {
      const matches = content.match(pattern)
      return count + (matches ? matches.length : 0)
    }, 0)
    
    const professionalTone = !hasExcessiveEmotional && (evidenceCitations > 0 || hasCompassionate)
    const qualityScore = (professionalTone ? 0.5 : 0) + 
                        (evidenceCitations * 0.1) + 
                        (hasCompassionate ? 0.1 : 0) +
                        (wordCount <= 150 ? 0.3 : 0)
    
    return {
      wordCount,
      professionalTone,
      evidenceCitations,
      needsTruncation,
      qualityScore: Math.min(1, qualityScore)
    }
  }

  private truncateResponseSmart(content: string, maxWords: number = 150): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim())
    let result = ''
    let wordCount = 0
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.trim().split(/\s+/).length
      if (wordCount + sentenceWords <= maxWords) {
        result += sentence.trim() + '. '
        wordCount += sentenceWords
      } else {
        break
      }
    }
    
    // Ensure we end with proper punctuation
    result = result.trim()
    if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
      result += '.'
    }
    
    return result
  }

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
      response = `For ${childContext.name} at ${childContext.ageDisplay}, these symptoms require immediate medical evaluation. Contact your pediatrician or call emergency services immediately.

**Immediate actions:**
- Monitor breathing and consciousness
- Keep child comfortable
- Prepare to provide symptom timeline to medical professionals

Do not delay seeking professional medical care for ${childContext.name}.`
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

      response = `For ${childContext.name} at ${childContext.ageDisplay}, sleep requirements: ${ageSpecificSleep} (AAP guidelines).

**Evidence-based interventions:**
- Sleep environment: 68-70°F, dark, quiet
- ${childContext.ageMonths <= 6 ? 'Safe Sleep Seven: back sleeping, firm surface, no loose bedding' : 'Consistent bedtime routine 30-45 minutes'}
- ${childContext.ageMonths <= 3 ? 'Night wakings every 2-3 hours normal for feeding' : 'Sleep consolidation typically begins 4-6 months'}

Monitor sleep patterns and consult pediatrician if significant deviations from age-appropriate norms occur.`
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
        feedingGuidance = `**Nutritional requirements ${childContext.name} (${childContext.ageDisplay}):**
- Exclusive breastfeeding/formula: 150-200ml/kg/day
- Feeding frequency: every 2-3 hours (8-12 feeds/day)
- Growth velocity: 25-35g/day expected weight gain
- Iron stores sufficient until 6 months (WHO/AAP)`
      } else if (childContext.ageMonths <= 12) {
        feedingGuidance = `**Feeding protocol ${childContext.name} (${childContext.ageDisplay}):**
- Complementary feeding: 6 months minimum (WHO guidelines)
- Iron-fortified cereals: 4-6mg iron/day requirement
- Progression: single foods 3-5 days, texture advancement
- Breastmilk/formula continues: 500-600ml/day minimum`
      } else {
        feedingGuidance = `**Nutritional needs ${childContext.name} (${childContext.ageDisplay}):**
- Caloric requirement: 1000-1400 calories/day
- Protein: 13-16g/day recommended
- Transition to family foods, varied textures
- Milk: 16-24oz/day maximum to prevent iron deficiency`
      }

      response = `${feedingGuidance}

Consult pediatrician for growth assessment and individualized nutritional guidance for ${childContext.name}.`
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
        developmentGuidance = `**Developmental milestones ${childContext.name} (${childContext.ageDisplay}):**
- Social smile: 6-8 weeks (CDC milestone)
- Head control: 90° by 3 months
- Visual tracking: 180° by 2-3 months  
- Reflexes: Moro, rooting, palmar grasp present
- Vocalizations: cooing sounds 2-3 months`
      } else if (childContext.ageMonths <= 6) {
        developmentGuidance = `**Motor development ${childContext.name} (${childContext.ageDisplay}):**
- Rolling: both directions by 6 months
- Sitting: supported 4-5 months, independent 6-7 months
- Grasp: palmar to pincer progression
- Babbling: consonant sounds 4-6 months
- Solid readiness: head control, sitting, interest in food`
      } else if (childContext.ageMonths <= 12) {
        developmentGuidance = `**Developmental assessment ${childContext.name} (${childContext.ageDisplay}):**
- Gross motor: crawling 7-9 months, standing 9-12 months
- Fine motor: pincer grasp 9-10 months
- Language: first words 10-12 months, responds to name
- Cognitive: object permanence 8-10 months
- Social: stranger anxiety 6-12 months normal`
      } else {
        developmentGuidance = `**Toddler milestones ${childContext.name} (${childContext.ageDisplay}):**
- Mobility: independent walking by 15 months
- Language: 50+ words by 24 months, 2-word phrases
- Motor skills: tower of 3-4 blocks, scribbling
- Cognitive: pretend play, following 2-step commands
- Social: parallel play, emotional regulation developing`
      }

      response = `${developmentGuidance}

Reference ranges based on CDC/AAP guidelines. Schedule developmental screening if concerns about ${childContext.name}'s progress.`
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
      response = `**Health parameters ${childContext.name} (${childContext.ageDisplay}):**
- Normal temperature: 36.1-37.2°C (97-99°F)
- Fever definition: >38°C (100.4°F) - contact pediatrician
- ${childContext.ageMonths <= 3 ? 'Any fever in infants <3 months requires immediate medical evaluation' : 'Monitor for associated symptoms with fever episodes'}

**Age-specific concerns:**
${childContext.ageMonths <= 6 ? '- Feeding changes, prolonged crying >3 hours\n- Respiratory distress, lethargy\n- Poor weight gain <15g/day' : ''}
${childContext.ageMonths > 6 ? '- Developmental regression, persistent illness\n- Injury prevention priorities\n- Growth velocity monitoring' : ''}

Contact pediatrician for medical assessment of ${childContext.name}'s specific symptoms.`
    }
    // General/catch-all response
    else {
      console.log('❓ Using general response for query:', query)
      response = `MilestoneBot provides evidence-based guidance for ${childContext.name} at ${childContext.ageMonths} months using AAP/WHO/CDC clinical standards.

**Clinical assessments available:**
- Developmental milestone tracking and screening
- Nutritional requirements and feeding protocols  
- Sleep medicine recommendations
- Health parameter monitoring
- Safety risk assessment

**For ${childContext.name} (${childContext.ageDisplay}):**
Current focus areas include age-appropriate developmental expectations, nutritional needs, and safety protocols.

For diagnostic concerns or medical evaluation, consult your pediatrician for ${childContext.name}.`
    }

    // Validate and potentially truncate fallback response
    const validation = this.validateResponseQuality(response)
    if (validation.needsTruncation) {
      response = this.truncateResponseSmart(response, 150)
    }

    return {
      content: response,
      responseType: 'local',
      confidenceScore: validation.qualityScore,
      emergencyDetected: isEmergency,
      safetyFlags: { 
        source: 'professional_fallback', 
        category: 'evidence_based_guidance',
        qualityValidation: validation
      },
      processingTimeMs: Date.now() - startTime,
      childContextUsed: this.compressChildContext(childContext),
      wordCount: validation.wordCount,
      professionalTone: validation.professionalTone,
      evidenceCitations: validation.evidenceCitations
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

      let content = response.choices[0]?.message.content || 'Sorry, I could not generate a response.'
      
      // Validate response quality
      const validation = this.validateResponseQuality(content)
      
      // Truncate if necessary while preserving important information
      if (validation.needsTruncation) {
        content = this.truncateResponseSmart(content, 150)
      }

      return {
        content,
        responseType: 'llm',
        modelUsed: MODELS[model].name,
        tokensUsed: response.usage.total_tokens,
        costCents,
        processingTimeMs: Date.now() - startTime,
        confidenceScore: validation.qualityScore,
        emergencyDetected: false,
        safetyFlags: { 
          model: MODELS[model].name,
          qualityValidation: validation
        },
        childContextUsed: compressedContext,
        wordCount: validation.wordCount,
        professionalTone: validation.professionalTone,
        evidenceCitations: validation.evidenceCitations
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