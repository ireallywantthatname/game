"use client";

import type { ReactNode } from "react";

/**
 * Brief fade-in for unlocked ledger content (see .ledger-reveal in CSS).
 */
export function LedgerReveal({ children }: { children: ReactNode }) {
  return <div className="ledger-reveal">{children}</div>;
}
