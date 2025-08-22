// Google Photos Picker API integration - Client-side implementation
import { uploadAttachmentFile } from './storage'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

// Validate environment variables
if (!CLIENT_ID) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set in environment variables')
}

if (!API_KEY) {
  console.warn('⚠️ VITE_GOOGLE_API_KEY is not set in environment variables')
}

// Google Photos Picker scopes
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest'
const SCOPES = 'https://www.googleapis.com/auth/photoslibrary.readonly'

interface SelectedPhoto {
  mediaItems: Array<{
    id: string
    baseUrl: string
    filename: string
    mimeType: string
  }>
}

declare global {
  interface Window {
    google: {
      picker: {
        PickerBuilder: any
        PhotosPickerBuilder: any
        ViewId: any
        Action: any
        Response: any
      }
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any
        }
      }
      client: {
        init: (config: any) => Promise<void>
        load: (api: string, callback: () => void) => void
      }
    }
    gapi: {
      load: (api: string, callback: () => void) => void
      client: {
        init: (config: any) => Promise<void>
      }
    }
  }
}

export class GooglePhotosService {
  private isInitialized = false
  private tokenClient: any = null
  private accessToken: string | null = null

  constructor() {
    this.loadGoogleAPI()
  }

  // Load Google APIs
  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve) => {
      // Load Google Identity Services
      const script1 = document.createElement('script')
      script1.src = 'https://accounts.google.com/gsi/client'
      script1.onload = () => {
        // Load Google Picker API
        const script2 = document.createElement('script')
        script2.src = 'https://apis.google.com/js/api.js'
        script2.onload = () => {
          this.initializeAPI().then(() => resolve())
        }
        document.head.appendChild(script2)
      }
      document.head.appendChild(script1)
    })
  }

  // Initialize Google APIs
  private async initializeAPI(): Promise<void> {
    if (this.isInitialized) return

    return new Promise((resolve) => {
      window.gapi.load('client:picker', async () => {
        if (!CLIENT_ID || !API_KEY) {
          console.error('Google API credentials not configured')
          resolve()
          return
        }

        try {
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC]
          })

          // Initialize OAuth2 token client
          this.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response: any) => {
              if (response.access_token) {
                this.accessToken = response.access_token
              }
            }
          })

          this.isInitialized = true
        } catch (error) {
          console.error('Failed to initialize Google API:', error)
        }
        
        resolve()
      })
    })
  }

  // Request access token
  private async requestAccessToken(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.tokenClient) {
        resolve(false)
        return
      }

      // Set up callback for this specific request
      const originalCallback = this.tokenClient.callback
      this.tokenClient.callback = (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token
          resolve(true)
        } else {
          resolve(false)
        }
        // Restore original callback
        this.tokenClient.callback = originalCallback
      }

      // Request token
      this.tokenClient.requestAccessToken()
    })
  }

  // Create and show Google Photos Picker
  private async showPhotoPicker(): Promise<SelectedPhoto | null> {
    return new Promise((resolve) => {
      if (!window.google?.picker || !this.accessToken) {
        resolve(null)
        return
      }

      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.DocsView(window.google.picker.ViewId.PHOTOS)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false))
        .setOAuthToken(this.accessToken)
        .setDeveloperKey(API_KEY)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const selectedItems = data.docs?.map((doc: any) => ({
              id: doc.id,
              baseUrl: doc.url,
              filename: doc.name,
              mimeType: doc.mimeType || 'image/jpeg'
            })) || []
            
            resolve({ mediaItems: selectedItems })
          } else if (data.action === window.google.picker.Action.CANCEL) {
            resolve(null)
          }
        })
        .build()

      picker.setVisible(true)
    })
  }

  // Download and upload photos to Supabase
  private async uploadPhotosToSupabase(
    photos: SelectedPhoto['mediaItems'],
    userId: string,
    childId: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      onProgress?.(i + 1, photos.length)

      try {
        // Download the photo
        const response = await fetch(photo.baseUrl)
        if (!response.ok) {
          console.warn(`Failed to download ${photo.filename}`)
          continue
        }

        const blob = await response.blob()
        const file = new File([blob], photo.filename, {
          type: photo.mimeType
        })

        // Upload to Supabase
        const { fileUrl, error } = await uploadAttachmentFile(
          file,
          userId,
          'memory'
        )

        if (!error && fileUrl) {
          uploadedUrls.push(fileUrl)
        } else {
          console.error(`Upload error for ${photo.filename}:`, error)
        }
      } catch (error) {
        console.error(`Processing error for ${photo.filename}:`, error)
      }
    }

    return uploadedUrls
  }

  // Main method to pick and upload photos
  async pickPhotos(
    userId: string,
    childId: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    try {
      // Ensure APIs are initialized
      await this.initializeAPI()

      if (!this.isInitialized) {
        throw new Error('Google APIs failed to initialize')
      }

      if (!CLIENT_ID || !API_KEY) {
        throw new Error('Google API credentials not configured. Please add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to your environment variables.')
      }

      // Request access token
      const hasToken = await this.requestAccessToken()
      if (!hasToken) {
        throw new Error('Authentication failed or cancelled')
      }

      // Show photo picker
      const selectedPhotos = await this.showPhotoPicker()
      if (!selectedPhotos || selectedPhotos.mediaItems.length === 0) {
        return []
      }

      // Upload photos to Supabase
      const uploadedUrls = await this.uploadPhotosToSupabase(
        selectedPhotos.mediaItems,
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

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized && !!this.tokenClient
  }

  // Get configuration status
  getConfigStatus(): { hasClientId: boolean; hasApiKey: boolean; isReady: boolean } {
    return {
      hasClientId: !!CLIENT_ID && CLIENT_ID !== 'your-google-client-id-here',
      hasApiKey: !!API_KEY && API_KEY !== 'your-google-api-key-here',
      isReady: this.isReady()
    }
  }
}

// Export singleton instance
export const googlePhotosService = new GooglePhotosService()