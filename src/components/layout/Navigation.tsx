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

  return (
    <nav className="w-64 bg-white border-r border-sage-200 min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" alt="MilestoneBee" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-sage-700">MilestoneBee</h1>
      </div>
      
      <ul className="space-y-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-sage-100 text-sage-700 border border-sage-300" 
                    : "text-gray-600 hover:bg-honey-50 hover:text-sage-600"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          )
        })}
        
        {/* Add Child Button */}
        <li>
          <button
            onClick={() => setShowAddChild(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sage-600 hover:bg-honey-50 hover:text-sage-700 border-2 border-dashed border-sage-300 hover:border-sage-400 w-full"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Child</span>
          </button>
        </li>
      </ul>

      {/* User section */}
      <div className="mt-auto pt-6 border-t border-sage-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600 truncate">
            {user?.email || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
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