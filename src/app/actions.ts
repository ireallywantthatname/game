"use server";

import { getDb } from "@/lib/db";
import { updateTag } from "next/cache";
import type { Reward } from "@/lib/types";

function now(): string {
  return new Date().toISOString();
}

export async function adjustBuck(
  buckType: "akash" | "achini",
  amount: number,
  reason: string
) {
  const db = await getDb();
  const column = buckType === "akash" ? "akash_bucks" : "achini_bucks";

  const result = await db.execute(
    `SELECT ${column} FROM game_state WHERE id = 1`
  );
  const current = Number(result.rows[0]?.[column] ?? 0);
  const newBalance = current + amount;
  if (newBalance < 0) return;

  const ts = now();

  const tx = await db.transaction("write");
  try {
    await tx.execute({
      sql: `UPDATE game_state SET ${column} = ?, updated_at = ? WHERE id = 1`,
      args: [newBalance, ts],
    });
    await tx.execute({
      sql: "INSERT INTO transactions (id, buck_type, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        buckType,
        amount,
        reason || "No reason given",
        ts,
      ],
    });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  updateTag("game-state");
  updateTag("transactions");
}

export async function createReward(data: {
  name: string;
  description: string;
  cost: number;
  buck_type: "akash" | "achini";
}) {
  const db = await getDb();
  const ts = now();

  await db.execute({
    sql: "INSERT INTO rewards (id, name, description, cost, buck_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'available', ?, ?)",
    args: [
      crypto.randomUUID(),
      data.name,
      data.description,
      data.cost,
      data.buck_type,
      ts,
      ts,
    ],
  });

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
  const db = await getDb();
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

  await db.execute({
    sql: `UPDATE rewards SET ${fields.join(", ")} WHERE id = ?`,
    args: values,
  });
  updateTag("rewards");
}

export async function deleteReward(id: string) {
  const db = await getDb();
  await db.execute({
    sql: "DELETE FROM rewards WHERE id = ?",
    args: [id],
  });
  updateTag("rewards");
}

export async function redeemReward(id: string) {
  const db = await getDb();

  const rewardResult = await db.execute({
    sql: "SELECT * FROM rewards WHERE id = ?",
    args: [id],
  });
  const rewardRow = rewardResult.rows[0];
  if (!rewardRow || rewardRow.status === "redeemed") return;

  const reward: Reward = {
    id: String(rewardRow.id),
    name: String(rewardRow.name),
    description: String(rewardRow.description),
    cost: Number(rewardRow.cost),
    buck_type: rewardRow.buck_type as Reward["buck_type"],
    status: rewardRow.status as Reward["status"],
    created_at: String(rewardRow.created_at),
    updated_at: String(rewardRow.updated_at),
    redeemed_at:
      rewardRow.redeemed_at == null ? null : String(rewardRow.redeemed_at),
  };

  const column =
    reward.buck_type === "akash" ? "akash_bucks" : "achini_bucks";
  const stateResult = await db.execute(
    `SELECT ${column} FROM game_state WHERE id = 1`
  );
  if (Number(stateResult.rows[0]?.[column] ?? 0) < reward.cost) return;

  const ts = now();

  const tx = await db.transaction("write");
  try {
    await tx.execute({
      sql: `UPDATE game_state SET ${column} = ${column} - ?, updated_at = ? WHERE id = 1`,
      args: [reward.cost, ts],
    });
    await tx.execute({
      sql: "UPDATE rewards SET status = 'redeemed', redeemed_at = ?, updated_at = ? WHERE id = ?",
      args: [ts, ts, id],
    });
    await tx.execute({
      sql: "INSERT INTO transactions (id, buck_type, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        reward.buck_type,
        -reward.cost,
        `Redeemed: ${reward.name}`,
        ts,
      ],
    });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  updateTag("game-state");
  updateTag("transactions");
  updateTag("rewards");
}
