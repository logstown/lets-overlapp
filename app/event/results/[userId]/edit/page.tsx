import AddEditDatesHeader from '@/components/AddEditDatesHeader'
import EventStepper from '@/components/EventStepper'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Id } from '@/convex/_generated/dataModel'

export default async function EditEventResults(props: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await props.params

  const user = await fetchQuery(api.functions.getUser, {
    userId: userId as Id<'users'>,
    serverSecret: process.env.SERVER_SECRET ?? '',
  })

  const event = await fetchQuery(api.functions.getEvent, {
    eventId: user.eventId,
  })

  const creator = await fetchQuery(api.functions.getCreator, {
    eventId: user.eventId,
    serverSecret: process.env.SERVER_SECRET ?? '',
  })

  const setDates = [creator.availableDates, creator.preferredDates].flat()

  // if (!user) {
  //   return notFound()
  // }

  return (
    <EventStepper
      setDates={setDates}
      event={event}
      creatorName={creator.name}
      user={user}
    />
  )
}
