import React from 'react'
import { AppSidebar } from './AppSidebar'
import { FloatingMilestoneBotWidget } from '../insights/FloatingMilestoneBotWidget'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  // Generate breadcrumb from current path
  const generateBreadcrumb = () => {
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)
    
    if (segments.length === 0 || path === '/dashboard') {
      return 'Dashboard'
    }
    
    // Capitalize first letter of each segment
    return segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{generateBreadcrumb()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
      
      {/* Floating chatbot widget */}
      <FloatingMilestoneBotWidget />
    </>
  )
}