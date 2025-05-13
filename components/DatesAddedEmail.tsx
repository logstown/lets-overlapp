import * as React from 'react'
import { User, Event } from '@prisma/client'

interface DatesAddedEmailTemplateProps {
  creator: User
  attendee: User & { event: Event }
  updated?: boolean
}

export const DatesAddedEmailTemplate: React.FC<
  Readonly<DatesAddedEmailTemplateProps>
> = ({ creator, attendee, updated }) => {
  const event = attendee.event
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const eventTitle = <strong>{event.title}</strong>
  return (
    <div>
      <h3>Hi, {creator.name}!</h3>
      <p>
        {attendee.name} {updated ? 'has updated' : 'has added'} their dates to{' '}
        {eventTitle}.
      </p>
      <p>
        You can view the event results{' '}
        <a href={`${baseUrl}/event/results/${creator.id}`}>here</a>
      </p>
    </div>
  )
}
