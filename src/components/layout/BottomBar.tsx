'use client';

import { useConflicts } from '@/hooks/useConflicts';

export default function BottomBar() {
  const { stats } = useConflicts();

  const items: [string, string, string][] = [
    ['#ff2d55', 'Conflicts', String(stats.total)],
    ['#ffae00', 'Countries', String(stats.countries)],
    ['#7b61ff', 'Displaced', '38.2M'],
    ['#00e5ff', 'Status', 'LIVE'],
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 z-[1000] flex items-center justify-center gap-7 border-t border-bdr backdrop-blur-lg bg-gradient-to-t from-[rgba(7,7,13,0.97)] to-[rgba(7,7,13,0.85)] font-mono text-[9px]">
      {items.map(([col, label, val]) => (
        <div key={label} className="flex items-center gap-[5px]">
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: col }}
          />
          <span className="text-txt-dim uppercase tracking-[1px]">{label}</span>
          <span className="text-txt">{val}</span>
        </div>
      ))}
    </div>
  );
}
