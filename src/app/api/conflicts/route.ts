import { NextResponse } from 'next/server';
import { getCached, setCache, TTL } from '@/lib/api/cache';
import { fetchUCDPConflicts, fetchUCDPCandidateEvents, fetchGDELTArticleCounts } from '@/lib/api/fetchers';
import { aggregateConflictData } from '@/lib/api/mapper';
import { conflictsData } from '@/data/conflicts';
import type { Conflict } from '@/lib/types';
import type { LiveConflictResponse } from '@/lib/api/types';

const MERGED_CACHE_KEY = 'merged-conflicts';

export async function GET() {
  // 1. Check merged cache first
  const cached = getCached<LiveConflictResponse>(MERGED_CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, source: 'cache' as const });
  }

  // 2. Fetch all sources in parallel (partial failure OK)
  const [conflictsResult, eventsResult, gdeltResult] = await Promise.allSettled([
    fetchUCDPConflicts(),
    fetchUCDPCandidateEvents(),
    fetchGDELTArticleCounts([
      'Ukraine Russia war',
      'Gaza Israel war',
      'Sudan civil war RSF',
      'Congo M23 Goma',
      'Myanmar civil war junta',
      'Ethiopia Amhara Fano',
      'Mexico cartel violence',
      'Yemen Houthi Red Sea',
      'Colombia FARC ELN',
      'Haiti gang crisis',
      'Afghanistan Taliban ISIS',
      'Syria HTS civil war',
      'Somalia Al-Shabaab',
      'Sahel Mali Burkina jihadist',
      'Nigeria Boko Haram ISWAP',
      'Taiwan strait China military',
      'North Korea missile nuclear',
      'South China Sea Philippines',
      'India Pakistan Kashmir',
      'Iran Israel shadow war',
      'US China cyber Volt Typhoon',
      'Russia NATO hybrid sabotage',
      'Ecuador armed conflict gang',
    ]),
  ]);

  const ucdpConflicts = conflictsResult.status === 'fulfilled' ? conflictsResult.value : [];
  const ucdpEvents = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
  const gdeltCounts = gdeltResult.status === 'fulfilled' ? gdeltResult.value : {};

  // 3. If ALL APIs failed, return seed data
  if (ucdpConflicts.length === 0 && ucdpEvents.length === 0) {
    const response: LiveConflictResponse = {
      conflicts: conflictsData,
      source: 'seed',
      lastFetched: new Date().toISOString(),
      eventCount: 0,
      conflictCount: conflictsData.length,
    };
    return NextResponse.json(response);
  }

  // 4. Aggregate and merge
  let conflicts: Conflict[];
  try {
    conflicts = aggregateConflictData(ucdpConflicts, ucdpEvents, gdeltCounts);
  } catch (err) {
    console.error('[GEOSTRIKE] Aggregation error:', err);
    return NextResponse.json({
      conflicts: conflictsData,
      source: 'seed',
      lastFetched: new Date().toISOString(),
      eventCount: 0,
      conflictCount: conflictsData.length,
    } satisfies LiveConflictResponse);
  }

  // 5. Cache and return
  const response: LiveConflictResponse = {
    conflicts,
    source: 'live',
    lastFetched: new Date().toISOString(),
    eventCount: ucdpEvents.length,
    conflictCount: conflicts.length,
  };

  setCache(MERGED_CACHE_KEY, response, TTL.MERGED);

  return NextResponse.json(response);
}
