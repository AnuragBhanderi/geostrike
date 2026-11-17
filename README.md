# GEOSTRIKE

Global conflict intelligence web app. An interactive, dark-themed world map that tracks armed conflicts around the world, with animated arc lines between aggressor and target countries.

## What it shows

- Interactive world map (Leaflet, dark tiles) with pulsing markers at conflict hotspots
- Animated arcs between aggressor and target countries
- 12 tracked conflicts with severity scores, casualty and displacement stats, and event timelines
- Sidebar with live search and filters: All, War, Tension, Cyber
- Detail panel for each conflict: overview, stats, parties and allies, timeline
- Live aggregate stats in the top and bottom bars

## Tech stack

- Next.js 15 and React 19
- TypeScript
- Tailwind CSS
- Leaflet and react-leaflet for the map
- Zustand for state
- Framer Motion and Lucide icons

## Run locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

## Status and roadmap

Currently in MVP development, with static data from a TypeScript seed file.

- Phase 2: PostgreSQL and Prisma backend with REST APIs for conflicts and stats
- Phase 3: News feed integration, severity heatmap, escalation alerts, admin panel
- Phase 4: Live updates over WebSocket, 3D globe view, user watchlists
