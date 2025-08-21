import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface UserSettings {
  id?: string
  user_id?: string
  // Notification settings
  milestone_reminders: boolean
  weekly_summaries: boolean
  app_updates: boolean
  email_notifications: boolean
  push_notifications: boolean
  // Privacy & Security settings
  two_factor_enabled: boolean
  data_encryption_enabled: boolean
  // Appearance settings
  theme: 'light' | 'dark' | 'auto'
  color_scheme: string
  // Language & Region settings
  language: string
  date_format: string
  country: string
  emergency_contact_numbers: Record<string, string>
}

const defaultSettings: UserSettings = {
  milestone_reminders: true,
  weekly_summaries: true,
  app_updates: false,
  email_notifications: true,
  push_notifications: true,
  two_factor_enabled: false,
  data_encryption_enabled: true,
  theme: 'auto',
  color_scheme: 'milestonebee',
  language: 'en',
  date_format: 'MM/DD/YYYY',
  country: 'US',
  emergency_contact_numbers: {}
}

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user settings
  const fetchSettings = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // If no settings exist, create default settings
        if (error.code === 'PGRST116') {
          await createDefaultSettings()
        } else {
          throw error
        }
      } else {
        setSettings(data)
      }
    } catch (err) {
      console.error('Error fetching user settings:', err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  // Create default settings for new user
  const createDefaultSettings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          ...defaultSettings
        })
        .select()
        .single()

      if (error) throw error
      setSettings(data)
    } catch (err) {
      console.error('Error creating default settings:', err)
      setError('Failed to create settings')
    }
  }

  // Update a specific setting
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (!user) return

    try {
      const updatedSettings = { ...settings, [key]: value }
      
      const { data, error } = await supabase
        .from('user_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setSettings(updatedSettings)
      return { success: true }
    } catch (err) {
      console.error('Error updating setting:', err)
      setError('Failed to update setting')
      return { success: false, error: err }
    }
  }

  // Update multiple settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return

    try {
      const updatedSettings = { ...settings, ...newSettings }
      
      const { data, error } = await supabase
        .from('user_settings')
        .update({ ...newSettings, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setSettings(updatedSettings)
      return { success: true }
    } catch (err) {
      console.error('Error updating settings:', err)
      setError('Failed to update settings')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    refreshSettings: fetchSettings
  }
}