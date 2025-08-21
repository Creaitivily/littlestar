import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-9 h-9 p-0 rounded-full transition-all duration-200",
        "hover:bg-sage-100 dark:hover:bg-sage-800",
        "focus:ring-2 focus:ring-sage-400 focus:ring-offset-2",
        "dark:focus:ring-sage-500 dark:focus:ring-offset-gray-800",
        className
      )}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-sage-600 dark:text-sage-400 transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Sun className="w-4 h-4 text-sage-600 dark:text-sage-400 transition-transform duration-200 rotate-0 scale-100" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </Button>
  )
}