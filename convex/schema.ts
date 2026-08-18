import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gameState: defineTable({
    key: v.literal("main"),
    akashBucks: v.number(),
    achiniBucks: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  transactions: defineTable({
    buckType: v.union(v.literal("akash"), v.literal("achini")),
    amount: v.number(),
    reason: v.string(),
  }),

  rewards: defineTable({
    name: v.string(),
    description: v.string(),
    cost: v.number(),
    buckType: v.union(v.literal("akash"), v.literal("achini")),
    status: v.union(v.literal("available"), v.literal("redeemed")),
    updatedAt: v.number(),
    redeemedAt: v.union(v.number(), v.null()),
  }),
});
