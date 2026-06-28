import type { Transaction } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";

export function TransactionLog({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-gray-500 uppercase tracking-widest py-8 text-center">
        No activity yet
      </p>
    );
  }

  return (
    <div className="divide-y-2 divide-gray-200 border-2 border-black">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}
