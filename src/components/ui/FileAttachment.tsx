import React, { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, File, X, Loader2, Image, FileText, Video, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileAttachmentProps {
  onFileSelect: (file: File | null, preview: string | null) => void
  accept?: string
  maxSize?: number // in MB
  selectedFile?: File | null
  previewUrl?: string | null
  label?: string
  className?: string
}

export function FileAttachment({ 
  onFileSelect, 
  accept = "*/*", 
  maxSize = 10,
  selectedFile,
  previewUrl,
  label = "Attach File",
  className 
}: FileAttachmentProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase()
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />
    if (type.startsWith('audio/')) return <Music className="w-6 h-6" />
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return <FileText className="w-6 h-6" />
    }
    return <File className="w-6 h-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file)
    if (validation) {
      setError(validation)
      return
    }

    setError(null)
    
    // Create preview for images
    let preview: string | null = null
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file)
    }
    
    onFileSelect(file, preview)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    onFileSelect(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError(null)
  }

  if (selectedFile) {
    return (
      <div className={cn("space-y-3", className)}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              {getFileIcon(selectedFile)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Preview */}
        {previewUrl && selectedFile.type.startsWith('image/') && (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragOver 
            ? "border-lavender-400 bg-lavender-50" 
            : "border-gray-300 hover:border-lavender-400 hover:bg-lavender-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-lavender-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Drop your file here or <span className="text-lavender-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
}