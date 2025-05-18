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

export const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
]

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
