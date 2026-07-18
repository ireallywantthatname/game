"use client";

import { useState, useTransition } from "react";
import { deleteReward } from "@/app/actions";

export function DeleteRewardButton({ rewardId }: { rewardId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-faint underline-offset-2 hover:text-ink hover:underline transition-colors"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="text-xs font-mono">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await deleteReward(rewardId);
            setConfirming(false);
          });
        }}
        className="font-semibold text-accent hover:underline disabled:opacity-50"
      >
        {pending ? "…" : "Yes"}
      </button>
      <span className="text-faint mx-0.5">/</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(false)}
        className="text-faint hover:text-ink transition-colors"
      >
        No
      </button>
    </span>
  );
}
