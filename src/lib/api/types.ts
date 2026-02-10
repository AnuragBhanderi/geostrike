// Raw UCDP GED event from the candidate events API
export interface UCDPEvent {
  id: number;
  relid: string;
  year: number;
  active_year: number;
  type_of_violence: number; // 1=state-based, 2=non-state, 3=one-sided
  conflict_new_id: number;
  dyad_new_id: number;
  side_a: string;
  side_b: string;
  number_of_sources: number;
  source_article: string;
  source_office: string;
  source_date: string;
  source_headline: string;
  source_original: string;
  where_prec: number;
  where_coordinates: string;
  where_description: string;
  adm_1: string;
  adm_2: string;
  latitude: number;
  longitude: number;
  geom_wkt: string;
  priogrid_gid: number;
  country: string;
  country_id: number; // Gleditsch-Ward number
  region: string;
  event_clarity: number;
  date_prec: number;
  date_start: string;
  date_end: string;
  deaths_a: number;
  deaths_b: number;
  deaths_civilians: number;
  deaths_unknown: number;
  best: number; // best estimate of total deaths
  high: number;
  low: number;
}

// UCDP Armed Conflict (PRIO)
export interface UCDPConflict {
  conflict_id: number;
  location: string;
  side_a: string;
  side_b: string;
  incompatibility: number; // 1=territory, 2=government, 3=both
  territory_name: string;
  year: number;
  intensity_level: number; // 1=minor (25-999 deaths), 2=war (1000+)
  cumulative_intensity: number;
  type_of_conflict: number; // 1=extrasystemic, 2=interstate, 3=intrastate, 4=internationalized intrastate
  start_date: string;
  start_date2: string;
  ep_end: number;
  ep_end_date: string;
  gwno_a: number;
  gwno_a_2nd: string;
  gwno_b: number;
  gwno_b_2nd: string;
  gwno_loc: number;
  region: string;
  version: number;
}

// Paginated UCDP response wrapper
export interface UCDPResponse<T> {
  TotalCount: number;
  TotalPages: number;
  PreviousPageUrl: string;
  NextPageUrl: string;
  Result: T[];
}

// GDELT DOC API article result
export interface GDELTArticle {
  url: string;
  url_mobile: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

// GDELT DOC API response
export interface GDELTDocResponse {
  articles: GDELTArticle[];
}

// Our API route response
export interface LiveConflictResponse {
  conflicts: import('@/lib/types').Conflict[];
  source: 'live' | 'cache' | 'seed';
  lastFetched: string;
  eventCount?: number;
  conflictCount?: number;
}
