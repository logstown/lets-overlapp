import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const applicationTables = {
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    availableDates: v.array(
      v.object({
        date: v.string(),
        isPreferred: v.boolean(),
      }),
    ),
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
