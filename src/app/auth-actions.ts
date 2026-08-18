"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { ACCESS_COOKIE, ACCESS_COOKIE_VALUE } from "@/lib/auth";

export type UnlockState = {
  error: string | null;
  attempt: number;
};

export async function unlockApp(
  prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const passcode = String(formData.get("passcode") ?? "").trim();

  if (!passcode) {
    return {
      error: "Enter the access code.",
      attempt: prev.attempt + 1,
    };
  }

  const ok = await fetchQuery(api.auth.verifyPasscode, { passcode });
  if (!ok) {
    return {
      error: "Code not recognized. Try again.",
      attempt: prev.attempt + 1,
    };
  }

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, ACCESS_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  refresh();

  return { error: null, attempt: prev.attempt };
}
