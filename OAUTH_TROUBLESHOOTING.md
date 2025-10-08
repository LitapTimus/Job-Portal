# Google OAuth Troubleshooting Guide

## ❌ Error: redirect_uri_mismatch

This error occurs when the redirect URI in Google Cloud Console doesn't match exactly what your application sends.

### 🔧 Quick Fix Steps:

#### 1. Check Your Google Cloud Console Configuration

Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

**Your OAuth 2.0 Client should have EXACTLY these settings:**

**Authorized JavaScript origins:**
```
http://localhost:5000
http://localhost:5173
```

**Authorized redirect URIs:**
```
http://localhost:5000/api/auth/google/callback
```

⚠️ **Important**: 
- No trailing slashes
- Exact port numbers (5000 for backend, 5173 for frontend)
- Use `http://` for local development (not `https://`)

#### 2. Verify Your Environment Variables

Make sure your `server/.env` file has:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google_console
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

#### 3. Restart Your Server

After making changes to `.env` or Google Console:
```bash
cd server
npm run dev
```

#### 4. Test the OAuth Flow

1. Go to `http://localhost:5173/login`
2. Click "Continue with Google"
3. Should redirect to Google OAuth consent screen

### 🔍 Debug Steps:

#### Check Current Configuration:
Visit: `http://localhost:5000/api/auth/status`

Should return:
```json
{
  "oauth": {
    "google": {
      "configured": true,
      "clientId": "Set"
    }
  },
  "session": {
    "secret": "Set"
  }
}
```

#### Test OAuth Initiation:
Visit: `http://localhost:5000/api/auth/google`

Should redirect to Google OAuth consent screen.

### 🚨 Common Mistakes:

1. **Wrong Port Numbers**
   - Backend must be on port 5000
   - Frontend must be on port 5173

2. **Trailing Slashes**
   - ❌ `http://localhost:5000/`
   - ✅ `http://localhost:5000`

3. **HTTPS vs HTTP**
   - Use `http://` for local development
   - Use `https://` only for production

4. **Missing Environment Variables**
   - Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set

5. **Cached Credentials**
   - Clear browser cache/cookies
   - Try incognito/private browsing mode

### 📋 Step-by-Step Fix for Your Current Error:

1. **Go to Google Cloud Console**
   - Navigate to your project
   - Go to APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID

2. **Update Authorized redirect URIs**
   - Click on your OAuth client
   - In "Authorized redirect URIs" section, add:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Remove any other redirect URIs that might be there
   - Click "Save"

3. **Wait 5 minutes**
   - Google changes can take a few minutes to propagate

4. **Test Again**
   - Restart your server: `cd server && npm run dev`
   - Try OAuth flow again

### 🔄 Alternative Callback URL Configuration

If you're still having issues, you can also try configuring the callback URL as an environment variable:

Add to `server/.env`:
```env
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Then update `server/config/passport.js`:
```javascript
callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
```

### 🎯 Exact Google Console Settings

**Project Name:** career-compass (or whatever you named it)

**OAuth consent screen:**
- Application name: Job Portal
- User support email: vijaysumit46@gmail.com
- Developer contact: vijaysumit46@gmail.com

**OAuth 2.0 Client ID:**
- Application type: Web application
- Name: Job Portal Web Client
- Authorized JavaScript origins: `http://localhost:5000`, `http://localhost:5173`
- Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`

### 📞 Still Having Issues?

If you're still getting the error:

1. **Double-check the exact error message** - sometimes it shows the expected vs actual URI
2. **Try a different browser** or incognito mode
3. **Check server logs** for any additional error details
4. **Verify your server is running on port 5000**

The most common cause is a mismatch between what's in Google Console and what your app is sending. Make sure they match exactly!
