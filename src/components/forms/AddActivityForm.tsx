import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useChild } from '@/contexts/ChildContext'
import { useAuth } from '@/contexts/AuthContext'
import { calculateAgeInMonths } from '@/lib/utils'

interface AddActivityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddActivityForm({ open, onOpenChange, onSuccess }: AddActivityFormProps) {
  const { selectedChild } = useChild()
  const { createActivity } = useAuth()
  
  // Calculate child's age to determine appropriate activity options
  const ageInMonths = selectedChild ? calculateAgeInMonths(selectedChild.birth_date) : 12
  const isInfant = ageInMonths <= 6 // 0-6 months
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'play',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedChild) {
      setError('No child selected')
      return
    }
    
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      const { error } = await createActivity(selectedChild.id, {
        date: formData.date,
        type: formData.type,
        description: formData.description.trim()
      })

      if (error) {
        console.error('Error creating activity:', error)
        setError('Failed to save activity. Please try again.')
        return
      }

      // Success - reset form and close dialog
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'play',
        description: ''
      })
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      console.error('Unexpected error creating activity:', error)
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
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="type">Activity Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="play">Play</option>
                <option value="learning">Learning</option>
                <option value={isInfant ? "feeding" : "meal"}>
                  {isInfant ? "Feeding" : "Meal"}
                </option>
                <option value="sleep">Sleep</option>
                <option value="outdoor">Outdoor</option>
                {isInfant && <option value="diaper">Diaper Change</option>}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What happened during this activity?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Log Activity'}
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