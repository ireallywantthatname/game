import { cookies } from "next/headers";

/** Shared access cookie for the GAME ledger gate. */
export const ACCESS_COOKIE = "game_access";
export const ACCESS_COOKIE_VALUE = "open";

export async function isUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value === ACCESS_COOKIE_VALUE;
}
