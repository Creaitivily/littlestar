import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, TrendingUp, Scale, Ruler, Save, X } from 'lucide-react'

interface AddMeasurementProps {
  open: boolean
  onClose: () => void
}

export function AddMeasurement({ open, onClose }: AddMeasurementProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
    notes: '',
    measurementType: 'routine'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Measurement data:', formData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Add Measurement</span>
          </DialogTitle>
          <DialogDescription>
            Record Emma's latest growth measurements
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Measurement Date</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Measurement Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Measurement Type</Label>
            <Select value={formData.measurementType} onValueChange={(value) => handleInputChange('measurementType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine Check</SelectItem>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="home">Home Measurement</SelectItem>
                <SelectItem value="milestone">Milestone Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>Height (cm)</span>
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="92.0"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center space-x-2">
                <Scale className="w-4 h-4" />
                <span>Weight (kg)</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="14.2"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
          </div>

          {/* Head Circumference */}
          <div className="space-y-2">
            <Label htmlFor="head">Head Circumference (cm)</Label>
            <Input
              id="head"
              type="number"
              step="0.1"
              placeholder="Optional"
              value={formData.headCircumference}
              onChange={(e) => handleInputChange('headCircumference', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Measurement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}