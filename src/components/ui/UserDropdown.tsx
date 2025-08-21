import { ChevronDown, User, Settings, CreditCard, UserCircle, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './dropdown-menu'
import { useSidebar } from './sidebar'

interface UserDropdownProps {
  user: {
    email?: string
  } | null
  onProfile: () => void
  onSubscriptions: () => void
  onSettings: () => void
  onLogout: () => void
}

export function UserDropdown({ 
  user, 
  onProfile, 
  onSubscriptions, 
  onSettings, 
  onLogout 
}: UserDropdownProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          <button 
            className="w-8 h-8 rounded-md bg-sage-100 dark:bg-sage-900/20 hover:bg-cream-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400 flex items-center justify-center"
            title={user?.email || 'User Account'}
          >
            <User className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          </button>
        ) : (
          <button className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-md hover:bg-cream-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-coral-500 dark:focus:ring-coral-400 text-left">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-navy-700 dark:text-cream-100 truncate">
                  {user?.email || 'User'}
                </div>
                <div className="text-xs text-navy-500 dark:text-cream-300">
                  Account settings
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-navy-500 dark:text-cream-400 flex-shrink-0" />
          </button>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-[200px]" align="start">
        {/* Profile */}
        <DropdownMenuItem
          onClick={onProfile}
          className="cursor-pointer hover:bg-cream-100 dark:hover:bg-navy-700"
        >
          <UserCircle className="w-4 h-4 mr-3 text-navy-600 dark:text-cream-300" />
          <span className="text-navy-700 dark:text-cream-100">Profile</span>
        </DropdownMenuItem>
        
        {/* Subscriptions */}
        <DropdownMenuItem
          onClick={onSubscriptions}
          className="cursor-pointer hover:bg-cream-100 dark:hover:bg-navy-700"
        >
          <CreditCard className="w-4 h-4 mr-3 text-navy-600 dark:text-cream-300" />
          <span className="text-navy-700 dark:text-cream-100">Subscriptions</span>
        </DropdownMenuItem>
        
        {/* Settings */}
        <DropdownMenuItem
          onClick={onSettings}
          className="cursor-pointer hover:bg-cream-100 dark:hover:bg-navy-700"
        >
          <Settings className="w-4 h-4 mr-3 text-navy-600 dark:text-cream-300" />
          <span className="text-navy-700 dark:text-cream-100">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Sign Out */}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-3 text-red-600 dark:text-red-400" />
          <span className="text-red-600 dark:text-red-400">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}