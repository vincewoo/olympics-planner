import { useState, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import rawEvents from './data/schedule.json'
import type { OlympicEvent } from './types'
import { useWatchlist } from './hooks/useWatchlist'
import { useFilteredEvents } from './hooks/useFilteredEvents'
import { FilterPanel } from './components/FilterPanel/FilterPanel'
import { ListView } from './components/ListView/ListView'
import { CalendarView } from './components/CalendarView/CalendarView'
import { WatchlistPanel } from './components/WatchlistPanel/WatchlistPanel'
import { Tabs, type TabId } from './components/Tabs/Tabs'

const allEvents = rawEvents as OlympicEvent[]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('list')
  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set())
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set())
  const [medalOnly, setMedalOnly] = useState(false)
  const [canadaMedalWatch, setCanadaMedalWatch] = useState(false)
  const [weekendsOnly, setWeekendsOnly] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const { watchlistIds, toggle, replaceAll, addMany } = useWatchlist()

  const allSports = useMemo(
    () => [...new Set(allEvents.map(e => e.sport))].sort(),
    []
  )
  const allZones = useMemo(
    () => [...new Set(allEvents.map(e => e.zone))].sort(),
    []
  )

  const filteredEvents = useFilteredEvents(allEvents, selectedSports, selectedZones, medalOnly, canadaMedalWatch, startDate, endDate, weekendsOnly)

  const activeFilterCount = selectedSports.size + selectedZones.size + (medalOnly ? 1 : 0) + (canadaMedalWatch ? 1 : 0) + (weekendsOnly ? 1 : 0) + (startDate ? 1 : 0)

  function toggleSport(sport: string) {
    setSelectedSports(prev => {
      const next = new Set(prev)
      if (next.has(sport)) {
        next.delete(sport)
      } else {
        next.add(sport)
      }
      return next
    })
  }

  function toggleZone(zone: string) {
    setSelectedZones(prev => {
      const next = new Set(prev)
      if (next.has(zone)) {
        next.delete(zone)
      } else {
        next.add(zone)
      }
      return next
    })
  }

  function selectDate(date: string) {
    if (!startDate) {
      // Nothing selected → set start
      setStartDate(date)
      setEndDate(null)
    } else if (!endDate) {
      if (date === startDate) {
        // Clicking the same date → deselect
        setStartDate(null)
      } else {
        // Second click → create range
        const [s, e] = date < startDate ? [date, startDate] : [startDate, date]
        setStartDate(s)
        setEndDate(e)
      }
    } else {
      // Range exists → start fresh with clicked date
      setStartDate(date)
      setEndDate(null)
    }
  }

  function clearAll() {
    setSelectedSports(new Set())
    setSelectedZones(new Set())
    setMedalOnly(false)
    setCanadaMedalWatch(false)
    setWeekendsOnly(false)
    setStartDate(null)
    setEndDate(null)
  }

  const filterPanelElement = (
    <FilterPanel
      allEvents={allEvents}
      allSports={allSports}
      allZones={allZones}
      selectedSports={selectedSports}
      selectedZones={selectedZones}
      medalOnly={medalOnly}
      canadaMedalWatch={canadaMedalWatch}
      weekendsOnly={weekendsOnly}
      startDate={startDate}
      endDate={endDate}
      onToggleSport={toggleSport}
      onToggleZone={toggleZone}
      onToggleMedalOnly={() => setMedalOnly(v => !v)}
      onToggleCanadaMedalWatch={() => setCanadaMedalWatch(v => !v)}
      onToggleWeekendsOnly={() => setWeekendsOnly(v => !v)}
      onSelectDate={selectDate}
      onClearDates={() => { setStartDate(null); setEndDate(null) }}
      onClearAll={clearAll}
      onClose={() => setFilterOpen(false)}
    />
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile filter toggle — only on non-watchlist tabs */}
          {activeTab !== 'watchlist' && (
            <button
              onClick={() => setFilterOpen(true)}
              className="md:hidden relative p-2 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
          <span className="text-xl font-black tracking-tight">
            LA<span className="text-[#E63329]">28</span>
          </span>
          <span className="text-sm text-white/60 hidden sm:block">Olympic Games Planner</span>
        </div>
        <Tabs active={activeTab} onChange={setActiveTab} watchlistCount={watchlistIds.size} />
        <div className="text-xs text-white/40 hidden md:block">
          {filteredEvents.length} of {allEvents.length} sessions
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — hide on watchlist tab and mobile */}
        {activeTab !== 'watchlist' && (
          <div className="hidden md:block">
            {filterPanelElement}
          </div>
        )}

        {/* Mobile filter drawer */}
        <div
          className={`filter-backdrop md:hidden ${filterOpen ? 'open' : ''}`}
          onClick={() => setFilterOpen(false)}
        />
        <div className={`filter-drawer md:hidden ${filterOpen ? 'open' : ''}`}>
          {filterPanelElement}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'list' && (
            <ListView
              events={filteredEvents}
              watchlistIds={watchlistIds}
              onToggleWatch={toggle}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarView
              events={filteredEvents}
              watchlistIds={watchlistIds}
              onToggleWatch={toggle}
            />
          )}
          {activeTab === 'watchlist' && (
            <WatchlistPanel
              allEvents={allEvents}
              watchlistIds={watchlistIds}
              onToggleWatch={toggle}
              onReplaceWatchlist={replaceAll}
              onAddToWatchlist={addMany}
            />
          )}
        </main>
      </div>
    </div>
  )
}
