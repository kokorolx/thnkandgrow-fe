# Deployment Guide

## Summary

All changes have been committed successfully:
- ✅ ISR configuration (on-demand page generation)
- ✅ SEO improvements (robots.txt, sitemap.xml, structured data)
- ✅ Text-to-Speech reader with progress bar
- ✅ Next.js 16 API compatibility fixes
- ✅ Cache warming script

## Deployment Options

### Option 1: GitHub + Vercel (Recommended)

1. **Create GitHub Repository** (if not exists)
   - Go to https://github.com/new
   - Create a new repository

2. **Push Code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Follow prompts** to link project

## Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
WORDPRESS_API_URL=https://blog.thnkandgrow.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your_token_here
REVALIDATION_SECRET=your_secret_here
```

## Post-Deployment

### Warm the Cache (Optional)

Once deployed, you can warm the cache:

```bash
# Wait for backend to be available, then:
npm run warm-cache https://your-vercel-url.vercel.app
```

This will pre-generate all pages sequentially.

### Verify Deployment

1. Check homepage loads
2. Test a few post pages
3. Verify SEO (check `/robots.txt` and `/sitemap.xml`)
4. Test Text-to-Speech reader

## ISR Behavior

- **Build Time**: Only homepage and static pages are generated
- **First Visit**: Pages generate on-demand (2-3 seconds)
- **Subsequent Visits**: Instant (served from cache)
- **Revalidation**: Every 1 hour (configurable via `revalidate` export)

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify GraphQL endpoint is accessible
- Review build logs in Vercel dashboard

### Pages Not Loading
- Check if backend GraphQL API is available
- Verify authentication token is correct
- Check Vercel function logs

### Slow First Loads
- This is expected for on-demand ISR
- Run cache warming script after deployment
- Consider increasing `generateStaticParams` limit if needed
