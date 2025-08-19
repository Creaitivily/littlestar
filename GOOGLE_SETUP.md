# Google Photos Integration Setup

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Google Photos API
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create or select a project**
3. **Enable APIs**:
   - Google Photos Library API
   - Google Photos Picker API
4. **Create OAuth 2.0 credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5178`
   - Authorized redirect URIs: `http://localhost:5178/auth/google/callback`
5. **Copy the Client ID** to your `.env.local` file

## OAuth Scopes Used

- `photospicker.mediaitems.readonly` - Access to Google Photos Picker API
- `https://www.googleapis.com/auth/photoslibrary.readonly` - Read access to Google Photos Library

## How It Works

1. **Authentication**: User signs in with Google OAuth2
2. **Session Creation**: Creates a picker session using Google Photos Picker API
3. **Photo Selection**: Opens Google Photos picker in new window for multi-select
4. **Batch Upload**: Downloads selected photos and uploads them to Supabase Storage
5. **Progress Tracking**: Shows real-time upload progress

## Features

- ✅ Multi-select photo picker
- ✅ Automatic batch upload to child storage folder
- ✅ Progress indicator with cancel option
- ✅ Smart conflict resolution (clears other selections)
- ✅ Visual preview of imported photos
- ✅ Error handling and retry functionality

## File Organization

Photos are uploaded to: `attachfiles/memory/{userId}/{childId}/{timestamp}_{filename}`