# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Olympics Planner is a single-page web app for browsing and planning attendance at the LA 2028 Olympic Games. Users can filter events by sport and venue zone, view schedules in list or calendar format, and maintain a personal watchlist (persisted in localStorage).

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
│   ├── CalendarView/    # Day-by-day calendar with absolute-positioned event blocks
│   ├── EventCard/       # Individual event display card
│   ├── FilterPanel/     # Sidebar with sport & zone filters
│   ├── ListView/        # Chronological event list grouped by date
│   ├── Tabs/            # List / Calendar / Watchlist tab switcher
│   └── WatchlistPanel/  # Saved events view
├── data/
│   └── schedule.json    # Full LA 2028 Olympic schedule (~300KB)
├── hooks/
│   ├── useFilteredEvents.ts  # Filters events by selected sports/zones
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
}
```

## Configuration Notes

- **Base path**: Vite is configured with `base: '/olympics-planner/'` for GitHub Pages hosting
- **TypeScript**: Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`
- **Target**: ES2023
- **ESLint**: Uses flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins
