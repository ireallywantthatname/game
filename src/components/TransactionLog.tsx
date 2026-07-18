import type { Transaction } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";

export function TransactionLog({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="panel-flat px-6 py-12 text-center">
        <p className="text-sm text-muted">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="panel-flat divide-y-2 divide-gray-200 overflow-hidden">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}
