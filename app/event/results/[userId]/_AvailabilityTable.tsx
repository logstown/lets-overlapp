import { format } from 'date-fns'
import Link from 'next/link'
import { CrownIcon, PencilIcon } from 'lucide-react'
import { UsersDate } from './page'
import { User } from '@prisma/client'

export default function AvailabilityTable({
  usersDates,
  users,
  currentUserId,
}: {
  usersDates: UsersDate[]
  users: User[]
  currentUserId: string
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='table-pin-rows table-xs sm:table-sm md:table-md table-pin-cols table text-sm sm:text-base'>
        <thead>
          <tr>
            <th className='bg-base-100'></th>
            {usersDates.map(({ date }) => (
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
              <th className='border-base-100 bg-base-100 w-1 border-2'>
                <div className='flex items-center gap-2 whitespace-nowrap'>
                  {name}
                  {isCreator && <CrownIcon size={15} />}
                </div>
              </th>
              {usersDates.map(({ date, availableDateUsers, preferredDateUsers }) => (
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
              <th className='border-base-100 bg-base-100 w-1 border-2'>
                <Link
                  href={`/event/results/${currentUserId}/edit`}
                  className={currentUserId !== id ? 'invisible' : ''}
                >
                  <button className='btn btn-xs btn-soft sm:btn-sm'>
                    <PencilIcon className='h-3 w-3 sm:h-4 sm:w-4' />
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
