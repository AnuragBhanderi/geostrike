'use client';

import { useEffect, useRef } from 'react';
import { Polyline } from 'react-leaflet';
import L from 'leaflet';
import type { Conflict } from '@/lib/types';
import { tagColor, tagDashArray, getArcPoints } from '@/lib/utils';

interface ConflictArcProps {
  conflict: Conflict;
  isDimmed: boolean;
}

export default function ConflictArc({ conflict, isDimmed }: ConflictArcProps) {
  const polylineRef = useRef<L.Polyline>(null);
  const glowRef = useRef<L.Polyline>(null);

  const start: [number, number] = [
    conflict.aggressor.coordinates.lat,
    conflict.aggressor.coordinates.lng,
  ];
  const end: [number, number] = [
    conflict.target.coordinates.lat,
    conflict.target.coordinates.lng,
  ];

  const arcPoints = getArcPoints(start, end, 50);
  const positions = arcPoints.map(([lat, lng]) => [lat, lng] as [number, number]);

  const color = tagColor(conflict.tag);
  const dashArray = tagDashArray(conflict.tag);
  const weight = conflict.severity === 'critical' ? 2.5 : 1.8;

  useEffect(() => {
    const polyline = polylineRef.current;
    const glow = glowRef.current;
    if (polyline) {
      const el = polyline.getElement() as HTMLElement | null;
      if (el) {
        el.style.opacity = isDimmed ? '0.08' : '0.7';
        el.style.transition = 'opacity 0.4s';
        el.setAttribute('stroke-dasharray', dashArray);
      }
    }
    if (glow) {
      const el = glow.getElement() as HTMLElement | null;
      if (el) {
        el.style.opacity = isDimmed ? '0.02' : '0.12';
        el.style.transition = 'opacity 0.4s';
      }
    }
  }, [isDimmed, dashArray]);

  return (
    <>
      {/* Glow line */}
      <Polyline
        ref={glowRef}
        positions={positions}
        pathOptions={{
          color,
          weight: weight + 4,
          opacity: 0.12,
          lineCap: 'round',
        }}
      />
      {/* Main arc */}
      <Polyline
        ref={polylineRef}
        positions={positions}
        pathOptions={{
          color,
          weight,
          opacity: 0.7,
          dashArray,
          lineCap: 'round',
        }}
      />
    </>
  );
}
