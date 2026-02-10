'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import type { LiveConflictResponse } from '@/lib/api/types';

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useConflictPolling() {
  const setConflictData = useAppStore((s) => s.setConflictData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchConflicts() {
      try {
        const res = await fetch('/api/conflicts');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: LiveConflictResponse = await res.json();
        if (!cancelled && data.conflicts?.length > 0) {
          setConflictData(data.conflicts, data.source, data.lastFetched);
        }
      } catch (err) {
        // Keep existing data on error — never show empty state
        console.warn('[GEOSTRIKE] Polling fetch failed:', err);
      }
    }

    // Fetch on mount
    fetchConflicts();

    // Poll every 5 minutes
    intervalRef.current = setInterval(fetchConflicts, POLL_INTERVAL);

    // Refetch on window focus
    function onFocus() {
      fetchConflicts();
    }
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('focus', onFocus);
    };
  }, [setConflictData]);
}
