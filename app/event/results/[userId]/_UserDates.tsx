'use client'

import AppCard from '@/components/AppCard'
import DaysLegend from '@/components/DaysLegend'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import BestDates from './BestDates'
import AggregatedDates from './_AggregatedDates'
import AvailabilityTable from './_AvailabilityTable'

export default function UsersDates({
  preloadedUsersDates,
  userId,
}: {
  preloadedUsersDates: Preloaded<typeof api.functions.getUsersDates>
  userId: Id<'users'>
}) {
  const { eventUsers, usersDates } = usePreloadedQuery(preloadedUsersDates)

  return (
    <AppCard className='w-full' bodyClassName='p-2 sm:p-4'>
      <div className='flex flex-col gap-15 py-4'>
        {eventUsers.length > 1 && (
          <>
            <BestDates usersDates={usersDates} />
            <AggregatedDates usersDates={usersDates} />
          </>
        )}
        <AvailabilityTable
          usersDates={usersDates}
          users={eventUsers}
          currentUserId={userId}
        />
        <div className='flex justify-center'>
          <DaysLegend includeUnavailable />
        </div>
      </div>
    </AppCard>
  )
}
