import type { Transaction } from "@/lib/types";

export function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const isPositive = transaction.amount > 0;
  const sign = isPositive ? "+" : "";

  return (
    <div className="flex items-center justify-between px-4 py-3 font-mono text-sm">
      <div>
        <span className="uppercase font-bold tracking-wider text-xs">
          {transaction.buck_type === "akash" ? "Akash Buck" : "Achini Buck"}
        </span>
        <span className="mx-2 text-gray-400">|</span>
        <span>{transaction.reason}</span>
      </div>
      <span className={isPositive ? "" : "text-gray-500"}>
        {sign}
        {transaction.amount}
      </span>
    </div>
  );
}
