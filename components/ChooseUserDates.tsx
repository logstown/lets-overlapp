'use client'

import { useState } from 'react'
import { ClassNames, DayEventHandler, DayPicker, Matcher } from 'react-day-picker'
import { max, min, differenceInCalendarMonths, isSameDay } from 'date-fns'
import { reject } from 'lodash'
import ContinueButton from '@/components/ContinueButton'
import DaysLegend from './DaysLegend'
import { User } from '@prisma/client'
import { getJSDateFromStr } from '@/lib/utilities'
import Link from 'next/link'
export default function ChooseUserDates({
  setDates,
  eventId,
  user,
}: {
  setDates?: Date[]
  eventId?: string
  user?: User
}) {
  const minDate = setDates ? min(setDates) : new Date()
  const classNames: Partial<ClassNames> = {
    root: 'react-day-picker shadow-lg',
    today: 'text-base-content bg-base-100',
    disabled: '!text-base-content/50',
    day_button: 'rdp-day_button hover:!bg-transparent',
  }

  if (!!eventId || !!user) {
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
  const [availableDates, setAvailableDates] = useState<Date[]>(
    user?.availableDates.map(getJSDateFromStr) ?? [],
  )
  const [preferredDates, setPreferredDates] = useState<Date[]>(
    user?.preferredDates.map(getJSDateFromStr) ?? [],
  )
  const [isEditing, setIsEditing] = useState(false)

  const disabledMatcher: Matcher = (day: Date) => {
    if (!setDates) {
      return day < new Date()
    }
    return !setDates.some(setDate => setDate.toISOString() === day.toISOString())
  }

  const onSelected: DayEventHandler<React.MouseEvent> = (day, modifiers) => {
    let newAvailableDates = [...(availableDates ?? [])]
    let newPreferredDates = [...(preferredDates ?? [])]

    if (modifiers.availableDates) {
      newAvailableDates = reject(newAvailableDates, d => isSameDay(day, d))
      newPreferredDates.push(day)
    } else if (modifiers.preferredDates) {
      newPreferredDates = reject(newPreferredDates, d => isSameDay(day, d))
    } else {
      newAvailableDates.push(day)
    }

    setAvailableDates(newAvailableDates)
    setPreferredDates(newPreferredDates)
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
                preferredDates,
                availableDates,
              }}
              modifiersClassNames={{
                preferredDates: '!bg-success !text-success-content',
                availableDates: '!bg-success/50 !text-success-content',
              }}
              classNames={classNames}
              hideNavigation={!!eventId || !!user}
            />
            <DaysLegend />
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        {(availableDates.length > 0 || preferredDates.length > 0) && isEditing && (
          <div className='flex gap-4'>
            <ContinueButton
              preferredDates={preferredDates}
              availableDates={availableDates}
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
      </div>
    </div>
  )
}
