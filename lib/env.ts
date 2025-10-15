import { z } from 'zod'

const envSchema = z.object({
  // Server-side environment variables
  SERVER_SECRET: z.string().min(1, 'SERVER_SECRET is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

  // Client-side environment variables
  NEXT_PUBLIC_CONVEX_URL: z
    .string()
    .url('NEXT_PUBLIC_CONVEX_URL must be a valid URL'),
})

// Parse and validate environment variables
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    SERVER_SECRET: process.env.SERVER_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  })

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

// Export validated environment variables
export const env = parseEnv()
