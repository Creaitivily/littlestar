import React from 'react'
import { OverviewCards } from './overview-cards'
import { RecentActivities } from './recent-activities'
import { QuickActions } from './quick-actions'
import { UpcomingEvents } from './upcoming-events'

export function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Good morning! 
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with Emma today
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
        
        {/* Side Panel */}
        <div className="space-y-8">
          <QuickActions />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  )
}