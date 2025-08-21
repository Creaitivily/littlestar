import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useAuth } from '../../contexts/AuthContext'
import { Star, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and privacy policy')
      setLoading(false)
      return
    }

    const { user, error } = await signUp(email, password, fullName)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // If user is returned, it means email confirmation is disabled
      // and the user is automatically logged in
      if (user) {
        navigate('/dashboard')
      } else {
        // Email confirmation is required
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    console.log('Google OAuth signup button clicked')
    
    try {
      const { error } = await signInWithGoogle()
      
      if (error) {
        console.error('Google OAuth signup error:', error)
        setError(`Google sign-up failed: ${error.message}`)
        setLoading(false)
      } else {
        console.log('Google OAuth signup initiated, redirecting...')
        // Don't set loading to false - user will be redirected
      }
    } catch (err) {
      console.error('Unexpected Google OAuth signup error:', err)
      setError('An unexpected error occurred with Google sign-up')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cream-50 via-peach-50 to-sage-50 p-4 overflow-x-hidden">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full">
          <CardHeader className="text-center">
            <Link to="/home" className="flex justify-center mb-4">
              <Star className="w-12 h-12 text-lavender-500 hover:text-lavender-600 transition-colors" />
            </Link>
            <CardTitle className="text-2xl font-bold text-gray-800">Check Your Email</CardTitle>
            <CardDescription className="mb-4">
              We've sent you a confirmation email. Please click the link to verify your account.
            </CardDescription>
            <Link to="/login">
              <Button variant="outline" className="mt-4">
                Go to Login
              </Button>
            </Link>
          </CardHeader>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cream-50 via-peach-50 to-sage-50 p-4 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
        <CardHeader className="text-center">
          <Link to="/home" className="flex justify-center mb-4">
            <img src="/logo.png" alt="MilestoneBee" className="w-12 h-12 hover:scale-105 transition-transform" />
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
          <CardDescription>
            Start tracking your child's milestones today
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="rounded border-lavender-300 text-lavender-500 focus:ring-lavender-400"
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{' '}
                <Link to="/terms" className="text-lavender-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-lavender-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn} 
            className="w-full"
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-lavender-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
        </Card>
        </div>
    </div>
  )
}