export function Header() {
  return (
    <header className="relative border-b-4 border-black pb-8 sm:pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-3">
          <p className="label-micro">Bucks · moments · rewards</p>
          <h1 className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] leading-none text-balance">
            GAME
          </h1>
        </div>
        <p className="max-w-[16rem] text-sm text-muted leading-relaxed sm:text-right sm:pb-1">
          Log what matters. Spend bucks on real rewards.
        </p>
      </div>
      <div
        className="absolute -bottom-1 left-0 h-1 w-16 bg-accent"
        aria-hidden
      />
    </header>
  );
}
