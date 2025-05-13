'use server'

import { z } from 'zod'
import prisma from './prisma'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { CreateEventEmailTemplate } from '@/components/CreateEventEmail'
import { FormDetails } from '@/components/EventStepper'
import { User, Event } from '@prisma/client'
import { DatesAddedEmailTemplate } from '@/components/DatesAddedEmail'

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
  preferredDates: string[],
  availableDates: string[],
): Promise<ActionResponse | undefined> {
  let user: (User & { event: Event }) | null = null

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

    user = await prisma.user.create({
      data: {
        name: attendeeName,
        email: attendeeEmail,
        isCreator: true,
        preferredDates,
        availableDates,
        event: {
          create: {
            title: eventName,
            description,
            icon,
          },
        },
      },
      include: {
        event: true,
      },
    })

    if (attendeeEmail && user) {
      resend.emails.send({
        from: 'Welcome <donotreply@letsoverl.app>',
        to: [attendeeEmail],
        subject: `Event created: ${eventName}`,
        react: await CreateEventEmailTemplate({ user }),
      })
    }
  } catch (error) {
    console.error('**********', error)
    return {
      userId: '',
      message: 'Error creating event',
    }
  } finally {
    if (user) {
      redirect(`/event/results/${user.id}`)
    }
  }
}

const addDatesSchema = z.object({
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: asOptionalField(z.string().email('Invalid email')),
})

export async function addDates(
  formData: FormDetails,
  preferredDates: string[],
  availableDates: string[],
  eventId: string,
): Promise<ActionResponse | undefined> {
  let user: (User & { event: Event & { users: User[] } }) | null = null

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

    user = await prisma.user.create({
      data: {
        name: attendeeName,
        email: attendeeEmail,
        preferredDates,
        availableDates,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
      include: {
        event: {
          include: {
            users: true,
          },
        },
      },
    })

    if (user) {
      if (attendeeEmail) {
        resend.emails.send({
          from: 'Welcome <donotreply@letsoverl.app>',
          to: [attendeeEmail],
          subject: `Dates added: ${user.event.title}`,
          react: await CreateEventEmailTemplate({ user }),
        })
      }

      const creator = user.event.users[0]

      if (creator.email) {
        resend.emails.send({
          from: 'Lets Overl.app <donotreply@letsoverl.app>',
          to: [creator.email],
          subject: `${user.name} added dates to ${user.event.title}`,
          react: await DatesAddedEmailTemplate({
            creator,
            attendee: user,
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
    if (user) {
      redirect(`/event/results/${user.id}`)
    }
  }
}

export async function editUser(
  formData: FormDetails,
  preferredDates: string[],
  availableDates: string[],
  userId: string,
): Promise<ActionResponse | undefined> {
  let user: (User & { event: Event & { users: User[] } }) | null = null

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

    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: attendeeName,
        email: attendeeEmail,
        preferredDates,
        availableDates,
      },
      include: {
        event: {
          include: {
            users: true,
          },
        },
      },
    })

    const creator = user?.event.users[0]

    if (creator?.email) {
      resend.emails.send({
        from: 'Lets Overl.app <donotreply@letsoverl.app>',
        to: [creator.email],
        subject: `${user.name} added dates to ${user.event.title}`,
        react: await DatesAddedEmailTemplate({
          creator,
          attendee: user,
          updated: true,
        }),
      })
    }
  } catch (error) {
    return {
      userId: '',
      message: 'Error updating user',
    }
  } finally {
    if (user) {
      redirect(`/event/results/${user.id}`)
    }
  }
}
