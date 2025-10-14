'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { CreateEventEmailTemplate } from '@/components/CreateEventEmail'
import { FormDetails } from '@/components/EventStepper'
import { DatesAddedEmailTemplate } from '@/components/DatesAddedEmail'
import { fetchMutation } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ActionResponse {
  userId: string
  message: string
  errors?: {
    [K in keyof FormDetails]?: string[]
  }
}

const emptyStringToUndefined = z.literal('').transform(() => undefined)

const asOptionalField = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional().or(emptyStringToUndefined)
}

const newEventSchema = z.object({
  eventName: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: asOptionalField(z.string().email('Invalid email')),
  icon: z.string().min(1, 'Icon is required'),
})

export async function createEvent(
  formData: FormDetails,
  availableDates: { date: string; isPreferred: boolean }[],
): Promise<ActionResponse | undefined> {
  let userForRedirect: Doc<'users'> | null = null

  try {
    const validatedFields = newEventSchema.safeParse(formData)

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { eventName, description, attendeeName, attendeeEmail, icon } =
      validatedFields.data

    const { user, event } = await fetchMutation(api.functions.createEvent, {
      title: eventName,
      description,
      icon,
      allowOthersToViewResults: true,
      attendeeName,
      attendeeEmail,
      availableDates,
      serverSecret: process.env.SERVER_SECRET ?? '',
    })

    userForRedirect = user

    if (user?.email && event) {
      resend.emails.send({
        from: "Let's Overlapp <donotreply@letsoverl.app>",
        to: [user.email],
        subject: `Event created: ${eventName}`,
        react: await CreateEventEmailTemplate({ user, event, isCreator: true }),
      })
    }
  } catch (error) {
    console.error('**********', error)
    return {
      userId: '',
      message: 'Error creating event',
    }
  } finally {
    if (userForRedirect) {
      redirect(`/event/results/${userForRedirect._id}`)
    }
  }
}

const addDatesSchema = z.object({
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: asOptionalField(z.string().email('Invalid email')),
})

export async function addDates(
  formData: FormDetails,
  availableDates: { date: string; isPreferred: boolean }[],
  eventId: Id<'events'>,
): Promise<ActionResponse | undefined> {
  let userForRedirect: Doc<'users'> | null = null

  try {
    const validatedFields = addDatesSchema.safeParse(formData)

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { attendeeName, attendeeEmail } = validatedFields.data

    const { user, event, creator } = await fetchMutation(
      api.functions.addUserAndDates,
      {
        name: attendeeName,
        email: attendeeEmail,
        availableDates,
        eventId,
        serverSecret: process.env.SERVER_SECRET ?? '',
      },
    )

    userForRedirect = user

    if (user) {
      if (attendeeEmail) {
        resend.emails.send({
          from: "Let's Overlapp <donotreply@letsoverl.app>",
          to: [attendeeEmail],
          subject: `Dates added: ${event.title}`,
          react: await CreateEventEmailTemplate({ user, event, isCreator: false }),
        })
      }

      if (creator?.email) {
        resend.emails.send({
          from: 'Lets Overlapp <donotreply@letsoverl.app>',
          to: [creator.email],
          subject: `${user.name} added dates to ${event.title}`,
          react: await DatesAddedEmailTemplate({
            creator,
            attendee: user,
            event,
          }),
        })
      }
    }
  } catch (error) {
    console.error('errrrrrrror;', error)
    return {
      userId: '',
      message: 'Error adding user',
    }
  } finally {
    if (userForRedirect) {
      redirect(`/event/results/${userForRedirect._id}`)
    }
  }
}

export async function editUser(
  formData: FormDetails,
  availableDates: { date: string; isPreferred: boolean }[],
  userId: Id<'users'>,
): Promise<ActionResponse | undefined> {
  let userForRedirect: Doc<'users'> | null = null

  try {
    const validatedFields = addDatesSchema.safeParse(formData)

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { attendeeName, attendeeEmail } = validatedFields.data

    const { user, event, creator } = await fetchMutation(api.functions.editUser, {
      userId,
      name: attendeeName,
      email: attendeeEmail,
      availableDates,
      serverSecret: process.env.SERVER_SECRET ?? '',
    })

    userForRedirect = user

    if (creator?.email) {
      resend.emails.send({
        from: 'Lets Overl.app <donotreply@letsoverl.app>',
        to: [creator.email],
        subject: `${user.name} added dates to ${event.title}`,
        react: await DatesAddedEmailTemplate({
          creator,
          attendee: user,
          event,
          updated: true,
        }),
      })
    }
  } catch (error) {
    console.log('errrrrrrror;', error)
    return {
      userId: '',
      message: 'Error updating user',
    }
  } finally {
    if (userForRedirect) {
      redirect(`/event/results/${userForRedirect._id}`)
    }
  }
}
