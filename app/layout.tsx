import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './_Navbar'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: "Let's Overlapp - Easy Group Scheduling",
    template: "%s | Let's Overlapp",
  },
  description:
    "Find the perfect time to meet with friends effortlessly. Let's Overlapp helps you coordinate schedules and plan events with ease.",
  keywords: [
    'scheduling',
    'calendar',
    'meeting planner',
    'group scheduling',
    'event planning',
    'coordinate schedules',
  ],
  authors: [{ name: "Let's Overlapp" }],
  creator: "Let's Overlapp",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://letsoverl.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: "Let's Overlapp - Easy Group Scheduling",
    description: 'Find the perfect time to meet with friends effortlessly.',
    siteName: "Let's Overlapp",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Let's Overlapp - Easy Group Scheduling",
    description: 'Find the perfect time to meet with friends effortlessly.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <ConvexClientProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-base-200 min-h-screen antialiased`}
        >
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </ConvexClientProvider>
    </html>
  )
}
