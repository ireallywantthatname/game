import type { Reward } from "@/lib/types";
import { RewardCard } from "./RewardCard";
import { RewardForm } from "./RewardForm";

export function RewardList({ rewards }: { rewards: Reward[] }) {
  const akashRewards = rewards.filter((r) => r.buck_type === "akash");
  const achiniRewards = rewards.filter((r) => r.buck_type === "achini");

  return (
    <div className="space-y-12">
      <RewardSection
        title="Akash Buck Rewards"
        subtitle="Achini redeems — Akash does something for Achini"
        rewards={akashRewards}
        buckType="akash"
      />
      <RewardSection
        title="Achini Buck Rewards"
        subtitle="Akash redeems — Achini does something for Akash"
        rewards={achiniRewards}
        buckType="achini"
      />
    </div>
  );
}

function RewardSection({
  title,
  subtitle,
  rewards,
  buckType,
}: {
  title: string;
  subtitle: string;
  rewards: Reward[];
  buckType: "akash" | "achini";
}) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
      <p className="text-xs text-gray-500 mt-1 mb-4">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>
      <div className="mt-4">
        <RewardForm buckType={buckType} />
      </div>
    </div>
  );
}
