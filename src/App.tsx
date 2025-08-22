import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ChildProvider } from './contexts/ChildContext'
import { SidebarProvider } from './components/ui/sidebar'
// Initialize app services
import './services/appInitializer'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import { LoginForm } from './components/auth/LoginForm'
import { SignupForm } from './components/auth/SignupForm'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Growth } from './pages/Growth'
import { Health } from './pages/Health'
import { Activities } from './pages/Activities'
import { Memories } from './pages/Memories'
import { Reports } from './pages/Reports'
import { Insights } from './pages/Insights'
import { Profile } from './pages/Profile'
import { Subscriptions } from './pages/Subscriptions'
import { Settings } from './pages/Settings'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { TermsOfService } from './pages/TermsOfService'
import { PrivacyPolicy } from './pages/PrivacyPolicy'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChildProvider>
          <SidebarProvider defaultOpen={true}>
            <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* OAuth callback route */}
          <Route path="/auth/google/callback" element={<Navigate to="/dashboard" replace />} />
          
          {/* Redirect root to home page */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/growth" element={
            <ProtectedRoute>
              <Layout>
                <Growth />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/health" element={
            <ProtectedRoute>
              <Layout>
                <Health />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute>
              <Layout>
                <Activities />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/memories" element={
            <ProtectedRoute>
              <Layout>
                <Memories />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute>
              <Layout>
                <Insights />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/subscriptions" element={
            <ProtectedRoute>
              <Layout>
                <Subscriptions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
            </Routes>
          </Router>
        </SidebarProvider>
        </ChildProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App