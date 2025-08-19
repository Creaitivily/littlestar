import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileAttachment } from '@/components/ui/FileAttachment'
import { uploadAttachmentFile } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'

interface AddHealthFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddHealthForm({ open, onOpenChange, onSubmit }: AddHealthFormProps) {
  const [formData, setFormData] = useState({
    type: 'checkup',
    date: new Date().toISOString().split('T')[0],
    description: '',
    doctorName: ''
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description) {
      setUploading(true)
      
      let fileUrl = null
      
      // Upload file if attached
      if (attachedFile && user) {
        const { fileUrl: uploadedFileUrl, error } = await uploadAttachmentFile(
          attachedFile,
          user.id,
          'health'
        )
        
        if (error) {
          console.error('File upload error:', error)
          // Continue without file if upload fails
        } else {
          fileUrl = uploadedFileUrl
        }
      }
      
      onSubmit({
        type: formData.type,
        date: formData.date,
        description: formData.description,
        doctorName: formData.doctorName || null,
        attachmentUrl: fileUrl
      })
      
      // Reset form
      setFormData({
        type: 'checkup',
        date: new Date().toISOString().split('T')[0],
        description: '',
        doctorName: ''
      })
      setAttachedFile(null)
      setFilePreview(null)
      setUploading(false)
      onOpenChange(false)
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Record Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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