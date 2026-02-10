'use client';

import { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Conflict } from '@/lib/types';
import { tagColor } from '@/lib/utils';

function createPulseIcon(color: string, size: number): L.DivIcon {
  const rgb =
    color === '#ff2d55'
      ? '255,45,85'
      : color === '#ffae00'
        ? '255,174,0'
        : '123,97,255';

  return L.divIcon({
    className: '',
    iconSize: [size * 4, size * 4],
    iconAnchor: [size * 2, size * 2],
    html: `<svg width="${size * 4}" height="${size * 4}" viewBox="0 0 ${size * 4} ${size * 4}">
      <circle class="pulse-ring" cx="${size * 2}" cy="${size * 2}" r="${size * 1.5}" fill="rgba(${rgb},0.12)"/>
      <circle class="pulse-ring" cx="${size * 2}" cy="${size * 2}" r="${size * 1.2}" fill="rgba(${rgb},0.06)" style="animation-delay:.6s"/>
      <circle cx="${size * 2}" cy="${size * 2}" r="${size * .5}" fill="rgba(${rgb},0.95)"/>
      <circle cx="${size * 2}" cy="${size * 2}" r="${size * .25}" fill="rgba(255,255,255,0.4)"/>
    </svg>`,
  });
}

interface PulseMarkerProps {
  conflict: Conflict;
  type: 'aggressor' | 'target';
  isDimmed: boolean;
  onSelect: (id: string) => void;
}

export default function PulseMarker({
  conflict,
  type,
  isDimmed,
  onSelect,
}: PulseMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);
  const party = type === 'aggressor' ? conflict.aggressor : conflict.target;
  const color = tagColor(conflict.tag);
  const size = conflict.severity === 'critical' ? 6 : 5;
  const icon = createPulseIcon(color, size);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const el = marker.getElement();
      if (el) {
        el.style.opacity = isDimmed ? '0.08' : '1';
        el.style.transition = 'opacity 0.4s';
      }
    }
  }, [isDimmed]);

  return (
    <Marker
      ref={markerRef}
      position={[party.coordinates.lat, party.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onSelect(conflict.id);
          const mid: [number, number] = [
            (conflict.aggressor.coordinates.lat + conflict.target.coordinates.lat) / 2,
            (conflict.aggressor.coordinates.lng + conflict.target.coordinates.lng) / 2,
          ];
          map.flyTo(mid, 5, { duration: 1.2 });
        },
      }}
    >
      <Popup>
        <div className="font-display text-sm font-semibold">
          {party.flag} {party.name}
        </div>
        <div className="font-mono text-[10px] text-txt-dim uppercase tracking-wider">
          {type === 'aggressor' ? 'Aggressor' : 'Target'} &bull; {conflict.type}
        </div>
      </Popup>
    </Marker>
  );
}
