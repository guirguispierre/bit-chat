"use client";

export function PerformanceBar({ tokensPerSecond }: { tokensPerSecond: number }) {
  if (!tokensPerSecond || tokensPerSecond <= 0) {
    return null;
  }

  return (
    <div className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 md:inline-flex">
      <span className="mr-1">⚡</span>
      <span className="font-mono">{tokensPerSecond.toFixed(1)}</span>
      <span className="ml-1">tok/s</span>
    </div>
  );
}
