import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddEditDatesHeader from '@/components/AddEditDatesHeader'
import EventStepper from '@/components/EventStepper'

export default async function AddDates(props: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await props.params

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      users: {
        where: {
          isCreator: true,
        },
      },
    },
  })

  if (!event) {
    return notFound()
  }

  //   if (!event.allowOthersToPropose) {
  //     return notFound();
  //   }

  const { availableDates, preferredDates } = event.users[0]

  const setDates = [...availableDates, ...preferredDates]

  return (
    <div className='flex flex-col gap-6'>
      <AddEditDatesHeader
        title={event.title}
        createdBy={event.users[0].name}
        createdAt={event.createdAt}
        icon={event.icon}
      />
      <EventStepper setDates={setDates} eventId={eventId} />
    </div>
  )
}
