# Vercel Deployment Fix

## Problem

You encountered this error when deploying to Vercel:

```
✖ Detected a non-production build environment and "CONVEX_DEPLOY_KEY" for a production Convex deployment.
```

## Root Cause

Vercel was trying to run `npx convex deploy` for **both** production and preview (non-production) builds, but using a production `CONVEX_DEPLOY_KEY`. Convex blocks this as a safety measure to prevent accidental production deployments from non-production environments.

## The Solution

I've implemented a fix using `vercel.json` that automatically handles this:

### What Was Added

**File:** `vercel.json`

- Conditionally runs Convex deployment only for production builds
- Preview builds skip Convex deployment and use an existing dev deployment URL

**The conditional build command:**

```bash
if [ "$VERCEL_ENV" = "production" ]; then
  npx convex deploy --cmd 'pnpm run build'
else
  pnpm run build
fi
```

## What You Need to Do

### 1. Commit and Push Changes

```bash
git add vercel.json DEPLOYMENT_GUIDE.md VERCEL_DEPLOYMENT_FIX.md
git commit -m "Fix: Add vercel.json to handle Convex deployment by environment"
git push origin prod-ready
```

### 2. Configure Vercel Environment Variables

In your Vercel project dashboard, ensure environment variables are set correctly:

#### **Production Environment Variables:**

- ✅ `CONVEX_DEPLOY_KEY`: Your production deploy key
- ✅ `SERVER_SECRET`: Your production secret
- ✅ `RESEND_API_KEY`: Your API key
- ✅ `NEXT_PUBLIC_APP_URL`: Your production URL

#### **Preview Environment Variables:**

- ✅ `NEXT_PUBLIC_CONVEX_URL`: Your **dev** Convex URL (e.g., `https://your-dev-123.convex.cloud`)
- ✅ `SERVER_SECRET`: Your dev/test secret
- ✅ `RESEND_API_KEY`: Your API key
- ❌ **DO NOT SET** `CONVEX_DEPLOY_KEY` for Preview

### 3. Deploy to Vercel

After pushing the changes:

1. Go to your Vercel project
2. The deployment should automatically trigger
3. The build will now succeed ✅

### 4. Verify It Works

**For Production Deployments:**

- Should see: `npx convex deploy --cmd 'pnpm run build'` in build logs
- Convex functions will deploy to production

**For Preview Deployments (PRs, branches):**

- Should see: `pnpm run build` in build logs
- Will connect to your existing dev Convex deployment via `NEXT_PUBLIC_CONVEX_URL`

## How to Get CONVEX_DEPLOY_KEY

If you haven't set this up yet:

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Navigate to **Settings** → **Deploy Keys**
4. Copy the **production** deploy key
5. Add it to Vercel's **Production** environment variables only

## Alternative Approach (Manual)

If you prefer not to use `vercel.json`, you can manually configure the build command in Vercel:

1. Go to Project Settings → General
2. Scroll to "Build & Development Settings"
3. Override Build Command with:
   ```bash
   if [ "$VERCEL_ENV" = "production" ]; then npx convex deploy --cmd 'pnpm run build'; else pnpm run build; fi
   ```

## Summary

✅ **What's Fixed:**

- Production builds → Deploy Convex automatically
- Preview builds → Use existing dev Convex, no deployment
- No more environment mismatch errors

✅ **What You Need:**

- `CONVEX_DEPLOY_KEY` only in Production environment
- `NEXT_PUBLIC_CONVEX_URL` in Preview environment pointing to dev

✅ **Next Steps:**

1. Commit and push the `vercel.json` file
2. Configure environment variables in Vercel
3. Deploy should now work without errors

---

**Need Help?**

- Check the updated `DEPLOYMENT_GUIDE.md` for full deployment instructions
- See the troubleshooting section for common issues
