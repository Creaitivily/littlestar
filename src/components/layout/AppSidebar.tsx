import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  TrendingUp, 
  Heart, 
  Calendar, 
  Camera, 
  FileText,
  Lightbulb
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useChild } from '../../contexts/ChildContext'
import { ChildOnboardingModal } from '../auth/ChildOnboardingModal'
import { SidebarChildSelector } from '../ui/SidebarChildSelector'
import { UserDropdown } from '../ui/UserDropdown'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Growth', path: '/growth', icon: TrendingUp },
  { name: 'Health', path: '/health', icon: Heart },
  { name: 'Insights', path: '/insights', icon: Lightbulb },
  { name: 'Activities', path: '/activities', icon: Calendar },
  { name: 'Memories', path: '/memories', icon: Camera },
  { name: 'Reports', path: '/reports', icon: FileText },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, createChild, fetchChildren, children } = useAuth()
  const { selectedChild, setSelectedChild } = useChild()
  const [showAddChild, setShowAddChild] = useState(false)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
    console.log('Navigate to Profile')
  }

  const handleSubscriptions = () => {
    navigate('/subscriptions')
    console.log('Navigate to Subscriptions')
  }

  const handleSettings = () => {
    navigate('/settings')
    console.log('Navigate to Settings')
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
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className={isCollapsed ? "p-2 flex items-center justify-center" : "p-4"}>
          {isCollapsed ? (
            <img 
              src="/logo.png" 
              alt="MilestoneBee Logo" 
              className="w-8 h-8 object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="MilestoneBee Logo" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <h1 className="text-xl font-bold text-navy-700 dark:text-cream-200 transition-colors">
                MilestoneBee
              </h1>
            </div>
          )}
        </SidebarHeader>
        
        <SidebarContent>
          {/* Child Selector - Above Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <div className={isCollapsed ? "px-2 py-1 flex justify-center" : "px-2 py-1"}>
                <SidebarChildSelector
                  children={children || []}
                  selectedChild={selectedChild}
                  onChildSelect={setSelectedChild}
                  onAddChild={() => setShowAddChild(true)}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />
          
          {/* Navigation Items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        tooltip={item.name}
                      >
                        <Link to={item.path}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className={isCollapsed ? "p-2 flex justify-center" : "p-2"}>
            <UserDropdown
              user={user}
              onProfile={handleProfile}
              onSubscriptions={handleSubscriptions}
              onSettings={handleSettings}
              onLogout={handleLogout}
            />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Add Child Modal */}
      <ChildOnboardingModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        onComplete={handleChildOnboardingComplete}
        isAdditionalChild={true}
      />
    </>
  )
}