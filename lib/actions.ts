'use server'

import { z } from 'zod'
import prisma from './prisma'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'
const resend = new Resend(process.env.RESEND_API_KEY)

export interface CreateEventFormData {
  title: string
  description?: string
  name: string
  allowOthersToViewResults: boolean
  email?: string
}

export interface ActionResponse {
  userId: string
  message: string
  errors?: {
    [K in keyof (CreateEventFormData | AddDatesFormData)]?: string[]
  }
}

const newEventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  allowOthersToViewResults: z.boolean(),
  email: z.string().email('Invalid email').optional(),
})

export async function createEvent(
  formData: FormData,
  preferredDates: string[],
  availableDates: string[],
): Promise<ActionResponse | undefined> {
  try {
    const validatedFields = newEventSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      name: formData.get('name'),
      allowOthersToViewResults: formData.get('allowOthersToViewResults') === 'on',
      email: formData.get('email') || undefined,
    })

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { title, description, name, allowOthersToViewResults, email } =
      validatedFields.data

    const user = await prisma.user.create({
      data: {
        name,
        email,
        isCreator: true,
        preferredDates,
        availableDates,
        event: {
          create: {
            title,
            description,
            allowOthersToViewResults,
          },
        },
      },
    })

    if (email) {
      resend.emails.send({
        from: 'Welcome <onboarding@letsoverl.app>',
        to: [email],
        subject: 'Hello world',
        react: await EmailTemplate({ firstName: name }),
      })
    }

    return {
      userId: user.id,
      message: 'Event created successfully',
    }
  } catch (error) {
    console.error('**********', error)
    return {
      userId: '',
      message: 'Error creating event',
    }
  }
}

export interface AddDatesFormData {
  name: string
  email?: string
}

// export interface ActionResponseAdd {
//   userId: string
//   message: string
//   errors?: {
//     [K in keyof AddDatesFormData]?: string[]
//   }
// }

const addDatesSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
})

export async function addDates(
  formData: FormData,
  preferredDates: string[],
  availableDates: string[],
  eventId: string,
): Promise<ActionResponse | undefined> {
  try {
    const validatedFields = addDatesSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email') || undefined,
    })

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email } = validatedFields.data

    const user = await prisma.user.create({
      data: {
        name,
        email,
        preferredDates,
        availableDates,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    })

    if (email) {
      resend.emails.send({
        from: 'Welcome <onboarding@letsoverl.app>',
        to: [email],
        subject: 'Hello world',
        react: await EmailTemplate({ firstName: name }),
      })
    }

    return {
      userId: user.id,
      message: 'User added successfully',
    }
  } catch (error) {
    console.error('errrrrrrror;', error)
    return {
      userId: '',
      message: 'Error adding user',
    }
  }
}

export async function editUser(
  formData: FormData,
  preferredDates: string[],
  availableDates: string[],
  userId: string,
): Promise<ActionResponse | undefined> {
  try {
    const validatedFields = addDatesSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email') || undefined,
    })

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email } = validatedFields.data

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        preferredDates,
        availableDates,
      },
    })

    return {
      userId: user.id,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      userId: '',
      message: 'Error updating user',
    }
  }
}
