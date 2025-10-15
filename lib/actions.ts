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
import { env } from './env'
import { logger } from './logger'
import { rateLimit } from './rate-limit'

const resend = new Resend(env.RESEND_API_KEY)

export interface ActionResponse {
  userId: string
  message: string
  errors?: {
    [K in keyof FormDetails]?: string[]
  }
}

// Helper to sanitize user input and prevent XSS
const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .slice(0, 1000) // Limit length
}

const emptyStringToUndefined = z.literal('').transform(() => undefined)

const asOptionalField = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional().or(emptyStringToUndefined)
}

// Helper function to send email without blocking
const sendEmailAsync = (emailPromise: Promise<unknown>, context: string) => {
  emailPromise.catch(error => {
    logger.error(`Failed to send ${context} email`, { error: String(error) })
  })
}

const newEventSchema = z.object({
  eventName: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: asOptionalField(z.email('Invalid email')),
  icon: z.string().min(1, 'Icon is required'),
})

export async function createEvent(
  formData: FormDetails,
  availableDates: { date: string; isPreferred: boolean }[],
): Promise<ActionResponse | undefined> {
  let userForRedirect: Doc<'users'> | null = null

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit({ interval: 60000, maxRequests: 5 })
    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded for createEvent')
      return {
        userId: '',
        message: 'Too many requests. Please try again later.',
      }
    }

    const validatedFields = newEventSchema.safeParse(formData)

    if (!validatedFields.success) {
      logger.debug('Validation failed for createEvent', {
        errors: z.flattenError(validatedFields.error).fieldErrors,
      })
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: z.flattenError(validatedFields.error).fieldErrors,
      }
    }

    const { eventName, description, attendeeName, attendeeEmail, icon } =
      validatedFields.data

    // Sanitize user inputs
    const sanitizedEventName = sanitizeString(eventName)
    const sanitizedDescription = description
      ? sanitizeString(description)
      : undefined
    const sanitizedAttendeeName = sanitizeString(attendeeName)

    const { user, event } = await fetchMutation(api.functions.createEvent, {
      title: sanitizedEventName,
      description: sanitizedDescription,
      icon,
      allowOthersToViewResults: true,
      attendeeName: sanitizedAttendeeName,
      attendeeEmail,
      availableDates,
      serverSecret: env.SERVER_SECRET,
    })

    userForRedirect = user

    // Send email asynchronously without blocking
    if (user?.email && event) {
      sendEmailAsync(
        resend.emails.send({
          from: "Let's Overlapp <donotreply@letsoverl.app>",
          to: [user.email],
          subject: `Event created: ${sanitizedEventName}`,
          react: await CreateEventEmailTemplate({ user, event, isCreator: true }),
        }),
        'event creation',
      )
    }

    logger.info('Event created successfully', {
      eventId: event?._id,
      userId: user?._id,
    })
  } catch (error) {
    logger.error('Error creating event', { error: String(error) })
    return {
      userId: '',
      message: 'Error creating event. Please try again.',
    }
  } finally {
    if (userForRedirect) {
      redirect(`/event/results/${userForRedirect._id}`)
    }
  }
}

const addDatesSchema = z.object({
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: asOptionalField(z.email('Invalid email')),
})

export async function addDates(
  formData: FormDetails,
  availableDates: { date: string; isPreferred: boolean }[],
  eventId: Id<'events'>,
): Promise<ActionResponse | undefined> {
  let userForRedirect: Doc<'users'> | null = null

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit({ interval: 60000, maxRequests: 10 })
    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded for addDates')
      return {
        userId: '',
        message: 'Too many requests. Please try again later.',
      }
    }

    const validatedFields = addDatesSchema.safeParse(formData)

    if (!validatedFields.success) {
      logger.debug('Validation failed for addDates', {
        errors: z.flattenError(validatedFields.error).fieldErrors,
      })
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: z.flattenError(validatedFields.error).fieldErrors,
      }
    }

    const { attendeeName, attendeeEmail } = validatedFields.data

    // Sanitize user inputs
    const sanitizedAttendeeName = sanitizeString(attendeeName)

    const { user, event, creator } = await fetchMutation(
      api.functions.addUserAndDates,
      {
        name: sanitizedAttendeeName,
        email: attendeeEmail,
        availableDates,
        eventId,
        serverSecret: env.SERVER_SECRET,
      },
    )

    userForRedirect = user

    // Send emails asynchronously without blocking
    if (user) {
      if (attendeeEmail) {
        sendEmailAsync(
          resend.emails.send({
            from: "Let's Overlapp <donotreply@letsoverl.app>",
            to: [attendeeEmail],
            subject: `Dates added: ${event.title}`,
            react: await CreateEventEmailTemplate({ user, event, isCreator: false }),
          }),
          'attendee confirmation',
        )
      }

      if (creator?.email) {
        sendEmailAsync(
          resend.emails.send({
            from: "Let's Overlapp <donotreply@letsoverl.app>",
            to: [creator.email],
            subject: `${user.name} added dates to ${event.title}`,
            react: await DatesAddedEmailTemplate({
              creator,
              attendee: user,
              event,
            }),
          }),
          'creator notification',
        )
      }
    }

    logger.info('Dates added successfully', { eventId, userId: user?._id })
  } catch (error) {
    logger.error('Error adding dates', { error: String(error), eventId })
    return {
      userId: '',
      message: 'Error adding dates. Please try again.',
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
    // Rate limiting
    const rateLimitResult = await rateLimit({ interval: 60000, maxRequests: 10 })
    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded for editUser')
      return {
        userId: '',
        message: 'Too many requests. Please try again later.',
      }
    }

    const validatedFields = addDatesSchema.safeParse(formData)

    if (!validatedFields.success) {
      logger.debug('Validation failed for editUser', {
        errors: z.flattenError(validatedFields.error).fieldErrors,
      })
      return {
        userId: '',
        message: 'Please fix the errors in the form',
        errors: z.flattenError(validatedFields.error).fieldErrors,
      }
    }

    const { attendeeName, attendeeEmail } = validatedFields.data

    // Sanitize user inputs
    const sanitizedAttendeeName = sanitizeString(attendeeName)

    const { user, event, creator } = await fetchMutation(api.functions.editUser, {
      userId,
      name: sanitizedAttendeeName,
      email: attendeeEmail,
      availableDates,
      serverSecret: env.SERVER_SECRET,
    })

    userForRedirect = user

    // Send email asynchronously without blocking
    if (creator?.email) {
      sendEmailAsync(
        resend.emails.send({
          from: "Let's Overlapp <donotreply@letsoverl.app>",
          to: [creator.email],
          subject: `${user.name} updated their dates for ${event.title}`,
          react: await DatesAddedEmailTemplate({
            creator,
            attendee: user,
            event,
            updated: true,
          }),
        }),
        'user update notification',
      )
    }

    logger.info('User updated successfully', { userId, eventId: event?._id })
  } catch (error) {
    logger.error('Error updating user', { error: String(error), userId })
    return {
      userId: '',
      message: 'Error updating user. Please try again.',
    }
  } finally {
    if (userForRedirect) {
      redirect(`/event/results/${userForRedirect._id}`)
    }
  }
}
