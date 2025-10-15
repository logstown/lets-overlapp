# Environment Variables Setup

This document explains all environment variables needed for Let's Overlapp.

## Required Environment Variables

Create a `.env.local` file in the root of your project with these variables:

### 1. NEXT_PUBLIC_CONVEX_URL

**Description:** The URL to your Convex deployment  
**Where to get it:** https://dashboard.convex.dev/  
**Format:** `https://your-deployment.convex.cloud`

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Setup:**

1. Run `pnpm convex dev` for development
2. Run `pnpm convex deploy` for production
3. Copy the URL provided

### 2. SERVER_SECRET

**Description:** A secret key for server-side authentication between Next.js and Convex  
**Where to get it:** Generate it yourself  
**Format:** Random base64 string

```bash
SERVER_SECRET=your-random-secret-here
```

**Setup:**

```bash
# Generate a secure random secret:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important:**

- Use different secrets for development and production
- Never commit this to version control
- Store securely in Vercel/hosting platform

### 3. RESEND_API_KEY

**Description:** API key for sending emails via Resend  
**Where to get it:** https://resend.com/api-keys  
**Format:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup:**

1. Sign up at https://resend.com
2. Verify your domain (or use their test domain in development)
3. Create an API key
4. Copy the key (you'll only see it once!)

### 4. NEXT_PUBLIC_APP_URL (Optional)

**Description:** Your application's public URL  
**Where to get it:** Your domain or Vercel deployment URL  
**Format:** `https://your-domain.com`

```bash
NEXT_PUBLIC_APP_URL=https://letsoverl.app
```

**Setup:**

- Development: Can be omitted or set to `http://localhost:3000`
- Production: Set to your actual domain

**Used for:**

- OpenGraph metadata
- Email links
- Sitemap generation

## Example .env.local File

```bash
# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://funny-hamster-123.convex.cloud

# Server Secret (generate with: openssl rand -base64 32)
SERVER_SECRET=abcd1234efgh5678ijkl90mnopqrstuvwxyz1234567890ab

# Resend API Key
RESEND_API_KEY=re_abc123def456ghi789jkl012mno345

# App URL (optional in development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Vercel Deployment

When deploying to Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development as needed
4. Make sure `NEXT_PUBLIC_APP_URL` points to your Vercel domain

## Security Notes

- ✅ **DO** use strong, random values for `SERVER_SECRET`
- ✅ **DO** use different secrets for dev and production
- ✅ **DO** store secrets in your hosting platform's environment variable system
- ❌ **DON'T** commit `.env.local` to git (it's in `.gitignore`)
- ❌ **DON'T** share your secrets publicly
- ❌ **DON'T** use the same `SERVER_SECRET` across multiple projects

## Validation

The app will validate all required environment variables on startup using Zod. If any are missing or invalid, you'll see a clear error message in the console.

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not set"

- Make sure you've run `pnpm convex dev` or `pnpm convex deploy`
- Check that the variable is in `.env.local`
- Restart your dev server

### "Invalid server secret"

- Ensure `SERVER_SECRET` matches between Next.js and Convex environments
- In Convex dashboard, go to Settings > Environment Variables
- Add `SERVER_SECRET` with the same value

### "Failed to send email"

- Verify your `RESEND_API_KEY` is correct
- Check that your domain is verified in Resend
- In development, you can use Resend's test domain
