"use server";

import { refresh } from "next/cache";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export async function adjustBuck(
  buckType: "akash" | "achini",
  amount: number,
  reason: string
) {
  await fetchMutation(api.game.adjustBuck, {
    buckType,
    amount,
    reason: reason || "No reason given",
  });
  refresh();
}

export async function createReward(data: {
  name: string;
  description: string;
  cost: number;
  buck_type: "akash" | "achini";
}) {
  await fetchMutation(api.rewards.create, {
    name: data.name,
    description: data.description,
    cost: data.cost,
    buckType: data.buck_type,
  });
  refresh();
}

export async function deleteReward(id: string) {
  await fetchMutation(api.rewards.deleteReward, {
    id: id as Id<"rewards">,
  });
  refresh();
}

export async function redeemReward(id: string) {
  await fetchMutation(api.rewards.redeem, {
    id: id as Id<"rewards">,
  });
  refresh();
}
