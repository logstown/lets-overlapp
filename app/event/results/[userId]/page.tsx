import prisma from '@/lib/prisma'
import CopyLink from './_CopyLink'
import { notFound } from 'next/navigation'
import _, { filter, maxBy } from 'lodash'
import { format, formatDistance } from 'date-fns'
import AggregatedDates from './_AggregatedDates'
import { getJSDateFromStr } from '@/lib/utilities'
import DaysLegend from '@/components/DaysLegend'
import { User } from '@prisma/client'
import AvailabilityTable from './_AvailabilityTable'

export interface UsersDate {
  date: Date
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

  const { usersDates, bestDates } = calculateData(users)
  const title = event.title || 'Event Results'
  const description = event.description || ''
  const creator = event.users.find(x => x.isCreator)

  return (
    <div className='grid grid-flow-row gap-10'>
      <div className='flex w-full gap-6'>
        <div className='card bg-base-300 p-0 shadow-2xl sm:p-3'>
          <div className='card-body gap-1'>
            <h1 className='text-3xl font-semibold'>{title}</h1>
            <p className='text-base-content/70 mt-4 max-w-prose text-base text-pretty'>
              {description}
            </p>
          </div>
        </div>
        <div className='card bg-base-300 hidden grow p-0 shadow-2xl sm:p-3 md:flex'>
          <div className='card-body items-center justify-center whitespace-nowrap'>
            <div className='text-sm italic'>Created by</div>
            <div className='text-2xl font-bold'>{creator?.name}</div>
            <div className='text-sm italic'>
              {formatDistance(event.createdAt, new Date(), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='card bg-base-300 w-full p-0 shadow-2xl sm:p-3'>
        <div className='card-body'>
          <h2 className='text-2xl font-semibold'>Availability</h2>
          <div className='flex flex-col gap-20'>
            <AvailabilityTable
              usersDates={usersDates}
              users={users}
              currentUserId={userId}
            />
            {users.length > 1 && (
              <div className='flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20'>
                <AggregatedDates usersDates={usersDates} />
                <div className='md:text-xl'>
                  {bestDates.length === 0 ? (
                    <p>No Dates work</p>
                  ) : (
                    <div className='text-center'>
                      {bestDates.length === 1 ? (
                        <p>Based on the responses, the best date is</p>
                      ) : (
                        <p>Based on the responses, the best dates are</p>
                      )}
                      <div className='text-3xl font-bold md:text-5xl'>
                        {bestDates.map((x, i) => {
                          let str = format(x, 'MMMM d')
                          if (i < bestDates.length - 1) {
                            str += '  |  '
                          }
                          return str
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className='flex justify-center'>
              <DaysLegend includeUnavailable />
            </div>
          </div>
        </div>
      </div>
      <CopyLink id={event.id} />
      <CopyLink id={userId} isResults />
    </div>
  )
}

function calculateData(users: User[]) {
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
        date: getJSDateFromStr(date),
        availableDateUsers,
        preferredDateUsers,
        score,
      }
    })
    .sortBy(date => date.date)
    .value()

  const best = maxBy(usersDates, 'score')
  const bestDates =
    best?.score === 0
      ? []
      : filter(usersDates, { score: best?.score }).map(x => x.date)

  return { usersDates, bestDates }
}
