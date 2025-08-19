import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileAttachment } from '@/components/ui/FileAttachment'
import { GooglePhotosPickerAdvanced } from '@/components/ui/GooglePhotosPickerAdvanced'
import { uploadAttachmentFile } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'

interface AddMemoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddMemoryForm({ open, onOpenChange, onSubmit }: AddMemoryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [googlePhotosUrl, setGooglePhotosUrl] = useState<string>('')
  const [googlePhotosUrls, setGooglePhotosUrls] = useState<string[]>([])
  
  const { user, children } = useAuth()
  
  // Get the first child for now - in a real app, you'd pass the selected child
  const selectedChild = children[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      setUploading(true)
      
      let fileUrl = null
      
      // Upload file if attached
      if (attachedFile && user) {
        const { fileUrl: uploadedFileUrl, error } = await uploadAttachmentFile(
          attachedFile,
          user.id,
          'memory'
        )
        
        if (error) {
          console.error('File upload error:', error)
          // Continue without file if upload fails
        } else {
          fileUrl = uploadedFileUrl
        }
      }
      
      onSubmit({
        title: formData.title,
        date: formData.date,
        description: formData.description,
        attachmentUrl: fileUrl,
        googlePhotosUrl: googlePhotosUrl || null,
        googlePhotosUrls: googlePhotosUrls.length > 0 ? googlePhotosUrls : null
      })
      
      // Reset form
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
      setAttachedFile(null)
      setFilePreview(null)
      setGooglePhotosUrl('')
      setGooglePhotosUrls([])
      setUploading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Add Memory</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Memory Title</Label>
            <Input
              id="title"
              placeholder="First day of school, beach vacation, etc."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell the story of this special moment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Add Photo or Document</Label>
              {selectedChild && (
                <GooglePhotosPickerAdvanced
                  childId={selectedChild.id}
                  onPhotosSelected={(urls) => {
                    setGooglePhotosUrls(urls)
                    // Clear local file when Google Photos are selected
                    if (urls.length > 0 && attachedFile) {
                      setAttachedFile(null)
                      setFilePreview(null)
                    }
                  }}
                />
              )}
            </div>
            
            {/* Show Google Photos if imported */}
            {googlePhotosUrls.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📷</span>
                    <span className="text-sm font-medium text-blue-900">
                      {googlePhotosUrls.length} photos imported from Google Photos
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setGooglePhotosUrls([])}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1"
                  >
                    Remove All
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {googlePhotosUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={url} 
                        alt={`Imported photo ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      {index === 3 && googlePhotosUrls.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            +{googlePhotosUrls.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or upload from device</span>
              </div>
            </div>
            
            <FileAttachment
              label="Upload from Device"
              onFileSelect={(file, preview) => {
                setAttachedFile(file)
                setFilePreview(preview)
                // Clear Google Photos when local file is selected
                if (file) {
                  setGooglePhotosUrls([])
                }
              }}
              selectedFile={attachedFile}
              previewUrl={filePreview}
              accept="image/*,application/pdf,.doc,.docx,.txt"
              maxSize={10}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? 'Saving...' : 'Save Memory'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormData({
                  title: '',
                  date: new Date().toISOString().split('T')[0],
                  description: ''
                })
                setAttachedFile(null)
                setFilePreview(null)
                setGooglePhotosUrl('')
                setGooglePhotosUrls([])
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