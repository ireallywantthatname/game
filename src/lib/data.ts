import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import type { GameState, Transaction, Reward } from "@/lib/types";

export async function getGameState(): Promise<GameState> {
  return await fetchQuery(api.game.getState);
}

export async function getTransactions(limit = 20): Promise<Transaction[]> {
  return await fetchQuery(api.game.listTransactions, { limit });
}

export async function getRewards(): Promise<Reward[]> {
  return await fetchQuery(api.rewards.list);
}
