# CLAUDE.md — GEOSTRIKE Project Instructions

## What Is This Project?

GEOSTRIKE is a real-time global conflict intelligence web application. It renders an interactive dark-themed world map showing armed conflicts, invasions, military tensions, and cyber operations with animated arc lines connecting aggressor → target countries.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Map**: Leaflet.js via `react-leaflet` — free, no API key
- **Tiles**: CartoDB Dark Matter — `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **Styling**: Tailwind CSS v3 with custom dark theme
- **State**: Zustand
- **Animations**: Framer Motion (panels), CSS (map elements)
- **Icons**: Lucide React
- **Database**: PostgreSQL + Prisma (Phase 2)
- **Fonts**: Chakra Petch (display), JetBrains Mono (data), Outfit (body)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Landing page — assembles all components
│   ├── globals.css             # Tailwind + custom CSS + animations
│   └── api/conflicts/route.ts  # API (Phase 2)
├── components/
│   ├── map/
│   │   ├── WorldMap.tsx        # Leaflet map (dynamic import, ssr:false)
│   │   ├── ConflictArc.tsx     # Animated dashed bezier arc
│   │   ├── PulseMarker.tsx     # Pulsing SVG divIcon marker
│   │   └── MapLegend.tsx       # Legend overlay
│   ├── sidebar/
│   │   ├── Sidebar.tsx         # Collapsible left panel
│   │   ├── SearchBar.tsx       # Search input
│   │   ├── FilterTabs.tsx      # All/War/Tension/Cyber buttons
│   │   ├── ConflictList.tsx    # Scrollable list
│   │   └── ConflictItem.tsx    # Single list row
│   ├── detail/
│   │   ├── DetailPanel.tsx     # Slide-in right panel
│   │   ├── StatRow.tsx         # Key/value stat line
│   │   ├── SeverityBar.tsx     # Animated fill bar
│   │   ├── PartyCard.tsx       # Flag + name + role badge
│   │   └── Timeline.tsx        # Vertical event timeline
│   └── layout/
│       ├── TopBar.tsx          # Fixed header — logo, stats, live badge
│       ├── BottomBar.tsx       # Fixed footer — summary stats
│       └── LoadingScreen.tsx   # Boot animation
├── data/
│   └── conflicts.ts            # Static seed data (12 conflicts)
├── lib/
│   ├── types.ts                # All TypeScript interfaces
│   ├── utils.ts                # Arc calculation, color maps, helpers
│   └── store.ts                # Zustand store
└── hooks/
    └── useConflicts.ts         # Data hook
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx prisma generate  # Generate Prisma client (Phase 2)
npx prisma db push   # Push schema to DB (Phase 2)
```

## Critical Implementation Rules

### Leaflet + Next.js SSR

Leaflet uses `window` which doesn't exist during SSR. ALWAYS dynamic import:

```tsx
import dynamic from 'next/dynamic';
const WorldMap = dynamic(() => import('@/components/map/WorldMap'), { ssr: false });
```

### Leaflet CSS Must Load Before JS

In `globals.css` or `layout.tsx`:
```css
@import 'leaflet/dist/leaflet.css';
```

### Map Container Must Have Height

```css
#map { position: fixed; inset: 0; top: 52px; bottom: 40px; }
```

### Dark Map Background

Prevent white flash:
```css
.leaflet-container { background: #07070d !important; }
```

### Map.invalidateSize After Layout Changes

When sidebar toggles, call `map.invalidateSize()` after animation (~400ms).

### Dash Animation

Leaflet polylines are SVG paths. Animate with setInterval:
```ts
setInterval(() => {
  document.querySelectorAll('.leaflet-overlay-pane path[stroke-dasharray]')
    .forEach(p => {
      p._do = (p._do || 0) - 0.6;
      p.style.strokeDashoffset = p._do + 'px';
    });
}, 40);
```

## Design System

### Colors (Tailwind Config)

```js
colors: {
  bg: { DEFAULT: '#07070d', 2: '#0d0d16', 3: '#13131f', 4: '#1a1a2a' },
  accent: {
    red: '#ff2d55',       // War, Critical, Aggressor
    amber: '#ffae00',     // Tension, High, Target
    cyan: '#00e5ff',      // Active states, Allies, UI
    purple: '#7b61ff',    // Cyber, Medium
  },
  txt: { DEFAULT: '#e4e4f0', mid: '#8888a0', dim: '#555568' },
  bdr: { DEFAULT: 'rgba(255,255,255,0.06)', light: 'rgba(255,255,255,0.1)' }
}
```

### Tag → Color Mapping

| Tag | Line Color | Dash Pattern | Marker |
|-----|-----------|-------------|---------|
| war | `#ff2d55` | `12 8` | Red glow |
| tension | `#ffae00` | `6 12` | Amber glow |
| cyber | `#7b61ff` | `4 8` | Purple glow |

### Severity → Visual

| Level | Dot Color | Glow | Bar Color |
|-------|-----------|------|-----------|
| critical | `#ff2d55` | Yes | `#ff2d55` |
| high | `#ffae00` | Yes | `#ffae00` |
| medium | `#7b61ff` | No | `#7b61ff` |

### Panel Dimensions

| Element | Size | Z-Index |
|---------|------|---------|
| TopBar | h:52px | 1000 |
| BottomBar | h:40px | 1000 |
| Sidebar | w:370px | 900 |
| DetailPanel | w:420px | 900 |
| Map | fill remaining | 1 |

## Arc Calculation Algorithm

```ts
function getArcPoints(start: [number,number], end: [number,number], n = 50) {
  const pts = [];
  const midLat = (start[0]+end[0])/2, midLng = (start[1]+end[1])/2;
  const d = Math.sqrt((end[0]-start[0])**2 + (end[1]-start[1])**2);
  const dx = end[1]-start[1], dy = -(end[0]-start[0]);
  const len = Math.sqrt(dx*dx+dy*dy) || 1;
  const off = Math.min(d*0.25, 15);
  const cLat = midLat + dy/len*off*0.3;
  const cLng = midLng + dx/len*off;
  for (let i = 0; i <= n; i++) {
    const t = i/n;
    pts.push([(1-t)*(1-t)*start[0]+2*(1-t)*t*cLat+t*t*end[0],
              (1-t)*(1-t)*start[1]+2*(1-t)*t*cLng+t*t*end[1]]);
  }
  return pts;
}
```

## Pulsing Marker DivIcon

```ts
function createPulseIcon(color: string, size: number): L.DivIcon {
  const rgb = color === 'red' ? '255,45,85' : color === 'amber' ? '255,174,0' : '123,97,255';
  return L.divIcon({
    className: '',
    iconSize: [size*4, size*4],
    iconAnchor: [size*2, size*2],
    html: `<svg width="${size*4}" height="${size*4}" viewBox="0 0 ${size*4} ${size*4}">
      <circle class="pulse-ring" cx="${size*2}" cy="${size*2}" r="${size*1.5}" fill="rgba(${rgb},0.12)"/>
      <circle class="pulse-ring" cx="${size*2}" cy="${size*2}" r="${size*1.2}" fill="rgba(${rgb},0.06)" style="animation-delay:.6s"/>
      <circle cx="${size*2}" cy="${size*2}" r="${size*.5}" fill="rgba(${rgb},0.95)"/>
      <circle cx="${size*2}" cy="${size*2}" r="${size*.25}" fill="rgba(255,255,255,0.4)"/>
    </svg>`
  });
}
```

## Implementation Order

1. `npx create-next-app@latest geostrike --typescript --tailwind --app --src-dir`
2. `npm install leaflet react-leaflet @types/leaflet zustand framer-motion lucide-react`
3. Tailwind config with full color system
4. `globals.css` — all animations, Leaflet overrides, scrollbar, scanline overlay
5. `layout.tsx` — Google Fonts, metadata
6. `lib/types.ts` — TypeScript interfaces
7. `data/conflicts.ts` — 12 seed conflicts (copy from GEOSTRIKE-HANDOFF.md)
8. `lib/store.ts` — Zustand store (activeId, filter, search, sidebarOpen, detailOpen)
9. `lib/utils.ts` — getArcPoints, tagColor, sevColor helpers
10. `components/layout/TopBar.tsx` + `BottomBar.tsx` + `LoadingScreen.tsx`
11. `components/map/WorldMap.tsx` — Leaflet init (DYNAMIC IMPORT, ssr:false)
12. `components/map/ConflictArc.tsx` + `PulseMarker.tsx` + `MapLegend.tsx`
13. `components/sidebar/*` — Sidebar, SearchBar, FilterTabs, ConflictList, ConflictItem
14. `components/detail/*` — DetailPanel, StatRow, SeverityBar, PartyCard, Timeline
15. `app/page.tsx` — assemble everything
16. Test, polish, responsive

## Reference Files

- **`geostrike-prototype.jsx`** — Full React prototype with all UI components, map rendering, interactions. Use as the visual reference target.
- **`GEOSTRIKE-HANDOFF.md`** — Complete spec: data model, DB schema, seed data, feature phases, behavior specs.

## What NOT To Do

- Don't use MapBox or Google Maps (paid API keys)
- Don't use Inter, Roboto, or Arial fonts
- Don't put Leaflet components in SSR-rendered code
- Don't hardcode colors — use design system
- Don't skip loading screen animation
- Don't forget `map.invalidateSize()` after sidebar toggle
- Don't use percentage-based widths for Leaflet containers
