# Deployment Guide

Step-by-step guide to deploy Let's Overlapp to production on Vercel.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account ([Sign up](https://vercel.com))
- [ ] Convex account ([Sign up](https://dashboard.convex.dev))
- [ ] Resend account ([Sign up](https://resend.com))
- [ ] Domain verified in Resend (or use test domain)

## Step 1: Prepare Your Code

1. **Commit all changes:**

   ```bash
   git add .
   git commit -m "Production-ready: Add security and performance enhancements"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

## Step 2: Set Up Production Convex

1. **Deploy Convex to production:**

   ```bash
   cd /Users/loganjoecks/Sites/lets-overlapp
   pnpm convex deploy
   ```

2. **Copy the production URL:**
   - The command will output a URL like: `https://your-app-123.convex.cloud`
   - Save this for later

3. **Set Convex environment variables:**
   - Go to [Convex Dashboard](https://dashboard.convex.dev)
   - Select your project
   - Go to Settings → Environment Variables
   - Add `SERVER_SECRET`:
     ```bash
     # Generate a production secret:
     openssl rand -base64 32
     ```
   - Copy the output and add it as `SERVER_SECRET` in Convex

## Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"

2. **Import your repository:**
   - Select your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure project:**
   - Project Name: `lets-overlapp` (or your preferred name)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: Leave default (handled by `vercel.json`)
   - Output Directory: `.next` (default)

   **Note:** The included `vercel.json` file automatically handles Convex deployment:
   - Production builds: Runs `npx convex deploy --cmd 'pnpm run build'`
   - Preview builds: Runs `pnpm run build` only

4. **Add Environment Variables:**
   Click "Environment Variables" and add the following.

   **For Production Environment:**

   ```bash
   # Convex Deploy Key (Production ONLY)
   CONVEX_DEPLOY_KEY=prod:your-deploy-key-123|your-secret-456

   # Server Secret (same as Convex)
   SERVER_SECRET=<your-production-secret>

   # Resend API Key
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

   # App URL (you'll update this after first deploy)
   NEXT_PUBLIC_APP_URL=https://lets-overlapp.vercel.app
   ```

   **For Preview Environment:**

   ```bash
   # Convex URL (point to dev deployment)
   NEXT_PUBLIC_CONVEX_URL=https://your-dev-123.convex.cloud

   # Server Secret (can be same as production or different)
   SERVER_SECRET=<your-secret>

   # Resend API Key (can be same as production)
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

   # App URL (Vercel will auto-set this)
   NEXT_PUBLIC_APP_URL=https://lets-overlapp-git-branch.vercel.app
   ```

   **How to get CONVEX_DEPLOY_KEY:**
   1. Go to [Convex Dashboard](https://dashboard.convex.dev)
   2. Select your project
   3. Go to Settings → Deploy Keys
   4. Copy the production deploy key

   **Important:**
   - Only set `CONVEX_DEPLOY_KEY` for Production environment
   - Make sure `SERVER_SECRET` matches between Vercel and Convex
   - Use your production Resend API key

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)

## Step 4: Update App URL

After first deployment:

1. **Copy your Vercel URL:**
   - You'll get a URL like: `https://lets-overlapp.vercel.app`
   - Or use your custom domain if configured

2. **Update environment variable:**
   - Go to Vercel project settings
   - Settings → Environment Variables
   - Find `NEXT_PUBLIC_APP_URL`
   - Update the value to your actual Vercel URL
   - Click "Save"

3. **Redeploy:**
   - Go to Deployments tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache" and click "Redeploy"

## Step 5: Configure Custom Domain (Optional)

1. **Add domain in Vercel:**
   - Go to Settings → Domains
   - Add your domain (e.g., `letsoverl.app`)

2. **Update DNS:**
   - Follow Vercel's instructions to point your domain to Vercel
   - Usually adding A/CNAME records

3. **Update environment variable:**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy

4. **Update Resend domain:**
   - Make sure your domain is verified in Resend
   - Update email "from" addresses if needed

## Step 6: Verify Deployment

### Test Core Functionality

1. **Create an event:**
   - Go to your production URL
   - Click "Create Event"
   - Fill in details and select dates
   - Submit and verify redirect

2. **Test email sending:**
   - Create an event with your email
   - Check if you receive the confirmation email
   - Check Resend dashboard for email logs

3. **Add dates to event:**
   - Share the event link with someone (or use incognito mode)
   - Add dates as a second person
   - Verify original creator receives notification email

4. **Test error handling:**
   - Try submitting forms with invalid data
   - Verify error messages display correctly
   - No crashes or white screens

### Verify Security

1. **Check security headers:**
   - Visit [securityheaders.com](https://securityheaders.com)
   - Enter your production URL
   - Aim for A+ rating

2. **Test rate limiting:**
   - Try submitting forms rapidly
   - Should see "Too many requests" message after limit

3. **Check HTTPS:**
   - Verify URL uses HTTPS
   - Check for valid SSL certificate (automatic with Vercel)

### Performance Check

1. **Run Lighthouse:**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit for:
     - Performance (aim for 90+)
     - Accessibility (aim for 90+)
     - Best Practices (aim for 95+)
     - SEO (aim for 90+)

2. **Check Core Web Vitals:**
   - Go to Vercel Analytics dashboard
   - Verify Speed Insights data is coming through
   - Monitor over next 24-48 hours

3. **Test on mobile:**
   - Test on actual mobile device
   - Verify responsive design
   - Check performance

## Step 7: Post-Deployment

### Monitoring

1. **Set up Vercel monitoring:**
   - Analytics is automatically enabled
   - Check the Analytics tab in Vercel dashboard

2. **Monitor Convex:**
   - Check Convex dashboard for errors
   - Review function performance

3. **Monitor emails:**
   - Check Resend dashboard for delivery rates
   - Watch for bounces or issues

### Optional Enhancements

1. **Set up uptime monitoring:**
   - [UptimeRobot](https://uptimerobot.com) (free)
   - [Pingdom](https://www.pingdom.com)
   - Check every 5 minutes

2. **Error tracking:**
   - Consider [Sentry](https://sentry.io) integration
   - Free tier available

3. **Analytics:**
   - Consider Google Analytics or Plausible
   - Already have Vercel Analytics built-in

## Troubleshooting

### Build Fails

**Error:** "Detected a non-production build environment and CONVEX_DEPLOY_KEY for a production Convex deployment"

This happens when Vercel tries to deploy Convex for preview builds using a production deploy key.

**Solution:**

- Use the included `vercel.json` file (already configured)
- This ensures `convex deploy` only runs for production builds
- Preview builds will use the `NEXT_PUBLIC_CONVEX_URL` you set

**Or manually configure in Vercel:**

- Settings → General → Build & Development Settings
- Set Build Command to: `if [ "$VERCEL_ENV" = "production" ]; then npx convex deploy --cmd 'pnpm run build'; else pnpm run build; fi`

**Error:** "Environment variable validation failed"

- Check all environment variables are set in Vercel
- Ensure `NEXT_PUBLIC_CONVEX_URL` is a valid URL
- Verify `SERVER_SECRET` is set

**Error:** Build succeeds but app crashes

- Check runtime logs in Vercel
- Verify Convex production deployment is running
- Check Convex environment variables

### Emails Not Sending

**Problem:** Emails not being delivered

- Check Resend dashboard for errors
- Verify `RESEND_API_KEY` is correct
- Confirm domain is verified in Resend
- Check sender email domain matches verified domain

**Problem:** Error in logs about Resend

- Verify API key has not expired
- Check Resend account is active
- Review API rate limits

### Database Issues

**Problem:** "Event not found" or "User not found"

- Check Convex production deployment is running
- Verify `NEXT_PUBLIC_CONVEX_URL` points to production
- Check Convex dashboard logs

**Problem:** "Invalid server secret"

- Ensure `SERVER_SECRET` matches in both:
  - Vercel environment variables
  - Convex environment variables
- They must be exactly the same

### Performance Issues

**Problem:** Slow page loads

- Check Vercel function logs for slow operations
- Review Convex function performance in dashboard
- Consider adding database indexes
- Check external API response times (Resend)

**Problem:** High error rates

- Check error logs in Vercel
- Review error boundary in production
- Check for client-side errors in browser console

## Rollback Plan

If you need to rollback:

1. **In Vercel:**
   - Go to Deployments tab
   - Find previous successful deployment
   - Click three dots (⋯)
   - Click "Promote to Production"

2. **In Convex:**
   - Convex deployments are versioned
   - Contact Convex support for rollback assistance

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Convex Docs:** https://docs.convex.dev
- **Next.js Docs:** https://nextjs.org/docs
- **Resend Docs:** https://resend.com/docs

## Success Checklist

- ✅ App deployed and accessible
- ✅ All environment variables set
- ✅ HTTPS enabled
- ✅ Custom domain configured (if applicable)
- ✅ Emails sending successfully
- ✅ Security headers verified (A+ rating)
- ✅ Performance metrics good (>90)
- ✅ Error monitoring in place
- ✅ Mobile tested
- ✅ All user flows tested

## 🎉 You're Live!

Congratulations! Your app is now in production. Monitor the first 24-48 hours closely and address any issues that arise.

Remember to:

- Check analytics regularly
- Monitor error logs
- Keep dependencies updated
- Review security headers periodically
- Backup your Convex data regularly

---

**Questions or issues?** Check the PRODUCTION_READY_SUMMARY.md file for additional troubleshooting tips.
