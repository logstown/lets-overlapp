'use client'

import Link from 'next/link'
import ThemeController from './_ThemeController'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div className='navbar px-4'>
      <div className='flex-1'>
        {pathname !== '/' && (
          <Link
            href='/'
            className='p-2 text-2xl font-semibold tracking-tight drop-shadow-2xl lg:text-3xl'
          >
            Let&apos;s Overlapp
          </Link>
        )}
      </div>
      <div className='flex gap-6'>
        <ThemeController />
        {pathname !== '/event/create' && pathname !== '/' && (
          <Link href='/event/create' className='btn btn-sm md:btn-md btn-primary'>
            New Event
          </Link>
        )}
      </div>
    </div>
  )
}
