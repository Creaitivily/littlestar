import React, { useState } from 'react'
import { GrowthCharts } from './growth-charts'
import { Milestones } from './milestones'
import { AddMeasurement } from './add-measurement'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  Target,
  Plus,
  Calendar
} from 'lucide-react'

export function GrowthTracking() {
  const [activeTab, setActiveTab] = useState('charts')
  const [showAddMeasurement, setShowAddMeasurement] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Growth Tracking</h1>
          <p className="text-muted-foreground">
            Monitor Emma's physical development and milestones
          </p>
        </div>
        <Button onClick={() => setShowAddMeasurement(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Measurement
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Height</p>
              <p className="text-2xl font-bold text-foreground">92 cm</p>
              <Badge variant="success" className="text-xs mt-1">95th percentile</Badge>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/20 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-2xl font-bold text-foreground">14.2 kg</p>
              <Badge variant="warning" className="text-xs mt-1">90th percentile</Badge>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/20 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Milestones</p>
              <p className="text-2xl font-bold text-foreground">5/8</p>
              <Badge variant="success" className="text-xs mt-1">On track</Badge>
            </div>
            <Target className="w-8 h-8 text-success" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Measurement</p>
              <p className="text-2xl font-bold text-foreground">1 week</p>
              <Badge variant="secondary" className="text-xs mt-1">Recent</Badge>
            </div>
            <Calendar className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="charts" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Growth Charts</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Milestones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <GrowthCharts />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Milestones />
        </TabsContent>
      </Tabs>

      {/* Add Measurement Modal */}
      {showAddMeasurement && (
        <AddMeasurement 
          open={showAddMeasurement} 
          onClose={() => setShowAddMeasurement(false)} 
        />
      )}
    </div>
  )
}