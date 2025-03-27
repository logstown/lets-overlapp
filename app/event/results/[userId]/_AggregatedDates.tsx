'use client'

import { min, max, differenceInCalendarMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { flatMap } from 'lodash'
import { useEffect, useState } from 'react'

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
  const [minDate, setMinDate] = useState<Date>(new Date())
  const [numberOfMonths, setNumberOfMonths] = useState<number>(1)

  useEffect(() => {
    const dates = flatMap(dateGroups)
    const minDate = min(dates)
    const maxDate = max(dates)
    const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1

    setMinDate(minDate)
    setNumberOfMonths(numberOfMonths)
  }, [dateGroups, modifierClassNames])

  return (
    <div className='flex justify-center'>
      <DayPicker
        month={minDate}
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
