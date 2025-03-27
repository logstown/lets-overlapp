import prisma from '@/lib/prisma'
import CopyLink from './_CopyLink'
import { notFound } from 'next/navigation'
import _, { map, mapKeys, mapValues } from 'lodash'
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

  const { dates, dateGroups, modifierClassNames } = calculateData(users)

  return (
    <div className='flex flex-col gap-10'>
      <CopyLink id={event.id} />
      <div className='flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-12'>
        <AggregatedDates
          dateGroups={dateGroups}
          modifierClassNames={modifierClassNames}
        />
        <DaysLegend includeUnavailable />
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
          {/* <tfoot>
              <tr>
                <th></th>
                <td>Name</td>
                <td>Job</td>
                <td>company</td>
                <td>location</td>
                <td>Last Login</td>
                <td>Favorite Color</td>
                <th></th>
              </tr>
            </tfoot> */}
        </table>
      </div>
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
      return {
        date: getJSDateFromStr(date),
        availableDateUsers,
        preferredDateUsers,
      }
    })
    .sortBy(date => date.date)
    .value()

  const dateGroups = _.chain(dates)
    .groupBy(({ availableDateUsers, preferredDateUsers }) => {
      if (preferredDateUsers.length === users.length) {
        return 'preferred'
      }

      if (preferredDateUsers.length + availableDateUsers.length === users.length) {
        const opacity =
          Math.round(((preferredDateUsers.length / users.length) * 50) / 5) * 5 + 50
        return `available-${opacity}`
      }

      return 'unavailable'
    })
    .mapValues(dates => map(dates, 'date'))
    .value()

  const modifierClassNames = mapValues(dateGroups, (dates, dateType) => {
    const baseClasses = 'border-2 border-base-100'

    switch (dateType) {
      case 'preferred':
        return `${baseClasses} bg-success text-success-content`
      case 'unavailable':
        return `${baseClasses} bg-base-300 text-base-content`
      default:
        const opacity = dateType.split('-')[1]
        const opacityClass = opacity === '100' ? '' : `/${opacity}`

        return `${baseClasses} bg-success${opacityClass} text-success-content`
    }
  })

  return { dates, dateGroups, modifierClassNames }
}
