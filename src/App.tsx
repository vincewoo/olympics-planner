import { useState, useMemo } from 'react'
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
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const { watchlistIds, toggle } = useWatchlist()

  const allSports = useMemo(
    () => [...new Set(allEvents.map(e => e.sport))].sort(),
    []
  )
  const allZones = useMemo(
    () => [...new Set(allEvents.map(e => e.zone))].sort(),
    []
  )

  const filteredEvents = useFilteredEvents(allEvents, selectedSports, selectedZones, medalOnly, startDate, endDate)

  function toggleSport(sport: string) {
    setSelectedSports(prev => {
      const next = new Set(prev)
      next.has(sport) ? next.delete(sport) : next.add(sport)
      return next
    })
  }

  function toggleZone(zone: string) {
    setSelectedZones(prev => {
      const next = new Set(prev)
      next.has(zone) ? next.delete(zone) : next.add(zone)
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
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
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
        {/* Sidebar — hide on watchlist tab */}
        {activeTab !== 'watchlist' && (
          <FilterPanel
            allEvents={allEvents}
            allSports={allSports}
            allZones={allZones}
            selectedSports={selectedSports}
            selectedZones={selectedZones}
            medalOnly={medalOnly}
            startDate={startDate}
            endDate={endDate}
            onToggleSport={toggleSport}
            onToggleZone={toggleZone}
            onToggleMedalOnly={() => setMedalOnly(v => !v)}
            onSelectDate={selectDate}
            onClearDates={() => { setStartDate(null); setEndDate(null) }}
            onClearAll={clearAll}
          />
        )}

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
            />
          )}
        </main>
      </div>
    </div>
  )
}
