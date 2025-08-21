import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  className?: string
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const { isOpen, toggle, isMobile } = useSidebar()

  if (!isMobile) return null

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "bg-white dark:bg-gray-900 border-b border-sage-200 dark:border-gray-700",
      "transition-colors duration-200",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Hamburger menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn(
            "w-10 h-10 p-0 rounded-lg transition-colors duration-200",
            "hover:bg-sage-100 dark:hover:bg-gray-800",
            "focus:ring-2 focus:ring-sage-400 focus:ring-offset-2",
            "dark:focus:ring-sage-500 dark:focus:ring-offset-gray-900"
          )}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="navigation-sidebar"
          aria-haspopup="menu"
        >
          <span className="sr-only">
            {isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          </span>
          {isOpen ? (
            <X className="w-5 h-5 text-sage-600 dark:text-sage-400 transition-transform duration-200" />
          ) : (
            <Menu className="w-5 h-5 text-sage-600 dark:text-sage-400 transition-transform duration-200" />
          )}
        </Button>

        {/* Center - App title/logo */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <h1 className="text-lg font-bold text-sage-800 dark:text-sage-200">
              MilestoneBee
            </h1>
          </div>
        </div>

        {/* Right side - Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}