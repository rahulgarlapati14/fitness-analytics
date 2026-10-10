# Quick Deployment Guide: Vercel + Render

This is a step-by-step guide to deploy the Fitness Analytics Platform using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account with the repository pushed
- Render account (free)
- Vercel account (free)

## Step 1: Push Code to GitHub

If you haven't already:

```bash
cd /r/rairer
git remote add origin https://github.com/YOUR_USERNAME/fitness-analytics.git
git push -u origin master
```

## Step 2: Deploy Backend on Render

### 2.1 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Verify your email

### 2.2 Deploy Backend Service

1. After signing in, click **"New +"** → **"Web Service"**
2. Click **"Connect"** next to your GitHub repository
3. Grant Render access to your repository
4. Configure the service:

   **General:**
   - Name: `fitness-analytics-backend`
   - Region: Oregon (or closest to you)
   - Branch: `master`

   **Build & Deploy:**
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Environment Variables:**
   Click "Add Environment Variable" and add:
   ```
   DATABASE_URL = sqlite+aiosqlite:///./fitness_analytics.db
   SECRET_KEY = (click "Generate" or enter your own)
   DEBUG = false
   INSTAGRAM_CLIENT_ID = (leave empty for now)
   INSTAGRAM_CLIENT_SECRET = (leave empty for now)
   INSTAGRAM_REDIRECT_URI = (leave empty for now, will update later)
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (2-3 minutes)
7. Render will provide a URL like: `https://fitness-analytics-backend.onrender.com`
8. **Copy this URL** - you'll need it for the frontend

### 2.3 Verify Backend

1. Click on your deployed service
2. Check the "Logs" tab - should show "Application startup complete"
3. Visit `https://your-backend-url.onrender.com/api/docs`
4. You should see the FastAPI Swagger documentation

## Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Verify your email

### 3.2 Deploy Frontend

1. After signing in, click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your GitHub repository
3. Configure the project:

   **Project Settings:**
   - Name: `fitness-analytics-frontend`
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `frontend`

   **Environment Variables:**
   Click "Add Environment Variable" and add:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com
   ```
   (Replace with your actual Render backend URL from Step 2)

4. Click **"Deploy"**
5. Wait for deployment (1-2 minutes)
6. Vercel will provide a URL like: `https://fitness-analytics-frontend.vercel.app`

### 3.3 Verify Frontend

1. Click on your deployed project
2. Visit the provided URL
3. You should see the analytics page load
4. Check browser console for API URL (should show your Render backend URL)

## Step 4: Update Backend URL in Meta App (Optional)

If you want to enable Instagram integration later:

1. Go to [https://developers.facebook.com/apps](https://developers.facebook.com/apps/)
2. Open your Instagram app
3. Instagram Basic Display → Valid OAuth Redirect URIs
4. Add: `https://your-backend-url.onrender.com/api/v1/instagram/callback`
5. Save changes

6. Go back to Render:
   - Edit your backend service
   - Update `INSTAGRAM_REDIRECT_URI` to the same URL
   - Add `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET`
   - Redeploy

## Step 5: Test Production

1. Visit your Vercel frontend URL
2. Verify analytics page loads
3. Test predictions (if you want to add auth back)
4. Check Render logs for any errors
5. Check Vercel logs for any errors

## Troubleshooting

### Backend Deployment Fails

**Issue:** Build fails
- Check Render logs for specific error
- Verify `requirements.txt` is in the backend folder
- Verify Python version is compatible

**Issue:** Runtime error
- Check environment variables are set correctly
- Verify start command is correct
- Check database URL format

### Frontend Can't Connect to Backend

**Issue:** API calls failing
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Check browser console for the API URL being used
- Verify backend is running (visit `/api/docs`)
- Check CORS settings in backend

**Issue:** Mixed content errors
- Ensure both frontend and backend use HTTPS
- Render and Vercel provide HTTPS automatically

### Database Issues

**Issue:** Database errors
- For SQLite (current setup): No external database needed
- If using PostgreSQL: Ensure database is running and accessible
- Check DATABASE_URL format

## Cost Summary

- **Render Backend:** Free (750 hours/month)
- **Vercel Frontend:** Free (100GB bandwidth/month)
- **Total:** $0/month

## Limits

**Render Free Tier:**
- 750 hours/month of runtime
- 90-day data retention
- Sleeps after 15 minutes of inactivity (spins up on request)

**Vercel Free Tier:**
- 100GB bandwidth/month
- 6,000 minutes of build time/month
- Unlimited deployments

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Vercel
3. ⬜ Add custom domain (optional)
4. ⬜ Configure Instagram integration (optional)
5. ⬜ Add monitoring (Sentry, etc.)
6. ⬜ Set up CI/CD
7. ⬜ Add tests

## Your URLs

After deployment, you'll have:

- **Backend:** `https://fitness-analytics-backend.onrender.com`
- **Frontend:** `https://fitness-analytics-frontend.vercel.app`
- **API Docs:** `https://fitness-analytics-backend.onrender.com/api/docs`

Save these URLs for future reference!
