# 🚀 Quick Google Photos Setup Guide

## Step 1: Google Cloud Console Setup

1. **Go to**: https://console.cloud.google.com
2. **Create/Select Project**: Choose existing or create new project
3. **Enable APIs**: 
   - Search "Google Photos Library API" → Enable
   - Search "Photos Picker API" → Enable (if available)

## Step 2: Create OAuth Credentials

1. **Navigate to**: APIs & Services → Credentials
2. **Click**: "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Configure**:
   - Application type: **Web application**
   - Name: **Little Star App**
   - Authorized JavaScript origins: `http://localhost:5178`
   - Authorized redirect URIs: `http://localhost:5178/auth/google/callback`
4. **Save** and copy the Client ID

## Step 3: Update Environment Variables

Replace in your `.env.local` file:
```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-from-step-2
```

## Step 4: Restart Development Server

```bash
npm run dev
```

## ✅ Test the Integration

1. Open the app → Add Memory
2. Click "Import from Google Photos"
3. Should now show proper setup instead of 404 error

## 🔧 Troubleshooting

- **404 Error**: Client ID not set or invalid
- **403 Error**: APIs not enabled in Google Cloud
- **Popup blocked**: Allow popups for localhost
- **CORS Error**: Check redirect URI matches exactly

---

Once set up, you'll have:
- ✅ Multi-select Google Photos picker
- ✅ Automatic batch upload to child folders  
- ✅ Progress tracking with visual feedback
- ✅ Smart integration with memory forms