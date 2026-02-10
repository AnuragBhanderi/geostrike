import { create } from 'zustand';
import type { Conflict, ConflictFilter } from './types';
import { conflictsData } from '@/data/conflicts';

interface AppState {
  // UI state
  activeConflictId: string | null;
  filter: ConflictFilter;
  searchQuery: string;
  sidebarOpen: boolean;
  detailOpen: boolean;

  // Conflict data state
  conflicts: Conflict[];
  isLive: boolean;
  lastFetched: string | null;
  source: 'live' | 'cache' | 'seed';

  // Map reset
  mapResetTrigger: number;

  // UI actions
  setActiveConflict: (id: string | null) => void;
  setFilter: (f: ConflictFilter) => void;
  setSearch: (q: string) => void;
  toggleSidebar: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  triggerMapReset: () => void;

  // Data actions
  setConflictData: (conflicts: Conflict[], source: 'live' | 'cache' | 'seed', lastFetched: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeConflictId: null,
  filter: 'all',
  searchQuery: '',
  sidebarOpen: true,
  detailOpen: false,

  // Initialize with seed data for instant render
  conflicts: conflictsData,
  isLive: false,
  lastFetched: null,
  source: 'seed',

  mapResetTrigger: 0,

  setActiveConflict: (id) => set({ activeConflictId: id }),

  setFilter: (f) => set({ filter: f }),

  setSearch: (q) => set({ searchQuery: q }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openDetail: (id) =>
    set({ activeConflictId: id, detailOpen: true }),

  closeDetail: () =>
    set({ detailOpen: false, activeConflictId: null }),

  triggerMapReset: () =>
    set((state) => ({ mapResetTrigger: state.mapResetTrigger + 1 })),

  setConflictData: (conflicts, source, lastFetched) =>
    set({
      conflicts,
      source,
      lastFetched,
      isLive: source === 'live',
    }),
}));
