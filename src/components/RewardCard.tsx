import type { Reward } from "@/lib/types";
import { getGameState } from "@/lib/data";
import { RedeemButton } from "./RedeemButton";
import { DeleteRewardButton } from "./DeleteRewardButton";

export async function RewardCard({ reward }: { reward: Reward }) {
  const state = await getGameState();
  const balance =
    reward.buck_type === "akash"
      ? (state?.akash_bucks ?? 0)
      : (state?.achini_bucks ?? 0);
  const canRedeem = reward.status === "available" && balance >= reward.cost;

  return (
    <div
      className={`border-2 border-black p-4 ${
        reward.status === "redeemed" ? "opacity-40" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold uppercase tracking-wide text-sm">
            {reward.name}
          </p>
          {reward.description && (
            <p className="text-xs text-gray-600 mt-1">{reward.description}</p>
          )}
          <p className="text-xs font-mono mt-2">
            Cost: <span className="font-bold">{reward.cost}</span> buck
            {reward.cost !== 1 ? "s" : ""}
          </p>
        </div>
        {reward.status === "redeemed" ? (
          <span className="text-xs uppercase tracking-widest font-bold border-2 border-black px-2 py-1">
            Redeemed
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            <RedeemButton rewardId={reward.id} canRedeem={canRedeem} />
            <DeleteRewardButton rewardId={reward.id} />
          </div>
        )}
      </div>
    </div>
  );
}
