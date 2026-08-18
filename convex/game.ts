import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  buckTypeValidator,
  gameStateValidator,
  getOrCreateGameState,
  mapGameState,
  mapTransaction,
  transactionValidator,
} from "./helpers";

export const getState = query({
  args: {},
  returns: gameStateValidator,
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("gameState")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
    return mapGameState(doc);
  },
});

export const listTransactions = query({
  args: { limit: v.number() },
  returns: v.array(transactionValidator),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("transactions")
      .order("desc")
      .take(args.limit);
    return rows.map(mapTransaction);
  },
});

export const adjustBuck = mutation({
  args: {
    buckType: buckTypeValidator,
    amount: v.number(),
    reason: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const state = await getOrCreateGameState(ctx);
    const field = args.buckType === "akash" ? "akashBucks" : "achiniBucks";
    const next = state[field] + args.amount;
    if (next < 0) return null;

    await ctx.db.patch("gameState", state._id, {
      [field]: next,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("transactions", {
      buckType: args.buckType,
      amount: args.amount,
      reason: args.reason,
    });
    return null;
  },
});
