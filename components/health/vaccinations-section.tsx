import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Syringe,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Shield,
  Plus
} from 'lucide-react'

interface Vaccination {
  id: string
  name: string
  description: string
  doseNumber: number
  totalDoses: number
  dueDate: Date
  givenDate?: Date
  nextDue?: Date
  status: 'completed' | 'due' | 'overdue' | 'upcoming'
  provider?: string
  location?: string
  lotNumber?: string
  sideEffects?: string
  category: 'routine' | 'seasonal' | 'travel'
}

const vaccinations: Vaccination[] = [
  {
    id: '1',
    name: 'DTaP',
    description: 'Diphtheria, Tetanus, and Pertussis',
    doseNumber: 4,
    totalDoses: 5,
    dueDate: new Date(2023, 5, 15),
    givenDate: new Date(2023, 5, 12),
    nextDue: new Date(2025, 5, 15),
    status: 'completed',
    provider: 'Dr. Sarah Johnson',
    location: 'Sunshine Pediatrics',
    lotNumber: 'DTaP-2023-456',
    category: 'routine'
  },
  {
    id: '2',
    name: 'MMR',
    description: 'Measles, Mumps, and Rubella',
    doseNumber: 1,
    totalDoses: 2,
    dueDate: new Date(2023, 7, 10),
    givenDate: new Date(2023, 7, 8),
    nextDue: new Date(2024, 7, 28),
    status: 'completed',
    provider: 'Dr. Sarah Johnson',
    location: 'Sunshine Pediatrics',
    lotNumber: 'MMR-2023-789',
    category: 'routine'
  },
  {
    id: '3',
    name: 'MMR',
    description: 'Measles, Mumps, and Rubella (2nd dose)',
    doseNumber: 2,
    totalDoses: 2,
    dueDate: new Date(2024, 7, 28),
    status: 'due',
    category: 'routine'
  },
  {
    id: '4',
    name: 'Varicella',
    description: 'Chickenpox',
    doseNumber: 1,
    totalDoses: 2,
    dueDate: new Date(2024, 8, 15),
    status: 'upcoming',
    category: 'routine'
  },
  {
    id: '5',
    name: 'Hepatitis A',
    description: 'Hepatitis A',
    doseNumber: 1,
    totalDoses: 2,
    dueDate: new Date(2024, 9, 1),
    status: 'upcoming',
    category: 'routine'
  },
  {
    id: '6',
    name: 'Influenza',
    description: 'Annual flu vaccine',
    doseNumber: 1,
    totalDoses: 1,
    dueDate: new Date(2024, 8, 1),
    status: 'due',
    category: 'seasonal'
  }
]

const statusColors = {
  completed: 'success',
  due: 'warning',
  overdue: 'destructive',
  upcoming: 'secondary'
} as const

const statusIcons = {
  completed: CheckCircle2,
  due: AlertTriangle,
  overdue: AlertTriangle,
  upcoming: Clock
}

const categoryColors = {
  routine: 'primary',
  seasonal: 'warning',
  travel: 'accent'
} as const

function VaccinationCard({ vaccination }: { vaccination: Vaccination }) {
  const StatusIcon = statusIcons[vaccination.status]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Syringe className="w-5 h-5 text-primary" />
              <span>{vaccination.name}</span>
            </CardTitle>
            <CardDescription>{vaccination.description}</CardDescription>
            <div className="flex items-center space-x-2">
              <Badge variant={statusColors[vaccination.status]} className="text-xs">
                <StatusIcon className="w-3 h-3 mr-1" />
                {vaccination.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Dose {vaccination.doseNumber}/{vaccination.totalDoses}
              </Badge>
              <Badge variant={categoryColors[vaccination.category]} className="text-xs">
                {vaccination.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            <span>{formatDate(vaccination.dueDate)}</span>
          </div>
          
          {vaccination.givenDate && (
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">Given:</span>
              <span>{formatDate(vaccination.givenDate)}</span>
            </div>
          )}
          
          {vaccination.nextDue && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground">Next due:</span>
              <span>{formatDate(vaccination.nextDue)}</span>
            </div>
          )}
        </div>

        {/* Provider Info */}
        {vaccination.provider && (
          <div className="p-3 bg-muted/30 rounded-lg space-y-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Provider:</span> {vaccination.provider}
            </div>
            {vaccination.location && (
              <div className="text-sm">
                <span className="text-muted-foreground">Location:</span> {vaccination.location}
              </div>
            )}
            {vaccination.lotNumber && (
              <div className="text-sm">
                <span className="text-muted-foreground">Lot #:</span> {vaccination.lotNumber}
              </div>
            )}
          </div>
        )}

        {/* Side Effects */}
        {vaccination.sideEffects && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground">Side effects:</span> {vaccination.sideEffects}
            </div>
          </div>
        )}

        {/* Actions */}
        {vaccination.status === 'due' && (
          <Button size="sm" className="w-full">
            Mark as Given
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function VaccinationsSection() {
  const completedVaccinations = vaccinations.filter(v => v.status === 'completed')
  const dueVaccinations = vaccinations.filter(v => v.status === 'due' || v.status === 'overdue')
  const upcomingVaccinations = vaccinations.filter(v => v.status === 'upcoming')

  const completionRate = (completedVaccinations.length / vaccinations.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Vaccinations</h2>
          <p className="text-sm text-muted-foreground">
            Track Emma's immunization schedule and records
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccination
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Shield className="w-5 h-5 text-success" />
            <span>Vaccination Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{completedVaccinations.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{dueVaccinations.length}</div>
                <div className="text-xs text-muted-foreground">Due Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{upcomingVaccinations.length}</div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Due Vaccinations */}
      {dueVaccinations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span>Due Now ({dueVaccinations.length})</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dueVaccinations.map((vaccination) => (
              <VaccinationCard key={vaccination.id} vaccination={vaccination} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Vaccinations */}
      {upcomingVaccinations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span>Upcoming ({upcomingVaccinations.length})</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingVaccinations.map((vaccination) => (
              <VaccinationCard key={vaccination.id} vaccination={vaccination} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Vaccinations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span>Completed ({completedVaccinations.length})</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {completedVaccinations.map((vaccination) => (
            <VaccinationCard key={vaccination.id} vaccination={vaccination} />
          ))}
        </div>
      </div>
    </div>
  )
}