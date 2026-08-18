import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  buckTypeValidator,
  getOrCreateGameState,
  mapReward,
  rewardValidator,
} from "./helpers";

export const list = query({
  args: {},
  returns: v.array(rewardValidator),
  handler: async (ctx) => {
    const rows = await ctx.db.query("rewards").order("asc").take(100);
    return rows.map(mapReward);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    cost: v.number(),
    buckType: buckTypeValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("rewards", {
      name: args.name,
      description: args.description,
      cost: args.cost,
      buckType: args.buckType,
      status: "available",
      updatedAt: now,
      redeemedAt: null,
    });
    return null;
  },
});

export const deleteReward = mutation({
  args: { id: v.id("rewards") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reward = await ctx.db.get("rewards", args.id);
    if (!reward) return null;
    await ctx.db.delete("rewards", args.id);
    return null;
  },
});

export const redeem = mutation({
  args: { id: v.id("rewards") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reward = await ctx.db.get("rewards", args.id);
    if (!reward || reward.status === "redeemed") return null;

    const state = await getOrCreateGameState(ctx);
    const field = reward.buckType === "akash" ? "akashBucks" : "achiniBucks";
    if (state[field] < reward.cost) return null;

    const now = Date.now();
    await ctx.db.patch("gameState", state._id, {
      [field]: state[field] - reward.cost,
      updatedAt: now,
    });
    await ctx.db.patch("rewards", reward._id, {
      status: "redeemed",
      redeemedAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("transactions", {
      buckType: reward.buckType,
      amount: -reward.cost,
      reason: `Redeemed: ${reward.name}`,
    });
    return null;
  },
});
