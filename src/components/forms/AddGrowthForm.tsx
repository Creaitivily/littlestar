import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChild } from '@/contexts/ChildContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'

interface AddGrowthFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddGrowthForm({ open, onOpenChange, onSuccess }: AddGrowthFormProps) {
  const { selectedChild } = useChild()
  const { createGrowthRecord } = useAuth()
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedChild) {
      setError('No child selected')
      return
    }
    
    if (!formData.height.trim() || !formData.weight.trim()) {
      setError('Height and weight are required')
      return
    }

    const height = parseFloat(formData.height)
    const weight = parseFloat(formData.weight)
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      setError('Please enter valid positive numbers for height and weight')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      const { error } = await createGrowthRecord(selectedChild.id, {
        measurement_date: formData.date,
        height: height,
        weight: weight
      })

      if (error) {
        console.error('Error creating growth record:', error)
        setError('Failed to save growth record. Please try again.')
        return
      }

      // Success - reset form and close dialog
      setFormData({ 
        date: new Date().toISOString().split('T')[0], 
        height: '', 
        weight: '' 
      })
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      console.error('Unexpected error creating growth record:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Add Growth Measurement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="102.5"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="16.3"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Measurement'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}