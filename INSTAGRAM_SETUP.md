# Instagram SSO Setup Guide

This guide will help you set up Instagram Basic Display API integration for the Fitness Analytics Platform.

## Prerequisites

- Meta Developer account (free)
- Instagram Business or Creator account
- Valid callback URL (your domain)

## Step 1: Create Meta Developer Account

1. Go to [https://developers.facebook.com/](https://developers.facebook.com/)
2. Click "Get Started" and create a developer account
3. Verify your identity (email or phone)

## Step 2: Create an App

1. Go to [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select **"Other"** as app type
4. Enter app name: "Fitness Analytics Platform"
5. Click "Create App"

## Step 3: Add Instagram Basic Display

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** if prompted

## Step 4: Configure Instagram Basic Display

1. In Instagram Basic Display settings:
   - **User Token Generator**: Click "Add or Remove Instagram Testers"
   - Add your Instagram account as a tester
   - You'll need to accept the tester invite in Instagram

2. **Valid OAuth Redirect URIs**:
   - For local development: `http://localhost:8000/api/v1/instagram/callback`
   - For production: `https://your-domain.com/api/v1/instagram/callback`
   - Click "Save Changes"

## Step 5: Get Your Credentials

1. In the app dashboard, go to **Settings** > **Basic**
2. Copy:
   - **App ID** → This is your `INSTAGRAM_CLIENT_ID`
   - **App Secret** → This is your `INSTAGRAM_CLIENT_SECRET`

## Step 6: Configure Backend Environment

Create or edit `backend/.env`:

```bash
INSTAGRAM_CLIENT_ID=your-actual-client-id
INSTAGRAM_CLIENT_SECRET=your-actual-client-secret
INSTAGRAM_REDIRECT_URI=http://localhost:8000/api/v1/instagram/callback
```

For production deployment:

```bash
INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/v1/instagram/callback
```

## Step 7: Update CORS Settings

In `backend/.env`, update CORS to include your production domain:

```bash
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","https://your-domain.com"]
```

## Step 8: Test Instagram Connection

1. Restart the backend server:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. In the frontend, go to the Instagram page
3. Click "Connect Account"
4. You'll be redirected to Instagram's authorization page
5. Log in and authorize the app
6. You'll be redirected back to your app with the access token

## Important Notes

### For Development:
- Only Instagram accounts added as "Testers" can connect
- You need to accept the tester invite in Instagram
- The app must be in "Development Mode"

### For Production:
- You'll need to submit the app for review by Meta
- Your app must pass Meta's review process
- This typically takes 1-2 weeks
- You'll need to provide:
  - Privacy Policy URL
  - Terms of Service URL
  - App description
  - Screenshots or demo video
  - App icon

### Permissions Required:
The Instagram Basic Display API provides:
- User profile information
- User's media (posts)
- Media insights (metrics like likes, comments, reach)

### Rate Limits:
- Instagram has rate limits on API calls
- Implement caching to avoid hitting limits
- Cache posts for 1-2 hours between syncs

## Troubleshooting

### Error: "Invalid redirect URI"
- Make sure the redirect URI matches exactly (including trailing slash if applicable)
- Check the Valid OAuth Redirect URIs in app settings

### Error: "This app is in development mode"
- Add your Instagram account as a tester
- Accept the tester invite in Instagram

### Error: "Token expired"
- The short-lived tokens expire in 1 hour
- The code automatically exchanges for long-lived tokens (60 days)
- Implement token refresh before expiration

### Error: "No posts returned"
- Make sure your Instagram account has public posts
- Business/Creator accounts may have different permissions
- Check that the user has granted the necessary permissions

## Security Best Practices

1. **Never commit** `INSTAGRAM_CLIENT_SECRET` to git
2. Use environment variables in production
3. Rotate secrets periodically
4. Implement token encryption in database
5. Log out inactive users
6. Monitor for suspicious activity

## Production Deployment Checklist

- [ ] App submitted for Meta review
- [ ] App approved by Meta
- [ ] Production redirect URI configured
- [ ] CORS settings updated for production domain
- [ ] HTTPS enabled (required for production)
- [ ] Environment variables set in production
- [ ] Database encrypted
- [ ] Token refresh implemented
- [ ] Rate limiting implemented
- [ ] Error monitoring configured

## Alternative: Mock Mode for Testing

If you want to test the UI without Instagram credentials, you can add a mock mode:

1. Add to `backend/.env`:
   ```bash
   MOCK_INSTAGRAM=true
   ```

2. Update the Instagram service to return mock data when in mock mode

This allows you to test the UI and flow without real Instagram integration.

## Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Meta App Review Guidelines](https://developers.facebook.com/docs/app-review/)
- [Instagram Graph API Reference](https://developers.facebook.com/docs/instagram-api/reference)
