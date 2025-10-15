import { headers } from 'next/headers'

interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

// Simple in-memory rate limiter (for production, use Redis/Upstash)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Cleanup every minute

export async function rateLimit(
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 },
) {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const identifier = ip.split(',')[0].trim()

  const now = Date.now()
  const rateLimitData = rateLimitStore.get(identifier)

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // First request or window has reset
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return { success: true, remaining: config.maxRequests - 1 }
  }

  if (rateLimitData.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
    }
  }

  // Increment count
  rateLimitData.count++
  rateLimitStore.set(identifier, rateLimitData)

  return {
    success: true,
    remaining: config.maxRequests - rateLimitData.count,
  }
}
