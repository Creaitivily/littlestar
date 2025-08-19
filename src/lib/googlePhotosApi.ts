// Google Photos Picker API integration
import { supabase } from './supabase'

const GOOGLE_PHOTOS_API_BASE = 'https://photospicker.googleapis.com/v1'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`

// Validate environment variables
if (!CLIENT_ID) {
  console.error('❌ VITE_GOOGLE_CLIENT_ID is not set in environment variables')
}

// OAuth2 configuration
const OAUTH_SCOPES = [
  'photospicker.mediaitems.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly'
]

interface PickerSession {
  id: string
  pickerUri: string
  mediaItemsSet?: boolean
}

interface PickedMediaItem {
  id: string
  mediaFile: {
    baseUrl: string
    filename: string
    mimeType: string
  }
}

export class GooglePhotosService {
  private accessToken: string | null = null

  constructor() {
    // Check for stored access token
    this.accessToken = localStorage.getItem('google_photos_token')
  }

  // Initialize OAuth2 flow
  async authenticate(): Promise<boolean> {
    try {
      if (this.accessToken && await this.validateToken()) {
        return true
      }

      // Start OAuth2 flow
      const authUrl = this.buildAuthUrl()
      
      // Open popup for authentication
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes'
      )

      return new Promise((resolve) => {
        const checkAuth = setInterval(() => {
          try {
            if (popup?.closed) {
              clearInterval(checkAuth)
              // Check if token was received
              const token = localStorage.getItem('google_photos_token')
              this.accessToken = token
              resolve(!!token)
            }
          } catch (error) {
            // Cross-origin error means popup is still active
          }
        }, 1000)

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkAuth)
          popup?.close()
          resolve(false)
        }, 300000)
      })
    } catch (error) {
      console.error('Authentication error:', error)
      return false
    }
  }

  // Create a picker session
  async createSession(): Promise<PickerSession | null> {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${GOOGLE_PHOTOS_API_BASE}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Optional: Configure session settings
        })
      })

      if (!response.ok) {
        throw new Error(`Session creation failed: ${response.statusText}`)
      }

      const session = await response.json()
      return session
    } catch (error) {
      console.error('Session creation error:', error)
      return null
    }
  }

  // Poll session for completion
  async pollSession(sessionId: string): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    let attempts = 0
    const maxAttempts = 60 // 5 minutes with 5-second intervals

    return new Promise((resolve) => {
      const poll = setInterval(async () => {
        try {
          const response = await fetch(`${GOOGLE_PHOTOS_API_BASE}/sessions/${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          })

          if (!response.ok) {
            clearInterval(poll)
            resolve(false)
            return
          }

          const session = await response.json()
          
          if (session.mediaItemsSet) {
            clearInterval(poll)
            resolve(true)
            return
          }

          attempts++
          if (attempts >= maxAttempts) {
            clearInterval(poll)
            resolve(false)
          }
        } catch (error) {
          console.error('Polling error:', error)
          clearInterval(poll)
          resolve(false)
        }
      }, 5000) // Poll every 5 seconds
    })
  }

  // Get selected media items
  async getSelectedItems(sessionId: string): Promise<PickedMediaItem[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${GOOGLE_PHOTOS_API_BASE}/mediaItems?sessionId=${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get media items: ${response.statusText}`)
      }

      const data = await response.json()
      return data.pickedMediaItems || []
    } catch (error) {
      console.error('Error getting selected items:', error)
      return []
    }
  }

  // Download and upload photos to Supabase
  async uploadSelectedPhotos(
    items: PickedMediaItem[], 
    userId: string, 
    childId: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      onProgress?.(i + 1, items.length)

      try {
        // Download image from Google Photos
        const imageResponse = await fetch(item.mediaFile.baseUrl, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        })

        if (!imageResponse.ok) {
          console.warn(`Failed to download ${item.mediaFile.filename}`)
          continue
        }

        const imageBlob = await imageResponse.blob()
        const imageFile = new File([imageBlob], item.mediaFile.filename, {
          type: item.mediaFile.mimeType
        })

        // Upload to Supabase Storage
        const timestamp = Date.now()
        const fileName = `memory/${userId}/${childId}/${timestamp}_${item.mediaFile.filename}`

        const { data, error } = await supabase.storage
          .from('attachfiles')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error(`Upload error for ${item.mediaFile.filename}:`, error)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('attachfiles')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)

      } catch (error) {
        console.error(`Processing error for ${item.mediaFile.filename}:`, error)
      }
    }

    return uploadedUrls
  }

  // Validate access token
  private async validateToken(): Promise<boolean> {
    if (!this.accessToken) return false

    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${this.accessToken}`
      )
      return response.ok
    } catch {
      return false
    }
  }

  // Build OAuth2 authorization URL
  private buildAuthUrl(): string {
    if (!CLIENT_ID) {
      throw new Error('Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env.local file.')
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: OAUTH_SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/oauth/authorize?${params.toString()}`
  }

  // Complete photo picker flow
  async pickPhotos(
    userId: string,
    childId: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    try {
      // Step 1: Authenticate
      const authenticated = await this.authenticate()
      if (!authenticated) {
        throw new Error('Authentication failed')
      }

      // Step 2: Create session
      const session = await this.createSession()
      if (!session) {
        throw new Error('Failed to create picker session')
      }

      // Step 3: Open picker in new tab
      const pickerWindow = window.open(session.pickerUri, '_blank')
      if (!pickerWindow) {
        throw new Error('Failed to open picker window')
      }

      // Step 4: Poll for completion
      const completed = await this.pollSession(session.id)
      if (!completed) {
        throw new Error('Photo selection timed out or was cancelled')
      }

      // Step 5: Get selected items
      const selectedItems = await this.getSelectedItems(session.id)
      if (selectedItems.length === 0) {
        return []
      }

      // Step 6: Upload to Supabase
      const uploadedUrls = await this.uploadSelectedPhotos(
        selectedItems,
        userId,
        childId,
        onProgress
      )

      return uploadedUrls
    } catch (error) {
      console.error('Photo picker error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const googlePhotosService = new GooglePhotosService()