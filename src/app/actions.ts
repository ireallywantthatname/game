"use server";

import { supabase } from "@/lib/supabase";
import { updateTag } from "next/cache";

export async function adjustBuck(
  buckType: "akash" | "achini",
  amount: number,
  reason: string
) {
  const column = buckType === "akash" ? "akash_bucks" : "achini_bucks";

  const { data: current } = await supabase
    .from("game_state")
    .select(column)
    .eq("id", 1)
    .single();

  const state = current as unknown as Record<string, number>;
  const newBalance = (state?.[column] ?? 0) + amount;
  if (newBalance < 0) return;

  await supabase
    .from("game_state")
    .update({ [column]: newBalance })
    .eq("id", 1);

  await supabase.from("transactions").insert({
    buck_type: buckType,
    amount,
    reason: reason || "No reason given",
  });

  updateTag("game-state");
  updateTag("transactions");
}

export async function createReward(data: {
  name: string;
  description: string;
  cost: number;
  buck_type: "akash" | "achini";
}) {
  await supabase.from("rewards").insert(data);
  updateTag("rewards");
}

export async function updateReward(
  id: string,
  data: {
    name?: string;
    description?: string;
    cost?: number;
  }
) {
  await supabase.from("rewards").update(data).eq("id", id);
  updateTag("rewards");
}

export async function deleteReward(id: string) {
  await supabase.from("rewards").delete().eq("id", id);
  updateTag("rewards");
}

export async function redeemReward(id: string) {
  const { data: reward } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", id)
    .single();
  if (!reward || reward.status === "redeemed") return;

  const column =
    reward.buck_type === "akash" ? "akash_bucks" : "achini_bucks";

  const { data: state } = await supabase
    .from("game_state")
    .select(column)
    .eq("id", 1)
    .single();

  const stateData = state as unknown as Record<string, number>;
  if ((stateData?.[column] ?? 0) < reward.cost) return;

  await supabase
    .from("game_state")
    .update({ [column]: stateData[column] - reward.cost })
    .eq("id", 1);

  await supabase
    .from("rewards")
    .update({ status: "redeemed", redeemed_at: new Date().toISOString() })
    .eq("id", id);

  await supabase.from("transactions").insert({
    buck_type: reward.buck_type,
    amount: -reward.cost,
    reason: `Redeemed: ${reward.name}`,
  });

  updateTag("game-state");
  updateTag("transactions");
  updateTag("rewards");
}
