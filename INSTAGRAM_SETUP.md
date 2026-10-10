# Instagram SSO Setup Guide

This guide will help you set up Instagram Basic Display API integration for the Fitness Analytics Platform.

## Important: Developer vs. End User Setup

**This setup is for YOU (the developer) only.**

Your end users (gym owners) will NOT need to:
- Create a Meta Developer account ❌
- Create their own Instagram app ❌
- Get API credentials ❌

Instead, end users will simply:
- Click "Connect Instagram" in your app ✅
- Log in to their Instagram account ✅
- Authorize your app to access their data ✅

This is how SaaS platforms like Buffer, Hootsuite, and Later work - they have ONE Instagram app that all their users connect their accounts to.

## Prerequisites (For You, the Developer)

- Meta Developer account (free - you create this once)
- Valid callback URL (your domain for production)

## Prerequisites (For End Users)

- Instagram account (any type works, but Business/Creator preferred for insights)
- That's it!

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

## Step 3: Choose Your API Option

You have two options for Instagram integration:

### Option A: Instagram Basic Display (Recommended for MVP - Current Implementation)
- ✅ Simpler setup
- ✅ Works with personal Instagram accounts
- ✅ Basic post data and engagement metrics
- ✅ Faster Meta review
- ✅ Lower rate limits but sufficient for most use cases
- ❌ Limited analytics depth
- ❌ No ad management

### Option B: Instagram Graph API / Marketing API (Advanced)
- ✅ More advanced features
- ✅ Detailed analytics and insights
- ✅ Ad management capabilities
- ✅ Better for Business/Creator accounts
- ✅ Higher rate limits
- ❌ Requires Business/Creator accounts only
- ❌ More complex implementation
- ❌ Stricter Meta review
- ❌ May have costs for high usage

**Recommendation:** Start with Option A (Basic Display) for MVP. Upgrade to Option B if you need advanced features.

**This guide covers Option A (Basic Display).** If you want Option B (Graph API/Marketing API), see the Marketing API documentation at [https://developers.facebook.com/social-technologies/marketing-api](https://developers.facebook.com/social-technologies/marketing-api).

## Step 4: Add Instagram Basic Display

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** if prompted

## Step 5: Configure Instagram Basic Display

1. In Instagram Basic Display settings:
   - **User Token Generator**: Click "Add or Remove Instagram Testers"
   - Add your Instagram account as a tester
   - You'll need to accept the tester invite in Instagram

2. **Valid OAuth Redirect URIs**:
   - For local development: `http://localhost:8000/api/v1/instagram/callback`
   - For production: `https://your-domain.com/api/v1/instagram/callback`
   - Click "Save Changes"

## Step 6: Get Your Credentials

1. In the app dashboard, go to **Settings** > **Basic**
2. Copy:
   - **App ID** → This is your `INSTAGRAM_CLIENT_ID`
   - **App Secret** → This is your `INSTAGRAM_CLIENT_SECRET`

## Step 7: Configure Backend Environment

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

## Step 8: Update CORS Settings

In `backend/.env`, update CORS to include your production domain:

```bash
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","https://your-domain.com"]
```

## Step 9: Test Instagram Connection

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

## How It Works for End Users

When a gym owner (end user) uses your app:

1. **They click "Connect Instagram"** in your dashboard
2. **They're redirected to Instagram** (using YOUR app's credentials)
3. **They log in to THEIR Instagram account**
4. **They authorize YOUR app** to access their data
5. **Instagram sends them back** to your app with an access token
6. **Your app stores the token** linked to their user account
7. **They can now sync their posts** and get predictions

This is standard OAuth 2.0 flow - the same way:
- You connect your Spotify account to third-party apps
- You connect your Google account to other services
- You connect your Instagram to Buffer, Hootsuite, etc.

**Your app handles all the technical complexity - end users just click and login.**

## Upgrading to Instagram Graph API / Marketing API

If you decide to upgrade from Basic Display to the more advanced Graph API/Marketing API:

### Required Changes

1. **Update App Product:**
   - Remove "Instagram Basic Display"
   - Add "Instagram Graph API" or "Marketing API"

2. **Update Backend Code:**
   - Change API endpoints from `graph.instagram.com` to Graph API endpoints
   - Update permissions scope (business_insights, ads_management, etc.)
   - Use Page Access Tokens instead of User Access Tokens
   - Update the Instagram service to use Graph API methods

3. **Require Business Accounts:**
   - End users must have Instagram Business or Creator accounts
   - They need to connect their Instagram to a Facebook Page
   - More complex onboarding flow

4. **Submit for Review:**
   - Stricter review process
   - Need to justify each permission requested
   - May require video walkthrough
   - Takes longer (2-4 weeks)

### When to Upgrade

Consider upgrading if:
- You need detailed audience insights
- You want to manage Instagram ads
- You need advanced analytics
- Your users are all businesses
- You're scaling to enterprise features

### Current Implementation

The current code uses Instagram Basic Display API and is production-ready for the MVP. You can upgrade to Graph API later without changing the architecture significantly.

For Graph API implementation details, see:
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Marketing API Docs](https://developers.facebook.com/social-technologies/marketing-api)

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

**Note**: This review is only for YOUR app. Once approved, any end user can connect their Instagram account without needing their own Meta developer account.

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

## FAQ

### Q: Do my end users need a Meta Developer account?
**A: No.** Only you (the developer) need one Meta Developer account and one Instagram app. End users just connect their Instagram accounts to your app.

### Q: Do end users need to add their Instagram as testers?
**A: No.** In development mode, you add testers. In production (after Meta review), anyone can connect their Instagram account.

### Q: Can multiple users connect their Instagram accounts?
**A: Yes!** That's the whole point. One Instagram app can serve thousands of users connecting their individual accounts.

### Q: Is this secure?
**A: Yes.** Each user gets their own access token stored in your database. Tokens are encrypted and can be revoked. You only see the data they explicitly authorize.

### Q: What if Instagram changes their API?
**A:** Instagram periodically updates their API. Monitor their developer announcements and update your code accordingly. The Basic Display API is relatively stable.

### Q: Can I test without real Instagram data?
**A: Yes.** The prediction features work without Instagram data using heuristic models. Instagram data just makes predictions more accurate.

### Q: What's the difference between Basic Display and Graph API?
**A:**
- **Basic Display**: Simpler, requires user login, good for small apps, limited to personal profiles
- **Graph API**: More features, requires Business/Creator accounts, more complex, better for business use

This app uses Basic Display for simplicity, but can be upgraded to Graph API if needed.

### Q: Should I use the Marketing API instead?
**A:** The Marketing API (https://developers.facebook.com/social-technologies/marketing-api) is more advanced and provides:
- Instagram Graph API for Business accounts
- Facebook Marketing API
- Detailed analytics and insights
- Ad management capabilities

**Use Marketing API if:**
- Your users have Instagram Business or Creator accounts
- You need detailed analytics and insights
- You want to manage ads
- You need more advanced features

**Use Basic Display if:**
- You want a simpler setup
- Personal Instagram accounts are acceptable
- You just need basic post data and engagement metrics
- You want to get started quickly

**Note:** Marketing API requires more permissions and stricter Meta review.

### Q: Do I need to pay for the Instagram API?
**A: No.** The Instagram Basic Display API is free. The Marketing API has free tiers but may have costs for high usage.

### Q: What happens if a user disconnects their Instagram?
**A:** They can revoke access in their Instagram settings. Your app should handle token expiration gracefully and prompt them to reconnect.
