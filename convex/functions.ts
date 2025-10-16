import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { api } from './_generated/api'
import { Doc } from './_generated/dataModel'
import _ from 'lodash'
import { groupBy, reject, filter } from 'lodash'

export const getEvent = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId)
    if (!event) throw new Error('Event not found')

    return event
  },
})

export const getUser = query({
  args: {
    userId: v.id('users'),
    serverSecret: v.string(),
  },
  handler: async (ctx, { userId, serverSecret }) => {
    if (serverSecret !== process.env.SERVER_SECRET)
      throw new Error('Invalid server secret')

    const user = await ctx.db.get(userId)
    if (!user) throw new Error('User not found')
    return user
  },
})

export const getCreator = query({
  args: {
    eventId: v.id('events'),
    serverSecret: v.string(),
  },
  handler: async (ctx, { eventId, serverSecret }) => {
    if (serverSecret !== process.env.SERVER_SECRET)
      throw new Error('Invalid server secret')

    const creator = await ctx.db
      .query('users')
      .withIndex('by_event', q => q.eq('eventId', eventId))
      .first()
    if (!creator) throw new Error('Creator not found')
    return creator
  },
})

export const getUsersDates = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId)
    if (!user) throw new Error('User not found')

    const event = await ctx.db.get(user.eventId)
    if (!event) throw new Error('Event not found')

    const eventUsers = await ctx.db
      .query('users')
      .withIndex('by_event', q => q.eq('eventId', event._id))
      .collect()

    const usersDates = _.chain(eventUsers)
      .flatMap(user => [user.availableDates, user.preferredDates].flat())
      .uniq()
      .map(date => {
        const availableDateUsers = eventUsers
          .filter(user => user.availableDates.includes(date))
          .map(x => x._id)
        const preferredDateUsers = eventUsers
          .filter(user => user.preferredDates.includes(date))
          .map(x => x._id)

        let score = 0
        const availableCount = availableDateUsers.length
        const preferredCount = preferredDateUsers.length
        const eventCount = eventUsers.length

        if (preferredCount + availableCount === eventCount) {
          score = Math.round(((preferredCount / eventCount) * 70) / 5) * 5 + 30
        }

        return {
          date,
          availableDateUsers,
          preferredDateUsers,
          score,
        }
      })
      .value()

    return { eventUsers, usersDates }
  },
})

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    allowOthersToViewResults: v.boolean(),
    attendeeName: v.string(),
    attendeeEmail: v.optional(v.string()),
    availableDates: v.array(v.string()),
    preferredDates: v.array(v.string()),
    serverSecret: v.string(),
  },
  handler: async (
    ctx,
    {
      title,
      description,
      icon,
      allowOthersToViewResults,
      attendeeName,
      attendeeEmail,
      availableDates,
      preferredDates,
      serverSecret,
    },
  ) => {
    if (serverSecret !== process.env.SERVER_SECRET)
      throw new Error('Invalid server secret')

    const eventId = await ctx.db.insert('events', {
      title,
      description,
      icon,
      allowOthersToViewResults,
      updatedAt: Date.now(),
    })
    const userId = await ctx.db.insert('users', {
      name: attendeeName,
      email: attendeeEmail,
      eventId,
      availableDates,
      preferredDates,
      updatedAt: Date.now(),
    })

    const user = await ctx.db.get(userId)
    const event = await ctx.db.get(eventId)
    return { user, event }
  },
})

export const addUserAndDates = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    availableDates: v.array(v.string()),
    preferredDates: v.array(v.string()),
    eventId: v.id('events'),
    serverSecret: v.string(),
  },
  handler: async (
    ctx,
    { name, email, availableDates, preferredDates, eventId, serverSecret },
  ) => {
    if (serverSecret !== process.env.SERVER_SECRET)
      throw new Error('Invalid server secret')

    const event = await ctx.db.get(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const userId = await ctx.db.insert('users', {
      name,
      email,
      eventId,
      availableDates,
      preferredDates,
      updatedAt: Date.now(),
    })

    const user = await ctx.db.get(userId)
    const creator = (await ctx.runQuery(api.functions.getCreator, {
      eventId,
      serverSecret,
    })) as Doc<'users'>

    return { user, event, creator }
  },
})

export const editUser = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    email: v.optional(v.string()),
    availableDates: v.array(v.string()),
    preferredDates: v.array(v.string()),
    serverSecret: v.string(),
  },
  handler: async (
    ctx,
    { userId, name, email, availableDates, preferredDates, serverSecret },
  ) => {
    if (serverSecret !== process.env.SERVER_SECRET)
      throw new Error('Invalid server secret')

    await ctx.db.patch(userId, {
      name,
      email,
      availableDates,
      preferredDates,
      updatedAt: Date.now(),
    })
    const user = await ctx.db.get(userId)
    if (!user) throw new Error('User not found')

    const event = await ctx.db.get(user.eventId)
    if (!event) throw new Error('Event not found')

    const creator = (await ctx.runQuery(api.functions.getCreator, {
      eventId: event._id,
      serverSecret,
    })) as Doc<'users'>

    return { user, event, creator }
  },
})
