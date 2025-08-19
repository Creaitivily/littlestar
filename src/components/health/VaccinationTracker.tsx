import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { healthDataService, type VaccinationRecord } from '@/lib/healthDataService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Syringe, Plus, AlertTriangle, CheckCircle, Calendar, Clock } from 'lucide-react'

// CDC Vaccination Schedule Data
const CDC_VACCINES = [
  { name: 'Hepatitis B (HepB)', code: '08', doses: [{ age: 0, due: 'Birth' }, { age: 2, due: '1-2 months' }, { age: 6, due: '6-18 months' }] },
  { name: 'Rotavirus (RV)', code: '116', doses: [{ age: 2, due: '2 months' }, { age: 4, due: '4 months' }, { age: 6, due: '6 months' }] },
  { name: 'Diphtheria, Tetanus, Pertussis (DTaP)', code: '20', doses: [{ age: 2, due: '2 months' }, { age: 4, due: '4 months' }, { age: 6, due: '6 months' }, { age: 15, due: '15-18 months' }, { age: 48, due: '4-6 years' }] },
  { name: 'Haemophilus influenzae type b (Hib)', code: '17', doses: [{ age: 2, due: '2 months' }, { age: 4, due: '4 months' }, { age: 6, due: '6 months' }, { age: 12, due: '12-15 months' }] },
  { name: 'Pneumococcal (PCV13)', code: '133', doses: [{ age: 2, due: '2 months' }, { age: 4, due: '4 months' }, { age: 6, due: '6 months' }, { age: 12, due: '12-15 months' }] },
  { name: 'Inactivated Poliovirus (IPV)', code: '10', doses: [{ age: 2, due: '2 months' }, { age: 4, due: '4 months' }, { age: 6, due: '6-18 months' }, { age: 48, due: '4-6 years' }] },
  { name: 'Influenza (Flu)', code: '88', doses: [{ age: 6, due: 'Annually starting at 6 months' }] },
  { name: 'Measles, Mumps, Rubella (MMR)', code: '03', doses: [{ age: 12, due: '12-15 months' }, { age: 48, due: '4-6 years' }] },
  { name: 'Varicella (Chickenpox)', code: '21', doses: [{ age: 12, due: '12-15 months' }, { age: 48, due: '4-6 years' }] },
  { name: 'Hepatitis A (HepA)', code: '83', doses: [{ age: 12, due: '12-23 months' }, { age: 18, due: '18-23 months' }] }
]

interface VaccinationTrackerProps {
  childId: string
}

export function VaccinationTracker({ childId }: VaccinationTrackerProps) {
  const { user, children: childrenData } = useAuth()
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([])
  const [overdue, setOverdue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    vaccine_name: '',
    vaccine_code: '',
    dose_number: 1,
    vaccination_date: new Date().toISOString().split('T')[0],
    next_due_date: '',
    provider_name: '',
    lot_number: '',
    administered_by: '',
    notes: ''
  })

  useEffect(() => {
    loadVaccinationData()
  }, [childId])

  const loadVaccinationData = async () => {
    if (!childId) return

    setLoading(true)
    try {
      const [vaccinationRecords, overdueVaccinations] = await Promise.all([
        healthDataService.getVaccinationRecords(childId),
        healthDataService.getOverdueVaccinations(childId)
      ])

      setVaccinations(vaccinationRecords)
      setOverdue(overdueVaccinations)
    } catch (error) {
      console.error('Error loading vaccination data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !childId) return

    try {
      const record: Omit<VaccinationRecord, 'id'> = {
        user_id: user.id,
        daughter_id: childId,
        vaccine_name: formData.vaccine_name,
        vaccine_code: formData.vaccine_code || null,
        dose_number: formData.dose_number,
        vaccination_date: formData.vaccination_date,
        next_due_date: formData.next_due_date || null,
        provider_name: formData.provider_name || null,
        lot_number: formData.lot_number || null,
        administered_by: formData.administered_by || null,
        notes: formData.notes || null
      }

      await healthDataService.createVaccinationRecord(record)
      await loadVaccinationData()
      setShowAddModal(false)
      setFormData({
        vaccine_name: '',
        vaccine_code: '',
        dose_number: 1,
        vaccination_date: new Date().toISOString().split('T')[0],
        next_due_date: '',
        provider_name: '',
        lot_number: '',
        administered_by: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error adding vaccination record:', error)
    }
  }

  const getCurrentChild = () => {
    return childrenData.find(child => child.id === childId)
  }

  const calculateAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  }

  const getRecommendedVaccines = () => {
    const currentChild = getCurrentChild()
    if (!currentChild) return []

    const ageMonths = calculateAgeInMonths(currentChild.birth_date)
    const recommended: Array<{ vaccine: string, dose: number, dueAge: string, overdue: boolean }> = []

    CDC_VACCINES.forEach(vaccine => {
      vaccine.doses.forEach((dose, index) => {
        if (dose.age <= ageMonths) {
          const isReceived = vaccinations.some(v => 
            v.vaccine_name === vaccine.name && v.dose_number === (index + 1)
          )
          
          if (!isReceived) {
            recommended.push({
              vaccine: vaccine.name,
              dose: index + 1,
              dueAge: dose.due,
              overdue: dose.age < ageMonths - 1 // Overdue if more than 1 month past due
            })
          }
        }
      })
    })

    return recommended
  }

  const currentChild = getCurrentChild()
  if (!currentChild) return <div>Loading...</div>

  const recommendedVaccines = getRecommendedVaccines()

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading vaccination records...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Vaccination Tracker</h2>
          <p className="text-gray-600">CDC immunization schedule for {currentChild.name}</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vaccination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
              <DialogDescription>
                Record a new vaccination for {currentChild.name}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="vaccine_name">Vaccine Name</Label>
                <Select value={formData.vaccine_name} onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    vaccine_name: value,
                    vaccine_code: CDC_VACCINES.find(v => v.name === value)?.code || ''
                  }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    {CDC_VACCINES.map(vaccine => (
                      <SelectItem key={vaccine.name} value={vaccine.name}>
                        {vaccine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dose_number">Dose Number</Label>
                  <Input
                    id="dose_number"
                    type="number"
                    min="1"
                    value={formData.dose_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, dose_number: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vaccination_date">Vaccination Date</Label>
                  <Input
                    id="vaccination_date"
                    type="date"
                    value={formData.vaccination_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, vaccination_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="next_due_date">Next Due Date (optional)</Label>
                <Input
                  id="next_due_date"
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_due_date: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider_name">Healthcare Provider</Label>
                  <Input
                    id="provider_name"
                    value={formData.provider_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                    placeholder="Dr. Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="administered_by">Administered By</Label>
                  <Input
                    id="administered_by"
                    value={formData.administered_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, administered_by: e.target.value }))}
                    placeholder="Nurse Johnson"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lot_number">Lot Number (optional)</Label>
                <Input
                  id="lot_number"
                  value={formData.lot_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, lot_number: e.target.value }))}
                  placeholder="ABC123"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Vaccination</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recommended/Overdue Vaccines */}
      {recommendedVaccines.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <Clock className="h-5 w-5 mr-2" />
              Recommended Vaccines
            </CardTitle>
            <CardDescription>
              Based on CDC immunization schedule for {currentChild.name}'s age
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recommendedVaccines.map((rec, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg border ${
                  rec.overdue ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div>
                    <div className="font-medium">{rec.vaccine}</div>
                    <div className="text-sm text-gray-600">
                      Dose {rec.dose} • Due: {rec.dueAge}
                    </div>
                  </div>
                  <Badge variant={rec.overdue ? "destructive" : "secondary"}>
                    {rec.overdue ? 'Overdue' : 'Due'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vaccination History */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccination History</CardTitle>
          <CardDescription>
            Complete immunization record for {currentChild.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vaccinations.length > 0 ? (
            <div className="space-y-4">
              {vaccinations.map(vaccination => (
                <div key={vaccination.id} className="flex justify-between items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{vaccination.vaccine_name}</span>
                      {vaccination.dose_number && (
                        <Badge variant="outline">Dose {vaccination.dose_number}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(vaccination.vaccination_date).toLocaleDateString()}</span>
                      </div>
                      {vaccination.provider_name && (
                        <div>Provider: {vaccination.provider_name}</div>
                      )}
                      {vaccination.lot_number && (
                        <div>Lot: {vaccination.lot_number}</div>
                      )}
                      {vaccination.notes && (
                        <div>Notes: {vaccination.notes}</div>
                      )}
                    </div>
                  </div>
                  {vaccination.next_due_date && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next due</div>
                      <div className="text-sm font-medium">
                        {new Date(vaccination.next_due_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No vaccination records yet</p>
              <p className="text-sm text-gray-500">Add vaccinations to track immunization progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}