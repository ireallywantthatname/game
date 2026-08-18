import { isUnlocked } from "@/lib/auth";
import { getGameState, getTransactions, getRewards } from "@/lib/data";
import { Header } from "@/components/Header";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { BalanceAdjuster } from "@/components/BalanceAdjuster";
import { TransactionLog } from "@/components/TransactionLog";
import { RewardList } from "@/components/RewardList";
import { PasswordGate } from "@/components/PasswordGate";
import { LockedShell } from "@/components/LockedShell";
import { LedgerReveal } from "@/components/LedgerReveal";

export default async function Page() {
  const unlocked = await isUnlocked();

  // Locked: empty shell only — no DB reads. Overlay sits on top.
  if (!unlocked) {
    return (
      <>
        <LockedShell />
        <PasswordGate />
      </>
    );
  }

  // Unlocked: fetch ledger data, then ink it in.
  const state = await getGameState();
  const transactions = await getTransactions(15);
  const rewards = await getRewards();

  const akashBucks = state.akash_bucks;
  const achiniBucks = state.achini_bucks;

  return (
    <LedgerReveal>
      <main
        id="main"
        className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-20 sm:pt-14 sm:pb-24 space-y-20"
      >
        <Header />

        <section aria-labelledby="balances-heading" className="space-y-8">
          <h2
            id="balances-heading"
            className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3"
          >
            Balances
          </h2>
          <BalanceDisplay akashBucks={akashBucks} achiniBucks={achiniBucks} />
          <BalanceAdjuster />
        </section>

        <section aria-labelledby="activity-heading">
          <h2
            id="activity-heading"
            className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3 mb-6"
          >
            Activity log
          </h2>
          <TransactionLog transactions={transactions} />
        </section>

        <section aria-labelledby="rewards-heading">
          <h2
            id="rewards-heading"
            className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3 mb-6"
          >
            Rewards
          </h2>
          <RewardList
            rewards={rewards}
            akashBucks={akashBucks}
            achiniBucks={achiniBucks}
          />
        </section>
      </main>
    </LedgerReveal>
  );
}
