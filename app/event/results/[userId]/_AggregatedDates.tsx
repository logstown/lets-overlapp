'use client'

import { min, max, differenceInCalendarMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import _, { flatMap, mapValues, map } from 'lodash'
import { useEffect, useState } from 'react'
import { UsersDate } from './page'
import { getJSDateFromStr } from '@/lib/utilities'

export default function AggregatedDates({
  usersDates,
}: {
  usersDates: UsersDate[]
}) {
  const [minDate, setMinDate] = useState<Date>(new Date())
  const [numberOfMonths, setNumberOfMonths] = useState<number>(1)
  const [dateGroups, setDateGroups] = useState<Record<string, Date[]>>({})
  const [modifierClassNames, setModifierClassNames] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    const { dateGroups, modifierClassNames } = getDayPickerStuff(usersDates)

    setDateGroups(dateGroups)
    setModifierClassNames(modifierClassNames)

    const dates = flatMap(dateGroups)
    const minDate = min(dates)
    const maxDate = max(dates)
    const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1

    setMinDate(minDate)
    setNumberOfMonths(numberOfMonths)
  }, [usersDates])

  return (
    <div className='flex justify-center'>
      <DayPicker
        month={minDate}
        numberOfMonths={numberOfMonths}
        modifiers={dateGroups}
        modifiersClassNames={modifierClassNames}
        classNames={{
          root: 'react-day-picker shadow-2xl',
          today: 'text-base-content bg-base-100',
          months: 'rdp-months justify-center',
        }}
        hideNavigation
      />
    </div>
  )
}

function getDayPickerStuff(usersDates: UsersDate[]) {
  const dateGroups = _.chain(usersDates)
    .map(x => ({ ...x, date: getJSDateFromStr(x.date) }))
    .sortBy('date')
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
    const base = 'border-2 border-base-100'
    if (dateType === 'unavailable') return `${base} bg-base-300 text-base-content`
    if (dateType === 'preferred') return `${base} bg-success text-success-content`

    if (dateType.startsWith('available-')) {
      const opacity = dateType.split('-')[1]
      switch (opacity) {
        case '30':
          return `${base} text-success-content bg-success/30`
        case '35':
          return `${base} text-success-content bg-success/35`
        case '40':
          return `${base} text-success-content bg-success/40`
        case '45':
          return `${base} text-success-content bg-success/45`
        case '50':
          return `${base} text-success-content bg-success/50`
        case '55':
          return `${base} text-success-content bg-success/55`
        case '60':
          return `${base} text-success-content bg-success/60`
        case '65':
          return `${base} text-success-content bg-success/65`
        case '70':
          return `${base} text-success-content bg-success/70`
        case '75':
          return `${base} text-success-content bg-success/75`
        case '80':
          return `${base} text-success-content bg-success/80`
        case '85':
          return `${base} text-success-content bg-success/85`
        case '90':
          return `${base} text-success-content bg-success/90`
        case '95':
          return `${base} text-success-content bg-success/95`
        default:
          return `${base} text-success-content bg-success`
      }
    }
  }) as {
    [key: string]: string
  }

  // dateGroups.best = getBestDates(usersDates)
  // modifierClassNames.best = 'ring-primary/50 dark:ring-primary/70 ring-inset ring-3'

  return { dateGroups, modifierClassNames }
}
