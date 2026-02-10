'use client';

import { Search } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SearchBar() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearch = useAppStore((s) => s.setSearch);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-bg-2 border border-bdr rounded-[10px]">
      <Search size={14} className="text-txt-dim flex-shrink-0" />
      <input
        type="text"
        placeholder="Search conflicts..."
        value={searchQuery}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-txt font-body text-xs placeholder:text-txt-dim"
      />
    </div>
  );
}
