import prisma from '@/lib/prisma'
import CopyLink from './_CopyLink'
import { notFound } from 'next/navigation'
import _ from 'lodash'
import { formatDistance } from 'date-fns'
import AggregatedDates from './_AggregatedDates'
import DaysLegend from '@/components/DaysLegend'
import { User } from '@prisma/client'
import AvailabilityTable from './_AvailabilityTable'
import BestDates from './BestDates'
import AppCard from '@/components/AppCard'

export interface UsersDate {
  date: string
  availableDateUsers: string[]
  preferredDateUsers: string[]
  score: number
}

export default async function EventResults(props: {
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
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      },
    },
  })

  //   if (!user || (!user.isCreator && !user.event.allowOthersToViewResults)) {
  if (!user) {
    return notFound()
  }
  const { event } = user
  const { users } = event

  const usersDates = getUsersDates(users)
  const title = event.title || 'Event Results'
  const description = event.description || ''
  const creator = event.users.find(x => x.isCreator)

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
          <div className='text-sm italic'>Created by</div>
          <div className='text-center text-3xl font-bold whitespace-nowrap'>
            {creator?.name}
          </div>
          <div className='text-xs italic'>
            {formatDistance(event.createdAt, new Date(), {
              addSuffix: true,
            })}
          </div>
        </AppCard>
      </div>
      <AppCard className='w-full' bodyClassName='p-2 sm:p-4'>
        <div className='flex flex-col gap-15 py-4'>
          {users.length > 1 && (
            <>
              <BestDates usersDates={usersDates} />
              <AggregatedDates usersDates={usersDates} />
            </>
          )}
          <AvailabilityTable
            usersDates={usersDates}
            users={users}
            currentUserId={userId}
          />
          <div className='flex justify-center'>
            <DaysLegend includeUnavailable />
          </div>
        </div>
      </AppCard>
      {user.isCreator && <CopyLink id={event.id} />}
      <CopyLink id={userId} isResults />
    </div>
  )
}

function getUsersDates(users: User[]): UsersDate[] {
  const usersDates = _.chain(users)
    .flatMap(user => [...user.availableDates, ...user.preferredDates])
    .uniq()
    .map(date => {
      const availableDateUsers = users
        .filter(user => user.availableDates.includes(date))
        .map(x => x.id)
      const preferredDateUsers = users
        .filter(user => user.preferredDates.includes(date))
        .map(x => x.id)
      return {
        date,
        availableDateUsers,
        preferredDateUsers,
      }
    })
    .map(({ date, availableDateUsers, preferredDateUsers }) => {
      let score = 0

      if (preferredDateUsers.length + availableDateUsers.length === users.length) {
        score =
          Math.round(((preferredDateUsers.length / users.length) * 50) / 5) * 5 + 50
      }

      return {
        date,
        availableDateUsers,
        preferredDateUsers,
        score,
      }
    })
    .value()

  return usersDates
}
