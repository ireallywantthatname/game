"use client";

import { useState, useTransition } from "react";
import { adjustBuck } from "@/app/actions";

export function BalanceAdjuster() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      <PersonAdjuster
        title="Achini"
        buckType="akash"
        description="When she does something he enjoys (+1) — or the reverse (−1)"
      />
      <PersonAdjuster
        title="Akash"
        buckType="achini"
        description="When he does something she enjoys (+1) — or the reverse (−1)"
      />
    </div>
  );
}

function PersonAdjuster({
  title,
  buckType,
  description,
}: {
  title: string;
  buckType: "akash" | "achini";
  description: string;
}) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  const handleAdjust = (amount: number) => {
    startTransition(async () => {
      await adjustBuck(buckType, amount, reason || "No reason given");
      setReason("");
    });
  };

  return (
    <div className="panel-flat p-5 space-y-3">
      <div>
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
      </div>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason…"
        disabled={pending}
        className="field"
        aria-label={`Reason for ${title} adjustment`}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleAdjust(1)}
          disabled={pending}
          className="btn flex-1"
        >
          {pending ? "…" : "+1 buck"}
        </button>
        <button
          type="button"
          onClick={() => handleAdjust(-1)}
          disabled={pending}
          className="btn flex-1"
        >
          {pending ? "…" : "−1 buck"}
        </button>
      </div>
    </div>
  );
}
