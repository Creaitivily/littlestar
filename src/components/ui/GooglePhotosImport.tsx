import React, { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { ExternalLink, Copy, CheckCircle, Info } from 'lucide-react'

interface GooglePhotosImportProps {
  onPhotoUrlSelect: (url: string) => void
  currentUrl?: string
  className?: string
}

export function GooglePhotosImport({ onPhotoUrlSelect, currentUrl = '', className }: GooglePhotosImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempUrl, setTempUrl] = useState(currentUrl)
  const [step, setStep] = useState(1)

  const handleApply = () => {
    onPhotoUrlSelect(tempUrl)
    setIsOpen(false)
    setStep(1)
  }

  const handleCancel = () => {
    setTempUrl(currentUrl)
    setIsOpen(false)
    setStep(1)
  }

  const steps = [
    {
      number: 1,
      title: "Open Google Photos",
      description: "Go to your Google Photos library",
      action: () => window.open('https://photos.google.com', '_blank')
    },
    {
      number: 2,
      title: "Find Your Photo",
      description: "Browse and select the photo you want to add to this memory"
    },
    {
      number: 3,
      title: "Share the Photo",
      description: "Click the share button (↗️) on your selected photo"
    },
    {
      number: 4,
      title: "Copy Link",
      description: "Choose 'Get Link' and copy the shareable link"
    },
    {
      number: 5,
      title: "Paste Below",
      description: "Paste the Google Photos link in the field below"
    }
  ]

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs px-3 py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            📷 Import from Google Photos
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              📷 Import Photo from Google Photos
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">How to import from Google Photos:</h3>
                  <div className="space-y-2">
                    {steps.map((stepItem, index) => (
                      <div 
                        key={stepItem.number}
                        className={`flex items-center gap-3 text-sm ${
                          step === stepItem.number ? 'text-blue-700 font-medium' : 'text-blue-600'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          step > stepItem.number 
                            ? 'bg-green-100 text-green-700' 
                            : step === stepItem.number 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-200 text-blue-600'
                        }`}>
                          {step > stepItem.number ? '✓' : stepItem.number}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium">{stepItem.title}:</span> {stepItem.description}
                        </div>
                        {stepItem.action && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              stepItem.action?.()
                              setStep(2)
                            }}
                            className="text-xs px-2 py-1"
                          >
                            Open <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="googlePhotosUrl" className="text-sm font-medium">
                Google Photos Link
              </Label>
              <div className="flex gap-2">
                <Input
                  id="googlePhotosUrl"
                  type="url"
                  placeholder="https://photos.app.goo.gl/..."
                  value={tempUrl}
                  onChange={(e) => {
                    setTempUrl(e.target.value)
                    if (e.target.value && step < 5) setStep(5)
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.readText().then(setTempUrl)}
                  className="px-3"
                  title="Paste from clipboard"
                >
                  📋
                </Button>
              </div>
              {tempUrl && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Google Photos link added successfully
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleApply} 
                disabled={!tempUrl.trim()}
                className="flex-1"
              >
                Use This Photo
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}