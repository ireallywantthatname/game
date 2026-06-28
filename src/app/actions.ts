"use server";

import { getDb } from "@/lib/db";
import { updateTag } from "next/cache";

function now(): string {
  return new Date().toISOString();
}

export async function adjustBuck(
  buckType: "akash" | "achini",
  amount: number,
  reason: string
) {
  const db = getDb();
  const column = buckType === "akash" ? "akash_bucks" : "achini_bucks";

  const row = db
    .query(`SELECT ${column} FROM game_state WHERE id = 1`)
    .get() as Record<string, number> | undefined;
  const current = row?.[column] ?? 0;
  const newBalance = current + amount;
  if (newBalance < 0) return;

  const ts = now();

  db.transaction(() => {
    db.query(
      `UPDATE game_state SET ${column} = ?, updated_at = ? WHERE id = 1`
    ).run(newBalance, ts);
    db.query(
      "INSERT INTO transactions (id, buck_type, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(
      crypto.randomUUID(),
      buckType,
      amount,
      reason || "No reason given",
      ts
    );
  })();

  updateTag("game-state");
  updateTag("transactions");
}

export async function createReward(data: {
  name: string;
  description: string;
  cost: number;
  buck_type: "akash" | "achini";
}) {
  const db = getDb();
  const ts = now();

  db.query(
    "INSERT INTO rewards (id, name, description, cost, buck_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'available', ?, ?)"
  ).run(
    crypto.randomUUID(),
    data.name,
    data.description,
    data.cost,
    data.buck_type,
    ts,
    ts
  );

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
  const db = getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }
  if (data.cost !== undefined) {
    fields.push("cost = ?");
    values.push(data.cost);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(now());
  values.push(id);

  db.query(`UPDATE rewards SET ${fields.join(", ")} WHERE id = ?`).run(
    ...values
  );
  updateTag("rewards");
}

export async function deleteReward(id: string) {
  const db = getDb();
  db.query("DELETE FROM rewards WHERE id = ?").run(id);
  updateTag("rewards");
}

export async function redeemReward(id: string) {
  const db = getDb();

  const reward = db
    .query("SELECT * FROM rewards WHERE id = ?")
    .get(id) as (import("@/lib/types").Reward & { cost: number }) | undefined;
  if (!reward || reward.status === "redeemed") return;

  const column =
    reward.buck_type === "akash" ? "akash_bucks" : "achini_bucks";
  const state = db
    .query(`SELECT ${column} FROM game_state WHERE id = 1`)
    .get() as Record<string, number> | undefined;
  if ((state?.[column] ?? 0) < reward.cost) return;

  const ts = now();

  db.transaction(() => {
    db.query(
      `UPDATE game_state SET ${column} = ${column} - ?, updated_at = ? WHERE id = 1`
    ).run(reward.cost, ts);
    db.query(
      "UPDATE rewards SET status = 'redeemed', redeemed_at = ?, updated_at = ? WHERE id = ?"
    ).run(ts, ts, id);
    db.query(
      "INSERT INTO transactions (id, buck_type, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(
      crypto.randomUUID(),
      reward.buck_type,
      -reward.cost,
      `Redeemed: ${reward.name}`,
      ts
    );
  })();

  updateTag("game-state");
  updateTag("transactions");
  updateTag("rewards");
}
