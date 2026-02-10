import type { Conflict, ConflictParty } from '@/lib/types';
import type { UCDPConflict, UCDPEvent } from './types';
import { GW_TO_COUNTRY } from './country-data';
import { conflictsData } from '@/data/conflicts';

// UCDP conflict_id → seed data id
const UCDP_TO_SEED: Record<number, string> = {
  13218: 'russia-ukraine',        // Russia - Ukraine
  234:   'israel-gaza',           // Israel - Palestine
  333:   'sudan-civil-war',       // Sudan: Government
  11354: 'myanmar-civil-war',     // Myanmar
  232:   'india-pakistan',         // India - Pakistan
  337:   'ethiopia-internal',     // Ethiopia: Government
  303:   'south-china-sea',       // Philippines/China (SCS)
  13690: 'eastern-congo',         // DR Congo (M23)
  332:   'yemen-red-sea',         // Yemen
  289:   'colombia-armed-groups', // Colombia FARC/ELN
  400:   'mexico-cartel-war',     // Mexico
  381:   'haiti-gang-crisis',     // Haiti
  418:   'afghanistan-taliban',   // Afghanistan: Taliban vs ISIS-K
  349:   'syria-civil-war',       // Syria
  327:   'somalia-alshabaab',     // Somalia
  339:   'sahel-jihadist',        // Mali/Sahel
  338:   'nigeria-boko-haram',    // Nigeria
};

// Strip "Government of " prefix from UCDP side names
function cleanSideName(raw: string): string {
  return raw
    .replace(/^Government of /i, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .trim();
}

// Determine tag from UCDP conflict type + intensity
function mapTag(c: UCDPConflict): 'war' | 'tension' | 'cyber' {
  if (c.intensity_level === 2) return 'war';
  if (c.type_of_conflict === 2) return 'tension'; // interstate
  if (c.intensity_level === 1 && c.type_of_conflict >= 3) return 'war';
  return 'tension';
}

// Determine severity from intensity + death count
function mapSeverity(
  c: UCDPConflict,
  totalDeaths: number,
  articleCount: number,
): { severity: 'critical' | 'high' | 'medium' | 'low'; severityIndex: number } {
  let index = 40; // base

  // Intensity-based
  if (c.intensity_level === 2) index += 35;
  else if (c.intensity_level === 1) index += 15;

  // Death-based boost
  if (totalDeaths > 10000) index += 20;
  else if (totalDeaths > 1000) index += 12;
  else if (totalDeaths > 100) index += 5;

  // GDELT media activity boost
  if (articleCount > 0) index += 5;

  index = Math.min(index, 99);

  let severity: 'critical' | 'high' | 'medium' | 'low';
  if (index >= 85) severity = 'critical';
  else if (index >= 60) severity = 'high';
  else if (index >= 35) severity = 'medium';
  else severity = 'low';

  return { severity, severityIndex: index };
}

// Build a party object from UCDP data + GW lookup
function buildParty(
  name: string,
  gwNo: number,
  role: ConflictParty['role'],
  eventCoords?: { lat: number; lng: number },
): ConflictParty {
  const country = GW_TO_COUNTRY[gwNo];
  const cleanName = cleanSideName(name);

  if (country) {
    return {
      name: cleanName || country.name,
      flag: country.flag,
      countryCode: country.iso,
      coordinates: eventCoords ?? { lat: country.lat, lng: country.lng },
      role,
    };
  }

  return {
    name: cleanName || 'Unknown',
    flag: '\u{1F3F3}\u{FE0F}',
    countryCode: 'XX',
    coordinates: eventCoords ?? { lat: 0, lng: 0 },
    role,
  };
}

// Compute event centroid for a given conflict
function eventCentroid(
  events: UCDPEvent[],
  conflictId: number,
  side: 'a' | 'b',
): { lat: number; lng: number } | undefined {
  const relevant = events.filter(
    (e) =>
      e.conflict_new_id === conflictId &&
      e.latitude !== 0 &&
      e.longitude !== 0,
  );
  if (relevant.length === 0) return undefined;

  // Use country_id to distinguish sides if possible
  const sumLat = relevant.reduce((s, e) => s + e.latitude, 0);
  const sumLng = relevant.reduce((s, e) => s + e.longitude, 0);
  const n = relevant.length;

  // Offset slightly for side_b so markers don't overlap
  const offset = side === 'b' ? 0.5 : 0;
  return { lat: sumLat / n + offset, lng: sumLng / n };
}

// Format number with commas
function formatNumber(n: number): string {
  if (n === 0) return 'N/A';
  return n.toLocaleString('en-US') + '+';
}

export function aggregateConflictData(
  ucdpConflicts: UCDPConflict[],
  ucdpEvents: UCDPEvent[],
  gdeltCounts: Record<string, number>,
): Conflict[] {
  // Index seed data by id
  const seedById = new Map(conflictsData.map((c) => [c.id, c]));
  const usedSeedIds = new Set<string>();

  // Deduplicate UCDP conflicts: keep only the latest year per conflict_id
  const latestByConflictId = new Map<number, UCDPConflict>();
  for (const uc of ucdpConflicts) {
    const existing = latestByConflictId.get(uc.conflict_id);
    if (!existing || uc.year > existing.year) {
      latestByConflictId.set(uc.conflict_id, uc);
    }
  }

  const liveConflicts: Conflict[] = [];

  for (const uc of latestByConflictId.values()) {
    const seedId = UCDP_TO_SEED[uc.conflict_id];
    const seed = seedId ? seedById.get(seedId) : undefined;
    if (seedId) usedSeedIds.add(seedId);

    // Aggregate deaths from events
    const conflictEvents = ucdpEvents.filter(
      (e) => e.conflict_new_id === uc.conflict_id,
    );
    const totalDeaths = conflictEvents.reduce((s, e) => s + e.best, 0);

    // Get GDELT article count (match by location name)
    const gdeltKey = uc.location || cleanSideName(uc.side_a);
    const articleCount = gdeltCounts[gdeltKey] ?? 0;

    // Coordinates from events
    const aggressorCoords = eventCentroid(ucdpEvents, uc.conflict_id, 'a');
    const targetCoords = eventCentroid(ucdpEvents, uc.conflict_id, 'b');

    // Build parties
    const aggressor = buildParty(uc.side_a, uc.gwno_a, 'aggressor', aggressorCoords);
    const target = buildParty(uc.side_b, uc.gwno_b || uc.gwno_loc, 'target', targetCoords);

    // If we have seed data, prefer its richer fields
    if (seed) {
      // Use seed coordinates if no events available
      if (!aggressorCoords) aggressor.coordinates = seed.aggressor.coordinates;
      if (!targetCoords) target.coordinates = seed.target.coordinates;

      // Use seed names if they're more descriptive
      if (seed.aggressor.name) aggressor.name = seed.aggressor.name;
      if (seed.target.name) target.name = seed.target.name;
      aggressor.flag = seed.aggressor.flag;
      target.flag = seed.target.flag;
      aggressor.countryCode = seed.aggressor.countryCode;
      target.countryCode = seed.target.countryCode;
    }

    const tag = seed?.tag ?? mapTag(uc);
    const { severity, severityIndex } = seed
      ? {
          severity: seed.severity,
          severityIndex: Math.max(
            seed.stats.severityIndex,
            totalDeaths > 0 ? Math.min(seed.stats.severityIndex + 5, 99) : 0,
          ),
        }
      : mapSeverity(uc, totalDeaths, articleCount);

    const conflict: Conflict = {
      id: seedId || `ucdp-${uc.conflict_id}`,
      title: seed?.title || `${cleanSideName(uc.side_a)} vs ${cleanSideName(uc.side_b)}`,
      description: seed?.description || `Armed conflict in ${uc.location}. ${uc.side_a} versus ${uc.side_b}.`,
      type: seed?.type || (uc.type_of_conflict === 2 ? 'Interstate Conflict' : 'Armed Conflict'),
      tag,
      severity,
      status: seed?.status ?? 'active',
      aggressor,
      target,
      allies: seed?.allies ?? [],
      stats: {
        casualties: totalDeaths > 0 ? formatNumber(totalDeaths) : (seed?.stats.casualties ?? 'N/A'),
        displaced: seed?.stats.displaced ?? 'N/A',
        severityIndex,
      },
      timeline: seed?.timeline ?? [
        {
          date: uc.start_date?.slice(0, 4) ?? String(uc.year),
          description: 'Conflict began',
        },
      ],
      startDate: seed?.startDate ?? uc.start_date ?? `${uc.year}-01-01`,
      lastUpdated: conflictEvents.length > 0
        ? conflictEvents.reduce((latest, e) =>
            e.date_end > latest ? e.date_end : latest,
          conflictEvents[0].date_end)
        : (seed?.lastUpdated ?? new Date().toISOString().slice(0, 10)),
      sources: seed?.sources ?? [],
    };

    liveConflicts.push(conflict);
  }

  // Add seed conflicts that weren't matched to any UCDP conflict
  for (const seed of conflictsData) {
    if (!usedSeedIds.has(seed.id)) {
      liveConflicts.push({ ...seed });
    }
  }

  // Sort by severityIndex descending
  liveConflicts.sort((a, b) => b.stats.severityIndex - a.stats.severityIndex);

  return liveConflicts;
}
