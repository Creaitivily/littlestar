import React, { createContext, useContext, useEffect, useState } from 'react'

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Auto-close on mobile when screen size changes
      if (mobile && isOpen) {
        setIsOpen(false)
      }
      // Auto-open on desktop if it was closed due to mobile
      else if (!mobile && !isOpen) {
        setIsOpen(true)
      }
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isOpen])

  // Set initial state based on screen size
  useEffect(() => {
    const initialMobile = window.innerWidth < 768
    setIsMobile(initialMobile)
    // Always start closed on mobile, open on desktop
    setIsOpen(!initialMobile)
  }, [])

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && isMobile) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isMobile])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isOpen])

  const toggle = () => setIsOpen(prev => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const value: SidebarContextType = {
    isOpen,
    toggle,
    open,
    close,
    isMobile
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}