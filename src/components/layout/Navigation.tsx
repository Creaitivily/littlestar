import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  TrendingUp, 
  Heart, 
  Calendar, 
  Camera, 
  FileText,
  Star,
  LogOut,
  User,
  Plus,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { ChildOnboardingModal } from '../auth/ChildOnboardingModal'

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Growth', path: '/growth', icon: TrendingUp },
  { name: 'Health', path: '/health', icon: Heart },
  { name: 'Insights', path: '/insights', icon: Lightbulb },
  { name: 'Activities', path: '/activities', icon: Calendar },
  { name: 'Memories', path: '/memories', icon: Camera },
  { name: 'Reports', path: '/reports', icon: FileText },
]

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, createChild, fetchChildren } = useAuth()
  const { isOpen, close, isMobile } = useSidebar()
  const [showAddChild, setShowAddChild] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleChildOnboardingComplete = async (childData: { name: string; birthDate: string; birthTime: string; profileImageUrl?: string | null }) => {
    try {
      const { error } = await createChild(childData)
      if (error) {
        console.error('Error creating child:', error)
        throw error
      }
      
      console.log('Child created successfully from sidebar')
      setShowAddChild(false)
      
      // Refresh children data
      await fetchChildren()
      console.log('Children data refreshed from sidebar')
    } catch (error) {
      console.error('Failed to create child from sidebar:', error)
      throw error
    }
  }

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (isMobile && isOpen) {
      close()
    }
  }

  return (
    <nav 
      id="navigation-sidebar"
      className={cn(
        // Base styles
        "bg-white dark:bg-gray-800 border-r border-sage-200 dark:border-gray-700",
        "w-64 h-full flex flex-col transition-all duration-300 ease-in-out",
        "overflow-hidden",
        // Desktop: relative positioning, always visible when open
        "md:relative md:z-auto",
        // Mobile: fixed positioning with transform
        "fixed top-0 left-0 z-50 md:z-auto",
        // Transform logic for slide animation
        isMobile 
          ? (isOpen ? "translate-x-0" : "-translate-x-full")
          : (isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"),
        // Shadow on mobile when open
        isMobile && isOpen && "shadow-2xl"
      )}
      aria-label="Main navigation"
      aria-hidden={isMobile ? !isOpen : false}
      role="navigation"
    >
      {/* Header */}
      <div className="p-6 border-b border-sage-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MB</span>
          </div>
          <h1 className="text-xl font-bold text-sage-700 dark:text-sage-300 transition-colors">MilestoneBee</h1>
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 flex flex-col p-6">
        <ul className="space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                    isActive 
                      ? "bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300 border border-sage-300 dark:border-sage-600" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-honey-50 dark:hover:bg-gray-700 hover:text-sage-600 dark:hover:text-sage-400"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
          
          {/* Add Child Button */}
          <li className="mt-4">
            <button
              onClick={() => setShowAddChild(true)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full",
                "text-sage-600 dark:text-sage-400 hover:bg-honey-50 dark:hover:bg-gray-700 hover:text-sage-700 dark:hover:text-sage-300",
                "border-2 border-dashed border-sage-300 dark:border-sage-600 hover:border-sage-400 dark:hover:border-sage-500",
                "focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              )}
              aria-label="Add a new child profile"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Add Child</span>
            </button>
          </li>
        </ul>

        {/* User section */}
        <div className="mt-6 pt-6 border-t border-sage-200 dark:border-gray-600">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full",
              "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400",
              "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            )}
            aria-label="Sign out of your account"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Add Child Modal */}
      <ChildOnboardingModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        onComplete={handleChildOnboardingComplete}
        isAdditionalChild={true}
      />
    </nav>
  )
}