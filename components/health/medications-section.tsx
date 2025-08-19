import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Pill,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Bell,
  Droplets,
  Package
} from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  form: 'tablet' | 'liquid' | 'drops' | 'cream' | 'inhaler'
  startDate: Date
  endDate?: Date
  status: 'active' | 'completed' | 'paused'
  purpose: string
  prescriber: string
  instructions: string
  sideEffects?: string[]
  reminders: boolean
  nextDose?: Date
  refillDate?: Date
  quantity?: string
}

const medications: Medication[] = [
  {
    id: '1',
    name: 'Vitamin D3',
    dosage: '400 IU',
    frequency: 'Once daily',
    form: 'drops',
    startDate: new Date(2022, 8, 1),
    status: 'active',
    purpose: 'Bone development and immune support',
    prescriber: 'Dr. Sarah Johnson',
    instructions: 'Give with morning feeding. Mix with formula or breast milk.',
    reminders: true,
    nextDose: new Date(2024, 7, 19, 8, 0),
    refillDate: new Date(2024, 8, 15),
    quantity: '1 bottle (50 mL)'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    dosage: '125 mg',
    frequency: 'Twice daily',
    form: 'liquid',
    startDate: new Date(2024, 6, 10),
    endDate: new Date(2024, 6, 20),
    status: 'completed',
    purpose: 'Ear infection treatment',
    prescriber: 'Dr. Michael Chen',
    instructions: 'Give with food. Complete full course even if symptoms improve.',
    sideEffects: ['Mild stomach upset', 'Loose stools'],
    reminders: false,
    quantity: '1 bottle (150 mL)'
  },
  {
    id: '3',
    name: 'Tylenol',
    dosage: '80 mg',
    frequency: 'As needed',
    form: 'liquid',
    startDate: new Date(2024, 7, 17),
    status: 'paused',
    purpose: 'Fever and pain relief',
    prescriber: 'Over-the-counter',
    instructions: 'Give only when fever > 100.4°F or for discomfort. Max 5 doses per day.',
    reminders: false,
    quantity: '1 bottle (160 mL)'
  }
]

const statusColors = {
  active: 'success',
  completed: 'secondary',
  paused: 'warning'
} as const

const statusIcons = {
  active: CheckCircle2,
  completed: CheckCircle2,
  paused: AlertCircle
}

const formIcons = {
  tablet: Pill,
  liquid: Droplets,
  drops: Droplets,
  cream: Package,
  inhaler: Package
}

function MedicationCard({ medication }: { medication: Medication }) {
  const StatusIcon = statusIcons[medication.status]
  const FormIcon = formIcons[medication.form]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <FormIcon className="w-5 h-5 text-primary" />
              <span>{medication.name}</span>
            </CardTitle>
            <CardDescription>{medication.purpose}</CardDescription>
            <div className="flex items-center space-x-2">
              <Badge variant={statusColors[medication.status]} className="text-xs">
                <StatusIcon className="w-3 h-3 mr-1" />
                {medication.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {medication.form}
              </Badge>
              {medication.reminders && (
                <Badge variant="secondary" className="text-xs">
                  <Bell className="w-3 h-3 mr-1" />
                  Reminders on
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dosage and Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Dosage</div>
            <div className="font-medium">{medication.dosage}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Frequency</div>
            <div className="font-medium">{medication.frequency}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">Instructions:</span>
            <p className="mt-1">{medication.instructions}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Started:</span>
            <span>{formatDate(medication.startDate)}</span>
          </div>
          
          {medication.endDate && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ended:</span>
              <span>{formatDate(medication.endDate)}</span>
            </div>
          )}
          
          {medication.nextDose && medication.status === 'active' && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground">Next dose:</span>
              <span>{medication.nextDose.toLocaleString()}</span>
            </div>
          )}
          
          {medication.refillDate && medication.status === 'active' && (
            <div className="flex items-center space-x-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Refill by:</span>
              <span>{formatDate(medication.refillDate)}</span>
            </div>
          )}
        </div>

        {/* Prescriber */}
        <div className="text-sm">
          <span className="text-muted-foreground">Prescribed by:</span> {medication.prescriber}
        </div>

        {/* Side Effects */}
        {medication.sideEffects && medication.sideEffects.length > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground font-medium">Side effects noted:</span>
              <ul className="mt-1 list-disc list-inside">
                {medication.sideEffects.map((effect, index) => (
                  <li key={index} className="text-sm">{effect}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        {medication.status === 'active' && (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Log Dose
            </Button>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MedicationsSection() {
  const activeMedications = medications.filter(m => m.status === 'active')
  const completedMedications = medications.filter(m => m.status === 'completed')
  const pausedMedications = medications.filter(m => m.status === 'paused')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Medications</h2>
          <p className="text-sm text-muted-foreground">
            Track Emma's medications and supplements
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Medications</p>
              <p className="text-2xl font-bold text-foreground">{activeMedications.length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Need Refill Soon</p>
              <p className="text-2xl font-bold text-foreground">1</p>
            </div>
            <Package className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reminders Set</p>
              <p className="text-2xl font-bold text-foreground">1</p>
            </div>
            <Bell className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Active Medications */}
      {activeMedications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span>Active Medications ({activeMedications.length})</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </div>
      )}

      {/* Paused Medications */}
      {pausedMedications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span>Paused Medications ({pausedMedications.length})</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pausedMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Medications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <span>Recently Completed ({completedMedications.length})</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {completedMedications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </div>
    </div>
  )
}