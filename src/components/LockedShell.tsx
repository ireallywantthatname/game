import { Header } from "./Header";

/**
 * Empty ledger chrome shown while locked — structure only, no data.
 * Inert so focus stays in the access overlay.
 */
export function LockedShell() {
  return (
    <main
      id="main"
      className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-20 sm:pt-14 sm:pb-24 space-y-20"
      inert
      aria-hidden="true"
    >
      <Header />

      <section className="space-y-8" aria-hidden>
        <h2 className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3">
          Balances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <EmptyBalanceCard label="Akash bucks" subtitle="Achini's balance" />
          <EmptyBalanceCard label="Achini bucks" subtitle="Akash's balance" />
        </div>
      </section>

      <section aria-hidden>
        <h2 className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3 mb-6">
          Activity log
        </h2>
        <div className="panel-flat px-6 py-14">
          <p className="font-mono text-sm text-faint tracking-widest text-center">
            ———
          </p>
        </div>
      </section>

      <section aria-hidden>
        <h2 className="text-2xl font-semibold tracking-tight border-b-2 border-ink pb-3 mb-6">
          Rewards
        </h2>
        <div className="panel-flat px-6 py-14">
          <p className="font-mono text-sm text-faint tracking-widest text-center">
            ———
          </p>
        </div>
      </section>
    </main>
  );
}

function EmptyBalanceCard({
  label,
  subtitle,
}: {
  label: string;
  subtitle: string;
}) {
  return (
    <div className="panel p-6 sm:p-7">
      <p className="label-micro">{subtitle}</p>
      <p className="font-mono text-6xl sm:text-7xl font-bold tracking-tight mt-3 tabular leading-none text-faint">
        —
      </p>
      <p className="mt-3 text-sm font-medium tracking-wide text-gray-700">
        {label}
      </p>
    </div>
  );
}
