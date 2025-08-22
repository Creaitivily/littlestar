import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileAttachment } from '@/components/ui/FileAttachment'
import { MultiFileUpload } from '@/components/ui/MultiFileUpload'
import { GooglePhotosPickerAdvanced } from '@/components/ui/GooglePhotosPickerAdvanced'
import { uploadAttachmentFile } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'
import { useChild } from '@/contexts/ChildContext'

interface AddMemoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddMemoryForm({ open, onOpenChange, onSuccess }: AddMemoryFormProps) {
  const { selectedChild } = useChild()
  const { user, createMemory } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [attachedFiles, setAttachedFiles] = useState<any[]>([])
  const [useMultiUpload, setUseMultiUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [googlePhotosUrl, setGooglePhotosUrl] = useState<string>('')
  const [googlePhotosUrls, setGooglePhotosUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedChild) {
      setError('No child selected')
      return
    }
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required')
      return
    }

    setUploading(true)
    setError(null)
    
    try {
      let fileUrl = null
      let attachmentUrls: string[] = []
      
      // Upload single file if attached (legacy support)
      if (attachedFile && user && !useMultiUpload) {
        const { fileUrl: uploadedFileUrl, error: uploadError } = await uploadAttachmentFile(
          attachedFile,
          user.id,
          'memory'
        )
        
        if (uploadError) {
          console.error('File upload error:', uploadError)
          setError('Failed to upload file. Saving memory without attachment.')
          // Continue without file if upload fails
        } else {
          fileUrl = uploadedFileUrl
        }
      }
      
      // Upload multiple files if using multi-upload
      if (useMultiUpload && attachedFiles.length > 0 && user) {
        for (const uploadedFile of attachedFiles) {
          if (uploadedFile.status === 'completed') {
            // File already uploaded via MultiFileUpload component
            attachmentUrls.push(uploadedFile.url)
          } else if (uploadedFile.status === 'pending') {
            // Upload remaining files
            const { fileUrl: uploadedFileUrl, error: uploadError } = await uploadAttachmentFile(
              uploadedFile.file,
              user.id,
              'memory'
            )
            
            if (!uploadError && uploadedFileUrl) {
              attachmentUrls.push(uploadedFileUrl)
            }
          }
        }
      }
      
      const { error } = await createMemory(selectedChild.id, {
        title: formData.title.trim(),
        date: formData.date,
        description: formData.description.trim(),
        attachment_url: fileUrl,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
        google_photos_url: googlePhotosUrl || null,
        google_photos_urls: googlePhotosUrls.length > 0 ? googlePhotosUrls : null
      })

      if (error) {
        console.error('Error creating memory:', error)
        setError('Failed to save memory. Please try again.')
        return
      }

      // Success - reset form and close dialog
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
      setAttachedFile(null)
      setFilePreview(null)
      setAttachedFiles([])
      setUseMultiUpload(false)
      setGooglePhotosUrl('')
      setGooglePhotosUrls([])
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      console.error('Unexpected error creating memory:', error)
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
          <DialogTitle>Add Memory</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Memory Title</Label>
            <Input
              id="title"
              placeholder="First day of school, beach vacation, etc."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={uploading}
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
              disabled={uploading}
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
              disabled={uploading}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Add Photos or Documents</Label>
              <div className="flex items-center gap-2">
                {selectedChild && (
                  <GooglePhotosPickerAdvanced
                    childId={selectedChild.id}
                    onPhotosSelected={(urls) => {
                      setGooglePhotosUrls(urls)
                      // Clear local files when Google Photos are selected
                      if (urls.length > 0) {
                        setAttachedFile(null)
                        setFilePreview(null)
                        setAttachedFiles([])
                      }
                    }}
                  />
                )}
                <Button
                  type="button"
                  variant={useMultiUpload ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setUseMultiUpload(!useMultiUpload)
                    // Clear existing selections when switching modes
                    setAttachedFile(null)
                    setFilePreview(null)
                    setAttachedFiles([])
                  }}
                  className="text-xs"
                >
                  {useMultiUpload ? "Single File" : "Multiple Files"}
                </Button>
              </div>
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
            
            {useMultiUpload ? (
              <MultiFileUpload
                onFilesChange={(files) => {
                  setAttachedFiles(files)
                  // Clear Google Photos when local files are selected
                  if (files.length > 0) {
                    setGooglePhotosUrls([])
                  }
                }}
                accept="image/*,application/pdf,.doc,.docx,.txt"
                maxSize={10}
                maxFiles={5}
                allowMultiple={true}
                uploadFunction={async (file) => {
                  if (user && selectedChild) {
                    return await uploadAttachmentFile(file, user.id, 'memory')
                  }
                  return { url: null, error: new Error('User or child not selected') }
                }}
              />
            ) : (
              <FileAttachment
                label="Upload from Device"
                onFileSelect={(file, preview) => {
                  setAttachedFile(file)
                  setFilePreview(preview)
                  // Clear Google Photos when local file is selected
                  if (file) {
                    setGooglePhotosUrls([])
                    setAttachedFiles([])
                  }
                }}
                selectedFile={attachedFile}
                previewUrl={filePreview}
                accept="image/*,application/pdf,.doc,.docx,.txt"
                maxSize={10}
              />
            )}
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
                setAttachedFiles([])
                setUseMultiUpload(false)
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