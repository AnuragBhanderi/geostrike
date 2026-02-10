import type { UCDPResponse, UCDPConflict, UCDPEvent } from './types';
import { getCached, setCache, TTL } from './cache';

const UCDP_BASE = process.env.UCDP_API_BASE || 'https://ucdpapi.pcr.uu.se/api';
const UCDP_CONFLICT_VERSION = process.env.UCDP_CONFLICT_VERSION || '24.1';
const UCDP_EVENTS_VERSION = process.env.UCDP_EVENTS_VERSION || '25.0.12';
const GDELT_BASE = process.env.GDELT_API_BASE || 'https://api.gdeltproject.org/api/v2/doc/doc';
const FETCH_TIMEOUT = Number(process.env.API_FETCH_TIMEOUT) || 15_000;

export async function fetchUCDPConflicts(): Promise<UCDPConflict[]> {
  const cacheKey = 'ucdp-conflicts';
  const cached = getCached<UCDPConflict[]>(cacheKey);
  if (cached) return cached;

  const url = `${UCDP_BASE}/ucdpprioconflict/${UCDP_CONFLICT_VERSION}?pagesize=100&page=0`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`UCDP conflicts: ${res.status}`);

  const data: UCDPResponse<UCDPConflict> = await res.json();
  const results = data.Result ?? [];
  setCache(cacheKey, results, TTL.UCDP_CONFLICTS);
  return results;
}

export async function fetchUCDPCandidateEvents(): Promise<UCDPEvent[]> {
  const cacheKey = 'ucdp-events';
  const cached = getCached<UCDPEvent[]>(cacheKey);
  if (cached) return cached;

  const url = `${UCDP_BASE}/gedevents/${UCDP_EVENTS_VERSION}?pagesize=1000&page=0`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`UCDP events: ${res.status}`);

  const data: UCDPResponse<UCDPEvent> = await res.json();
  const results = data.Result ?? [];
  setCache(cacheKey, results, TTL.UCDP_EVENTS);
  return results;
}

export async function fetchGDELTArticleCounts(
  queries: string[],
): Promise<Record<string, number>> {
  const cacheKey = 'gdelt-counts';
  const cached = getCached<Record<string, number>>(cacheKey);
  if (cached) return cached;

  const counts: Record<string, number> = {};

  // Fetch article counts for each query in parallel (batched)
  const fetches = queries.map(async (query) => {
    try {
      const params = new URLSearchParams({
        query: query,
        mode: 'artlist',
        maxrecords: '1',
        format: 'json',
        timespan: '7d',
      });
      const url = `${GDELT_BASE}?${params}`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) {
        counts[query] = 0;
        return;
      }
      const text = await res.text();
      // GDELT returns empty string or HTML when no results
      if (!text || text.startsWith('<')) {
        counts[query] = 0;
        return;
      }
      try {
        const data = JSON.parse(text);
        counts[query] = data.articles?.length ?? 0;
      } catch {
        counts[query] = 0;
      }
    } catch {
      counts[query] = 0;
    }
  });

  await Promise.allSettled(fetches);
  setCache(cacheKey, counts, TTL.GDELT);
  return counts;
}
