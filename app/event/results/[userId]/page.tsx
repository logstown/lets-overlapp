import CopyLink from './_CopyLink'
import _ from 'lodash'
import { formatDistance } from 'date-fns'
import AppCard from '@/components/AppCard'
import { fetchQuery, preloadQuery, preloadedQueryResult } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import UsersDates from './_UserDates'

export interface UsersDate {
  date: string
  availableDateUsers: string[]
  preferredDateUsers: string[]
  score: number
}

export default async function EventResults(props: {
  params: Promise<{ userId: string }>
}) {
  const params = await props.params

  const userId = params.userId as Id<'users'>

  const preloadedUsersDates = await preloadQuery(api.functions.getUsersDates, {
    userId,
  })

  const { eventUsers } = preloadedQueryResult(preloadedUsersDates)
  const event = await fetchQuery(api.functions.getEvent, {
    eventId: eventUsers[0].eventId,
  })

  //   if (!user || (!user.isCreator && !user.event.allowOthersToViewResults)) {

  const title = event.title || 'Event Results'
  const description = event.description || ''
  const creator = eventUsers[0]

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex w-full gap-6'>
        <AppCard className='grow'>
          <div className='flex items-center gap-6'>
            <img
              src={`/event-icons/${event.icon}.png`}
              alt={title}
              className='h-24 w-24 rounded-2xl'
            />
            <div className='flex flex-col gap-1'>
              <h1 className='text-3xl font-semibold'>{title}</h1>
              {description && (
                <p className='text-base-content/70 w-full max-w-[65ch] text-base text-pretty'>
                  {description}
                </p>
              )}
            </div>
          </div>
        </AppCard>
        <AppCard
          className='hidden md:flex'
          bodyClassName='items-center justify-center'
        >
          <div className='text-base-content/70 text-xs text-balance whitespace-nowrap'>
            Created{' '}
            <span className='font-bold'>
              {formatDistance(event._creationTime, new Date(), {
                addSuffix: true,
              })}
            </span>{' '}
            by
          </div>
          <div className='text-center text-3xl font-bold whitespace-nowrap'>
            {creator?.name}
          </div>
        </AppCard>
      </div>
      <UsersDates preloadedUsersDates={preloadedUsersDates} userId={userId} />
      {userId === creator._id && <CopyLink id={event._id} />}
      <CopyLink id={userId} isResults />
    </div>
  )
}
