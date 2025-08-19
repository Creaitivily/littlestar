import { supabase } from './supabase'

// Storage configuration
const STORAGE_BUCKET = 'attachfiles'

// Test storage connection
export const testStorageAccess = async (): Promise<{ success: boolean; error: any }> => {
  try {
    console.log('=== TESTING STORAGE ACCESS ===')
    
    // Try to list buckets
    console.log('Attempting to list buckets...')
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Storage access test failed:', error)
      
      // Provide specific guidance based on error
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        console.error('SOLUTION: Enable Supabase Storage in your project dashboard')
      } else if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
        console.error('SOLUTION: Check your Supabase API keys and project settings')
      }
      
      return { success: false, error }
    }
    
    console.log('Storage access successful!')
    console.log('Available buckets:', buckets?.map(b => ({ name: b.name, public: b.public })))
    console.log('=== STORAGE ACCESS TEST COMPLETED ===')
    return { success: true, error: null }
  } catch (error) {
    console.error('Storage access test error:', error)
    return { success: false, error }
  }
}

// Manual test function for debugging (can be called from browser console)
export const manualStorageTest = async () => {
  console.log('=== MANUAL STORAGE TEST ===')
  
  // Test basic storage access
  const { success, error } = await testStorageAccess()
  if (!success) {
    console.error('Storage access failed:', error)
    return false
  }
  
  // Test storage initialization
  console.log('Testing storage initialization...')
  const initResult = await initializeStorage()
  console.log('Storage initialization result:', initResult)
  
  return initResult
}

// Delete all child profiles for current user (admin function)
export const deleteAllChildProfiles = async (userId: string): Promise<{ success: boolean; error: any }> => {
  try {
    console.log('=== DELETING ALL CHILD PROFILES ===')
    console.log('User ID:', userId)
    
    // First, get all child profiles for this user
    const { data: children, error: fetchError } = await supabase
      .from('daughters')
      .select('*')
      .eq('user_id', userId)
    
    if (fetchError) {
      console.error('Error fetching children for deletion:', fetchError)
      return { success: false, error: fetchError }
    }
    
    if (!children || children.length === 0) {
      console.log('No child profiles found to delete')
      return { success: true, error: null }
    }
    
    console.log(`Found ${children.length} child profile(s) to delete:`)
    children.forEach(child => console.log(`- ${child.name} (ID: ${child.id})`))
    
    // Delete associated images from storage if they exist
    for (const child of children) {
      if (child.profile_image_url && child.profile_image_url.includes(STORAGE_BUCKET)) {
        console.log(`Deleting image for ${child.name}...`)
        const { success: imageDeleted } = await deleteChildImage(child.profile_image_url)
        if (imageDeleted) {
          console.log(`Image deleted for ${child.name}`)
        } else {
          console.warn(`Failed to delete image for ${child.name}`)
        }
      }
    }
    
    // Delete all related data first (foreign key constraints)
    console.log('Deleting related data (activities, growth records, health records, memories)...')
    
    // Delete activities
    const { error: activitiesError } = await supabase
      .from('activities')
      .delete()
      .eq('user_id', userId)
    
    if (activitiesError) {
      console.error('Error deleting activities:', activitiesError)
    } else {
      console.log('Activities deleted successfully')
    }
    
    // Delete growth records
    const { error: growthError } = await supabase
      .from('growth_records')
      .delete()
      .eq('user_id', userId)
    
    if (growthError) {
      console.error('Error deleting growth records:', growthError)
    } else {
      console.log('Growth records deleted successfully')
    }
    
    // Delete health records
    const { error: healthError } = await supabase
      .from('health_records')
      .delete()
      .eq('user_id', userId)
    
    if (healthError) {
      console.error('Error deleting health records:', healthError)
    } else {
      console.log('Health records deleted successfully')
    }
    
    // Delete memories
    const { error: memoriesError } = await supabase
      .from('memories')
      .delete()
      .eq('user_id', userId)
    
    if (memoriesError) {
      console.error('Error deleting memories:', memoriesError)
    } else {
      console.log('Memories deleted successfully')
    }
    
    // Finally, delete the child profiles
    console.log('Deleting child profiles...')
    const { error: deleteError } = await supabase
      .from('daughters')
      .delete()
      .eq('user_id', userId)
    
    if (deleteError) {
      console.error('Error deleting child profiles:', deleteError)
      return { success: false, error: deleteError }
    }
    
    console.log('=== ALL CHILD PROFILES DELETED SUCCESSFULLY ===')
    return { success: true, error: null }
    
  } catch (error) {
    console.error('=== FAILED TO DELETE CHILD PROFILES ===')
    console.error('Error details:', error)
    return { success: false, error }
  }
}

// Helper function to create storage bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    console.log('Initializing storage...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      
      // If we can't list buckets, storage might not be enabled
      if (listError.message?.includes('not found') || listError.message?.includes('404')) {
        console.warn('Supabase Storage may not be enabled. Please enable Storage in your Supabase dashboard.')
        return false
      }
      throw listError
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name))
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET)
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${STORAGE_BUCKET}`)
      const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      })
      
      if (error) {
        console.error('Error creating storage bucket:', error)
        
        // If bucket creation fails, try without restrictions
        console.log('Trying to create bucket with minimal configuration...')
        const { error: simpleError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true
        })
        
        if (simpleError) {
          console.error('Failed to create bucket even with simple config:', simpleError)
          return false
        }
      }
      
      console.log('Storage bucket created successfully')
    } else {
      console.log(`Storage bucket ${STORAGE_BUCKET} already exists`)
    }
    
    return true
  } catch (error) {
    console.error('Error initializing storage:', error)
    return false
  }
}

// Convert file to base64 data URL (fallback method)
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

// Upload attachment file (general purpose)
export const uploadAttachmentFile = async (
  file: File,
  userId: string,
  recordType: 'health' | 'memory',
  recordId?: string
): Promise<{ fileUrl: string | null; error: any }> => {
  try {
    console.log('=== STARTING ATTACHMENT UPLOAD ===')
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })
    console.log('Upload parameters:', { userId, recordType, recordId })
    
    // Validate file first
    if (file.size > 10 * 1024 * 1024) { // 10MB max for attachments
      throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum 10MB allowed.`)
    }
    
    // Try Supabase Storage first
    console.log('Trying Supabase Storage upload...')
    try {
      // Ensure storage is initialized
      const storageReady = await initializeStorage()
      
      if (!storageReady) {
        throw new Error('Storage not available')
      }
      
      // Create filename with proper organization
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt) {
        throw new Error('File has no extension')
      }
      
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${recordType}/${userId}/${recordId || timestamp}_${sanitizedFileName}`
      
      console.log('Generated filename:', fileName)
      
      // Upload file to Supabase Storage
      console.log('Starting file upload to Supabase Storage...')
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('Supabase Storage upload error:', error)
        throw error
      }
      
      if (!data) {
        throw new Error('Upload returned no data')
      }
      
      console.log('Supabase Storage upload successful:', data)
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)
      
      if (!publicUrl) {
        throw new Error('Failed to generate public URL')
      }
      
      console.log('Public URL generated:', publicUrl)
      console.log('=== ATTACHMENT UPLOAD COMPLETED SUCCESSFULLY ===')
      
      return { fileUrl: publicUrl, error: null }
      
    } catch (storageError) {
      console.error('Supabase Storage failed, using fallback method:', storageError)
      
      // Fallback to base64 data URL for smaller files
      console.log('Using base64 data URL fallback...')
      
      // For fallback, limit file size further to avoid database issues
      if (file.size > 2 * 1024 * 1024) { // 2MB for base64
        throw new Error('File too large for fallback method. Please use a smaller file (max 2MB).')
      }
      
      const dataUrl = await fileToDataURL(file)
      console.log('Base64 conversion successful, data URL length:', dataUrl.length)
      console.log('=== BASE64 FALLBACK UPLOAD COMPLETED ===')
      
      return { fileUrl: dataUrl, error: null }
    }
    
  } catch (error) {
    console.error('=== ATTACHMENT UPLOAD COMPLETELY FAILED ===')
    console.error('Error details:', error)
    return { fileUrl: null, error }
  }
}

// Upload child profile image
export const uploadChildImage = async (
  file: File,
  userId: string,
  childName: string
): Promise<{ imageUrl: string | null; error: any }> => {
  try {
    console.log('=== STARTING IMAGE UPLOAD ===')
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    })
    console.log('Upload parameters:', { userId, childName })
    
    // Validate file first
    if (!file.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`)
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum 5MB allowed.`)
    }
    
    // Try Supabase Storage first
    console.log('Trying Supabase Storage upload...')
    try {
      // Ensure storage is initialized
      const storageReady = await initializeStorage()
      
      if (!storageReady) {
        throw new Error('Storage not available')
      }
      
      // Create filename with user and child info
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt) {
        throw new Error('File has no extension')
      }
      
      const sanitizedChildName = childName.replace(/[^a-zA-Z0-9]/g, '_')
      const fileName = `children/${userId}/${sanitizedChildName}_${Date.now()}.${fileExt}`
      
      console.log('Generated filename:', fileName)
      
      // Upload file to Supabase Storage
      console.log('Starting file upload to Supabase Storage...')
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('Supabase Storage upload error:', error)
        throw error
      }
      
      if (!data) {
        throw new Error('Upload returned no data')
      }
      
      console.log('Supabase Storage upload successful:', data)
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)
      
      if (!publicUrl) {
        throw new Error('Failed to generate public URL')
      }
      
      console.log('Public URL generated:', publicUrl)
      console.log('=== SUPABASE STORAGE UPLOAD COMPLETED SUCCESSFULLY ===')
      
      return { imageUrl: publicUrl, error: null }
      
    } catch (storageError) {
      console.error('Supabase Storage failed, using fallback method:', storageError)
      
      // Fallback to base64 data URL
      console.log('Using base64 data URL fallback...')
      
      // For fallback, limit file size further to avoid database issues
      if (file.size > 1 * 1024 * 1024) { // 1MB for base64
        throw new Error('File too large for fallback method. Please use a smaller image (max 1MB).')
      }
      
      const dataUrl = await fileToDataURL(file)
      console.log('Base64 conversion successful, data URL length:', dataUrl.length)
      console.log('=== BASE64 FALLBACK UPLOAD COMPLETED ===')
      
      return { imageUrl: dataUrl, error: null }
    }
    
  } catch (error) {
    console.error('=== IMAGE UPLOAD COMPLETELY FAILED ===')
    console.error('Error details:', error)
    return { imageUrl: null, error }
  }
}

// Delete child image
export const deleteChildImage = async (imageUrl: string): Promise<{ success: boolean; error: any }> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/')
    const bucketIndex = urlParts.findIndex(part => part === STORAGE_BUCKET)
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL')
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/')
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])
    
    if (error) {
      console.error('Delete error:', error)
      throw error
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error }
  }
}

// Get image URL (helper function)
export const getImageUrl = (path: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)
  
  return publicUrl
}