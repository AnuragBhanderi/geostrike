interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiry: Date.now() + ttlMs });
}

// TTL constants
export const TTL = {
  UCDP_CONFLICTS: 24 * 60 * 60 * 1000,  // 24 hours
  UCDP_EVENTS: 30 * 60 * 1000,           // 30 minutes
  GDELT: 15 * 60 * 1000,                  // 15 minutes
  MERGED: 30 * 60 * 1000,                 // 30 minutes
} as const;
