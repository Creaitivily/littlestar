import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileAttachment } from '@/components/ui/FileAttachment'
import { uploadAttachmentFile } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'
import { useChild } from '@/contexts/ChildContext'

interface AddHealthFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddHealthForm({ open, onOpenChange, onSuccess }: AddHealthFormProps) {
  const { selectedChild } = useChild()
  const { user, createHealthRecord } = useAuth()
  const [formData, setFormData] = useState({
    type: 'checkup',
    date: new Date().toISOString().split('T')[0],
    description: '',
    doctorName: ''
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
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

    setUploading(true)
    setError(null)
    
    try {
      let fileUrl = null
      
      // Upload file if attached
      if (attachedFile && user) {
        const { fileUrl: uploadedFileUrl, error: uploadError } = await uploadAttachmentFile(
          attachedFile,
          user.id,
          'health'
        )
        
        if (uploadError) {
          console.error('File upload error:', uploadError)
          setError('Failed to upload file. Saving record without attachment.')
          // Continue without file if upload fails
        } else {
          fileUrl = uploadedFileUrl
        }
      }
      
      const { error } = await createHealthRecord(selectedChild.id, {
        type: formData.type,
        date: formData.date,
        description: formData.description.trim(),
        doctor_name: formData.doctorName || null,
        attachment_url: fileUrl
      })

      if (error) {
        console.error('Error creating health record:', error)
        setError('Failed to save health record. Please try again.')
        return
      }

      // Success - reset form and close dialog
      setFormData({
        type: 'checkup',
        date: new Date().toISOString().split('T')[0],
        description: '',
        doctorName: ''
      })
      setAttachedFile(null)
      setFilePreview(null)
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      console.error('Unexpected error creating health record:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Record Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={uploading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="appointment">Appointment</option>
                <option value="checkup">Checkup</option>
                <option value="vaccination">Vaccination</option>
                <option value="medication">Medication</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={uploading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the appointment or procedure"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={uploading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctorName">Doctor Name (Optional)</Label>
            <Input
              id="doctorName"
              type="text"
              placeholder="Dr. Smith, Dr. Johnson, etc."
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              disabled={uploading}
            />
          </div>
          
          <FileAttachment
            label="Attach Medical Document or Image"
            onFileSelect={(file, preview) => {
              setAttachedFile(file)
              setFilePreview(preview)
            }}
            selectedFile={attachedFile}
            previewUrl={filePreview}
            accept="image/*,application/pdf,.doc,.docx,.txt"
            maxSize={10}
            className="pt-2"
          />
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? 'Saving...' : 'Add Record'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormData({
                  type: 'checkup',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  doctorName: ''
                })
                setAttachedFile(null)
                setFilePreview(null)
                onOpenChange(false)
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}