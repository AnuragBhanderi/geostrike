'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useAppStore } from '@/lib/store';

const DEFAULT_CENTER: [number, number] = [20, 15];
const DEFAULT_ZOOM = 3;

export default function MapEvents() {
  const map = useMap();
  const activeConflictId = useAppStore((s) => s.activeConflictId);
  const conflicts = useAppStore((s) => s.conflicts);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const mapResetTrigger = useAppStore((s) => s.mapResetTrigger);
  const prevSidebarOpen = useRef(sidebarOpen);

  // Fly to conflict midpoint when selected
  useEffect(() => {
    if (activeConflictId) {
      const conflict = conflicts.find((c) => c.id === activeConflictId);
      if (conflict) {
        const midLat =
          (conflict.aggressor.coordinates.lat + conflict.target.coordinates.lat) / 2;
        const midLng =
          (conflict.aggressor.coordinates.lng + conflict.target.coordinates.lng) / 2;
        map.flyTo([midLat, midLng], 5, { duration: 1.2 });
      }
    }
  }, [activeConflictId, conflicts, map]);

  // Fly back to default view on reset
  useEffect(() => {
    if (mapResetTrigger > 0) {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
    }
  }, [mapResetTrigger, map]);

  // Invalidate map size when sidebar toggles
  useEffect(() => {
    if (prevSidebarOpen.current !== sidebarOpen) {
      prevSidebarOpen.current = sidebarOpen;
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, map]);

  return null;
}
