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

  // if (!user) {
  //   return notFound()
  // }

  return (
    <div className='flex flex-col gap-2'>
      <AddEditDatesHeader
        title={event.title}
        createdBy={creator.name}
        createdAt={new Date(event._creationTime)}
        icon={event.icon}
      />
      <EventStepper setDates={creator.availableDates.map(x => x.date)} user={user} />
    </div>
  )
}
