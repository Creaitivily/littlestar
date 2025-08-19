import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Mail, Lock, Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ADMIN_EMAIL = 'creaitivily@gmail.com'
const ADMIN_PASSWORD = 'abc123'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('Admin login attempt:')
    console.log('Entered email:', `"${email}"`)
    console.log('Expected email:', `"${ADMIN_EMAIL}"`)
    console.log('Email match:', email === ADMIN_EMAIL)
    console.log('Entered password:', `"${password}"`)
    console.log('Expected password:', `"${ADMIN_PASSWORD}"`)
    console.log('Password match:', password === ADMIN_PASSWORD)

    // Simulate a brief loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email.trim() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      localStorage.setItem('admin_session', 'true')
      localStorage.setItem('admin_email', email.trim())
      console.log('Admin login successful')
      navigate('/admin/dashboard')
    } else {
      console.log('Admin login failed - credentials do not match')
      setError('Invalid admin credentials. Access denied.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-red-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/landing" className="flex items-center gap-2">
              <Star className="w-8 h-8 text-lavender-500" />
              <span className="text-xl font-bold text-gray-800">Little Star</span>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                User Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-red-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Access</CardTitle>
            <CardDescription className="text-red-600 font-medium">
              Restricted Area - Authorized Personnel Only
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Security Notice</span>
              </div>
              <p className="text-xs text-red-600">
                This area is restricted to authorized administrators only. 
                All access attempts are logged and monitored.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2 pt-4 border-t border-red-200">
              <div className="text-xs text-red-500 space-y-1">
                <p className="font-medium">Admin Credentials Required</p>
                <p>Only authorized administrators can access this area</p>
              </div>
              
              {/* Debug info - remove in production */}
              <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 space-y-1">
                <p className="font-medium">Expected Credentials:</p>
                <p>Email: {ADMIN_EMAIL}</p>
                <p>Password: {ADMIN_PASSWORD}</p>
              </div>
              
              <div className="pt-2">
                <Link to="/landing">
                  <Button variant="outline" size="sm">
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}