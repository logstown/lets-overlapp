'use server'

import { z } from 'zod'
import prisma from './prisma'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'
import { FormDetails } from '@/components/EventStepper'
import { User } from '@prisma/client'
const resend = new Resend(process.env.RESEND_API_KEY)

export interface ActionResponse {
  userId: string
  message: string
  errors?: {
    [K in keyof FormDetails]?: string[]
  }
}

const newEventSchema = z.object({
  eventName: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: z.string().email('Invalid email').optional(),
})

export async function createEvent(
  formData: FormDetails,
  preferredDates: string[],
  availableDates: string[],
): Promise<ActionResponse | undefined> {
  let user: User | null = null

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

    const { eventName, description, attendeeName, attendeeEmail } =
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
          },
        },
      },
    })

    if (attendeeEmail) {
      resend.emails.send({
        from: 'Welcome <onboarding@letsoverl.app>',
        to: [attendeeEmail],
        subject: 'Hello world',
        react: await EmailTemplate({ firstName: attendeeName }),
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
  attendeeEmail: z.string().email('Invalid email').optional(),
})

export async function addDates(
  formData: FormDetails,
  preferredDates: string[],
  availableDates: string[],
  eventId: string,
): Promise<ActionResponse | undefined> {
  let user: User | null = null

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
    })

    if (attendeeEmail) {
      resend.emails.send({
        from: 'Welcome <onboarding@letsoverl.app>',
        to: [attendeeEmail],
        subject: 'Hello world',
        react: await EmailTemplate({ firstName: attendeeName }),
      })
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
  let user: User | null = null

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
    })
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
