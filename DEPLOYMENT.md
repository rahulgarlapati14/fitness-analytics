# Deployment Guide

This guide covers deployment options for the Fitness Analytics Platform.

## Why Not GitHub Pages?

GitHub Pages is for static sites only. It cannot host:
- FastAPI backend (Python server)
- Databases (PostgreSQL)
- Redis
- API endpoints

This is a full-stack application requiring backend + database, so GitHub Pages won't work.

## Recommended Deployment Options

### Option 1: Vercel + Render (Recommended for MVP)

**Frontend on Vercel:**
- Free tier available
- Built for Next.js
- Automatic deployments from GitHub
- Global CDN
- Free SSL certificates

**Backend on Render:**
- Free tier for web services
- Native Python/FastAPI support
- Built-in PostgreSQL
- Easy GitHub integration

**Pros:**
- Free tiers available
- Easy to set up
- Best for MVP
- Good documentation

**Cons:**
- Free tiers have limits
- Need to deploy two services

**Cost:**
- Vercel: Free (up to limits)
- Render: Free (up to limits)
- Total: $0/month for MVP

### Option 2: Railway.app (All-in-One)

- Single platform for frontend + backend + database
- Free tier available
- Easy GitHub integration
- Built-in PostgreSQL

**Pros:**
- One platform for everything
- Simple setup
- Good for small teams

**Cons:**
- Free tier limits
- Less flexible than split deployment

**Cost:**
- Free tier: $5/month credits
- Paid: From $5/month

### Option 3: Vercel + Supabase (Scalable)

**Frontend on Vercel:**
- Same as above

**Backend on Vercel Serverless Functions:**
- Adapt FastAPI to serverless
- Cold starts

**Database on Supabase:**
- Free tier PostgreSQL
- Real-time features
- Good documentation

**Pros:**
- Scalable
- Good for production
- Supabase has generous free tier

**Cons:**
- More complex setup
- Need to adapt backend for serverless

**Cost:**
- Vercel: Free (up to limits)
- Supabase: Free (up to 500MB database)
- Total: $0/month for MVP

## Quick Start: Vercel + Render Deployment

### Step 1: Deploy Backend on Render

1. **Prepare Backend:**
   ```bash
   # Create render.yaml in backend/
   cat > render.yaml << 'EOF'
   services:
     - type: web
       name: fitness-analytics-backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: DATABASE_URL
           fromDatabase:
             name: fitness-analytics-db
             property: connectionString
         - key: SECRET_KEY
           generateValue: true
         - key: INSTAGRAM_CLIENT_ID
           sync: false
         - key: INSTAGRAM_CLIENT_SECRET
           sync: false
   EOF
   ```

2. **Create PostgreSQL Database on Render:**
   - Go to [render.com](https://render.com)
   - Create account (free)
   - Click "New" → "PostgreSQL"
   - Name: fitness-analytics-db
   - Click "Create Database"

3. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Build settings:
     - Root directory: `backend`
     - Build command: `pip install -r requirements.txt`
     - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment variables:
     - `DATABASE_URL`: (from database)
     - `SECRET_KEY`: generate random
     - `INSTAGRAM_CLIENT_ID`: your Instagram app ID
     - `INSTAGRAM_CLIENT_SECRET`: your Instagram app secret
     - `INSTAGRAM_REDIRECT_URI`: https://your-backend-url.onrender.com/api/v1/instagram/callback
   - Click "Deploy Web Service"

4. **Get Backend URL:**
   - Render will provide: `https://your-backend.onrender.com`
   - Save this for frontend configuration

### Step 2: Deploy Frontend on Vercel

1. **Configure Frontend:**
   ```bash
   # Create .env.local in frontend/
   cat > frontend/.env.local << 'EOF'
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   EOF
   ```

2. **Update API Client:**
   In `frontend/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Create account (free)
   - Click "Add New Project"
   - Import your GitHub repository
   - Root directory: `frontend`
   - Build settings (auto-detected for Next.js)
   - Environment variables:
     - `NEXT_PUBLIC_API_URL`: your Render backend URL
   - Click "Deploy"

4. **Get Frontend URL:**
   - Vercel will provide: `https://your-app.vercel.app`

### Step 3: Update Instagram Callback

1. **Update Meta Developer App:**
   - Go to [developers.facebook.com/apps](https://developers.facebook.com/apps/)
   - Open your app
   - Instagram Basic Display → Valid OAuth Redirect URIs
   - Add: `https://your-backend.onrender.com/api/v1/instagram/callback`
   - Save changes

2. **Update Backend Environment:**
   - In Render dashboard, edit backend service
   - Update `INSTAGRAM_REDIRECT_URI` to your production URL
   - Redeploy

### Step 4: Test Production

1. **Visit your frontend:** `https://your-app.vercel.app`
2. **Register a new account**
3. **Test predictions**
4. **Test Instagram connection** (if configured)

## Alternative: Railway.app All-in-One

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Create account (free)

2. **Create New Project:**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository

3. **Add Services:**
   - Railway will detect Docker Compose
   - It will create services for:
     - Backend (FastAPI)
     - Frontend (Next.js)
     - Database (PostgreSQL)

4. **Configure Environment Variables:**
   - Add all required variables
   - Railway will provide database URL

5. **Deploy:**
   - Click "Deploy"
   - Railway handles everything

## Environment Variables Checklist

### Backend (Required)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (generate with: `openssl rand -hex 32`)
- `INSTAGRAM_CLIENT_ID` - From Meta Developer app
- `INSTAGRAM_CLIENT_SECRET` - From Meta Developer app
- `INSTAGRAM_REDIRECT_URI` - Your backend URL + `/api/v1/instagram/callback`

### Backend (Optional)
- `REDIS_URL` - Redis connection (for caching)
- `OPENAI_API_KEY` - For advanced LLM features
- `ANTHROPIC_API_KEY` - For advanced LLM features

### Frontend (Required)
- `NEXT_PUBLIC_API_URL` - Your backend URL

## Domain Configuration

### Vercel Custom Domain
1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records
4. Vercel handles SSL automatically

### Render Custom Domain
1. In Render service settings → Domains
2. Add your custom domain
3. Update DNS records
4. Render handles SSL automatically

## Monitoring

### Vercel Analytics
- Built-in analytics dashboard
- Page views, visitors
- Performance metrics

### Render Logs
- Real-time logs
- Error tracking
- Performance metrics

### Recommended: Add Sentry
- Error tracking
- Performance monitoring
- Alerting

## Cost Summary

### Free Tier (MVP)
- Vercel: $0/month
- Render: $0/month
- Total: $0/month

### Limits (Free Tiers)
- Vercel: 100GB bandwidth/month, 6,000 minutes build/month
- Render: 750 hours/month, 90-day data retention

### Paid Tier (Production)
- Vercel: From $20/month
- Render: From $7/month
- Custom domain: ~$10/year
- Total: ~$37/month minimum

## Scaling Considerations

### When to Upgrade
- Traffic exceeds free tier limits
- Need dedicated database
- Need more processing power
- Require better uptime SLA

### Scaling Strategy
1. Add Redis for caching
2. Use CDN for static assets
3. Implement database indexing
4. Add load balancer
5. Use managed database (Supabase, Neon)

## Security Checklist

- [ ] Environment variables set (not in code)
- [ ] HTTPS enabled
- [ ] Database encrypted
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Secrets not committed to git
- [ ] API tokens rotated regularly
- [ ] Access logs monitored
- [ ] Backup strategy in place

## Troubleshooting

### Backend won't start
- Check Render logs
- Verify environment variables
- Ensure database is accessible
- Check port configuration

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings
- Ensure backend is running
- Check network/firewall rules

### Instagram OAuth fails
- Verify redirect URI matches exactly
- Check app is in correct mode (dev/prod)
- Ensure user is added as tester (dev mode)
- Check Meta app status

### Database connection errors
- Verify DATABASE_URL is correct
- Check database is running
- Ensure database is accessible from backend
- Check connection limits

## Next Steps

1. **Deploy to staging** (Render + Vercel free tiers)
2. **Test all features** in production environment
3. **Configure Instagram** with production credentials
4. **Set up monitoring** (Sentry, etc.)
5. **Configure custom domain**
6. **Submit Meta app for review** (for production Instagram)
7. **Add backup strategy**
8. **Document operational procedures**

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
