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

  const setDates = [creator.availableDates, creator.preferredDates].flat()

  //   if (!event.allowOthersToPropose) {
  //     return notFound();
  //   }

  return (
    <EventStepper setDates={setDates} event={event} creatorName={creator.name} />
  )
}
