'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to error reporting service
    logger.error('Application error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='card bg-base-100 w-full max-w-lg shadow-xl'>
        <div className='card-body items-center text-center'>
          <h2 className='card-title text-error text-2xl'>Something went wrong!</h2>
          <p className='text-base-content/70 mt-4'>
            We encountered an unexpected error. Our team has been notified and will
            look into it.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className='bg-base-200 mt-4 w-full overflow-auto rounded-lg p-4 text-left'>
              <p className='text-error font-mono text-sm'>{error.message}</p>
            </div>
          )}
          <div className='card-actions mt-6 justify-center gap-4'>
            <button onClick={reset} className='btn btn-primary'>
              Try again
            </button>
            <Link href='/' className='btn btn-ghost'>
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
