import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { OlympicEvent } from '../../types'
import { DateRangeFilter } from './DateRangeFilter'
import { CANADA_MEDAL_WATCH, TIER_CONFIG } from '../../data/canadaMedalWatch'

// Zones that are outside of Southern California
const OUT_OF_SOCAL_ZONES = new Set([
  'Columbus',
  'Nashville',
  'New York',
  'OKC',
  'San José',
  'St. Louis',
])

interface Props {
  allEvents: OlympicEvent[]
  allSports: string[]
  allZones: string[]
  selectedSports: Set<string>
  selectedZones: Set<string>
  medalOnly: boolean
  canadaMedalWatch: boolean
  weekendsOnly: boolean
  startDate: string | null
  endDate: string | null
  onToggleSport: (sport: string) => void
  onToggleZone: (zone: string) => void
  onToggleMedalOnly: () => void
  onToggleCanadaMedalWatch: () => void
  onToggleWeekendsOnly: () => void
  onSelectDate: (date: string) => void
  onClearDates: () => void
  onClearAll: () => void
  onClose?: () => void
}

function ZoneButton({
  zone,
  selected,
  onToggle,
}: {
  zone: string
  selected: Set<string>
  onToggle: (zone: string) => void
}) {
  const active = selected.has(zone)
  return (
    <button
      onClick={() => onToggle(zone)}
      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {zone}
    </button>
  )
}

function FilterSection({
  title,
  items,
  selected,
  onToggle,
  showCanadaIndicators,
}: {
  title: string
  items: string[]
  selected: Set<string>
  onToggle: (item: string) => void
  showCanadaIndicators?: boolean
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 hover:text-slate-300 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        {title}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {expanded && (
        <div className="flex flex-col gap-1">
          {items.map(item => {
            const active = selected.has(item)
            const canadaProfile = showCanadaIndicators ? CANADA_MEDAL_WATCH[item] : undefined
            return (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between gap-1 ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="truncate">{item}</span>
                {canadaProfile && (
                  <span
                    className="shrink-0 text-xs"
                    aria-label={`Canada: ${TIER_CONFIG[canadaProfile.tier].label}`}
                    style={{ opacity: TIER_CONFIG[canadaProfile.tier].opacity }}
                  >
                    🍁
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ZoneFilterSection({
  allZones,
  selectedZones,
  onToggleZone,
}: {
  allZones: string[]
  selectedZones: Set<string>
  onToggleZone: (zone: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  const socalZones = allZones.filter(z => !OUT_OF_SOCAL_ZONES.has(z))
  const otherZones = allZones.filter(z => OUT_OF_SOCAL_ZONES.has(z))

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 hover:text-slate-300 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        Zones
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {expanded && (
        <div className="flex flex-col gap-3">
          {/* Southern California */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1 mb-1">
              Southern California
            </p>
            <div className="flex flex-col gap-1">
              {socalZones.map(z => (
                <ZoneButton key={z} zone={z} selected={selectedZones} onToggle={onToggleZone} />
              ))}
            </div>
          </div>

          {/* Other Venues */}
          {otherZones.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1 mb-1">
                Other Venues
              </p>
              <div className="flex flex-col gap-1">
                {otherZones.map(z => (
                  <ZoneButton key={z} zone={z} selected={selectedZones} onToggle={onToggleZone} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function FilterPanel({
  allEvents,
  allSports,
  allZones,
  selectedSports,
  selectedZones,
  medalOnly,
  canadaMedalWatch,
  weekendsOnly,
  startDate,
  endDate,
  onToggleSport,
  onToggleZone,
  onToggleMedalOnly,
  onToggleCanadaMedalWatch,
  onToggleWeekendsOnly,
  onSelectDate,
  onClearDates,
  onClearAll,
  onClose,
}: Props) {
  const hasFilters = selectedSports.size > 0 || selectedZones.size > 0 || medalOnly || canadaMedalWatch || weekendsOnly || startDate !== null

  return (
    <aside className="w-full md:w-60 shrink-0 bg-[#0d1f3c] flex flex-col h-full">
      <div className="px-4 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Filters</span>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1 -mr-1 transition-colors"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      {hasFilters && (
        <div className="px-4 py-2 flex flex-wrap gap-1 border-b border-slate-700/50">
          {weekendsOnly && (
            <button
              onClick={onToggleWeekendsOnly}
              className="text-xs bg-violet-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-violet-800"
            >
              Weekends <X size={10} />
            </button>
          )}
          {startDate && (
            <button
              onClick={onClearDates}
              className="text-xs bg-emerald-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-emerald-800"
            >
              📅 {endDate
                ? `Jul ${parseInt(startDate.slice(-2))}–${parseInt(endDate.slice(-2))}`
                : `Jul ${parseInt(startDate.slice(-2))}`
              } <X size={10} />
            </button>
          )}
          {medalOnly && (
            <button
              onClick={onToggleMedalOnly}
              className="text-xs bg-yellow-600 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-yellow-700"
            >
              🏅 Medal Events <X size={10} />
            </button>
          )}
          {canadaMedalWatch && (
            <button
              onClick={onToggleCanadaMedalWatch}
              className="text-xs bg-red-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-red-800"
            >
              🍁 Canada Watch <X size={10} />
            </button>
          )}
          {[...selectedSports].map(s => (
            <button
              key={s}
              onClick={() => onToggleSport(s)}
              className="text-xs bg-blue-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-blue-800"
            >
              {s} <X size={10} />
            </button>
          ))}
          {[...selectedZones].map(z => (
            <button
              key={z}
              onClick={() => onToggleZone(z)}
              className="text-xs bg-indigo-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 hover:bg-indigo-800"
            >
              {z} <X size={10} />
            </button>
          ))}
        </div>
      )}
      <div className="px-4 py-4 flex-1 overflow-y-auto">
        {/* Date Range mini-calendar */}
        <DateRangeFilter
          allEvents={allEvents}
          startDate={startDate}
          endDate={endDate}
          weekendsOnly={weekendsOnly}
          onSelectDate={onSelectDate}
          onClear={onClearDates}
          onToggleWeekendsOnly={onToggleWeekendsOnly}
        />

        {/* Medal Events checkbox */}
        <div className="mb-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={onToggleMedalOnly}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                medalOnly
                  ? 'bg-yellow-500 border-yellow-500'
                  : 'border-slate-500 group-hover:border-slate-300'
              }`}
            >
              {medalOnly && (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1.5,5 4,7.5 8.5,2" />
                </svg>
              )}
            </div>
            <span
              onClick={onToggleMedalOnly}
              className={`text-sm transition-colors ${
                medalOnly ? 'text-yellow-400 font-medium' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              🏅 Medal Events only
            </span>
          </label>
        </div>

        {/* Canada Medal Watch checkbox */}
        <div className="mb-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={onToggleCanadaMedalWatch}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                canadaMedalWatch
                  ? 'bg-red-600 border-red-600'
                  : 'border-slate-500 group-hover:border-slate-300'
              }`}
            >
              {canadaMedalWatch && (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1.5,5 4,7.5 8.5,2" />
                </svg>
              )}
            </div>
            <span
              onClick={onToggleCanadaMedalWatch}
              className={`text-sm transition-colors ${
                canadaMedalWatch ? 'text-red-400 font-medium' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              🍁 Canada Medal Watch
            </span>
          </label>
        </div>

        <FilterSection
          title="Sports"
          items={allSports}
          selected={selectedSports}
          onToggle={onToggleSport}
          showCanadaIndicators
        />
        <ZoneFilterSection
          allZones={allZones}
          selectedZones={selectedZones}
          onToggleZone={onToggleZone}
        />
      </div>
    </aside>
  )
}
