'use client';

import { useAppStore } from '@/lib/store';
import { useConflicts } from '@/hooks/useConflicts';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import ConflictList from './ConflictList';

export default function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const { conflicts } = useConflicts();

  return (
    <>
      <div
        className="fixed top-[52px] left-0 bottom-10 w-[370px] z-[900] bg-[rgba(10,10,18,0.92)] border-r border-bdr backdrop-blur-xl flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-370px)',
        }}
      >
        {/* Header */}
        <div className="px-[18px] pt-4 pb-3 border-b border-bdr">
          <div className="font-display text-[10px] font-semibold tracking-[3px] uppercase text-txt-dim mb-2.5">
            Conflict Intelligence
          </div>
          <SearchBar />
        </div>

        {/* Filter tabs */}
        <div className="px-[18px] pt-2.5">
          <FilterTabs />
        </div>

        {/* Conflict list */}
        <ConflictList conflicts={conflicts} />
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-[901] w-[30px] h-[30px] top-[62px] border border-bdr-light rounded-r-lg bg-[rgba(10,10,18,0.92)] text-txt-dim cursor-pointer flex items-center justify-center text-xs transition-all duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)] hover:text-accent-cyan hover:border-accent-cyan/50"
        style={{ left: sidebarOpen ? 370 : 0 }}
      >
        {sidebarOpen ? '\u25C2' : '\u25B8'}
      </button>
    </>
  );
}
