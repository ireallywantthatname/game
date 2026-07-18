"use client";

import { useState, useTransition } from "react";
import { redeemReward } from "@/app/actions";

export function RedeemButton({
  rewardId,
  canRedeem,
}: {
  rewardId: string;
  canRedeem: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!canRedeem) {
    return (
      <button type="button" disabled className="btn">
        Redeem
      </button>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn"
      >
        Redeem
      </button>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={pending}
        className="btn btn-ghost"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await redeemReward(rewardId);
            setConfirming(false);
          });
        }}
        className="btn btn-primary"
      >
        {pending ? "…" : "Confirm"}
      </button>
    </div>
  );
}
