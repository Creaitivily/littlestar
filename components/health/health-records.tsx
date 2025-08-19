import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentsSection } from './appointments-section'
import { VaccinationsSection } from './vaccinations-section'
import { MedicationsSection } from './medications-section'
import { HealthMetrics } from './health-metrics'
import {
  Calendar,
  Syringe,
  Pill,
  Heart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'

export function HealthRecords() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground">
            Manage Emma's medical information and health tracking
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Health Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Status</p>
              <p className="text-xl font-bold text-foreground">Excellent</p>
              <Badge variant="success" className="text-xs mt-1">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Up to date
              </Badge>
            </div>
            <Heart className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Appointment</p>
              <p className="text-xl font-bold text-foreground">Aug 25</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Clock className="w-3 h-3 mr-1" />
                In 7 days
              </Badge>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <p className="text-xl font-bold text-foreground">8/10</p>
              <Badge variant="warning" className="text-xs mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                2 pending
              </Badge>
            </div>
            <Syringe className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Medications</p>
              <p className="text-xl font-bold text-foreground">1 Active</p>
              <Badge variant="secondary" className="text-xs mt-1">
                <Pill className="w-3 h-3 mr-1" />
                Vitamin D
              </Badge>
            </div>
            <Pill className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center space-x-2">
            <Syringe className="w-4 h-4" />
            <span>Vaccinations</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center space-x-2">
            <Pill className="w-4 h-4" />
            <span>Medications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <HealthMetrics />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <AppointmentsSection />
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-6">
          <VaccinationsSection />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}