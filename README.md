# Let's Overlapp

**Easy Group Scheduling** - Find the perfect time to meet with friends effortlessly.

Let's Overlapp helps you coordinate schedules and plan events with ease. Share your available times, find when everyone can meet, and schedule together seamlessly.

## Features

- 📅 **Easy Scheduling** - Input your available times with an intuitive calendar interface
- 🤝 **Find Overlap** - Automatically discover times that work for everyone
- 📧 **Email Notifications** - Get notified when others add their availability
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 🔒 **Secure** - Built with security best practices and rate limiting
- ⚡ **Fast** - Optimized for performance with Next.js and Convex

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Database & Backend:** [Convex](https://convex.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Email:** [Resend](https://resend.com/)
- **Language:** TypeScript
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A Convex account ([Sign up here](https://dashboard.convex.dev/))
- A Resend account for email functionality ([Sign up here](https://resend.com/))

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Convex Backend
# Get this from your Convex dashboard: https://dashboard.convex.dev/
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Server Secret
# Generate a random secret for server-side authentication
# Use: openssl rand -base64 32
SERVER_SECRET=your-random-secret-here

# Resend API Key
# Get this from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# App URL (optional, for production)
# Set this to your production domain
NEXT_PUBLIC_APP_URL=https://letsoverl.app
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd lets-overlapp
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up Convex:**

   ```bash
   pnpm convex dev
   ```

   This will:
   - Create a new Convex project (if needed)
   - Generate your `NEXT_PUBLIC_CONVEX_URL`
   - Start the Convex development server

4. **Add environment variables:**
   - Copy the `.env.local` template above
   - Fill in your Convex URL from the previous step
   - Generate a SERVER_SECRET: `openssl rand -base64 32`
   - Add your Resend API key

5. **Run the development server:**

   ```bash
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `pnpm dev` - Run both frontend and Convex backend in development mode
- `pnpm dev:frontend` - Run only the Next.js frontend
- `pnpm dev:backend` - Run only the Convex backend
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Project Structure

```
lets-overlapp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── event/             # Event-related pages
│   ├── error.tsx          # Error boundary
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── convex/               # Convex backend functions
│   ├── functions.ts      # Database queries and mutations
│   └── schema.ts         # Database schema
├── lib/                  # Utility functions
│   ├── actions.ts        # Server actions
│   ├── env.ts            # Environment validation
│   ├── logger.ts         # Logging utility
│   ├── rate-limit.ts     # Rate limiting
│   └── utilities.ts      # Helper functions
└── public/              # Static assets
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. **Push your code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   In your Vercel project settings, add:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `SERVER_SECRET`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

4. **Deploy Convex to Production:**

   ```bash
   pnpm convex deploy
   ```

   This creates a production Convex deployment and gives you a production URL.

5. **Update Vercel Environment Variables:**
   Update `NEXT_PUBLIC_CONVEX_URL` to your production Convex URL

6. **Redeploy:**
   Trigger a new deployment in Vercel

### Security Checklist for Production

- ✅ Environment variables are set correctly
- ✅ SERVER_SECRET is a strong random value
- ✅ Rate limiting is enabled
- ✅ Security headers are configured
- ✅ Error logging is set up
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ CSP headers are configured

## Features & Security

### Security Features Implemented

- **Environment Validation** - All environment variables are validated at startup
- **Rate Limiting** - Protects against abuse of API endpoints
- **Input Sanitization** - User inputs are sanitized to prevent XSS attacks
- **Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **Server-side Secret** - Secure authentication for server actions
- **Error Boundaries** - Graceful error handling with React error boundaries
- **Structured Logging** - Detailed logs for debugging production issues

### Performance Optimizations

- **Image Optimization** - Next.js Image component with AVIF/WebP support
- **Code Splitting** - Automatic code splitting for faster page loads
- **Font Optimization** - Optimized Google Fonts loading
- **Caching** - Proper caching headers for static assets
- **Edge Functions** - Server actions run on Vercel Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Support

For support, email [your-email] or open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Convex](https://convex.dev/)
- UI components from [DaisyUI](https://daisyui.com/)
- Icons from [Lucide React](https://lucide.dev/)
