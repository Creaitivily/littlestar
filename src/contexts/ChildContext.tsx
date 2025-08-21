import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface Child {
  id: string
  user_id: string
  name: string
  birth_date: string
  birth_time: string | null
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

interface ChildContextType {
  selectedChild: Child | null
  setSelectedChild: (child: Child | null) => void
}

const ChildContext = createContext<ChildContextType | undefined>(undefined)

export function ChildProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const { children } = useAuth()
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  // Auto-select first child when children list changes
  useEffect(() => {
    if (children && children.length > 0 && !selectedChild) {
      setSelectedChild(children[0])
    }
  }, [children, selectedChild])

  return (
    <ChildContext.Provider value={{ selectedChild, setSelectedChild }}>
      {reactChildren}
    </ChildContext.Provider>
  )
}

export function useChild() {
  const context = useContext(ChildContext)
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider')
  }
  return context
}