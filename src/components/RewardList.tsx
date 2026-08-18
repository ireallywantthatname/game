import type { Reward } from "@/lib/types";
import { RewardCard } from "./RewardCard";
import { RewardForm } from "./RewardForm";

export function RewardList({
  rewards,
  akashBucks,
  achiniBucks,
}: {
  rewards: Reward[];
  akashBucks: number;
  achiniBucks: number;
}) {
  const akashRewards = rewards.filter((r) => r.buck_type === "akash");
  const achiniRewards = rewards.filter((r) => r.buck_type === "achini");

  return (
    <div className="space-y-14">
      <RewardSection
        title="Akash buck rewards"
        subtitle="Achini redeems — Akash does something for Achini"
        rewards={akashRewards}
        buckType="akash"
        balance={akashBucks}
      />
      <RewardSection
        title="Achini buck rewards"
        subtitle="Akash redeems — Achini does something for Akash"
        rewards={achiniRewards}
        buckType="achini"
        balance={achiniBucks}
      />
    </div>
  );
}

function RewardSection({
  title,
  subtitle,
  rewards,
  buckType,
  balance,
}: {
  title: string;
  subtitle: string;
  rewards: Reward[];
  buckType: "akash" | "achini";
  balance: number;
}) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">{subtitle}</p>
      </div>
      {rewards.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 px-5 py-8 mb-4 text-center">
          <p className="text-sm text-muted">No rewards yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} balance={balance} />
          ))}
        </div>
      )}
      <RewardForm buckType={buckType} />
    </div>
  );
}
