# Google Photos Integration Setup Guide

## Overview
This guide will help you set up Google Photos integration for MilestoneBee. Users will be able to import photos directly from their Google Photos library when creating memories.

## Prerequisites
- Google Cloud Console account
- Admin access to your MilestoneBee deployment

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note the project ID for reference

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for and enable the following APIs:
   - **Google Picker API**
   - **Google Photos Library API**

## Step 3: Create Credentials

### Create API Key
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > API key**
3. Copy the generated API key
4. **Optional but Recommended**: Restrict the API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your domain (e.g., `https://milestonebee.com/*`, `https://*.vercel.app/*`)
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Picker API" and "Google Photos Library API"
   - Save the restrictions

### Create OAuth 2.0 Client ID
1. In the same **Credentials** page, click **+ CREATE CREDENTIALS > OAuth 2.0 Client ID**
2. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "MilestoneBee"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`
   - Add test users if needed
3. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "MilestoneBee Web Client"
   - Authorized JavaScript origins:
     - `https://milestonebee.com`
     - `https://localhost:5173` (for development)
     - Add any other domains you use
   - Authorized redirect URIs:
     - `https://milestonebee.com/auth/google/callback`
     - `https://localhost:5173/auth/google/callback`
4. Copy the generated **Client ID**

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google Photos Integration
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

Replace the placeholder values with your actual credentials from Step 3.

## Step 5: Deploy Updates

1. Commit your environment variable changes
2. Deploy to your hosting platform (Vercel, etc.)
3. Ensure the production environment has the same environment variables

## Step 6: Test the Integration

1. Open your MilestoneBee app
2. Go to the Memories page
3. Click "Add Memory"
4. Click "📷 Import from Google Photos"
5. The integration should now work without 404 errors

## Security Notes

- **Never commit credentials to your repository**
- Use environment variables for all API keys and secrets
- Restrict your API key to your specific domains
- Regularly rotate your credentials
- Monitor usage in Google Cloud Console

## Troubleshooting

### Common Issues

**404 Error**: Fixed! The callback route has been added to handle OAuth redirects.

**"Google API credentials not configured"**: 
- Verify environment variables are set correctly
- Check that VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY are not the default placeholder values

**Authentication fails**:
- Ensure your domain is added to Authorized JavaScript origins
- Check that the OAuth consent screen is properly configured
- Verify the redirect URI matches exactly

**API quota exceeded**:
- Check your quota limits in Google Cloud Console
- Consider implementing usage limits or user restrictions

### Debug Steps

1. Open browser Developer Tools (F12)
2. Check the Console tab for error messages
3. Look for network requests to Google APIs
4. Verify environment variables are loaded: `console.log(import.meta.env)`

## Cost Considerations

- Google Picker API: Free tier with generous limits
- Google Photos Library API: Free tier with limits, paid tiers available
- Monitor usage in Google Cloud Console to avoid unexpected charges

## Alternative Solutions

If Google Photos integration is too complex, consider:
- Simple file upload from device (already implemented)
- Dropbox or OneDrive integration
- Manual photo import workflow

---

**Updated**: 2025-08-22  
**Status**: Ready for Production  
**Integration Type**: Client-side Google Picker API