"use client";

import { useState } from "react";
import { deleteReward } from "@/app/actions";

export function DeleteRewardButton({ rewardId }: { rewardId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-gray-400 hover:text-black transition-colors underline"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="text-xs">
      <button
        onClick={async () => {
          await deleteReward(rewardId);
          setConfirming(false);
        }}
        className="text-red-600 font-bold hover:underline mr-1"
      >
        Yes
      </button>
      /
      <button
        onClick={() => setConfirming(false)}
        className="text-gray-400 hover:text-black ml-1"
      >
        No
      </button>
    </span>
  );
}
