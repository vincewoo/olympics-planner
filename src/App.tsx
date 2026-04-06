import { useState, useMemo } from 'react'
import { SlidersHorizontal, Columns2 } from 'lucide-react'
import rawEvents from './data/schedule.json'
import type { OlympicEvent } from './types'
import { useWatchlist } from './hooks/useWatchlist'
import { useFilteredEvents } from './hooks/useFilteredEvents'
import { FilterPanel } from './components/FilterPanel/FilterPanel'
import { ListView } from './components/ListView/ListView'
import { WatchlistPanel } from './components/WatchlistPanel/WatchlistPanel'
import { SharedWatchlistView } from './components/SharedWatchlistView/SharedWatchlistView'
import { Tabs, type TabId } from './components/Tabs/Tabs'

const allEvents = rawEvents as OlympicEvent[]
const allEventIds = new Set(allEvents.map(e => e.id))

function parseSharedWatchlist(): Set<string> | null {
  const hash = window.location.hash
  const prefix = '#watchlist='
  if (!hash.startsWith(prefix)) return null
  const ids = hash.slice(prefix.length).split(',').filter(id => allEventIds.has(id))
  return ids.length > 0 ? new Set(ids) : null
}

interface SharedFilters {
  sports: string[]
  zones: string[]
  medals: boolean
  canada: boolean
  weekends: boolean
  afternoon: boolean
  start: string | null
  end: string | null
}

function parseSharedFilters(): SharedFilters | null {
  const hash = window.location.hash
  const prefix = '#filters?'
  if (!hash.startsWith(prefix)) return null
  const params = new URLSearchParams(hash.slice(prefix.length))
  const sports = params.get('sports')?.split(',').filter(Boolean) ?? []
  const zones = params.get('zones')?.split(',').filter(Boolean) ?? []
  const medals = params.get('medals') === '1'
  const canada = params.get('canada') === '1'
  const weekends = params.get('weekends') === '1'
  const afternoon = params.get('afternoon') === '1'
  const start = params.get('start') || null
  const end = params.get('end') || null
  const hasAny = sports.length > 0 || zones.length > 0 || medals || canada || weekends || afternoon || start !== null
  return hasAny ? { sports, zones, medals, canada, weekends, afternoon, start, end } : null
}

const initialShared = parseSharedWatchlist()
const initialFilters = parseSharedFilters()

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(initialShared ? 'shared-watchlist' : 'list')
  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set(initialFilters?.sports ?? []))
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set(initialFilters?.zones ?? []))
  const [medalOnly, setMedalOnly] = useState(initialFilters?.medals ?? false)
  const [canadaMedalWatch, setCanadaMedalWatch] = useState(initialFilters?.canada ?? false)
  const [weekendsOnly, setWeekendsOnly] = useState(initialFilters?.weekends ?? false)
  const [afternoonOnly, setAfternoonOnly] = useState(initialFilters?.afternoon ?? false)
  const [startDate, setStartDate] = useState<string | null>(initialFilters?.start ?? null)
  const [endDate, setEndDate] = useState<string | null>(initialFilters?.end ?? null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [splitView, setSplitView] = useState(true)
  const [sharedIds, setSharedIds] = useState<Set<string> | null>(initialShared)
  const { watchlistIds, toggle, replaceAll, addMany } = useWatchlist()

  function exitSharedView() {
    setSharedIds(null)
    setActiveTab('list')
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  const allSports = useMemo(
    () => [...new Set(allEvents.map(e => e.sport))].sort(),
    []
  )
  const allZones = useMemo(
    () => [...new Set(allEvents.map(e => e.zone))].sort(),
    []
  )

  const filteredEvents = useFilteredEvents(allEvents, selectedSports, selectedZones, medalOnly, canadaMedalWatch, startDate, endDate, weekendsOnly, afternoonOnly)

  const activeFilterCount = selectedSports.size + selectedZones.size + (medalOnly ? 1 : 0) + (canadaMedalWatch ? 1 : 0) + (weekendsOnly ? 1 : 0) + (afternoonOnly ? 1 : 0) + (startDate ? 1 : 0)

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

  function shareFilters() {
    const params = new URLSearchParams()
    if (selectedSports.size > 0) params.set('sports', [...selectedSports].join(','))
    if (selectedZones.size > 0) params.set('zones', [...selectedZones].join(','))
    if (medalOnly) params.set('medals', '1')
    if (canadaMedalWatch) params.set('canada', '1')
    if (weekendsOnly) params.set('weekends', '1')
    if (afternoonOnly) params.set('afternoon', '1')
    if (startDate) params.set('start', startDate)
    if (endDate) params.set('end', endDate)
    const url = `${window.location.origin}${window.location.pathname}#filters?${params.toString()}`
    navigator.clipboard.writeText(url)
  }

  function clearAll() {
    setSelectedSports(new Set())
    setSelectedZones(new Set())
    setMedalOnly(false)
    setCanadaMedalWatch(false)
    setWeekendsOnly(false)
    setAfternoonOnly(false)
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
      afternoonOnly={afternoonOnly}
      startDate={startDate}
      endDate={endDate}
      onToggleSport={toggleSport}
      onToggleZone={toggleZone}
      onToggleMedalOnly={() => setMedalOnly(v => !v)}
      onToggleCanadaMedalWatch={() => setCanadaMedalWatch(v => !v)}
      onToggleWeekendsOnly={() => setWeekendsOnly(v => !v)}
      onToggleAfternoonOnly={() => setAfternoonOnly(v => !v)}
      onSelectDate={selectDate}
      onClearDates={() => { setStartDate(null); setEndDate(null) }}
      onClearAll={clearAll}
      onShareFilters={shareFilters}
      onClose={() => setFilterOpen(false)}
    />
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile filter toggle — only on schedule tab */}
          {activeTab === 'list' && (
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
        <div className={activeTab !== 'shared-watchlist' && splitView ? 'xl:hidden' : ''}>
          <Tabs active={activeTab} onChange={setActiveTab} watchlistCount={watchlistIds.size} />
        </div>
        <div className="flex items-center gap-2">
          {activeTab !== 'shared-watchlist' && (
            <button
              onClick={() => setSplitView(v => !v)}
              className={`hidden xl:flex items-center p-1.5 rounded-md transition-colors ${splitView ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              aria-label={splitView ? 'Switch to single panel' : 'Switch to split view'}
              title={splitView ? 'Switch to single panel' : 'Switch to split view'}
            >
              <Columns2 size={16} />
            </button>
          )}
          <div className="text-xs text-white/40 hidden md:block">
            {filteredEvents.length} of {allEvents.length} sessions
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — show on schedule tab (md+), or always on xl+ side-by-side */}
        {activeTab !== 'shared-watchlist' && (
          <div className={`hidden ${activeTab === 'list' ? 'md:block' : ''} ${splitView ? 'xl:block' : ''}`}>
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

        {/* Shared watchlist: always full width */}
        {activeTab === 'shared-watchlist' && sharedIds && (
          <main className="flex-1 overflow-auto">
            <SharedWatchlistView
              sharedIds={sharedIds}
              allEvents={allEvents}
              watchlistIds={watchlistIds}
              onToggleWatch={toggle}
              onAddToWatchlist={addMany}
              onBack={exitSharedView}
            />
          </main>
        )}

        {/* Non-shared: tab-based on <xl, side-by-side on xl+ */}
        {activeTab !== 'shared-watchlist' && (
          <>
            {/* Tab-based layout for md and below (and xl when split view is off) */}
            <main className={`flex-1 overflow-auto ${splitView ? 'xl:hidden' : ''}`}>
              {activeTab === 'list' && (
                <ListView
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

            {/* Side-by-side layout for xl+ (when split view is on) */}
            <div className={`${splitView ? 'hidden xl:flex' : 'hidden'} flex-1 overflow-hidden`}>
              <div className="flex-1 overflow-auto min-w-0">
                <ListView
                  events={filteredEvents}
                  watchlistIds={watchlistIds}
                  onToggleWatch={toggle}
                />
              </div>
              <div className="w-96 shrink-0 border-l border-slate-200 overflow-auto bg-white">
                <WatchlistPanel
                  allEvents={allEvents}
                  watchlistIds={watchlistIds}
                  onToggleWatch={toggle}
                  onReplaceWatchlist={replaceAll}
                  onAddToWatchlist={addMany}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
