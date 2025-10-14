import AddEditDatesHeader from '@/components/AddEditDatesHeader'
import EventStepper from '@/components/EventStepper'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Id } from '@/convex/_generated/dataModel'

export default async function AddDates(props: {
  params: Promise<{ eventId: string }>
}) {
  const params = await props.params
  const eventId = params.eventId as Id<'events'>

  const event = await fetchQuery(api.functions.getEvent, {
    eventId,
  })

  const creator = await fetchQuery(api.functions.getCreator, {
    eventId,
    serverSecret: process.env.SERVER_SECRET ?? '',
  })

  //   if (!event.allowOthersToPropose) {
  //     return notFound();
  //   }

  return (
    <div className='flex flex-col gap-6'>
      <AddEditDatesHeader
        title={event.title}
        createdBy={creator.name}
        createdAt={new Date(event._creationTime)}
        icon={event.icon}
      />
      <EventStepper
        setDates={creator.availableDates.map(x => x.date)}
        eventId={eventId}
      />
    </div>
  )
}
