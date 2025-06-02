import { format } from 'date-fns'
import Link from 'next/link'
import { CrownIcon, PencilIcon } from 'lucide-react'
import { UsersDate } from './page'
import { User } from '@prisma/client'
import _ from 'lodash'
import { getJSDateFromStr } from '@/lib/utilities'

export default function AvailabilityTable({
  usersDates,
  users,
  currentUserId,
}: {
  usersDates: UsersDate[]
  users: User[]
  currentUserId: string
}) {
  const localUserDates = _.chain(usersDates)
    .map(x => ({
      ...x,
      date: getJSDateFromStr(x.date),
    }))
    .sortBy('date')
    .value()

  return (
    <div className='overflow-x-scroll sm:overflow-x-auto'>
      <table className='table-pin-rows table-xs sm:table-sm md:table-md table-pin-cols table'>
        <thead>
          <tr>
            <th className='bg-base-100'></th>
            {localUserDates.map(({ date }) => (
              <td className='bg-base-100 text-center' key={date.toISOString()}>
                {format(date, 'MMM d')}
              </td>
            ))}
            <th className='bg-base-100'></th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, isCreator }) => (
            <tr key={id}>
              <th className='border-base-100 bg-base-100 text-base-content/70 w-1 border-2 border-l-0'>
                <div className='flex items-center gap-2'>
                  {name}
                  {isCreator && <CrownIcon size={15} />}
                </div>
              </th>
              {localUserDates.map(
                ({ date, availableDateUsers, preferredDateUsers }) => (
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
                ),
              )}
              <th className='border-base-100 bg-base-100 w-1 border-2 border-r-0'>
                <Link
                  href={`/event/results/${currentUserId}/edit`}
                  className={currentUserId !== id ? 'invisible' : ''}
                >
                  <button className='btn btn-xs btn-soft sm:btn-sm'>
                    <PencilIcon className='h-2 w-2 sm:h-4 sm:w-4' />
                  </button>
                </Link>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
