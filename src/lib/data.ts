"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { GameState, Transaction, Reward } from "@/lib/types";

export async function getGameState(): Promise<GameState | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("game-state");

  const { data } = await supabase
    .from("game_state")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}

export async function getTransactions(
  limit = 20
): Promise<Transaction[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("transactions");

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRewards(): Promise<Reward[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("rewards");

  const { data } = await supabase
    .from("rewards")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}
