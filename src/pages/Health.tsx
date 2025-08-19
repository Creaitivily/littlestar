import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Syringe, 
  Stethoscope, 
  Pill, 
  Plus,
  Clock
} from 'lucide-react'
import { healthRecords } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { AddHealthForm } from '@/components/forms/AddHealthForm'

export function Health() {
  const [showHealthForm, setShowHealthForm] = useState(false)
  
  const appointments = healthRecords.filter(record => record.type === 'appointment' || record.type === 'checkup')

  const handleAddHealth = (data: any) => {
    console.log('New health record:', data)
    // In a real app, this would update the database
  }
  const vaccinations = healthRecords.filter(record => record.type === 'vaccination')
  const medications = healthRecords.filter(record => record.type === 'medication')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'upcoming':
        return 'warning'
      case 'missed':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
      case 'checkup':
        return <Stethoscope className="w-5 h-5" />
      case 'vaccination':
        return <Syringe className="w-5 h-5" />
      case 'medication':
        return <Pill className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Records</h1>
          <p className="text-gray-600">Track appointments, vaccinations, and health information</p>
        </div>
        <Button onClick={() => setShowHealthForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-mint-50 border-mint-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            <Calendar className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{healthRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-lavender-50 border-lavender-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-lavender-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {healthRecords.filter(r => r.status === 'upcoming').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{vaccinations.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-cream-100 border-cream-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Last Checkup</CardTitle>
            <Stethoscope className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-800">Mar 2024</div>
          </CardContent>
        </Card>
      </div>

      {/* All Health Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">All Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthRecords.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-lavender-100 rounded-lg">
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-800">{record.title}</h3>
                        <Badge variant={getStatusColor(record.status) as any}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📅 {formatDate(record.date)}</span>
                        {record.doctor && <span>👨‍⚕️ {record.doctor}</span>}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{record.notes}"</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Vaccination Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Completed Vaccinations</h4>
              {vaccinations.filter(v => v.status === 'completed').map((vaccination) => (
                <div key={vaccination.id} className="flex items-center gap-3 p-3 bg-mint-50 rounded-lg">
                  <Syringe className="w-4 h-4 text-mint-600" />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{vaccination.title}</h5>
                    <p className="text-sm text-gray-600">{formatDate(vaccination.date)}</p>
                  </div>
                  <Badge variant="success">✓</Badge>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Upcoming Vaccinations</h4>
              {vaccinations.filter(v => v.status === 'upcoming').map((vaccination) => (
                <div key={vaccination.id} className="flex items-center gap-3 p-3 bg-lavender-50 rounded-lg">
                  <Syringe className="w-4 h-4 text-lavender-600" />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{vaccination.title}</h5>
                    <p className="text-sm text-gray-600">{formatDate(vaccination.date)}</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <AddHealthForm 
        open={showHealthForm} 
        onOpenChange={setShowHealthForm}
        onSubmit={handleAddHealth}
      />
    </div>
  )
}