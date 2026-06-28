"use client";

import { useState } from "react";
import { redeemReward } from "@/app/actions";

export function RedeemButton({
  rewardId,
  canRedeem,
}: {
  rewardId: string;
  canRedeem: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!canRedeem) {
    return (
      <button
        disabled
        className="border-2 border-gray-300 px-3 py-1 text-xs uppercase text-gray-300
                   font-bold cursor-not-allowed"
      >
        Redeem
      </button>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="border-2 border-black px-3 py-1 text-xs uppercase font-bold
                   hover:bg-black hover:text-white transition-colors"
      >
        Redeem
      </button>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => setConfirming(false)}
        className="border-2 border-gray-500 px-3 py-1 text-xs uppercase text-gray-500
                   font-bold hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={async () => {
          await redeemReward(rewardId);
          setConfirming(false);
        }}
        className="border-2 border-black px-3 py-1 text-xs uppercase font-bold
                   bg-black text-white hover:bg-gray-800 transition-colors"
      >
        Confirm
      </button>
    </div>
  );
}
