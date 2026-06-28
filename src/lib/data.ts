"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db";
import type { GameState, Transaction, Reward } from "@/lib/types";

export async function getGameState(): Promise<GameState | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("game-state");

  const db = getDb();
  const row = db
    .query(
      "SELECT akash_bucks, achini_bucks, updated_at FROM game_state WHERE id = 1"
    )
    .get() as GameState | undefined;
  return row ?? null;
}

export async function getTransactions(
  limit = 20
): Promise<Transaction[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("transactions");

  const db = getDb();
  return db
    .query(
      "SELECT id, buck_type, amount, reason, created_at FROM transactions ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as Transaction[];
}

export async function getRewards(): Promise<Reward[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("rewards");

  const db = getDb();
  return db
    .query(
      "SELECT id, name, description, cost, buck_type, status, created_at, updated_at, redeemed_at FROM rewards ORDER BY created_at ASC"
    )
    .all() as Reward[];
}
