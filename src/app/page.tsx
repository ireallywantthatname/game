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
    <main
      id="main"
      className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-20 sm:pt-14 sm:pb-24 space-y-20"
    >
      <Header />

      <section aria-labelledby="balances-heading" className="space-y-8">
        <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-3">
          <h2
            id="balances-heading"
            className="text-2xl font-semibold tracking-tight text-balance"
          >
            Balances
          </h2>
          <p className="label-micro hidden sm:block pb-0.5">
            Live scoreboard
          </p>
        </div>
        <BalanceDisplay akashBucks={akashBucks} achiniBucks={achiniBucks} />
        <BalanceAdjuster />
      </section>

      <section aria-labelledby="activity-heading">
        <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-3 mb-6">
          <h2
            id="activity-heading"
            className="text-2xl font-semibold tracking-tight text-balance"
          >
            Activity log
          </h2>
          <p className="label-micro hidden sm:block pb-0.5">
            Latest {transactions.length || "—"}
          </p>
        </div>
        <TransactionLog transactions={transactions} />
      </section>

      <section aria-labelledby="rewards-heading">
        <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-3 mb-6">
          <h2
            id="rewards-heading"
            className="text-2xl font-semibold tracking-tight text-balance"
          >
            Rewards
          </h2>
          <p className="label-micro hidden sm:block pb-0.5">
            Earn · redeem
          </p>
        </div>
        <RewardList rewards={rewards} />
      </section>

      <footer className="border-t-2 border-black pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted">
        <p className="font-mono tracking-wide">GAME · private ledger</p>
        <p className="text-faint">Akash & Achini</p>
      </footer>
    </main>
  );
}
