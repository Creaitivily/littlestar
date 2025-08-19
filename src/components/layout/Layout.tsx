import React from 'react'
import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-cream-50">
      <Navigation />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}