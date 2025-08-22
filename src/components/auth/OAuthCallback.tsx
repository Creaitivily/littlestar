import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        
        if (accessToken) {
          // Session is already set by Supabase, just navigate to dashboard
          console.log('OAuth callback successful, redirecting to dashboard...')
          navigate('/dashboard', { replace: true })
        } else {
          // Check if we have an error
          const error = hashParams.get('error_description') || hashParams.get('error')
          if (error) {
            console.error('OAuth error:', error)
            navigate('/login', { 
              replace: true, 
              state: { error: 'Authentication failed. Please try again.' } 
            })
          } else {
            // No token and no error, check if user is already authenticated
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
              navigate('/dashboard', { replace: true })
            } else {
              navigate('/login', { replace: true })
            }
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}