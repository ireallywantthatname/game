import type { Transaction } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";

export function TransactionLog({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="panel-flat px-6 py-12 text-center space-y-2">
        <p className="text-sm font-medium tracking-tight">No activity yet</p>
        <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
          Adjust a balance above to log the first moment. Reasons show up here.
        </p>
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
