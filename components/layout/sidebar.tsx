import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Home,
  TrendingUp,
  Heart,
  Activity,
  Camera,
  FileText,
  Baby,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-primary' },
  { id: 'growth', label: 'Growth Tracking', icon: TrendingUp, color: 'text-secondary' },
  { id: 'health', label: 'Health Records', icon: Heart, color: 'text-destructive' },
  { id: 'activities', label: 'Activities', icon: Activity, color: 'text-warning' },
  { id: 'memories', label: 'Photos & Memories', icon: Camera, color: 'text-accent' },
  { id: 'reports', label: 'Reports', icon: FileText, color: 'text-muted-foreground' }
]

export function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-72 bg-gradient-soft border-r transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-lavender flex items-center justify-center">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Little Angel</h1>
                  <p className="text-sm text-muted-foreground">Tracking App</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-6">
            <Card className="p-4 bg-gradient-mint border-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
                  <span className="text-xl">👶</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Emma Rose</h3>
                  <p className="text-sm text-muted-foreground">2 years 3 months</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 font-medium transition-all duration-200",
                    isActive 
                      ? "bg-secondary/50 text-secondary-foreground shadow-sm" 
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => {
                    onNavigate(item.id)
                    if (window.innerWidth < 1024) onToggle()
                  }}
                >
                  <Icon className={cn("w-5 h-5 mr-3", isActive ? item.color : "")} />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Made with ❤️ for Emma
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden bg-card shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  )
}