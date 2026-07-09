# Google OAuth Setup Instructions

This guide will help you configure Google OAuth for MarketVision AI.

## Prerequisites

1. A Google Cloud account
2. A Google Cloud project with OAuth consent screen configured

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: MarketVision AI
   - User support email: your email
   - Developer contact email: your email
4. Add scopes: `openid`, `email`, `profile`
5. Save and continue

### 3. Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application** as application type
4. Configure authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add the following to `server/.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 5. Restart Server

```bash
cd server
npm run dev
```

### 6. Test Google OAuth

1. Go to `http://localhost:5173/login`
2. Click "Sign in with Google"
3. After authorization, you'll be redirected back with a valid token

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Ensure the redirect URI in Google Console matches: `http://localhost:5000/api/auth/google/callback`
- Check for trailing slashes or protocol differences

**Error: "Google OAuth is not configured"**
- Ensure both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `server/.env`
- Restart the server after adding credentials

## Current Implementation

- Passport.js Google Strategy
- Backend routes: `/api/auth/google` and `/api/auth/google/callback`
- Frontend handling in `Landing.jsx` (token from URL params)
- Automatic token generation and user creation/lookup
- Redirect to dashboard after successful authentication

If Google OAuth credentials are not configured, the application shows an error and allows email/password or guest login instead.
