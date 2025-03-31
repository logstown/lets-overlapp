'use server'

import { z } from 'zod'
import prisma from './prisma'
import { redirect } from 'next/navigation'
export interface CreateEventFormData {
  title: string
  description?: string
  name: string
  allowOthersToViewResults: boolean
  email?: string
}

export interface ActionResponseCreate {
  success: boolean
  message: string
  errors?: {
    [K in keyof CreateEventFormData]?: string[]
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
): Promise<ActionResponseCreate | undefined> {
  let redirectUrl: string | null = null

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
        success: false,
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

    redirectUrl = `/event/results/${user.id}`
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error creating event',
    }
  } finally {
    if (redirectUrl) {
      redirect(redirectUrl)
    }
  }
}

export interface AddDatesFormData {
  name: string
}

export interface ActionResponseAdd {
  success: boolean
  message: string
  errors?: {
    [K in keyof AddDatesFormData]?: string[]
  }
}

const addDatesSchema = z.object({
  name: z.string().min(2, 'Name is required'),
})

export async function addDates(
  formData: FormData,
  preferredDates: string[],
  availableDates: string[],
  eventId: string,
): Promise<ActionResponseAdd | undefined> {
  let redirectUrl: string | null = null

  try {
    const validatedFields = addDatesSchema.safeParse({
      name: formData.get('name'),
    })

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name } = validatedFields.data

    const user = await prisma.user.create({
      data: {
        name,
        preferredDates,
        availableDates,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    })

    redirectUrl = `/event/results/${user.id}`
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error creating event',
    }
  } finally {
    if (redirectUrl) {
      redirect(redirectUrl)
    }
  }
}
