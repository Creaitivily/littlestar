import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Plus,
  CheckCircle2,
  AlertCircle,
  Edit
} from 'lucide-react'

interface Appointment {
  id: string
  type: string
  doctor: string
  practice: string
  date: Date
  time: string
  address: string
  phone: string
  status: 'upcoming' | 'completed' | 'cancelled'
  notes?: string
  reason: string
}

const appointments: Appointment[] = [
  {
    id: '1',
    type: 'Routine Checkup',
    doctor: 'Dr. Sarah Johnson',
    practice: 'Sunshine Pediatrics',
    date: new Date(2024, 7, 25, 10, 0),
    time: '10:00 AM',
    address: '123 Main St, Suite 200, Anytown, ST 12345',
    phone: '(555) 123-4567',
    status: 'upcoming',
    reason: '6-month wellness visit and growth assessment'
  },
  {
    id: '2',
    type: 'Vaccination',
    doctor: 'Dr. Sarah Johnson',
    practice: 'Sunshine Pediatrics',
    date: new Date(2024, 7, 28, 14, 30),
    time: '2:30 PM',
    address: '123 Main St, Suite 200, Anytown, ST 12345',
    phone: '(555) 123-4567',
    status: 'upcoming',
    reason: 'MMR second dose administration'
  },
  {
    id: '3',
    type: 'Follow-up',
    doctor: 'Dr. Michael Chen',
    practice: 'Children\'s Specialty Clinic',
    date: new Date(2024, 8, 15, 9, 0),
    time: '9:00 AM',
    address: '456 Oak Ave, Building B, Anytown, ST 12345',
    phone: '(555) 987-6543',
    status: 'upcoming',
    reason: 'Follow-up on recent ear infection'
  },
  {
    id: '4',
    type: 'Routine Checkup',
    doctor: 'Dr. Sarah Johnson',
    practice: 'Sunshine Pediatrics',
    date: new Date(2024, 6, 4, 11, 0),
    time: '11:00 AM',
    address: '123 Main St, Suite 200, Anytown, ST 12345',
    phone: '(555) 123-4567',
    status: 'completed',
    notes: 'Excellent development, all milestones met',
    reason: '4-month wellness visit'
  }
]

const statusColors = {
  upcoming: 'warning',
  completed: 'success',
  cancelled: 'destructive'
} as const

const statusIcons = {
  upcoming: AlertCircle,
  completed: CheckCircle2,
  cancelled: AlertCircle
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const StatusIcon = statusIcons[appointment.status]
  
  return (
    <Card className="card-soft hover:card-soft-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <span>{appointment.type}</span>
              <Badge variant={statusColors[appointment.status]} className="text-xs">
                <StatusIcon className="w-3 h-3 mr-1" />
                {appointment.status}
              </Badge>
            </CardTitle>
            <CardDescription>{appointment.reason}</CardDescription>
          </div>
          {appointment.status === 'upcoming' && (
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{appointment.time}</span>
          </div>
        </div>

        {/* Doctor and Practice */}
        <div className="flex items-center space-x-2 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{appointment.doctor} at {appointment.practice}</span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <span className="text-muted-foreground">{appointment.address}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{appointment.phone}</span>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AppointmentsSection() {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming')
  const pastAppointments = appointments.filter(apt => apt.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Appointments</h2>
          <p className="text-sm text-muted-foreground">
            Manage Emma's medical appointments and visits
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          <span>Upcoming Appointments ({upcomingAppointments.length})</span>
        </h3>
        
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No upcoming appointments</h3>
            <p className="text-muted-foreground mb-4">Schedule Emma's next checkup or appointment</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </Card>
        )}
      </div>

      {/* Past Appointments */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span>Past Appointments</span>
        </h3>
        
        <div className="space-y-4">
          {pastAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  )
}