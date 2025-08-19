// File handling utilities for the Little Star app
export interface FileUploadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
}

export interface AttachedFile {
  id: string
  originalName: string
  fileName: string
  filePath: string
  size: number
  type: string
  uploadDate: string
  category: 'health-records' | 'memories' | 'activities' | 'reports'
}

// File categories and their corresponding folders
export const FILE_CATEGORIES = {
  'health-records': 'attachfiles/health-records',
  'memories': 'attachfiles/memories', 
  'activities': 'attachfiles/activities',
  'reports': 'attachfiles/reports'
} as const

// Generate unique filename with timestamp
export function generateFileName(originalName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_')
  
  return `${timestamp}_${sanitizedName}.${extension}`
}

// Generate file path for category
export function getFilePath(category: keyof typeof FILE_CATEGORIES, fileName: string): string {
  return `${FILE_CATEGORIES[category]}/${fileName}`
}

// Validate file type based on category
export function isValidFileType(file: File, category: keyof typeof FILE_CATEGORIES): boolean {
  const allowedTypes: Record<string, string[]> = {
    'health-records': ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt'],
    'memories': ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.pdf'],
    'activities': ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    'reports': ['.pdf', '.csv', '.xlsx', '.doc', '.docx']
  }
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  return allowedTypes[category]?.includes(fileExtension) || false
}

// Simulate file upload (in real app, this would upload to server/cloud)
export async function uploadFile(file: File, category: keyof typeof FILE_CATEGORIES): Promise<FileUploadResult> {
  try {
    // Validate file type
    if (!isValidFileType(file, category)) {
      return {
        success: false,
        error: `Invalid file type for ${category}. File: ${file.name}`
      }
    }
    
    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = getFilePath(category, fileName)
    
    // In a real application, you would:
    // 1. Upload file to server/cloud storage
    // 2. Save file metadata to database
    // 3. Return actual file URL
    
    // For demo purposes, we'll simulate the upload
    console.log(`Uploading file: ${file.name}`)
    console.log(`To: ${filePath}`)
    console.log(`Size: ${Math.round(file.size / 1024)} KB`)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      filePath,
      fileName
    }
  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error}`
    }
  }
}

// Upload multiple files
export async function uploadFiles(files: File[], category: keyof typeof FILE_CATEGORIES): Promise<AttachedFile[]> {
  const uploadedFiles: AttachedFile[] = []
  
  for (const file of files) {
    const result = await uploadFile(file, category)
    
    if (result.success && result.filePath && result.fileName) {
      uploadedFiles.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        originalName: file.name,
        fileName: result.fileName,
        filePath: result.filePath,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        category
      })
    }
  }
  
  return uploadedFiles
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file extension icon
export function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️'
    case 'mp4':
    case 'mov':
      return '🎥'
    case 'csv':
    case 'xlsx':
      return '📊'
    default:
      return '📎'
  }
}