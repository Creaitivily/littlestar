import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function useAuthRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if we're coming from an OAuth redirect
    const checkOAuthRedirect = async () => {
      // Check for OAuth tokens in the URL hash
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('OAuth tokens detected in URL, processing...')
        
        // Let Supabase handle the tokens
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session && !error) {
          console.log('OAuth session established, redirecting to dashboard...')
          // Clear the hash to clean up the URL
          window.history.replaceState(null, '', window.location.pathname)
          navigate('/dashboard', { replace: true })
        }
      }
      
      // Also check if we're on the home page with an active session
      if (location.pathname === '/home' || location.pathname === '/') {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          console.log('Active session found on home page, redirecting to dashboard...')
          navigate('/dashboard', { replace: true })
        }
      }
    }

    checkOAuthRedirect()
  }, [navigate, location.pathname])
}