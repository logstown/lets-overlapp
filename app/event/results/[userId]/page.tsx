import prisma from '@/lib/prisma'
import CopyLink from './_CopyLink'
import { notFound } from 'next/navigation'
import _, { filter, find, map, mapKeys, mapValues, maxBy } from 'lodash'
import { format } from 'date-fns'
import AggregatedDates from './_AggregatedDates'
import { getJSDateFromStr } from '@/lib/utilities'
import DaysLegend from '@/components/DaysLegend'
import { CircleUserIcon } from 'lucide-react'
import { User } from '@prisma/client'
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

  const { dates, dateGroups, modifierClassNames, bestDates } = calculateData(users)
  const title = event.title || 'Event Results'
  const description = event.description || 'View availability for all participants'

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <p className='text-base-content/70 max-w-prose'>{description}</p>
      </div>
      <div className='overflow-x-auto'>
        <table className='table-pin-rows table-xs sm:table-sm md:table-md table-pin-cols table text-sm sm:text-base'>
          <thead>
            <tr>
              <th></th>
              {dates.map(({ date }) => (
                <td className='text-center' key={date.toISOString()}>
                  {format(date, 'MMM d')}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, name, isCreator }) => (
              <tr key={id}>
                <th className='border-base-100 w-1 border-2'>
                  <div className='flex items-center gap-2 whitespace-nowrap'>
                    {name}
                    {isCreator && <CircleUserIcon size={15} />}
                  </div>
                </th>
                {dates.map(({ date, availableDateUsers, preferredDateUsers }) => (
                  <td
                    key={date.toISOString()}
                    className={`border-base-100 border-2 ${
                      preferredDateUsers.includes(id)
                        ? 'bg-success'
                        : availableDateUsers.includes(id)
                          ? 'bg-success/50'
                          : 'bg-base-300'
                    }`}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length > 1 && (
        <div className='flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20'>
          <AggregatedDates
            dateGroups={dateGroups}
            modifierClassNames={modifierClassNames}
          />
          <div>
            {bestDates.length === 0 ? (
              <p>No Dates work</p>
            ) : (
              <div className='text-center'>
                {bestDates.length === 1 ? (
                  <p>Based on the responses, the best date is</p>
                ) : (
                  <p>Based on the responses, the best dates are</p>
                )}
                <div className='text-3xl font-bold'>
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
      <CopyLink id={event.id} />
      <CopyLink id={userId} isResults />
    </div>
  )
}

function calculateData(users: User[]) {
  const dates = _.chain(users)
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

  const dateGroups = _.chain(dates)
    .groupBy(({ score }) => {
      if (score === 1) {
        return 'preferred'
      } else if (score === 0) {
        return 'unavailable'
      } else {
        return `available-${score}`
      }
    })
    .mapValues(dates => map(dates, 'date'))
    .value()

  const modifierClassNames = mapValues(dateGroups, (dates, dateType) => {
    const baseClasses = 'border-2 border-base-100'

    if (dateType === 'unavailable') {
      return `${baseClasses} bg-base-300 text-base-content`
    }

    let classToReturn = `${baseClasses} bg-success text-success-content`

    if (!dateType.startsWith('available-')) {
      return classToReturn
    }

    const opacity = dateType.split('-')[1]

    switch (opacity) {
      case '50':
        return `${classToReturn} bg-success/50`
      case '55':
        return `${classToReturn} bg-success/55`
      case '60':
        return `${classToReturn} bg-success/60`
      case '65':
        return `${classToReturn} bg-success/65`
      case '70':
        return `${classToReturn} bg-success/70`
      case '75':
        return `${classToReturn} bg-success/75`
      case '80':
        return `${classToReturn} bg-success/80`
      case '85':
        return `${classToReturn} bg-success/85`
      case '90':
        return `${classToReturn} bg-success/90`
      case '95':
        return `${classToReturn} bg-success/95`
      default:
        return classToReturn
    }
  })

  const best = maxBy(dates, 'score')
  const bestDates =
    best?.score === 0 ? [] : filter(dates, { score: best?.score }).map(x => x.date)

  return { dates, dateGroups, modifierClassNames, bestDates }
}
