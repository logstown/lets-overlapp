import { Doc } from '@/convex/_generated/dataModel'
import * as React from 'react'

interface CreateEventEmailTemplateProps {
  user: Doc<'users'>
  event: Doc<'events'>
  isCreator: boolean
}

export const CreateEventEmailTemplate: React.FC<
  Readonly<CreateEventEmailTemplateProps>
> = ({ user, event, isCreator }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const eventTitle = <strong>{event.title}</strong>

  return (
    <div>
      <h3>Hi, {user.name}!</h3>
      {isCreator ? (
        <p>You&apos;ve created the event: {eventTitle}</p>
      ) : (
        <p>Thank you for voting on dates for {eventTitle}</p>
      )}
      {isCreator && (
        <p>
          Send this link to others to get their availability:{' '}
          <a href={`${baseUrl}/event/add-dates/${event._id}`}>
            {baseUrl}/event/add-dates/${event._id}
          </a>
        </p>
      )}
      <p>
        You can view the event results{' '}
        <a href={`${baseUrl}/event/results/${user._id}`}>here</a>
      </p>
    </div>
  )
}
