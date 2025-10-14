import { UsersDate } from '@/app/event/results/[userId]/page'
import { filter } from 'lodash'
import { maxBy } from 'lodash'

export const getJSDateFromStr = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-')
  return new Date(+year, +month - 1, +day)
}

export const getBestDates = (usersDates: UsersDate[]) => {
  const best = maxBy(usersDates, 'score')
  return best?.score === 0
    ? []
    : filter(usersDates, { score: best?.score }).map(x => getJSDateFromStr(x.date))
}

export const eventIcons = [
  {
    event: 'Calendar',
    fileName: 'calendar',
  },
  {
    event: 'Party',
    fileName: 'party',
  },
  {
    event: 'Conversation',
    fileName: 'chat-bubble',
  },
  {
    event: 'Clock',
    fileName: 'clock',
  },
  {
    event: 'Computer',
    fileName: 'computer',
  },
  {
    event: 'Food',
    fileName: 'food',
  },
  {
    event: 'Map',
    fileName: 'map',
  },
  {
    event: 'People',
    fileName: 'people',
  },
  {
    event: 'Trophy',
    fileName: 'trophy',
  },
]
