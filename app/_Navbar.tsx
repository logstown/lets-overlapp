'use client'

import Link from 'next/link'
import ThemeController from './_ThemeController'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div className='navbar px-4 md:px-8'>
      <div className='flex-1'>
        {pathname !== '/' && (
          <Link href='/' className='block w-fit'>
            <img
              src='/logo.png'
              alt='Lets Overlapp'
              className='h-10 sm:h-14 dark:hidden'
            />
            <img
              src='/logo-dark.png'
              alt='Lets Overlapp'
              className='hidden h-10 sm:h-14 dark:block'
            />
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
