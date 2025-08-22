// File validation and security utilities

export interface FileValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export interface FileValidationOptions {
  maxSize?: number // in MB
  allowedTypes?: string[]
  allowedExtensions?: string[]
  checkMaliciousContent?: boolean
  scanForViruses?: boolean
}

// Default allowed file types for child memories
export const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'video/mp4',
  'video/mov',
  'video/avi'
]

export const DEFAULT_ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.txt',
  '.mp4', '.mov', '.avi'
]

// Potentially dangerous file types that should never be allowed
export const DANGEROUS_TYPES = [
  'application/x-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-sh',
  'text/x-sh',
  'application/javascript',
  'text/javascript',
  'application/x-php',
  'text/x-php'
]

export const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js', '.jar', 
  '.sh', '.ps1', '.php', '.asp', '.aspx', '.msi', '.dll'
]

/**
 * Validates file size
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): FileValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${maxSizeMB}MB`
    }
  }
  
  const warnings = []
  
  // Warn for large files
  if (file.size > 5 * 1024 * 1024) {
    warnings.push('Large file may take longer to upload')
  }
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Validates file type and extension
 */
export function validateFileType(
  file: File, 
  allowedTypes: string[] = DEFAULT_ALLOWED_TYPES,
  allowedExtensions: string[] = DEFAULT_ALLOWED_EXTENSIONS
): FileValidationResult {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()
  const fileExtension = '.' + fileName.split('.').pop()
  
  // Check for dangerous file types
  if (DANGEROUS_TYPES.includes(fileType)) {
    return {
      isValid: false,
      error: `File type ${fileType} is not allowed for security reasons`
    }
  }
  
  if (DANGEROUS_EXTENSIONS.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension ${fileExtension} is not allowed for security reasons`
    }
  }
  
  // Check if file type is in allowed list
  const isTypeAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return fileType.startsWith(type.slice(0, -1))
    }
    return fileType === type
  })
  
  // Check if file extension is in allowed list
  const isExtensionAllowed = allowedExtensions.includes(fileExtension)
  
  if (!isTypeAllowed && !isExtensionAllowed) {
    return {
      isValid: false,
      error: `File type ${fileType} (${fileExtension}) is not supported. Allowed types: ${allowedExtensions.join(', ')}`
    }
  }
  
  const warnings = []
  
  // Warn if MIME type is missing or generic
  if (!fileType || fileType === 'application/octet-stream') {
    warnings.push('File type could not be determined. Upload may fail.')
  }
  
  // Warn if MIME type and extension don't match
  if (fileType && isTypeAllowed && !isExtensionAllowed) {
    warnings.push('File extension may not match file type')
  }
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Basic malicious content detection
 */
export async function detectMaliciousContent(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const content = reader.result as string
      const warnings = []
      
      // Check for suspicious patterns in file content
      const suspiciousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /onload\s*=/gi,
        /onerror\s*=/gi,
        /eval\s*\(/gi,
        /document\.write/gi
      ]
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          return resolve({
            isValid: false,
            error: 'File contains potentially malicious content'
          })
        }
      }
      
      // Check for embedded executables in images
      if (file.type.startsWith('image/')) {
        if (content.includes('MZ') || content.includes('PE\0\0')) {
          return resolve({
            isValid: false,
            error: 'Image file appears to contain embedded executable code'
          })
        }
      }
      
      resolve({
        isValid: true,
        warnings: warnings.length > 0 ? warnings : undefined
      })
    }
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Could not read file for security scanning'
      })
    }
    
    // Only read first 1KB for performance
    const blob = file.slice(0, 1024)
    reader.readAsText(blob)
  })
}

/**
 * Comprehensive file validation
 */
export async function validateFile(
  file: File, 
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const {
    maxSize = 10,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
    checkMaliciousContent = true
  } = options
  
  // Size validation
  const sizeResult = validateFileSize(file, maxSize)
  if (!sizeResult.isValid) {
    return sizeResult
  }
  
  // Type validation
  const typeResult = validateFileType(file, allowedTypes, allowedExtensions)
  if (!typeResult.isValid) {
    return typeResult
  }
  
  // Malicious content detection
  if (checkMaliciousContent) {
    const contentResult = await detectMaliciousContent(file)
    if (!contentResult.isValid) {
      return contentResult
    }
  }
  
  // Combine all warnings
  const allWarnings = [
    ...(sizeResult.warnings || []),
    ...(typeResult.warnings || [])
  ]
  
  return {
    isValid: true,
    warnings: allWarnings.length > 0 ? allWarnings : undefined
  }
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // Replace dangerous characters with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase()
    .substring(0, 100) // Limit length
}

/**
 * Generate secure filename with timestamp
 */
export function generateSecureFilename(originalFilename: string, userId: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const extension = sanitized.substring(sanitized.lastIndexOf('.'))
  const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'))
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  
  return `${nameWithoutExt}_${timestamp}_${randomSuffix}${extension}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file type is image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if file type is video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * Check if file type is document
 */
export function isDocumentFile(file: File): boolean {
  return file.type.includes('pdf') || 
         file.type.includes('document') || 
         file.type.includes('text') ||
         file.type.includes('msword')
}

/**
 * Get appropriate file icon based on type
 */
export function getFileTypeIcon(file: File): string {
  if (isImageFile(file)) return '🖼️'
  if (isVideoFile(file)) return '🎥'
  if (isDocumentFile(file)) return '📄'
  return '📁'
}

/**
 * Create safe preview for file
 */
export function createSafePreview(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!isImageFile(file)) {
      resolve(null)
      return
    }
    
    // Only create previews for safe image types
    const safeImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!safeImageTypes.includes(file.type.toLowerCase())) {
      resolve(null)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}