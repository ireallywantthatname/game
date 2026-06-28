import { getGameState, getTransactions, getRewards } from "@/lib/data";
import { Header } from "@/components/Header";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { BalanceAdjuster } from "@/components/BalanceAdjuster";
import { TransactionLog } from "@/components/TransactionLog";
import { RewardList } from "@/components/RewardList";

export default async function Page() {
  const state = await getGameState();
  const transactions = await getTransactions(15);
  const rewards = await getRewards();

  const akashBucks = state?.akash_bucks ?? 0;
  const achiniBucks = state?.achini_bucks ?? 0;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      <Header />

      <section>
        <BalanceDisplay akashBucks={akashBucks} achiniBucks={achiniBucks} />
        <div className="mt-8">
          <BalanceAdjuster />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">
          Activity Log
        </h2>
        <TransactionLog transactions={transactions} />
      </section>

      <section>
        <h2 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">
          Rewards
        </h2>
        <RewardList rewards={rewards} />
      </section>
    </main>
  );
}
