import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Download,
  Printer,
  Calendar,
  Syringe,
  Pill,
  Thermometer,
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

interface HealthReportsProps {
  dateRange: string
}

const healthSummary = {
  checkups: { total: 4, completed: 4, nextDue: 'Sep 15, 2024' },
  vaccinations: { total: 10, completed: 8, pending: 2 },
  medications: { active: 1, completed: 2 },
  healthScore: 9.8
}

const upcomingEvents = [
  { date: '2024-08-25', type: 'checkup', description: '6-month wellness visit' },
  { date: '2024-08-28', type: 'vaccination', description: 'MMR second dose' },
  { date: '2024-09-15', type: 'checkup', description: 'Growth assessment' }
]

export function HealthReports({ dateRange }: HealthReportsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Health Reports</h2>
          <p className="text-sm text-muted-foreground">
            Medical history, vaccination records, and health summaries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold text-foreground">{healthSummary.healthScore}/10</p>
              <Badge variant="success" className="text-xs mt-1">Excellent</Badge>
            </div>
            <Heart className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Checkups</p>
              <p className="text-2xl font-bold text-foreground">{healthSummary.checkups.completed}/{healthSummary.checkups.total}</p>
              <Badge variant="secondary" className="text-xs mt-1">Up to date</Badge>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <p className="text-2xl font-bold text-foreground">{healthSummary.vaccinations.completed}/{healthSummary.vaccinations.total}</p>
              <Badge variant="warning" className="text-xs mt-1">{healthSummary.vaccinations.pending} pending</Badge>
            </div>
            <Syringe className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Medications</p>
              <p className="text-2xl font-bold text-foreground">{healthSummary.medications.active}</p>
              <Badge variant="secondary" className="text-xs mt-1">Active</Badge>
            </div>
            <Pill className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Health Report Templates</CardTitle>
          <CardDescription>Generate comprehensive health summaries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">Complete Health Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive report including all health records, vaccinations, and growth data
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">PDF • 8-12 pages</Badge>
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Syringe className="w-5 h-5 text-warning" />
                    <h4 className="font-medium">Vaccination Record</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Official vaccination record for school enrollment and travel
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">PDF • 2-3 pages</Badge>
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Health Events</CardTitle>
          <CardDescription>Scheduled appointments and health reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
                    {event.type === 'checkup' ? (
                      <Heart className="w-4 h-4 text-white" />
                    ) : (
                      <Syringe className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{event.type}</div>
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}