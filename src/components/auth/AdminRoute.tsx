import React from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

interface AdminRouteProps {
  children: React.ReactNode
}

const ADMIN_EMAIL = 'creaitivily@gmail.com'

// Helper function to check admin session
const isAdminAuthenticated = (): boolean => {
  const adminSession = localStorage.getItem('admin_session')
  const adminEmail = localStorage.getItem('admin_email')
  return adminSession === 'true' && adminEmail === ADMIN_EMAIL
}

export function AdminRoute({ children }: AdminRouteProps) {
  // Check admin authentication from localStorage
  if (!isAdminAuthenticated()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin" replace />
  }

  // Render admin content if authenticated
  return <>{children}</>
}

// Export helper function for other components
export { isAdminAuthenticated }