'use client';

import type { Conflict } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import ConflictItem from './ConflictItem';

interface ConflictListProps {
  conflicts: Conflict[];
}

export default function ConflictList({ conflicts }: ConflictListProps) {
  const activeConflictId = useAppStore((s) => s.activeConflictId);
  const openDetail = useAppStore((s) => s.openDetail);

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {conflicts.map((c) => (
        <ConflictItem
          key={c.id}
          conflict={c}
          isActive={activeConflictId === c.id}
          onClick={() => openDetail(c.id)}
        />
      ))}
      {conflicts.length === 0 && (
        <div className="p-[30px] text-center text-txt-dim text-xs">
          No conflicts found
        </div>
      )}
    </div>
  );
}
