import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

export function useConflicts() {
  const conflicts = useAppStore((s) => s.conflicts);
  const filter = useAppStore((s) => s.filter);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const isLive = useAppStore((s) => s.isLive);
  const source = useAppStore((s) => s.source);

  const filtered = useMemo(() => {
    return conflicts.filter((c) => {
      const matchesFilter = filter === 'all' || c.tag === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.aggressor.name.toLowerCase().includes(q) ||
        c.target.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [conflicts, filter, searchQuery]);

  const stats = useMemo(() => {
    const wars = conflicts.filter((c) => c.tag === 'war').length;
    const tensions = conflicts.filter((c) => c.tag === 'tension').length;
    const cybers = conflicts.filter((c) => c.tag === 'cyber').length;
    const countries = new Set(
      conflicts.flatMap((c) => [c.aggressor.countryCode, c.target.countryCode])
    ).size;
    return { wars, tensions, cybers, total: conflicts.length, countries };
  }, [conflicts]);

  return { conflicts: filtered, allConflicts: conflicts, stats, isLive, source };
}
