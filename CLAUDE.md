# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Olympics Planner is a single-page web app for browsing and planning attendance at the LA 2028 Olympic Games. Users can filter events by sport, venue zone, date range, weekends-only, and medal-round type; optionally highlight Canada's medal contenders with athlete-specific event targeting; view schedules in list format; maintain a personal watchlist with export/import capabilities; view venue seat maps with ticket category pricing; and benefit from mobile-friendly tooltips. The app is fully responsive for mobile and desktop.

## Tech Stack

- **Framework**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Icons**: lucide-react
- **Deployment**: GitHub Pages (auto-deploy on push to `main` via `.github/workflows/deploy.yml`)

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with HMR
npm run build        # Type-check (tsc -b) then build for production
npm run lint         # Run ESLint
npm run preview      # Preview the production build locally
```

## Architecture

### Directory Structure

```
src/
├── App.tsx              # Root component — state management, layout, tab routing
├── main.tsx             # React entry point (StrictMode)
├── index.css            # Global styles + Tailwind import
├── App.css              # App-specific styles
├── components/          # UI components (folder-per-component)
│   ├── EventCard/       # Individual event display card (includes session code badge, price badges, seat map trigger)
│   ├── FilterPanel/     # Sidebar with sport & zone filters, date picker, medal toggles
│   │   └── DateRangeFilter.tsx  # Mini calendar for selecting a date range; includes weekends-only toggle
│   ├── ListView/        # Chronological event list grouped by date
│   ├── SharedWatchlistView/  # Read-only view for shared watchlist links (import all or cherry-pick)
│   ├── Tabs/            # Schedule / Watchlist / Shared Watchlist tab switcher
│   ├── Tooltip/         # Mobile-friendly tooltip component with auto-flip placement
│   ├── VenueMapModal/   # Modal overlay showing official LA28 seat map image + price legend
│   └── WatchlistPanel/  # Saved events view with export/import/share-link functionality
├── data/
│   ├── schedule.json        # Full LA 2028 Olympic schedule (~300KB); includes prices per event
│   ├── canadaMedalWatch.ts  # Canada medal-potential profiles by sport (gold/medal/watch tiers)
│   └── venueMapData.ts      # Venue seat map registry: maps venue+sport → LA28 image filename; CATEGORY_COLORS constant; getSeatMapUrl() helper
├── hooks/
│   ├── useFilteredEvents.ts  # Filters events by sport, zone, date range, medal type, Canada watch
│   └── useWatchlist.ts       # Watchlist state with localStorage persistence
├── types/
│   └── index.ts         # OlympicEvent interface
└── utils/
    ├── groupByDate.ts   # Groups events by date string
    └── timeUtils.ts     # Time parsing and formatting helpers
```

### Key Patterns

- **No router** — tab-based navigation managed by `activeTab` state in `App.tsx`
- **Components are folder-scoped** — each component lives in its own directory under `src/components/`
- **Data is static JSON** — `src/data/schedule.json` is imported directly, no API calls
- **Watchlist uses localStorage** — managed by the `useWatchlist` hook
- **Filters use Set-based state** — `selectedSports` and `selectedZones` are `Set<string>`
- **Zone grouping** — FilterPanel groups venue zones into "SoCal Venues" and "Other Venues" sections
- **Medal-only toggle** — `medalOnly` boolean in App state; filters to sessions where `sessionType` is `Final` or `Bronze`, including mixed sessions identified via `sessionDescription`
- **Date range filter** — `startDate`/`endDate` strings (`"2028-07-DD"`); `DateRangeFilter` renders a mini calendar with activity-density dots
- **Weekends-only filter** — `weekendsOnly` boolean in App state; filters to Saturday/Sunday sessions; timezone-safe date parsing to avoid off-by-one day errors
- **Canada Medal Watch** — `canadaMedalWatch` boolean filters to athlete-specific events in `src/data/canadaMedalWatch.ts` (not just by sport); each sport/athlete pairing includes keyword matching for precise event targeting; sport chips in the filter sidebar show a maple leaf (🍁) with opacity indicating tier (Gold=100%, Medal=66%, Dark Horse=33%) when enabled; hovering shows athlete names and event details via mobile-friendly tooltips
- **Watchlist Export/Import** — watchlist data (JSON) can be exported and imported via WatchlistPanel; enables cross-browser sharing and backup of saved events
- **Shareable Watchlist Links** — "Share Link" button in WatchlistPanel generates a URL with event IDs in the hash fragment (`#watchlist=ID1,ID2,...`); opening the link shows a `SharedWatchlistView` where recipients can browse shared events, import all at once, or star individual events to add them to their own watchlist; uses comma-separated raw IDs (not base64) since event IDs are ~5 chars; hash is parsed synchronously at module level (not in useEffect) to avoid lint violations with `react-hooks/set-state-in-effect`; `TabId` type includes `'shared-watchlist'` but the tab is not shown in the tab bar — it's only activated via URL hash
- **Mobile-Friendly Tooltips** — custom tooltip component auto-flips placement when clipped at screen edges; accessible on both hover (desktop) and tap (mobile); used for sport tier indicators and athlete/event details
- **Session code badge** — `EventCard` displays `sessionCode` as an identifier badge on each event card
- **Venue Seat Maps** — clicking a venue name (shown with a MapPin icon when available) opens `VenueMapModal` with the official LA28 seat map image fetched from `tickets.la28.org`; seat maps are keyed by exact venue + sport name pair in `src/data/venueMapData.ts`; `getSeatMapUrl(venue, sport)` returns the full external URL or `undefined`
- **Ticket Pricing** — `OlympicEvent.prices` is a `Record<string, number>` (e.g. `{ "A": 775, "B": 521 }`); price badges appear on `EventCard` using muted tints of the LA28 category colors; the modal footer shows the same badges in full vibrant color to match the seat map legend; categories sorted alphabetically (A → J)
- **LA28 Category Colors** — `CATEGORY_COLORS` in `venueMapData.ts` maps category letter (A–J) to `{ bg, dimBg, vibrantText, dimText }`; `bg` is the full LA28 brand color, `dimBg` is ~15% opacity for use on event cards
- **Responsive layout** — sidebar collapses on mobile; filter panel slides in as a sheet; Tabs component adapts for small screens

### OlympicEvent Type

```typescript
interface OlympicEvent {
  id: string;
  sessionCode: string;
  sport: string;
  venue: string;
  zone: string;
  date: string;            // "2028-07-16"
  gamesDay: number;
  sessionType: string;
  sessionDescription: string;
  startTime: string;       // "HH:MM"
  endTime: string;         // "HH:MM"
  prices?: Record<string, number>; // e.g. { "A": 514.72, "B": 279.07 } — Category A is most expensive
}
```

## Configuration Notes

- **Base path**: Vite is configured with `base: '/olympics-planner/'` for GitHub Pages hosting
- **TypeScript**: Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`
- **Target**: ES2023
- **ESLint**: Uses flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins
