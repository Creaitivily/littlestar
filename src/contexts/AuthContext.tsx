import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { initializeStorage, testStorageAccess, manualStorageTest, deleteAllChildProfiles } from '../lib/storage'

interface Child {
  id: string
  user_id: string
  name: string
  birth_date: string
  birth_time: string | null
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  children: Child[]
  hasChildren: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ user: User | null; error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  createChild: (childData: { name: string; birthDate: string; birthTime: string; profileImageUrl?: string | null }) => Promise<{ child: Child | null; error: any }>
  fetchChildren: () => Promise<void>
  deleteAllChildren: () => Promise<{ success: boolean; error: any }>
  fetchChildActivities: (childId: string) => Promise<any[]>
  fetchChildGrowthRecords: (childId: string) => Promise<any[]>
  fetchChildHealthRecords: (childId: string) => Promise<any[]>
  fetchChildMemories: (childId: string) => Promise<any[]>
  createActivity: (childId: string, activityData: any) => Promise<{ data: any; error: any }>
  createGrowthRecord: (childId: string, growthData: any) => Promise<{ data: any; error: any }>
  createHealthRecord: (childId: string, healthData: any) => Promise<{ data: any; error: any }>
  createMemory: (childId: string, memoryData: any) => Promise<{ data: any; error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [childrenData, setChildrenData] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const ensureUserProfile = async (currentUser: User) => {
    console.log('Ensuring user profile exists for:', currentUser.id)
    
    try {
      // Check if user profile exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', currentUser.id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking user profile:', checkError)
        return // Don't throw, just return to not block authentication
      }
      
      if (!existingUser) {
        console.log('User profile not found, creating one...')
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: currentUser.id,
            email: currentUser.email!,
            full_name: currentUser.user_metadata?.full_name || null,
          })
        
        if (createError) {
          console.error('Error creating user profile:', createError)
          // Don't throw, just log the error to not block authentication
        } else {
          console.log('User profile created successfully')
        }
      } else {
        console.log('User profile already exists')
      }
    } catch (error) {
      console.error('Unexpected error in ensureUserProfile:', error)
      // Don't throw, just log the error to not block authentication
    }
  }

  useEffect(() => {
    let mounted = true
    
    // Test and initialize storage
    const setupStorage = async () => {
      const { success, error } = await testStorageAccess()
      if (!success) {
        console.warn('Storage access check failed:', error)
        console.log('Storage features may be limited.')
        console.log('You can run manualStorageTest() in the browser console to debug storage issues')
      } else {
        const storageInitialized = await initializeStorage()
        if (!storageInitialized) {
          console.info('Storage bucket not available. File upload features will be disabled.')
        }
      }
    }
    
    setupStorage().catch(err => {
      console.warn('Storage setup failed:', err)
      // Don't crash the app, just continue without storage
    })
    
    // Make debug functions available globally
    if (typeof window !== 'undefined') {
      ;(window as any).manualStorageTest = manualStorageTest
      ;(window as any).testStorageAccess = testStorageAccess
      ;(window as any).deleteAllChildProfiles = (userId: string) => deleteAllChildProfiles(userId)
    }
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Fetch children if user is already logged in
        if (session?.user) {
          // Ensure user profile exists for existing sessions
          await ensureUserProfile(session.user)
          
          if (!mounted) return
          
          try {
            const { data: initialChildren, error } = await supabase
              .from('daughters')
              .select('*')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: true })

            if (!mounted) return

            if (!error && initialChildren) {
              setChildrenData(initialChildren)
            } else if (error) {
              console.error('Error fetching children on session restore:', error)
            }
          } catch (error) {
            console.error('Unexpected error fetching children on session restore:', error)
          }
        }
      } catch (error) {
        console.error('Error in initial session setup:', error)
      } finally {
        if (mounted) {
          console.log('Initial session setup complete, setting loading to false')
          setLoading(false)
        }
      }
    })

    // Fallback timeout to ensure loading state is cleared
    const fallbackTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Fallback timeout: setting loading to false')
        setLoading(false)
      }
    }, 5000)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      // Set loading to false immediately when we have auth state
      console.log('Auth state determined, setting loading to false')
      setLoading(false)
      
      // Handle background operations without blocking UI
      if (session?.user) {
        // Create user profile on signup
        if ((event as string) === 'SIGNED_UP') {
          console.log('Handling SIGNED_UP event')
          createUserProfile(session.user).catch(console.error)
        }

        // Fetch children when user signs in
        if ((event as string) === 'SIGNED_IN') {
          console.log('Handling SIGNED_IN event')
          
          // Run background operations without blocking
          Promise.resolve().then(async () => {
            await ensureUserProfile(session.user)
            
            try {
              const { data: childrenData, error } = await supabase
                .from('daughters')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: true })

              if (!error && childrenData) {
                console.log('Fetched children data:', childrenData.length, 'children')
                setChildrenData(childrenData)
              } else if (error) {
                console.error('Error fetching children on sign in:', error)
              }
            } catch (error) {
              console.error('Unexpected error fetching children:', error)
            }
          })
        }
      } else {
        // Clear children when user signs out
        if ((event as string) === 'SIGNED_OUT') {
          console.log('Handling SIGNED_OUT event')
          setChildrenData([])
        }
      }
    })

    return () => {
      mounted = false
      clearTimeout(fallbackTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const createUserProfile = async (user: User) => {
    console.log('Creating user profile for:', user.id, user.email)
    
    try {
      // Check if profile already exists to avoid duplicate key errors
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', checkError)
        return
      }
      
      if (existingProfile) {
        console.log('User profile already exists, skipping creation')
        return
      }
      
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
        })
      
      if (error) {
        console.error('Error creating user profile:', error)
        // Don't throw error here as it might prevent signup completion
      } else {
        console.log('User profile created successfully')
      }
    } catch (error) {
      console.error('Unexpected error in createUserProfile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { user: data.user, error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in:', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('Sign in result:', { user: data.user?.email, error: error?.message })
      return { user: data.user, error }
    } catch (err) {
      console.error('Unexpected sign in error:', err)
      return { user: null, error: err as any }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    console.log('Attempting Google OAuth sign in...')
    console.log('Current origin:', window.location.origin)
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      })
      
      console.log('Google OAuth result:', { data, error })
      
      if (error) {
        console.error('Google OAuth error details:', error)
        // Provide more specific error messages
        if (error.message?.includes('Invalid login credentials')) {
          return { user: null, error: { ...error, message: 'Google authentication failed. Please ensure Google OAuth is properly configured.' } }
        }
        return { user: null, error }
      }
      
      // OAuth redirect happens automatically, no user returned immediately
      console.log('Google OAuth redirect should happen now...')
      return { user: null, error: null }
    } catch (err) {
      console.error('Unexpected Google OAuth error:', err)
      return { user: null, error: err as any }
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const fetchChildren = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('daughters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setChildrenData(data)
    }
  }

  const createChild = async (childData: { name: string; birthDate: string; birthTime: string; profileImageUrl?: string | null }) => {
    if (!user) {
      return { child: null, error: new Error('User not authenticated') }
    }

    console.log('Creating child with data:', childData)
    console.log('User ID:', user.id)
    console.log('User email:', user.email)
    
    try {
      // Ensure user profile exists before creating child
      await ensureUserProfile(user)
    } catch (profileError) {
      console.error('Failed to ensure user profile:', profileError)
      return { child: null, error: profileError }
    }

    try {
      // First try with birth_time column
      let insertData: any = {
        user_id: user.id,
        name: childData.name,
        birth_date: childData.birthDate,
        profile_image_url: childData.profileImageUrl || null,
      }

      // Add birth_time if provided
      if (childData.birthTime) {
        insertData.birth_time = childData.birthTime
      }

      console.log('Attempting to insert:', insertData)

      const { data, error } = await supabase
        .from('daughters')
        .insert(insertData)
        .select()
        .single()

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Database error:', error)
        
        // If birth_time column doesn't exist, try without it
        if (error.message?.includes('birth_time') || error.code === '42703') {
          console.log('Trying without birth_time column...')
          const fallbackData = {
            user_id: user.id,
            name: childData.name,
            birth_date: childData.birthDate,
            profile_image_url: childData.profileImageUrl || null,
          }
          
          const { data: fallbackResult, error: fallbackError } = await supabase
            .from('daughters')
            .insert(fallbackData)
            .select()
            .single()
            
          console.log('Fallback response:', { data: fallbackResult, error: fallbackError })
          
          if (fallbackError) {
            return { child: null, error: fallbackError }
          }
          
          if (fallbackResult) {
            setChildrenData(prev => [...prev, fallbackResult])
            return { child: fallbackResult, error: null }
          }
        }
        
        return { child: null, error }
      }

      if (data) {
        setChildrenData(prev => [...prev, data])
        return { child: data, error: null }
      }

      return { child: null, error: new Error('No data returned from database') }
    } catch (err) {
      console.error('Unexpected error creating child:', err)
      return { child: null, error: err }
    }
  }

  const deleteAllChildren = async () => {
    if (!user) {
      return { success: false, error: new Error('User not authenticated') }
    }

    try {
      console.log('Deleting all children for user:', user.id)
      
      const result = await deleteAllChildProfiles(user.id)
      
      if (result.success) {
        // Clear the local children state
        setChildrenData([])
        console.log('Local children state cleared')
      }
      
      return result
    } catch (error) {
      console.error('Error in deleteAllChildren:', error)
      return { success: false, error }
    }
  }

  const fetchChildActivities = async (childId: string) => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('daughter_id', childId)
        .order('date', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching child activities:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching child activities:', error)
      return []
    }
  }

  const fetchChildGrowthRecords = async (childId: string) => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('growth_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('daughter_id', childId)
        .order('measurement_date', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching child growth records:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching child growth records:', error)
      return []
    }
  }

  const fetchChildHealthRecords = async (childId: string) => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('daughter_id', childId)
        .order('date', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching child health records:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching child health records:', error)
      return []
    }
  }

  const fetchChildMemories = async (childId: string) => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .eq('daughter_id', childId)
        .order('date', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching child memories:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching child memories:', error)
      return []
    }
  }

  const createActivity = async (childId: string, activityData: any) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          daughter_id: childId,
          ...activityData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating activity:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating activity:', error)
      return { data: null, error }
    }
  }

  const createGrowthRecord = async (childId: string, growthData: any) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('growth_records')
        .insert({
          user_id: user.id,
          daughter_id: childId,
          ...growthData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating growth record:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating growth record:', error)
      return { data: null, error }
    }
  }

  const createHealthRecord = async (childId: string, healthData: any) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          daughter_id: childId,
          ...healthData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating health record:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating health record:', error)
      return { data: null, error }
    }
  }

  const createMemory = async (childId: string, memoryData: any) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          daughter_id: childId,
          ...memoryData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating memory:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating memory:', error)
      return { data: null, error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        children: childrenData,
        hasChildren: childrenData.length > 0,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        resetPassword,
        createChild,
        fetchChildren,
        deleteAllChildren,
        fetchChildActivities,
        fetchChildGrowthRecords,
        fetchChildHealthRecords,
        fetchChildMemories,
        createActivity,
        createGrowthRecord,
        createHealthRecord,
        createMemory,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}