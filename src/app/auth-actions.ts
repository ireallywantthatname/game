"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, ACCESS_COOKIE_VALUE } from "@/lib/auth";

/** Household PIN — never imported by client modules. */
const ACCESS_PASSWORD = "102471";

export type UnlockState = {
  error: string | null;
  /** Bumps on each failed attempt so the UI can re-shake. */
  attempt: number;
};

export async function unlockApp(
  prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const password = String(formData.get("password") ?? "").trim();

  if (!password) {
    return {
      error: "Enter the access code.",
      attempt: prev.attempt + 1,
    };
  }

  if (password !== ACCESS_PASSWORD) {
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
    // 30 days — re-enter occasionally, not every visit
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}
