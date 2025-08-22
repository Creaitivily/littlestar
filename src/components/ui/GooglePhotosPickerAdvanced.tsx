import React, { useState } from 'react'
import { Button } from './button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Progress } from './progress'
import { Alert, AlertDescription } from './alert'
import { CheckCircle, AlertCircle, Camera, Upload, X } from 'lucide-react'
import { googlePhotosService } from '@/lib/googlePhotosApi'
import { useAuth } from '@/contexts/AuthContext'

interface GooglePhotosPickerAdvancedProps {
  onPhotosSelected: (urls: string[]) => void
  childId: string
  className?: string
}

interface PickerState {
  idle: boolean
  authenticating: boolean
  picking: boolean
  uploading: boolean
  complete: boolean
  error: boolean
}

export function GooglePhotosPickerAdvanced({ 
  onPhotosSelected, 
  childId, 
  className 
}: GooglePhotosPickerAdvancedProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<PickerState>({
    idle: true,
    authenticating: false,
    picking: false,
    uploading: false,
    complete: false,
    error: false
  })
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])

  const { user } = useAuth()

  const resetState = () => {
    setState({
      idle: true,
      authenticating: false,
      picking: false,
      uploading: false,
      complete: false,
      error: false
    })
    setUploadProgress({ current: 0, total: 0 })
    setErrorMessage('')
    setSelectedUrls([])
  }

  const handleError = (message: string) => {
    setState(prev => ({ ...prev, error: true }))
    setErrorMessage(message)
  }

  const startPhotoPicker = async () => {
    if (!user) {
      handleError('User not authenticated')
      return
    }

    // Check configuration
    const config = googlePhotosService.getConfigStatus()
    if (!config.hasClientId || !config.hasApiKey) {
      handleError('Google Photos integration is not configured. Please add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to your environment variables.')
      return
    }

    resetState()
    
    try {
      // Step 1: Authentication & Initialization
      setState(prev => ({ ...prev, idle: false, authenticating: true }))
      
      // Step 2: Start picking process  
      setState(prev => ({ ...prev, authenticating: false, picking: true }))
      
      // Step 3: Upload photos
      setState(prev => ({ ...prev, picking: false, uploading: true }))
      
      const uploadedUrls = await googlePhotosService.pickPhotos(
        user.id,
        childId,
        (current, total) => {
          setUploadProgress({ current, total })
        }
      )

      if (uploadedUrls.length === 0) {
        handleError('No photos were selected or upload was cancelled')
        return
      }

      // Success
      setSelectedUrls(uploadedUrls)
      setState(prev => ({ ...prev, uploading: false, complete: true }))
      
      // Call parent callback after a brief delay to show success
      setTimeout(() => {
        onPhotosSelected(uploadedUrls)
        setIsOpen(false)
        resetState()
      }, 2000)

    } catch (error) {
      console.error('Photo picker error:', error)
      handleError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  const getStatusIcon = () => {
    if (state.error) return <AlertCircle className="w-5 h-5 text-red-500" />
    if (state.complete) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (state.authenticating) return <Camera className="w-5 h-5 text-blue-500 animate-pulse" />
    if (state.picking) return <Camera className="w-5 h-5 text-purple-500 animate-pulse" />
    if (state.uploading) return <Upload className="w-5 h-5 text-orange-500 animate-bounce" />
    return <Camera className="w-5 h-5 text-gray-500" />
  }

  const getStatusMessage = () => {
    if (state.error) return errorMessage
    if (state.complete) return `Successfully imported ${selectedUrls.length} photos!`
    if (state.authenticating) return 'Connecting to Google Photos...'
    if (state.picking) return 'Select your photos in the Google Photos window...'
    if (state.uploading) return `Uploading photos... (${uploadProgress.current}/${uploadProgress.total})`
    return 'Ready to import photos from Google Photos'
  }

  const getProgressValue = () => {
    if (state.complete) return 100
    if (state.uploading && uploadProgress.total > 0) {
      return (uploadProgress.current / uploadProgress.total) * 100
    }
    if (state.picking) return 60
    if (state.authenticating) return 30
    return 0
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={!state.idle}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
      >
        📷 Import from Google Photos
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Import from Google Photos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Display */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {getStatusMessage()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{Math.round(getProgressValue())}%</span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
            </div>

            {/* Error Alert */}
            {state.error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            {state.idle && (
              <div className="text-sm text-gray-600 space-y-2">
                {!googlePhotosService.getConfigStatus().hasClientId || !googlePhotosService.getConfigStatus().hasApiKey ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <h4 className="font-medium text-amber-800 mb-2">⚙️ Setup Required</h4>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      To use Google Photos import, you need to:
                    </p>
                    <ol className="text-xs text-amber-700 ml-4 mt-1 space-y-1">
                      <li>1. Create a Google Cloud project</li>
                      <li>2. Enable Google Picker API</li>
                      <li>3. Create API Key and OAuth2 credentials</li>
                      <li>4. Add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to .env.local</li>
                    </ol>
                    <p className="text-xs text-amber-600 mt-2">
                      Missing: {!googlePhotosService.getConfigStatus().hasClientId ? 'Client ID' : ''} {!googlePhotosService.getConfigStatus().hasApiKey ? 'API Key' : ''}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-800">How it works:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• Connect to your Google Photos account</li>
                      <li>• Select multiple photos in the picker</li>
                      <li>• Photos are automatically uploaded to your child's memory folder</li>
                      <li>• Use them in your memory records!</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {state.idle ? (
                <>
                  <Button 
                    onClick={startPhotoPicker}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Start Import
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : state.error ? (
                <>
                  <Button 
                    onClick={startPhotoPicker}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetState()
                      setIsOpen(false)
                    }}
                  >
                    Close
                  </Button>
                </>
              ) : state.complete ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetState()
                    setIsOpen(false)
                  }}
                  className="flex-1"
                >
                  Done
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetState()
                    setIsOpen(false)
                  }}
                  className="flex-1"
                  disabled={state.uploading}
                >
                  Cancel Import
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}