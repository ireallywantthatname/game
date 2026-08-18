import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

export const buckTypeValidator = v.union(
  v.literal("akash"),
  v.literal("achini"),
);

export const gameStateValidator = v.object({
  akash_bucks: v.number(),
  achini_bucks: v.number(),
  updated_at: v.string(),
});

export const transactionValidator = v.object({
  id: v.string(),
  buck_type: buckTypeValidator,
  amount: v.number(),
  reason: v.string(),
  created_at: v.string(),
});

export const rewardValidator = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  cost: v.number(),
  buck_type: buckTypeValidator,
  status: v.union(v.literal("available"), v.literal("redeemed")),
  created_at: v.string(),
  updated_at: v.string(),
  redeemed_at: v.union(v.string(), v.null()),
});

export function iso(ts: number): string {
  return new Date(ts).toISOString();
}

export function mapGameState(doc: Doc<"gameState"> | null) {
  if (!doc) {
    return {
      akash_bucks: 0,
      achini_bucks: 0,
      updated_at: new Date(0).toISOString(),
    };
  }
  return {
    akash_bucks: doc.akashBucks,
    achini_bucks: doc.achiniBucks,
    updated_at: iso(doc.updatedAt),
  };
}

export function mapTransaction(doc: Doc<"transactions">) {
  return {
    id: doc._id,
    buck_type: doc.buckType,
    amount: doc.amount,
    reason: doc.reason,
    created_at: iso(doc._creationTime),
  };
}

export function mapReward(doc: Doc<"rewards">) {
  return {
    id: doc._id,
    name: doc.name,
    description: doc.description,
    cost: doc.cost,
    buck_type: doc.buckType,
    status: doc.status,
    created_at: iso(doc._creationTime),
    updated_at: iso(doc.updatedAt),
    redeemed_at: doc.redeemedAt === null ? null : iso(doc.redeemedAt),
  };
}

export async function getOrCreateGameState(ctx: MutationCtx) {
  const existing = await ctx.db
    .query("gameState")
    .withIndex("by_key", (q) => q.eq("key", "main"))
    .unique();
  if (existing) return existing;

  const id = await ctx.db.insert("gameState", {
    key: "main",
    akashBucks: 0,
    achiniBucks: 0,
    updatedAt: Date.now(),
  });
  const created = await ctx.db.get("gameState", id);
  if (!created) {
    throw new Error("Failed to create game state");
  }
  return created;
}
