"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { ACCESS_COOKIE, ACCESS_COOKIE_VALUE } from "@/lib/auth";

export type UnlockState = {
  error: string | null;
  /** Bumps on each failed attempt so the UI can re-shake. */
  attempt: number;
};

function getPasscode(): string {
  const passcode = process.env.PASSCODE;
  if (!passcode) {
    throw new Error("PASSCODE is not set");
  }
  return passcode;
}

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

  if (passcode !== getPasscode()) {
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

  // Re-render the page so data loads only after unlock
  refresh();

  return { error: null, attempt: prev.attempt };
}
