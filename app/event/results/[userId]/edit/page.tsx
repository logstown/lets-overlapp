import AddEditDatesHeader from '@/components/AddEditDatesHeader'
import EventStepper from '@/components/EventStepper'
import prisma from '@/lib/prisma'
import { getJSDateFromStr } from '@/lib/utilities'
import { notFound } from 'next/navigation'

export default async function EditEventResults(props: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await props.params

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      event: {
        include: {
          users: {
            where: {
              isCreator: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return notFound()
  }

  const { availableDates, preferredDates } = user.event.users[0]

  const jsDates = [...availableDates, ...preferredDates].map(getJSDateFromStr)

  return (
    <div className='flex flex-col gap-6'>
      <AddEditDatesHeader
        title={user.event.title}
        createdBy={user.event.users[0].name}
        createdAt={user.event.createdAt}
      />
      {/* <ChooseUserDates user={user} setDates={jsDates} /> */}
      <EventStepper setDates={jsDates} user={user} />
    </div>
  )
}
