'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { useConflicts } from '@/hooks/useConflicts';
import { useConflictPolling } from '@/hooks/useConflictPolling';
import TopBar from '@/components/layout/TopBar';
import BottomBar from '@/components/layout/BottomBar';
import LoadingScreen from '@/components/layout/LoadingScreen';
import Sidebar from '@/components/sidebar/Sidebar';
import DetailPanel from '@/components/detail/DetailPanel';
import MapLegend from '@/components/map/MapLegend';

const WorldMap = dynamic(() => import('@/components/map/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bg flex items-center justify-center">
      <div className="font-mono text-[10px] text-txt-dim tracking-[3px] uppercase">
        Loading Map...
      </div>
    </div>
  ),
});

export default function Home() {
  useConflictPolling();
  const closeDetail = useAppStore((s) => s.closeDetail);
  const setActiveConflict = useAppStore((s) => s.setActiveConflict);
  const setFilter = useAppStore((s) => s.setFilter);
  const setSearch = useAppStore((s) => s.setSearch);
  const triggerMapReset = useAppStore((s) => s.triggerMapReset);
  const { conflicts } = useConflicts();

  const handleReset = () => {
    closeDetail();
    setActiveConflict(null);
    setFilter('all');
    setSearch('');
    triggerMapReset();
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-bg text-txt relative">
      <LoadingScreen />
      <TopBar />

      {/* Map */}
      <div className="fixed top-[52px] left-0 right-0 bottom-10 z-[1]">
        <WorldMap conflicts={conflicts} />
      </div>

      <Sidebar />
      <DetailPanel />
      <BottomBar />
      <MapLegend />

      {/* Reset Button — positioned left of Leaflet zoom controls */}
      <button
        onClick={handleReset}
        className="fixed bottom-[56px] right-[60px] z-[1100] px-3 py-[5px] rounded-lg border border-bdr bg-[rgba(10,10,18,0.92)] text-txt-dim cursor-pointer font-mono text-[9px] tracking-[1px] uppercase hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors"
      >
        &#x27F3; Reset
      </button>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />
    </div>
  );
}
