interface Props {
  akashBucks: number;
  achiniBucks: number;
}

export function BalanceDisplay({ akashBucks, achiniBucks }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      <BalanceCard
        label="Akash bucks"
        subtitle="Achini's balance"
        amount={akashBucks}
      />
      <BalanceCard
        label="Achini bucks"
        subtitle="Akash's balance"
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
    <div className="panel p-6 sm:p-7 transition-transform duration-200 hover:-translate-y-0.5">
      <p className="label-micro">{subtitle}</p>
      <p className="font-mono text-6xl sm:text-7xl font-bold tracking-tight mt-3 tabular leading-none">
        {amount}
      </p>
      <p className="mt-3 text-sm font-medium tracking-wide text-gray-700">
        {label}
      </p>
    </div>
  );
}
