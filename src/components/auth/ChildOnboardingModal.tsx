import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Card, CardContent } from '../ui/card'
import { Star, Heart, Baby, Calendar, Camera, Loader2, Upload, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { uploadChildImage, initializeStorage } from '../../lib/storage'

interface ChildData {
  name: string
  birthDate: string
  birthTime: string
  profileImageUrl?: string
}

interface ChildOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (childData: { name: string; birthDate: string; birthTime: string; profileImageUrl?: string | null }) => void
  isAdditionalChild?: boolean
}

export function ChildOnboardingModal({ isOpen, onClose, onComplete, isAdditionalChild = false }: ChildOnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [childData, setChildData] = useState<ChildData>({
    name: '',
    birthDate: '',
    birthTime: '',
    profileImageUrl: ''
  })

  const { user } = useAuth()

  // Initialize storage when component mounts
  useEffect(() => {
    initializeStorage()
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setLoading(false)
      setUploadingImage(false)
      setError(null)
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setChildData({
        name: '',
        birthDate: '',
        birthTime: '',
        profileImageUrl: ''
      })
    }
  }, [isOpen])

  const handleNext = () => {
    if (step === 1 && !childData.name.trim()) {
      setError('Please enter your little star\'s name')
      return
    }
    if (step === 2 && !childData.birthDate) {
      setError('Please select your little star\'s birth date')
      return
    }
    if (step === 3 && !childData.birthTime) {
      setError('Please enter your little star\'s birth time')
      return
    }
    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleComplete = async () => {
    if (!childData.name.trim() || !childData.birthDate || !childData.birthTime) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let profileImageUrl: string | null = null
      
      // Upload image if one was selected
      if (selectedFile && user) {
        console.log('Uploading child image...')
        setUploadingImage(true)
        
        const { imageUrl, error: uploadError } = await uploadChildImage(
          selectedFile,
          user.id,
          childData.name
        )
        
        if (uploadError) {
          console.error('Image upload failed:', uploadError)
          const errorMessage = uploadError?.message || 'Unknown upload error'
          setError(`Failed to upload image: ${errorMessage}`)
          return
        }
        
        profileImageUrl = imageUrl
        console.log('Image uploaded successfully:', profileImageUrl)
      }
      
      const childDataToSubmit = {
        name: childData.name,
        birthDate: childData.birthDate,
        birthTime: childData.birthTime || '',
        profileImageUrl
      }
      
      console.log('Submitting child data:', childDataToSubmit)
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 15000)
      )
      
      await Promise.race([
        onComplete(childDataToSubmit),
        timeoutPromise
      ])
      
      console.log('Child creation completed successfully')
      onClose()
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    } catch (err: any) {
      console.error('Child creation error:', err)
      
      // Check for specific error types
      if (err?.message?.includes('Request timed out')) {
        setError('Request took too long. Please check your connection and try again.')
      } else if (err?.message?.includes('relation "daughters" does not exist')) {
        setError('Database not set up yet. Please run the database setup SQL commands.')
      } else if (err?.message?.includes('birth_time')) {
        setError('Database schema needs updating. Please run: ALTER TABLE daughters ADD COLUMN birth_time TIME;')
      } else if (err?.message?.includes('violates foreign key constraint') || err?.message?.includes('user_id_fkey')) {
        setError('User profile issue detected. Please try logging out and back in, then try again.')
      } else if (err?.message?.includes('not found') && err?.message?.includes('user')) {
        setError('User profile not found. Creating profile automatically - please try again.')
      } else {
        setError(`Failed to create profile: ${err?.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      setError(null)
      
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      
      console.log('Image selected:', file.name, 'Size:', Math.round(file.size / 1024), 'KB')
    }
  }

  const removeSelectedImage = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setChildData(prev => ({ ...prev, profileImageUrl: '' }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Star className="h-12 w-12 text-lavender-500 animate-pulse" fill="currentColor" />
              <Heart className="h-4 w-4 text-pink-400 absolute -top-1 -right-1 animate-bounce" fill="currentColor" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">
            {isAdditionalChild ? 'Add Another Little Star! ✨' : 'Welcome to Little Star! ✨'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isAdditionalChild ? 
              "Let's create a profile for another precious little one" :
              "Let's create a profile for your precious little one"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i <= step ? 'bg-lavender-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Name */}
          {step === 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Baby className="w-12 h-12 text-lavender-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">What's your little star's name?</h3>
                    <p className="text-sm text-gray-600">This will be displayed throughout the app</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child's Name</Label>
                    <Input
                      id="childName"
                      type="text"
                      placeholder="Enter your little star's name"
                      value={childData.name}
                      onChange={(e) => setChildData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-center text-lg"
                      autoFocus
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Birth Date */}
          {step === 2 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-lavender-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">When was {childData.name} born?</h3>
                    <p className="text-sm text-gray-600">This helps us track age-appropriate milestones</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={childData.birthDate}
                      onChange={(e) => setChildData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="text-center"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Birth Time */}
          {step === 3 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-lavender-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">What time was {childData.name} born?</h3>
                    <p className="text-sm text-gray-600">This helps us provide more precise milestone tracking</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthTime">Birth Time</Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={childData.birthTime}
                      onChange={(e) => setChildData(prev => ({ ...prev, birthTime: e.target.value }))}
                      className="text-center text-lg"
                    />
                  </div>
                  
                  <div className="text-center text-xs text-gray-500">
                    💡 Tip: You can find this on the birth certificate or hospital records
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Photo (Optional) */}
          {step === 4 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-lavender-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">Add a photo of {childData.name}?</h3>
                    <p className="text-sm text-gray-600">Optional - you can always add this later</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {previewUrl && (
                      <div className="flex justify-center relative">
                        <img
                          src={previewUrl}
                          alt={childData.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-lavender-200 shadow-lg"
                        />
                        <button
                          onClick={removeSelectedImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    {!previewUrl && (
                      <div className="flex justify-center">
                        <label
                          htmlFor="profileImage"
                          className="cursor-pointer bg-lavender-50 hover:bg-lavender-100 border-2 border-dashed border-lavender-300 rounded-lg p-8 transition-colors text-center"
                        >
                          <Upload className="w-8 h-8 text-lavender-500 mx-auto mb-2" />
                          <p className="text-sm text-lavender-600 font-medium">Click to upload photo</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                        </label>
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                    
                    {/* Upload Progress */}
                    {uploadingImage && (
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-lavender-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Uploading image...</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="flex-1"
            >
              Back
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading || uploadingImage}
                className="flex-1"
              >
                {loading || uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadingImage ? 'Uploading Image...' : 'Creating Profile...'}
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            )}
          </div>

          {/* Skip photo step */}
          {step === 4 && (
            <div className="text-center">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip photo for now
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}