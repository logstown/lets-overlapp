import { Metadata } from 'next'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Id } from '@/convex/_generated/dataModel'

type Props = {
  params: Promise<{ eventId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params

  try {
    const event = await fetchQuery(api.functions.getEvent, {
      eventId: eventId as Id<'events'>,
    })

    const creator = await fetchQuery(api.functions.getCreator, {
      eventId: eventId as Id<'events'>,
      serverSecret: process.env.SERVER_SECRET ?? '',
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://letsoverl.app'
    const eventUrl = `${baseUrl}/event/add-dates/${eventId}`

    const title = `Add Your Availability - ${event.title}`
    const description = event.description
      ? `${event.description} Join ${creator.name} and others to find the perfect time to meet.`
      : `Join ${creator.name} and others to find the perfect time to meet for "${event.title}".`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: eventUrl,
        type: 'website',
        siteName: "Let's Overlapp",
        images: [
          {
            url: `${baseUrl}/api/og?title=${encodeURIComponent(event.title)}&creator=${encodeURIComponent(creator.name)}&icon=${encodeURIComponent(event.icon)}`,
            width: 1200,
            height: 630,
            alt: `${event.title} - Add Your Availability`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [
          `${baseUrl}/api/og?title=${encodeURIComponent(event.title)}&creator=${encodeURIComponent(creator.name)}&icon=${encodeURIComponent(event.icon)}`,
        ],
      },
      alternates: {
        canonical: eventUrl,
      },
    }
  } catch {
    // Fallback metadata if event data can't be fetched
    return {
      title: 'Add Your Availability - Event Scheduling',
      description:
        'Join others to find the perfect time to meet. Add your availability and coordinate schedules effortlessly.',
      openGraph: {
        title: 'Add Your Availability - Event Scheduling',
        description:
          'Join others to find the perfect time to meet. Add your availability and coordinate schedules effortlessly.',
        type: 'website',
        siteName: "Let's Overlapp",
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Add Your Availability - Event Scheduling',
        description:
          'Join others to find the perfect time to meet. Add your availability and coordinate schedules effortlessly.',
      },
    }
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto mt-4 max-w-3xl pb-16'>{children}</div>
}
