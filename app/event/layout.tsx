import NavbarActions from '@/app/event/_NavbarActions'
import Link from 'next/link'

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='navbar'>
        <div className='flex-1'>
          <Link
            href='/'
            className='p-2 text-2xl font-semibold tracking-tight drop-shadow-2xl lg:text-3xl'
          >
            Let's Overlapp
          </Link>
        </div>
        <NavbarActions />
      </div>
      <div className='mx-auto mt-8 max-w-5xl p-4'>{children}</div>
    </>
  )
}
