'use client'

import { min, max, differenceInCalendarMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { flatMap } from 'lodash'

export default function AggregatedDates({
  dateGroups,
  modifierClassNames,
}: {
  dateGroups: {
    [key: string]: Date[]
  }
  modifierClassNames: {
    [key: string]: string
  }
}) {
  const dates = flatMap(dateGroups)
  const minDate = min(dates)
  const maxDate = max(dates)
  const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1

  console.log(dateGroups, modifierClassNames)

  return (
    <div className='flex justify-center'>
      <DayPicker
        defaultMonth={minDate}
        numberOfMonths={numberOfMonths}
        modifiers={dateGroups}
        modifiersClassNames={modifierClassNames}
        classNames={{
          root: 'react-day-picker shadow-lg',
          today: 'text-base-content bg-base-100',
        }}
        hideNavigation
      />
    </div>
  )
}
