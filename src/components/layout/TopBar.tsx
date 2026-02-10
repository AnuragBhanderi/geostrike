'use client';

import { useConflicts } from '@/hooks/useConflicts';

export default function TopBar() {
  const { stats, source } = useConflicts();

  const items: [string, string, number | string][] = [
    ['#ff2d55', 'Wars', stats.wars],
    ['#ffae00', 'Tensions', stats.tensions],
    ['#7b61ff', 'Cyber', stats.cybers],
    ['#00e5ff', 'Tracked', stats.total],
  ];

  // Badge config based on data source
  const badge = {
    live: { color: '#00e553', borderColor: 'rgba(0,229,83,0.35)', label: 'Live Intel' },
    cache: { color: '#00e5ff', borderColor: 'rgba(0,229,255,0.35)', label: 'Cached' },
    seed: { color: '#ffae00', borderColor: 'rgba(255,174,0,0.35)', label: 'Seed Data' },
  }[source];

  return (
    <div className="fixed top-0 left-0 right-0 h-[52px] z-[1000] flex items-center justify-between px-5 border-b border-bdr backdrop-blur-xl bg-gradient-to-b from-[rgba(7,7,13,0.98)] to-[rgba(7,7,13,0.90)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 border-[1.5px] border-accent-red rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse-core" />
        </div>
        <div className="font-display text-[15px] font-bold tracking-[5px]">
          GEO<span className="text-accent-red">STRIKE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6">
        {items.map(([col, label, val]) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px]">
            <div
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: col, boxShadow: `0 0 6px ${col}40` }}
            />
            <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-txt-dim">
              {label}
            </span>
            <strong className="font-display text-[13px]">{val}</strong>
          </div>
        ))}
      </div>

      {/* Live Status Badge */}
      <div
        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border font-mono text-[9px] tracking-[2px] uppercase"
        style={{ borderColor: badge.borderColor, color: badge.color }}
      >
        <div
          className="w-[5px] h-[5px] rounded-full animate-pulse-core"
          style={{ background: badge.color }}
        />
        {badge.label}
      </div>
    </div>
  );
}
