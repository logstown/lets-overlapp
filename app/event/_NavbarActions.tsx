'use client'

import ThemeChooser from '@/components/ThemeChooser'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarActions() {
  const pathname = usePathname()

  return (
    <div className='flex items-center gap-2'>
      {pathname !== '/event/create' && (
        <Link href='/event/create' className='btn btn-sm md:btn-md btn-primary'>
          New Event
        </Link>
      )}
      <ThemeChooser />
    </div>
  )
}
