'use client'

import { useState } from 'react'
import { ClassNames, DayEventHandler, DayPicker, Matcher } from 'react-day-picker'
import { max, min, differenceInCalendarMonths, isSameDay } from 'date-fns'
import { reject } from 'lodash'
import ContinueButton from '@/components/ContinueButton'
import DaysLegend from './DaysLegend'
import Link from 'next/link'
import { UserDates } from './EventStepper'

export default function ChooseUserDates({
  setDates,
  isUpdating,
  userDates,
  setUserDates,
}: {
  setDates?: Date[]
  isUpdating: boolean
  userDates: UserDates
  setUserDates: (userDates: UserDates) => void
}) {
  const minDate = setDates ? min(setDates) : new Date()
  const classNames: Partial<ClassNames> = {
    root: 'react-day-picker shadow-lg',
    today: 'text-base-content bg-base-100',
    disabled: '!text-base-content/50',
    day_button: 'rdp-day_button hover:!bg-transparent',
  }

  if (isUpdating) {
    classNames.day = 'text-primary'
  }

  const [numberOfMonths] = useState(() => {
    if (setDates) {
      const maxDate = max(setDates)
      return differenceInCalendarMonths(maxDate, minDate) + 1
    } else {
      return 2
    }
  })
  const [isEditing, setIsEditing] = useState(false)

  const disabledMatcher: Matcher = (day: Date) => {
    if (!setDates) {
      return day < new Date()
    }
    return !setDates.some(setDate => setDate.toISOString() === day.toISOString())
  }

  const onSelected: DayEventHandler<React.MouseEvent> = (day, modifiers) => {
    let newAvailableDates = [...(userDates.availableDates ?? [])]
    let newPreferredDates = [...(userDates.preferredDates ?? [])]

    if (modifiers.availableDates) {
      newAvailableDates = reject(newAvailableDates, d => isSameDay(day, d))
      newPreferredDates.push(day)
    } else if (modifiers.preferredDates) {
      newPreferredDates = reject(newPreferredDates, d => isSameDay(day, d))
    } else {
      newAvailableDates.push(day)
    }

    setUserDates({
      availableDates: newAvailableDates,
      preferredDates: newPreferredDates,
    })
    setIsEditing(true)
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='card bg-base-300 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title justify-center'>Choose Potential Dates</h2>
          <div className='mt-6 flex flex-col items-center justify-evenly gap-6'>
            <DayPicker
              startMonth={new Date()}
              fixedWeeks
              defaultMonth={minDate}
              disabled={disabledMatcher}
              numberOfMonths={numberOfMonths}
              onDayClick={onSelected}
              modifiers={{
                preferredDates: userDates.preferredDates,
                availableDates: userDates.availableDates,
              }}
              modifiersClassNames={{
                preferredDates: '!bg-success !text-success-content',
                availableDates: '!bg-success/50 !text-success-content',
              }}
              classNames={classNames}
              hideNavigation={isUpdating}
            />
            <DaysLegend />
          </div>
        </div>
      </div>
      {/* <div className='flex justify-end'>
        {(userDates.availableDates.length > 0 || userDates.preferredDates.length > 0) && isEditing && (
          <div className='flex gap-4'>
            <ContinueButton
              preferredDates={userDates.preferredDates}
              availableDates={userDates.availableDates}
              eventId={eventId}
              user={user}
            />
            {!!user && (
              <Link
                href={`/event/results/${user.id}`}
                className='btn btn-soft btn-xl'
              >
                Cancel
              </Link>
            )}
          </div>
        )}
      </div> */}
    </div>
  )
}
