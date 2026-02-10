'use client';

import { useAppStore } from '@/lib/store';
import type { ConflictFilter } from '@/lib/types';

const filters: { key: ConflictFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: '#00e5ff' },
  { key: 'war', label: 'War', color: '#ff2d55' },
  { key: 'tension', label: 'Tension', color: '#ffae00' },
  { key: 'cyber', label: 'Cyber', color: '#7b61ff' },
];

export default function FilterTabs() {
  const filter = useAppStore((s) => s.filter);
  const setFilter = useAppStore((s) => s.setFilter);

  return (
    <div className="flex gap-[5px] flex-wrap">
      {filters.map((f) => {
        const isActive = filter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-[11px] py-1 rounded-full text-[9px] font-mono tracking-[1px] uppercase cursor-pointer transition-all duration-200"
            style={{
              border: `1px solid ${isActive ? f.color : 'rgba(255,255,255,0.06)'}`,
              background: isActive ? `${f.color}1e` : 'transparent',
              color: isActive ? f.color : '#555568',
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
