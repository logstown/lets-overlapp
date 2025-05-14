import * as React from 'react'
import { User, Event } from '@prisma/client'

interface CreateEventEmailTemplateProps {
  user: User & { event: Event }
}

export const CreateEventEmailTemplate: React.FC<
  Readonly<CreateEventEmailTemplateProps>
> = ({ user }) => {
  const event = user.event
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const eventTitle = <strong>{event.title}</strong>
  return (
    <div>
      <h3>Hi, {user.name}!</h3>
      {user.isCreator ? (
        <p>You&apos;ve created the event: {eventTitle}</p>
      ) : (
        <p>Thank you for voting on dates for {eventTitle}</p>
      )}
      {user.isCreator && (
        <p>
          Send this link to others to get their availability:{' '}
          <a href={`${baseUrl}/event/add-dates/${event.id}`}>
            {baseUrl}/event/add-dates/${event.id}
          </a>
        </p>
      )}
      <p>
        You can view the event results{' '}
        <a href={`${baseUrl}/event/results/${user.id}`}>here</a>
      </p>
    </div>
  )
}
