# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Job Portal application.

## Prerequisites

1. **Install Required Backend Dependencies**
   ```bash
   cd server
   npm install passport passport-google-oauth20 express-session
   ```

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google People API)

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Choose **"Web application"** as the application type
4. Configure the OAuth consent screen if prompted:
   - Add your app name: "Job Portal"
   - Add your email
   - Add authorized domains if needed

### Step 3: Configure OAuth Client

**Authorized JavaScript origins:**
```
http://localhost:5000
http://localhost:5173
```

**Authorized redirect URIs:**
```
http://localhost:5000/api/auth/google/callback
```

### Step 4: Get Your Credentials

After creating the OAuth client, you'll receive:
- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)

## Environment Configuration

Update your `server/.env` file with the Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# Make sure these are also set
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_key_change_in_production
```

## Testing the OAuth Flow

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test the OAuth flow:**
   - Go to `http://localhost:5173/login`
   - Click "Continue with Google"
   - Complete the Google OAuth flow
   - You should be redirected to role selection
   - Choose your role (Candidate/Recruiter)
   - You'll be redirected to the appropriate dashboard

## OAuth Flow Explanation

1. **User clicks "Continue with Google"** → Redirects to `/api/auth/google`
2. **Google OAuth consent screen** → User grants permissions
3. **Google redirects back** → `/api/auth/google/callback`
4. **Backend processes OAuth** → Creates/updates user account
5. **Role selection** → If new user, redirects to `/role-selection`
6. **Dashboard redirect** → Based on user role

## Features Included

✅ **Google OAuth Integration**
- Login/Signup with Google account
- Automatic account linking for existing emails
- Profile picture from Google account

✅ **Role Selection for OAuth Users**
- New OAuth users can choose Candidate/Recruiter role
- Seamless integration with existing role-based routing

✅ **Enhanced User Model**
- `googleId` field for OAuth users
- `avatar` field for profile pictures
- `authProvider` field to track login method

✅ **Security Features**
- Session-based OAuth flow
- JWT tokens for API authentication
- Secure cookie configuration

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error:**
   - Ensure redirect URI in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`

2. **"OAuth client not found" error:**
   - Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env`

3. **CORS issues:**
   - Ensure `CLIENT_URL` is set correctly in `.env`
   - Check that CORS is configured to allow credentials

4. **Session issues:**
   - Make sure `SESSION_SECRET` is set in `.env`
   - Check that cookies are being sent with requests

### Debug Steps:

1. Check server logs for OAuth errors
2. Verify Google Cloud Console configuration
3. Test OAuth endpoints directly:
   - `GET http://localhost:5000/api/auth/google`
   - Should redirect to Google OAuth

## Production Deployment

For production deployment:

1. **Update OAuth settings in Google Console:**
   - Add your production domain to authorized origins
   - Add production callback URL

2. **Update environment variables:**
   ```env
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   SESSION_SECRET=strong_random_secret_for_production
   ```

3. **Enable HTTPS:**
   - OAuth requires HTTPS in production
   - Update cookie settings for secure cookies

## Next Steps

- Add more OAuth providers (Facebook, GitHub, etc.)
- Implement OAuth account unlinking
- Add OAuth-specific user settings
- Enhanced profile management for OAuth users
