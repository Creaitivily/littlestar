import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          updated_at?: string
        }
      }
      daughters: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_date: string
          birth_time: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          birth_date: string
          birth_time?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          birth_date?: string
          birth_time?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          daughter_id: string
          type: string
          description: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daughter_id: string
          type: string
          description?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daughter_id?: string
          type?: string
          description?: string | null
          date?: string
        }
      }
      growth_records: {
        Row: {
          id: string
          user_id: string
          daughter_id: string
          height: number | null
          weight: number | null
          measurement_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daughter_id: string
          height?: number | null
          weight?: number | null
          measurement_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daughter_id?: string
          height?: number | null
          weight?: number | null
          measurement_date?: string
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          daughter_id: string
          type: string
          description: string
          date: string
          doctor_name: string | null
          attachment_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daughter_id: string
          type: string
          description: string
          date: string
          doctor_name?: string | null
          attachment_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daughter_id?: string
          type?: string
          description?: string
          date?: string
          doctor_name?: string | null
          attachment_url?: string | null
        }
      }
      memories: {
        Row: {
          id: string
          user_id: string
          daughter_id: string
          title: string
          description: string | null
          image_url: string | null
          attachment_url: string | null
          attachment_urls: string[] | null
          google_photos_url: string | null
          google_photos_urls: string[] | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daughter_id: string
          title: string
          description?: string | null
          image_url?: string | null
          attachment_url?: string | null
          attachment_urls?: string[] | null
          google_photos_url?: string | null
          google_photos_urls?: string[] | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daughter_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          attachment_url?: string | null
          attachment_urls?: string[] | null
          google_photos_url?: string | null
          google_photos_urls?: string[] | null
          date?: string
        }
      }
    }
  }
}