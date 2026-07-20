"use client";

import type { ReactNode } from "react";

/**
 * Staggers an ink-in text animation over unlocked ledger content.
 * Pure CSS — children opt in via structure under .ledger-reveal.
 */
export function LedgerReveal({ children }: { children: ReactNode }) {
  return <div className="ledger-reveal">{children}</div>;
}
