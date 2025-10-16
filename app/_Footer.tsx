import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='footer sm:footer-horizontal footer-center bg-base-100 text-base-content/60 p-4'>
      <aside className='flex w-full flex-col justify-around sm:flex-row'>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Let&apos;s
          Overlapp
        </p>
        {/* <p>
        Powered by{' '}
        <Link
          className='link link-primary'
          href='https://convex.dev'
          target='_blank'
          rel='noopener noreferrer'
        >
          Convex
        </Link>
      </p> */}
        <p className='flex items-baseline gap-2'>
          <span className='text-2xl'>👨‍💻</span>
          <Link
            className='link link-primary'
            href='https://loganjoecks.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            loganjoecks.com
          </Link>
        </p>
      </aside>
    </footer>
  )
}
