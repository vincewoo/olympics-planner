# 🏅 LA28 Olympic Games Planner

A web app to browse, filter, and plan your schedule for the **LA 2028 Olympic Games**. Save sessions to your watchlist and browse them in list format.

**[Live Demo →](https://vincewoo.github.io/olympics-planner/)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **Filter by Sport & Zone** — Sidebar filter panel with sport chips and venue zones grouped into SoCal and Other
- **Date Range Filter** — Mini calendar picker to narrow the schedule to a specific day or range
- **Weekends-Only Filter** — Quickly filter to weekend sessions only
- **Medal Events Toggle** — Show only Finals and Bronze-medal sessions
- **Canada Medal Watch** — Highlight events where Canada has medal potential with athlete-specific targeting; tier indicators via maple leaf opacity (🍁 Gold Favourite, 🍁 Medal Contender, 🍁 Dark Horse); hover for athlete names and event details
- **Venue Seat Maps** — Click any venue name (shown with a map pin icon) to open the official LA28 seating chart in a modal overlay
- **Ticket Pricing** — Color-coded price badges per event using the LA28 category color system (A–J); muted on event cards, vibrant in the seat map modal to match the legend
- **Session Code Badge** — Each event card displays the session code identifier
- **Schedule View** — Browse events chronologically, grouped by date
- **Watchlist** — Save events you're interested in (persisted in localStorage)
- **Watchlist Export/Import** — Share your saved watchlist across browsers via JSON data
- **Shareable Watchlist Links** — Generate a share link for your watchlist; recipients can browse your picks, import everything, or star individual events to add to their own watchlist
- **Mobile-Friendly Tooltips** — Accessible tooltips with smart positioning on touch devices
- **Responsive** — Works on desktop and mobile

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/olympics-planner/`.

### Other Commands

```bash
npm run build      # Type-check and build for production
npm run lint       # Run ESLint
npm run preview    # Preview the production build locally
```

## Deployment

The app auto-deploys to **GitHub Pages** on every push to `main` via the [deploy workflow](.github/workflows/deploy.yml).

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | React 19                    |
| Language  | TypeScript 5.9 (strict)     |
| Build     | Vite 8                      |
| Styling   | Tailwind CSS v4             |
| Icons     | lucide-react                |
| Hosting   | GitHub Pages                |

## Project Structure

```
src/
├── App.tsx              # Root component — layout & tab routing
├── components/          # UI components (folder-per-component)
│   ├── EventCard/       # Individual event card (price badges, seat map trigger)
│   ├── FilterPanel/     # Sport & zone filter sidebar, date picker, medal toggles
│   ├── ListView/        # Chronological list grouped by date
│   ├── SharedWatchlistView/  # Read-only view for shared watchlist links
│   ├── Tabs/            # Tab switcher (Schedule / Watchlist)
│   ├── Tooltip/         # Mobile-friendly tooltip with auto-flip placement
│   ├── VenueMapModal/   # Seat map modal with official LA28 image + price legend
│   └── WatchlistPanel/  # Saved events view with export/import/share link
├── data/
│   ├── schedule.json        # Full LA 2028 competition schedule (includes ticket prices)
│   ├── canadaMedalWatch.ts  # Canada medal-potential profiles by sport
│   └── venueMapData.ts      # Venue seat map registry + LA28 category color constants
├── hooks/               # Custom React hooks
├── types/               # TypeScript interfaces
└── utils/               # Date/time helpers
```

## License

This project is for personal/educational use. Olympic schedule data is sourced from the official LA 2028 competition schedule.
