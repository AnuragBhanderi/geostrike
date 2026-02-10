# GEOSTRIKE — Implementation Handoff

## Overview

GEOSTRIKE is a global conflict intelligence web app. An interactive dark-themed world map shows armed conflicts with animated arc lines between aggressor and target countries. See `CLAUDE.md` for tech stack, project structure, design system, and implementation rules. See `geostrike-prototype.jsx` for the working React prototype to use as visual reference.

This document covers: data model, seed data, database schema, feature roadmap, and UI behavior specs.

---

## 1. DATA MODEL

File: `src/lib/types.ts`

```typescript
export interface Coordinates { lat: number; lng: number; }

export interface ConflictParty {
  name: string;
  flag: string;           // Emoji flag
  countryCode: string;    // ISO 3166
  coordinates: Coordinates;
  role: 'aggressor' | 'target' | 'ally' | 'supporter';
}

export interface ConflictStats {
  casualties: string;
  displaced: string;
  severityIndex: number;  // 0–100
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

export interface AppState {
  activeConflictId: string | null;
  filter: ConflictFilter;
  searchQuery: string;
  sidebarOpen: boolean;
  detailOpen: boolean;
  setActiveConflict: (id: string | null) => void;
  setFilter: (f: ConflictFilter) => void;
  setSearch: (q: string) => void;
  toggleSidebar: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
}
```

---

## 2. SEED DATA (12 Conflicts)

File: `src/data/conflicts.ts` — Export as `conflictsData: Conflict[]`

| ID | Title | Tag | Severity | Aggressor (lat,lng) | Target (lat,lng) | Sev Index |
|----|-------|-----|----------|--------------------|--------------------|-----------|
| russia-ukraine | Russian Invasion of Ukraine | war | critical | Russia (55.75, 37.62) | Ukraine (48.38, 31.17) | 95 |
| israel-gaza | Israel–Gaza War | war | critical | Israel (31.77, 35.22) | Palestine Gaza (31.35, 34.31) | 93 |
| sudan-civil-war | Sudanese Civil War | war | critical | RSF (13.19, 30.22) | Sudan SAF (15.59, 32.53) | 90 |
| china-taiwan | China–Taiwan Strait Crisis | tension | high | China (26.07, 119.30) | Taiwan (23.70, 120.96) | 72 |
| korea-tensions | Korean Peninsula Tensions | tension | high | North Korea (39.04, 125.76) | South Korea (35.91, 127.77) | 65 |
| myanmar-civil-war | Myanmar Civil War | war | high | Junta (19.76, 96.07) | Resistance (21.97, 96.08) | 82 |
| india-pakistan | India–Pakistan Tensions | tension | medium | India (28.61, 77.21) | Pakistan (33.69, 73.04) | 55 |
| ethiopia-internal | Ethiopia Internal Conflicts | war | high | Fano/OLA (9.03, 38.75) | Ethiopia Fed (7.50, 39.50) | 78 |
| iran-israel | Iran–Israel Shadow War | cyber | high | Iran (35.69, 51.39) | Israel (32.09, 34.78) | 70 |
| south-china-sea | South China Sea Disputes | tension | high | China (16.00, 112.00) | Philippines (14.60, 120.98) | 60 |
| eastern-congo | Eastern Congo Crisis | war | critical | M23/Rwanda (-1.94, 29.87) | DR Congo (-1.68, 29.23) | 87 |
| yemen-red-sea | Yemen / Red Sea Crisis | cyber | high | Houthis (15.37, 44.19) | Red Sea (12.80, 43.15) | 75 |

**Full seed data with descriptions, allies, and timelines is in the `geostrike-prototype.jsx` file** — extract from the `CONFLICTS` array at the top. Convert the short keys (`a`, `t`, `desc`, `tl`) to the full TypeScript interface format.

Key ally data per conflict:
- Russia-Ukraine: NATO (ally), Belarus (supporter)
- Israel-Gaza: Iran Axis (ally), US (ally)
- Sudan: Wagner Group (supporter)
- China-Taiwan: US (ally), Japan (ally)
- Korea: US (ally)
- Iran-Israel: Hezbollah (ally), Houthis (ally)
- South China Sea: US (ally)
- Eastern Congo: Uganda (supporter)
- Yemen: Iran (ally)

---

## 3. DATABASE SCHEMA (Phase 2)

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Conflict {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  type        String
  tag         String   // war | tension | cyber
  severity    String   // critical | high | medium | low
  status      String   @default("active")
  startDate   DateTime
  lastUpdated DateTime @updatedAt
  stats       Json     // { casualties, displaced, severityIndex }
  sources     String[]

  aggressorId String
  aggressor   Party    @relation("AggressorConflicts", fields: [aggressorId], references: [id])
  targetId    String
  target      Party    @relation("TargetConflicts", fields: [targetId], references: [id])

  allies      ConflictAlly[]
  events      ConflictEvent[]

  createdAt   DateTime @default(now())
}

model Party {
  id          String @id @default(cuid())
  name        String
  flag        String
  countryCode String @unique
  lat         Float
  lng         Float

  aggressorIn Conflict[]     @relation("AggressorConflicts")
  targetIn    Conflict[]     @relation("TargetConflicts")
  alliedIn    ConflictAlly[]
}

model ConflictAlly {
  id         String   @id @default(cuid())
  conflictId String
  conflict   Conflict @relation(fields: [conflictId], references: [id])
  partyId    String
  party      Party    @relation(fields: [partyId], references: [id])
  role       String   // ally | supporter
}

model ConflictEvent {
  id          String   @id @default(cuid())
  conflictId  String
  conflict    Conflict @relation(fields: [conflictId], references: [id])
  date        String
  description String
  sortOrder   Int
}
```

---

## 4. FEATURE ROADMAP

### Phase 1: MVP ✦ (Build This First)
- [ ] Next.js project + Tailwind dark theme config
- [ ] Leaflet map with CartoDB dark tiles (full viewport, dynamic import)
- [ ] Conflict arc lines (animated dashed bezier curves)
- [ ] Pulsing SVG markers at hotspots
- [ ] Map interactions: pan, zoom, fly-to on select
- [ ] Left sidebar: search, filter tabs (All/War/Tension/Cyber), conflict list
- [ ] Right detail panel: stats, parties, timeline, severity bar
- [ ] Top bar: logo, live stats, badge
- [ ] Bottom bar: aggregate numbers
- [ ] Map legend overlay
- [ ] Loading screen boot animation
- [ ] Layer dimming on conflict selection
- [ ] Sidebar collapse/expand with map resize
- [ ] Static data from TypeScript file

### Phase 2: Backend
- [ ] PostgreSQL + Prisma setup
- [ ] Seed database with 12 conflicts
- [ ] GET /api/conflicts (list, filter, search)
- [ ] GET /api/conflicts/[id] (detail)
- [ ] GET /api/stats (dashboard summary)

### Phase 3: Enhanced Features
- [ ] Country hover tooltips
- [ ] GeoJSON country boundary highlighting
- [ ] News feed integration (RSS/API)
- [ ] Severity heatmap overlay
- [ ] Escalation alert notifications
- [ ] Admin panel for conflict CRUD
- [ ] ACLED / UCDP data integration
- [ ] Mobile responsive (sidebar → bottom sheet)

### Phase 4: Advanced
- [ ] WebSocket live updates
- [ ] Historical timeline slider
- [ ] 3D globe view (Three.js / globe.gl)
- [ ] User accounts + watchlists
- [ ] PDF report export
- [ ] Embeddable widget

---

## 5. UI BEHAVIOR SPECS

### Sidebar (Left, 370px)
- Default: **open**
- Toggle: button on right edge slides it in/out
- On collapse: call `map.invalidateSize()` after 400ms
- Search: filters list in real-time by title, aggressor, target names
- Filter tabs: All (cyan active), War (red), Tension (amber), Cyber (purple)
- Click conflict: selects it (cyan left border + background), flies map to midpoint, opens detail

### Detail Panel (Right, 420px)
- Default: **closed** (translated off-screen right)
- Opens on conflict select, slides in from right
- Sections: Header → Overview → Stats (with severity bar) → Parties → Timeline
- Close button: slides out, resets active state, restores all layers

### Map
- Scroll wheel: zoom
- Click+drag: pan
- Click marker: select conflict + open popup
- On conflict select: fly to midpoint at zoom 5, dim all non-selected layers to opacity 0.08
- Reset button: fly to [lat:20, lng:15, zoom:3], close detail, restore layers

### Top Bar (52px, z:1000)
- Left: Logo mark (pulsing red dot) + "GEOSTRIKE" text
- Center: War count, Tension count, Cyber count, Total tracked
- Right: "LIVE INTEL" badge with pulsing dot

### Bottom Bar (40px, z:1000)
- Centered: Total conflicts, Countries involved, Total displaced, Status=LIVE

### Loading Screen
- Covers full viewport, z:10000
- Spinning ring (border-top red) + "Initializing GEOSTRIKE" flicker text
- Fades out after 1.2-1.5s

### Scanline Overlay
- Fixed, full viewport, z:9999, pointer-events:none
- `repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,.012) 3px 4px)`

---

## 6. CSS ANIMATIONS NEEDED

```css
/* In globals.css */

/* Pulse ring for markers */
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(3); opacity: 0; }
}
.pulse-ring { animation: pulse-ring 2s ease-out infinite; transform-origin: center; }

/* Loading spinner */
@keyframes spin { to { transform: rotate(360deg); } }

/* Loading text flicker */
@keyframes flicker { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Logo dot pulse */
@keyframes pulse-core {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.7); }
}

/* Leaflet overrides */
.leaflet-container { background: #07070d !important; }
.leaflet-control-zoom { border: none !important; }
.leaflet-control-zoom a {
  background: #0c0c15 !important;
  color: #e4e4f0 !important;
  border: 1px solid rgba(255,255,255,.1) !important;
  border-radius: 8px !important;
}
.leaflet-control-zoom a:hover {
  background: #13131f !important;
  border-color: #00e5ff !important;
  color: #00e5ff !important;
}
.leaflet-popup-content-wrapper {
  background: #0c0c15 !important;
  color: #e4e4f0 !important;
  border: 1px solid rgba(255,255,255,.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 16px 48px rgba(0,0,0,.7) !important;
}
.leaflet-popup-tip { background: #0c0c15 !important; }
```

---

## 7. GETTING STARTED

```bash
# Create project
npx create-next-app@latest geostrike --typescript --tailwind --app --src-dir
cd geostrike

# Install deps
npm install leaflet react-leaflet @types/leaflet zustand framer-motion lucide-react

# Copy these files into the project:
# - CLAUDE.md → project root
# - geostrike-prototype.jsx → reference (don't deploy, just read)

# Follow implementation order in CLAUDE.md section "Implementation Order"
npm run dev
```

---

*Reference the `geostrike-prototype.jsx` for exact visual appearance and the `CLAUDE.md` for all technical rules and design tokens.*
