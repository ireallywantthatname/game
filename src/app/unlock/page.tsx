import type { Metadata } from "next";
import { PasswordGate } from "@/components/PasswordGate";

export const metadata: Metadata = {
  title: "Access — GAME",
};

export default function UnlockPage() {
  return <PasswordGate />;
}
