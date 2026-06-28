interface Props {
  akashBucks: number;
  achiniBucks: number;
}

export function BalanceDisplay({ akashBucks, achiniBucks }: Props) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <BalanceCard
        label="Akash Bucks"
        subtitle="Achini's Balance"
        amount={akashBucks}
      />
      <BalanceCard
        label="Achini Bucks"
        subtitle="Akash's Balance"
        amount={achiniBucks}
      />
    </div>
  );
}

function BalanceCard({
  label,
  subtitle,
  amount,
}: {
  label: string;
  subtitle: string;
  amount: number;
}) {
  return (
    <div className="border-2 border-black p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        {subtitle}
      </p>
      <p className="text-6xl font-mono font-bold mt-2">{amount}</p>
      <p className="text-sm uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
