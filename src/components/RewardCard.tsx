import type { Reward } from "@/lib/types";
import { RedeemButton } from "./RedeemButton";
import { DeleteRewardButton } from "./DeleteRewardButton";

export function RewardCard({
  reward,
  balance,
}: {
  reward: Reward;
  balance: number;
}) {
  const canRedeem = reward.status === "available" && balance >= reward.cost;
  const redeemed = reward.status === "redeemed";

  return (
    <article
      className={`panel-flat p-5 flex flex-col min-h-[9.5rem] ${
        redeemed ? "opacity-45" : "hover:bg-field-hover"
      }`}
    >
      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="min-w-0 space-y-1.5">
          <h3 className="font-semibold tracking-tight text-sm leading-snug text-balance">
            {reward.name}
          </h3>
          {reward.description ? (
            <p className="text-xs text-muted leading-relaxed">
              {reward.description}
            </p>
          ) : null}
          <p className="text-xs font-mono tabular pt-1">
            <span className="text-faint">Cost </span>
            <span className="font-bold">{reward.cost}</span>
            <span className="text-faint">
              {" "}
              buck{reward.cost !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
        {redeemed ? (
          <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] border-2 border-ink px-2 py-1 bg-white">
            Redeemed
          </span>
        ) : (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <RedeemButton rewardId={reward.id} canRedeem={canRedeem} />
            <DeleteRewardButton rewardId={reward.id} />
          </div>
        )}
      </div>
    </article>
  );
}
