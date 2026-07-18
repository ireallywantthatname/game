import type { Transaction } from "@/lib/types";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const isPositive = transaction.amount > 0;
  const sign = isPositive ? "+" : "";
  const label =
    transaction.buck_type === "akash" ? "Akash buck" : "Achini buck";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3.5 font-mono text-sm group hover:bg-paper/60 transition-colors">
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {label}
          </span>
          <span className="hidden sm:inline text-gray-300" aria-hidden>
            ·
          </span>
          <time
            dateTime={transaction.created_at}
            className="text-[0.65rem] text-faint tabular"
          >
            {formatWhen(transaction.created_at)}
          </time>
        </div>
        <p className="text-sm font-sans text-ink truncate sm:whitespace-normal">
          {transaction.reason}
        </p>
      </div>
      <span
        className={`shrink-0 font-bold tabular text-base sm:text-sm ${
          isPositive ? "text-gain" : "text-loss"
        }`}
      >
        {sign}
        {transaction.amount}
      </span>
    </div>
  );
}
