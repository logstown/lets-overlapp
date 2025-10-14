'use client'

import { useState } from 'react'
import { ClassNames, DayEventHandler, DayPicker, Matcher } from 'react-day-picker'
import {
  max,
  min,
  differenceInCalendarMonths,
  isSameDay,
  startOfToday,
} from 'date-fns'
import { reject } from 'lodash'
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
    disabled: '!text-base-content/50 font-light',
    day_button: 'rdp-day_button hover:!bg-transparent',
    months: 'rdp-months justify-center',
  }

  if (isUpdating) {
    classNames.day = 'text-primary font-bold'
  }

  const [numberOfMonths] = useState(() => {
    if (setDates) {
      const maxDate = max(setDates)
      return differenceInCalendarMonths(maxDate, minDate) + 1
    } else {
      return 2
    }
  })

  const disabledMatcher: Matcher = (day: Date) => {
    if (!setDates) {
      return day < startOfToday()
    }
    return !setDates.some(setDate => isSameDay(setDate, day))
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
  }

  return (
    <div className='flex flex-col items-center justify-evenly gap-10'>
      <div className='flex flex-col items-center gap-4'>
        {isUpdating ? (
          <p>
            Choose from the{' '}
            <span className='text-primary text-lg font-bold'>offered dates</span>
          </p>
        ) : (
          <p className='text-lg font-medium'>Choose possible dates for your event</p>
        )}
      </div>
      <DayPicker
        startMonth={new Date()}
        fixedWeeks
        defaultMonth={minDate}
        numberOfMonths={numberOfMonths}
        onDayClick={onSelected}
        disabled={disabledMatcher}
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
      <div className='flex gap-2 p-2'>
        <p>
          Tap once for{' '}
          <span className='!bg-success/40 !text-success-content p-2 font-bold'>
            available
          </span>
        </p>
        <p>
          Twice for{' '}
          <span className='!bg-success !text-success-content p-2 font-bold'>
            preferred
          </span>
        </p>
      </div>
      {/* <DaysLegend /> */}
    </div>
  )
}
