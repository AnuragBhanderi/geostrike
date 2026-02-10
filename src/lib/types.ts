export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ConflictParty {
  name: string;
  flag: string;
  countryCode: string;
  coordinates: Coordinates;
  role: 'aggressor' | 'target' | 'ally' | 'supporter';
}

export interface ConflictStats {
  casualties: string;
  displaced: string;
  severityIndex: number;
}

export interface TimelineEvent {
  date: string;
  description: string;
}

export interface Conflict {
  id: string;
  title: string;
  description: string;
  type: string;
  tag: 'war' | 'tension' | 'cyber';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'ceasefire' | 'frozen' | 'resolved';
  aggressor: ConflictParty;
  target: ConflictParty;
  allies: ConflictParty[];
  stats: ConflictStats;
  timeline: TimelineEvent[];
  startDate: string;
  lastUpdated: string;
  sources: string[];
}

export type ConflictFilter = 'all' | 'war' | 'tension' | 'cyber';
