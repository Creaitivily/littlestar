import { supabase } from './supabase'

// Health data types
export interface GrowthData {
  id?: string
  user_id: string
  daughter_id: string
  height: number | null
  weight: number | null
  head_circumference: number | null
  height_percentile: number | null
  weight_percentile: number | null
  bmi: number | null
  bmi_percentile: number | null
  growth_standard: 'CDC' | 'WHO'
  gestational_weeks: number | null
  measurement_date: string
  notes: string | null
}

export interface VaccinationRecord {
  id?: string
  user_id: string
  daughter_id: string
  vaccine_name: string
  vaccine_code: string | null
  dose_number: number | null
  vaccination_date: string
  next_due_date: string | null
  provider_name: string | null
  lot_number: string | null
  administered_by: string | null
  notes: string | null
}

export interface DevelopmentalMilestone {
  id?: string
  user_id: string
  daughter_id: string
  milestone_category: 'motor' | 'language' | 'cognitive' | 'social'
  milestone_name: string
  age_months_expected: number
  age_months_achieved: number | null
  achieved: boolean
  achieved_date: string | null
  notes: string | null
  source: 'CDC' | 'WHO' | 'AAP'
}

export interface HealthAlert {
  id?: string
  user_id: string
  daughter_id: string
  alert_type: 'growth_concern' | 'vaccination_due' | 'milestone_delay'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  action_required: boolean
  dismissed: boolean
  dismissed_date: string | null
}

export interface NutritionEntry {
  id?: string
  user_id: string
  daughter_id: string
  food_item: string
  food_group: string | null
  serving_size: string | null
  calories: number | null
  nutrients: Record<string, any> | null
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  consumption_date: string
  consumption_time: string | null
  notes: string | null
}

export interface GrowthPrediction {
  id?: string
  user_id: string
  daughter_id: string
  prediction_date: string
  predicted_height: number | null
  predicted_weight: number | null
  confidence_score: number
  model_version: string
}

// CDC Growth Chart LMS Parameters for offline calculations
// These are simplified versions - in production, you'd load the full CDC data
const CDC_GROWTH_STANDARDS = {
  // Height-for-age percentiles for girls (sample data)
  height_girls: {
    0: { L: 1, M: 49.1, S: 0.0379 }, // Birth
    1: { L: 1, M: 53.7, S: 0.0364 },
    2: { L: 1, M: 57.1, S: 0.0352 },
    6: { L: 1, M: 65.7, S: 0.0336 },
    12: { L: 1, M: 74.0, S: 0.0334 },
    24: { L: 1, M: 86.4, S: 0.0343 }
  },
  // Weight-for-age percentiles for girls (sample data)
  weight_girls: {
    0: { L: 0.3809, M: 3.232, S: 0.14171 }, // Birth
    1: { L: 0.1714, M: 4.180, S: 0.13724 },
    2: { L: -0.0328, M: 5.107, S: 0.13000 },
    6: { L: -0.2584, M: 7.297, S: 0.11807 },
    12: { L: -0.0756, M: 9.538, S: 0.11316 },
    24: { L: 0.2986, M: 12.051, S: 0.10797 }
  }
}

class HealthDataService {
  // Growth Records Operations
  async createGrowthRecord(record: Omit<GrowthData, 'id'>): Promise<GrowthData> {
    // Calculate BMI if height and weight are provided
    let bmi = null
    if (record.height && record.weight) {
      const heightInM = record.height / 100
      bmi = record.weight / (heightInM * heightInM)
    }

    // Calculate percentiles using offline data
    const percentiles = await this.calculatePercentiles(
      record.height,
      record.weight,
      record.daughter_id,
      record.measurement_date,
      record.growth_standard
    )

    const recordWithCalculations = {
      ...record,
      bmi,
      height_percentile: percentiles.heightPercentile,
      weight_percentile: percentiles.weightPercentile,
      bmi_percentile: percentiles.bmiPercentile
    }

    const { data, error } = await supabase
      .from('growth_records')
      .insert([recordWithCalculations])
      .select()
      .single()

    if (error) throw error

    // Check for growth alerts
    await this.checkGrowthAlerts(data)

    return data
  }

  async getGrowthRecords(daughterId: string): Promise<GrowthData[]> {
    const { data, error } = await supabase
      .from('growth_records')
      .select('*')
      .eq('daughter_id', daughterId)
      .order('measurement_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Percentile Calculation (offline-capable)
  async calculatePercentiles(
    height: number | null,
    weight: number | null,
    daughterId: string,
    measurementDate: string,
    standard: 'CDC' | 'WHO' = 'CDC'
  ): Promise<{
    heightPercentile: number | null
    weightPercentile: number | null
    bmiPercentile: number | null
  }> {
    try {
      // Get child's birth date to calculate age
      const { data: child } = await supabase
        .from('daughters')
        .select('birth_date')
        .eq('id', daughterId)
        .single()

      if (!child) return { heightPercentile: null, weightPercentile: null, bmiPercentile: null }

      const ageMonths = this.calculateAgeInMonths(child.birth_date, measurementDate)
      
      // Use LMS method for percentile calculation
      const heightPercentile = height ? this.calculatePercentileFromLMS(height, 'height', ageMonths, 'F') : null
      const weightPercentile = weight ? this.calculatePercentileFromLMS(weight, 'weight', ageMonths, 'F') : null
      
      let bmiPercentile = null
      if (height && weight) {
        const bmi = weight / Math.pow(height / 100, 2)
        bmiPercentile = this.calculatePercentileFromLMS(bmi, 'bmi', ageMonths, 'F')
      }

      return { heightPercentile, weightPercentile, bmiPercentile }
    } catch (error) {
      console.error('Error calculating percentiles:', error)
      return { heightPercentile: null, weightPercentile: null, bmiPercentile: null }
    }
  }

  // LMS Method for percentile calculation
  private calculatePercentileFromLMS(
    value: number,
    metric: 'height' | 'weight' | 'bmi',
    ageMonths: number,
    gender: 'M' | 'F'
  ): number {
    // This is a simplified implementation
    // In production, you'd load the full CDC LMS tables
    
    // Find closest age in our sample data
    const availableAges = Object.keys(CDC_GROWTH_STANDARDS[`${metric}_girls`]).map(Number)
    const closestAge = availableAges.reduce((prev, curr) => 
      Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
    )

    const lms = CDC_GROWTH_STANDARDS[`${metric}_girls` as keyof typeof CDC_GROWTH_STANDARDS][closestAge as keyof typeof CDC_GROWTH_STANDARDS['height_girls']]
    
    if (!lms) return 50 // Default to 50th percentile if no data

    // LMS formula: Z = ((value/M)^L - 1) / (L * S)
    const { L, M, S } = lms
    const z = L !== 0 ? (Math.pow(value / M, L) - 1) / (L * S) : Math.log(value / M) / S

    // Convert Z-score to percentile using approximation
    return this.zScoreToPercentile(z)
  }

  private zScoreToPercentile(z: number): number {
    // Approximation of cumulative normal distribution
    // More accurate implementation would use erf function
    const percentile = 50 * (1 + Math.tanh(z / Math.sqrt(2)))
    return Math.max(0.1, Math.min(99.9, percentile))
  }

  private calculateAgeInMonths(birthDate: string, measurementDate: string): number {
    const birth = new Date(birthDate)
    const measurement = new Date(measurementDate)
    
    const yearsDiff = measurement.getFullYear() - birth.getFullYear()
    const monthsDiff = measurement.getMonth() - birth.getMonth()
    
    return yearsDiff * 12 + monthsDiff
  }

  // Vaccination Records
  async createVaccinationRecord(record: Omit<VaccinationRecord, 'id'>): Promise<VaccinationRecord> {
    const { data, error } = await supabase
      .from('vaccination_records')
      .insert([record])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getVaccinationRecords(daughterId: string): Promise<VaccinationRecord[]> {
    const { data, error } = await supabase
      .from('vaccination_records')
      .select('*')
      .eq('daughter_id', daughterId)
      .order('vaccination_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getOverdueVaccinations(daughterId: string): Promise<any[]> {
    const { data, error } = await supabase
      .rpc('get_overdue_vaccinations', { child_id: daughterId })

    if (error) throw error
    return data || []
  }

  // Developmental Milestones
  async createMilestone(milestone: Omit<DevelopmentalMilestone, 'id'>): Promise<DevelopmentalMilestone> {
    const { data, error } = await supabase
      .from('developmental_milestones')
      .insert([milestone])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getMilestones(daughterId: string): Promise<DevelopmentalMilestone[]> {
    const { data, error } = await supabase
      .from('developmental_milestones')
      .select('*')
      .eq('daughter_id', daughterId)
      .order('age_months_expected')

    if (error) throw error
    return data || []
  }

  async updateMilestone(id: string, updates: Partial<DevelopmentalMilestone>): Promise<DevelopmentalMilestone> {
    const { data, error } = await supabase
      .from('developmental_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Health Alerts
  async createHealthAlert(alert: Omit<HealthAlert, 'id'>): Promise<HealthAlert> {
    const { data, error } = await supabase
      .from('health_alerts')
      .insert([alert])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getActiveHealthAlerts(userId: string): Promise<HealthAlert[]> {
    const { data, error } = await supabase
      .from('health_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('dismissed', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async dismissHealthAlert(id: string): Promise<void> {
    const { error } = await supabase
      .from('health_alerts')
      .update({ dismissed: true, dismissed_date: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }

  // Automated Alert Checking
  private async checkGrowthAlerts(growthData: GrowthData): Promise<void> {
    const alerts: Omit<HealthAlert, 'id'>[] = []

    // Check for concerning percentiles
    if (growthData.height_percentile && growthData.height_percentile < 3) {
      alerts.push({
        user_id: growthData.user_id,
        daughter_id: growthData.daughter_id,
        alert_type: 'growth_concern',
        severity: 'high',
        title: 'Height Below 3rd Percentile',
        message: 'Your child\'s height is below the 3rd percentile. Consider consulting with your pediatrician.',
        action_required: true,
        dismissed: false,
        dismissed_date: null
      })
    }

    if (growthData.weight_percentile && growthData.weight_percentile < 3) {
      alerts.push({
        user_id: growthData.user_id,
        daughter_id: growthData.daughter_id,
        alert_type: 'growth_concern',
        severity: 'high',
        title: 'Weight Below 3rd Percentile',
        message: 'Your child\'s weight is below the 3rd percentile. Consider consulting with your pediatrician.',
        action_required: true,
        dismissed: false,
        dismissed_date: null
      })
    }

    // Create alerts
    for (const alert of alerts) {
      await this.createHealthAlert(alert)
    }
  }

  // Nutrition Tracking
  async createNutritionEntry(entry: Omit<NutritionEntry, 'id'>): Promise<NutritionEntry> {
    const { data, error } = await supabase
      .from('nutrition_tracking')
      .insert([entry])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getNutritionEntries(daughterId: string, startDate?: string, endDate?: string): Promise<NutritionEntry[]> {
    let query = supabase
      .from('nutrition_tracking')
      .select('*')
      .eq('daughter_id', daughterId)

    if (startDate) query = query.gte('consumption_date', startDate)
    if (endDate) query = query.lte('consumption_date', endDate)

    const { data, error } = await query.order('consumption_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Growth Predictions
  async createGrowthPrediction(prediction: Omit<GrowthPrediction, 'id'>): Promise<GrowthPrediction> {
    const { data, error } = await supabase
      .from('growth_predictions')
      .insert([prediction])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getGrowthPredictions(daughterId: string): Promise<GrowthPrediction[]> {
    const { data, error } = await supabase
      .from('growth_predictions')
      .select('*')
      .eq('daughter_id', daughterId)
      .order('prediction_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Health Standards Cache
  async getHealthStandards(type: string, source: string, ageMonths?: number, gender?: string): Promise<any> {
    let query = supabase
      .from('health_standards_cache')
      .select('*')
      .eq('standard_type', type)
      .eq('standard_source', source)

    if (ageMonths !== undefined) query = query.eq('age_months', ageMonths)
    if (gender) query = query.eq('gender', gender)

    const { data, error } = await query

    if (error) throw error
    return data || []
  }
}

export const healthDataService = new HealthDataService()