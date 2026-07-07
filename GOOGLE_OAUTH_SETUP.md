# Google OAuth Setup Instructions

This guide will help you configure Google OAuth for your MarketVision AI application.

## Prerequisites

1. A Google Cloud account
2. A Google Cloud project with OAuth consent screen configured

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your Project ID

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: MarketVision AI
   - User support email: your email
   - Developer contact email: your email
4. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
5. Save and continue

### 3. Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application** as application type
4. Configure authorized redirect URIs:
   - Development: `http://localhost:3002/login`
   - Production: `https://yourdomain.com/login`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Update Backend Environment Variables

Add the following to your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 5. Restart Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm start
```

### 6. Test Google OAuth

1. Go to `http://localhost:3002/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your application with a valid token

## Troubleshooting

### Error: "Google OAuth is not configured"

- Ensure both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `backend/.env`
- Restart the backend server after adding the credentials

### Error: "redirect_uri_mismatch"

- Ensure the redirect URI in Google Console matches exactly: `http://localhost:3002/login`
- Check for trailing slashes or protocol differences (http vs https)

### Error: "unauthorized_client"

- Verify the OAuth client type is set to "Web application"
- Check that the correct project is selected in Google Console

## Security Notes

- Never commit `.env` file to version control
- Keep your Client Secret secure
- Use environment variables for production deployments
- Restrict the OAuth consent screen to authorized users if needed

## Production Deployment

For production:

1. Update the authorized redirect URIs in Google Console to your production domain
2. Update the callback URL in `backend/controllers/authController.js` to use your production domain
3. Update the redirect URL in `backend/routes/auth.js` to use your production domain
4. Ensure HTTPS is enabled (Google requires HTTPS for OAuth in production)

## Current Implementation

The application currently has Google OAuth implemented with:

- Passport.js Google Strategy
- Backend routes: `/api/auth/google` and `/api/auth/google/callback`
- Frontend handling in `Login.jsx`
- Automatic token generation and user creation/lookup
- Redirect to dashboard after successful authentication

If Google OAuth credentials are not configured, the application gracefully shows an error message and allows users to use email/password or guest login instead.
