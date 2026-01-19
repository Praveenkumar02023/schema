# Google OAuth Setup Guide for SchemaFlow

## Overview
This guide will help you set up Google OAuth authentication for SchemaFlow using NextAuth.js.

## Prerequisites
- Google Account
- Access to Google Cloud Console

## Step 1: Install Dependencies

The required package `next-auth` should already be installed. If not, run:
```bash
npm install next-auth
```

## Step 2: Set Up Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it "SchemaFlow" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" user type
   - Click "Create"
   - Fill in required fields:
     - App name: SchemaFlow
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "SchemaFlow Web Client"
   - Authorized JavaScript origins:
     - http://localhost:3000
     - (Add your production URL later)
   - Authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google
     - (Add your production callback URL later)
   - Click "Create"
   - **IMPORTANT**: Copy the Client ID and Client Secret

## Step 3: Configure Environment Variables

1. **Create `.env.local` file** in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your credentials:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

3. **Generate NEXTAUTH_SECRET**:
   
   On Windows (PowerShell):
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   On Mac/Linux:
   ```bash
   openssl rand -base64 32
   ```
   
   Or use an online generator: https://generate-secret.vercel.app/32

## Step 4: Test the Authentication

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to**: http://localhost:3000

3. **Click "Start Designing"** → You'll be redirected to `/signin`

4. **Click "Continue with Google"**:
   - You'll be redirected to Google's OAuth consent screen
   - Sign in with your Google account
   - Grant permissions
   - You'll be redirected back to `/editor`

## Step 5: Verify It Works

- After signing in, you should be redirected to the editor
- Your session should persist across page refreshes
- You can sign out by clearing cookies or implementing a sign-out button

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Exact protocol (http vs https)

### Error: "invalid_client"
- Double-check your Client ID and Client Secret in `.env.local`
- Make sure there are no extra spaces or quotes

### Session not persisting
- Verify NEXTAUTH_SECRET is set correctly
- Clear browser cookies and try again

## Production Deployment

When deploying to production:

1. Add your production URL to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

2. Update `.env.local` (or your hosting platform's environment variables):
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. Keep NEXTAUTH_SECRET and Google credentials the same

## Security Notes

- **Never commit `.env.local`** to version control
- Keep your Client Secret private
- Regenerate secrets if they're ever exposed
- Use different OAuth clients for development and production

## Additional Resources

- NextAuth.js Documentation: https://next-auth.js.org/
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- NextAuth Google Provider: https://next-auth.js.org/providers/google

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal/server logs
3. Verify all environment variables are set correctly
4. Ensure Google Cloud project is properly configured
