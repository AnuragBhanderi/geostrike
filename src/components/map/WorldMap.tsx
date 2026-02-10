'use client';

import { useEffect, useRef, useCallback, Fragment } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import type { Conflict } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import ConflictArc from './ConflictArc';
import PulseMarker from './PulseMarker';
import MapEvents from './MapEvents';

interface WorldMapProps {
  conflicts: Conflict[];
}

export default function WorldMap({ conflicts }: WorldMapProps) {
  const activeConflictId = useAppStore((s) => s.activeConflictId);
  const openDetail = useAppStore((s) => s.openDetail);
  const animFrameRef = useRef<number>(0);

  // Dash animation for arc lines
  useEffect(() => {
    const animate = () => {
      document
        .querySelectorAll<SVGPathElement>(
          '.leaflet-overlay-pane path[stroke-dasharray]'
        )
        .forEach((p) => {
          const node = p as SVGPathElement & { _do?: number };
          node._do = (node._do || 0) - 0.6;
          p.style.strokeDashoffset = node._do + 'px';
        });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      openDetail(id);
    },
    [openDetail]
  );

  return (
    <MapContainer
      center={[20, 15]}
      zoom={3}
      minZoom={2}
      maxZoom={10}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <ZoomControl position="bottomright" />
      <MapEvents />

      {conflicts.map((conflict) => {
        const isDimmed =
          activeConflictId !== null && activeConflictId !== conflict.id;

        return (
          <Fragment key={conflict.id}>
            <ConflictArc conflict={conflict} isDimmed={isDimmed} />
            <PulseMarker
              conflict={conflict}
              type="aggressor"
              isDimmed={isDimmed}
              onSelect={handleSelect}
            />
            <PulseMarker
              conflict={conflict}
              type="target"
              isDimmed={isDimmed}
              onSelect={handleSelect}
            />
          </Fragment>
        );
      })}
    </MapContainer>
  );
}
