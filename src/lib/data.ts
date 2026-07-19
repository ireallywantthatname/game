"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db";
import type { GameState, Transaction, Reward } from "@/lib/types";

export async function getGameState(): Promise<GameState | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("game-state");

  const db = await getDb();
  const result = await db.execute(
    "SELECT akash_bucks, achini_bucks, updated_at FROM game_state WHERE id = 1"
  );
  const row = result.rows[0];
  if (!row) return null;

  return {
    akash_bucks: Number(row.akash_bucks),
    achini_bucks: Number(row.achini_bucks),
    updated_at: String(row.updated_at),
  };
}

export async function getTransactions(limit = 20): Promise<Transaction[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("transactions");

  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, buck_type, amount, reason, created_at FROM transactions ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    buck_type: row.buck_type as Transaction["buck_type"],
    amount: Number(row.amount),
    reason: String(row.reason),
    created_at: String(row.created_at),
  }));
}

export async function getRewards(): Promise<Reward[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("rewards");

  const db = await getDb();
  const result = await db.execute(
    "SELECT id, name, description, cost, buck_type, status, created_at, updated_at, redeemed_at FROM rewards ORDER BY created_at ASC"
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    cost: Number(row.cost),
    buck_type: row.buck_type as Reward["buck_type"],
    status: row.status as Reward["status"],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    redeemed_at: row.redeemed_at == null ? null : String(row.redeemed_at),
  }));
}
