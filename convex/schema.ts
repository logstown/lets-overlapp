import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const applicationTables = {
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    availableDates: v.array(v.string()),
    preferredDates: v.array(v.string()),
    eventId: v.id('events'),
    updatedAt: v.number(),
  }).index('by_event', ['eventId']),
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    allowOthersToViewResults: v.boolean(),
    updatedAt: v.number(),
  }),
}

export default defineSchema(applicationTables)
