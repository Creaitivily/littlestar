import React, { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Progress } from './progress'
import { Upload, File, X, Loader2, Image, FileText, Video, Music, Plus, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  preview: string | null
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

interface MultiFileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  allowMultiple?: boolean
  uploadFunction?: (file: File) => Promise<{ url: string | null; error: any }>
  className?: string
}

export function MultiFileUpload({ 
  onFilesChange,
  accept = "image/*,application/pdf,.doc,.docx,.txt",
  maxSize = 10,
  maxFiles = 10,
  allowMultiple = true,
  uploadFunction,
  className 
}: MultiFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase()
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return <FileText className="w-5 h-5" />
    }
    return <File className="w-5 h-5" />
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
    
    if (accept !== "*/*" && !accept.split(',').some(type => {
      const cleanType = type.trim()
      if (cleanType.startsWith('.')) {
        return file.name.toLowerCase().endsWith(cleanType.toLowerCase())
      }
      return file.type.match(cleanType.replace('*', '.*'))
    })) {
      return 'File type not supported'
    }
    
    return null
  }

  const createFilePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  }

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    
    if (!allowMultiple && fileArray.length > 1) {
      fileArray.splice(1)
    }
    
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validatedFiles: UploadedFile[] = []

    for (const file of fileArray) {
      const validation = validateFile(file)
      const preview = await createFilePreview(file)
      
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        status: validation ? 'error' : 'pending',
        progress: 0,
        error: validation || undefined
      }
      
      validatedFiles.push(uploadedFile)
    }

    const updatedFiles = [...files, ...validatedFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }, [files, maxFiles, allowMultiple, maxSize, accept, onFilesChange])

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    
    // Clean up preview URLs
    files.forEach(f => {
      if (f.id === fileId && f.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(f.preview)
      }
    })
  }

  const uploadAllFiles = async () => {
    if (!uploadFunction) return
    
    setUploading(true)
    const updatedFiles = [...files]
    
    for (let i = 0; i < updatedFiles.length; i++) {
      const file = updatedFiles[i]
      
      if (file.status !== 'pending') continue
      
      file.status = 'uploading'
      file.progress = 0
      setFiles([...updatedFiles])
      
      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          file.progress = Math.min(file.progress + 10, 90)
          setFiles([...updatedFiles])
        }, 200)
        
        const { url, error } = await uploadFunction(file.file)
        clearInterval(progressInterval)
        
        if (error) {
          file.status = 'error'
          file.error = error.message || 'Upload failed'
        } else {
          file.status = 'completed'
          file.progress = 100
        }
      } catch (error) {
        file.status = 'error'
        file.error = 'Upload failed'
      }
      
      setFiles([...updatedFiles])
    }
    
    setUploading(false)
    onFilesChange(updatedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
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

  const getStatusIcon = (file: UploadedFile) => {
    switch (file.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      default:
        return getFileIcon(file.file)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
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
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Drop files here or <span className="text-lavender-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            {allowMultiple ? `Up to ${maxFiles} files, ` : 'Single file, '} 
            max {maxSize}MB each
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h4>
            {uploadFunction && files.some(f => f.status === 'pending') && (
              <Button
                onClick={uploadAllFiles}
                disabled={uploading}
                size="sm"
                className="text-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload All'
                )}
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                        {getStatusIcon(file)}
                      </div>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="mt-1">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(file)}
                  </div>
                </div>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={allowMultiple}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
}