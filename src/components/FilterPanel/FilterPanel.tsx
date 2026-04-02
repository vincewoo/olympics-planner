import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { OlympicEvent } from '../../types'
import { DateRangeFilter } from './DateRangeFilter'

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
  startDate: string | null
  endDate: string | null
  onToggleSport: (sport: string) => void
  onToggleZone: (zone: string) => void
  onToggleMedalOnly: () => void
  onSelectDate: (date: string) => void
  onClearDates: () => void
  onClearAll: () => void
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
}: {
  title: string
  items: string[]
  selected: Set<string>
  onToggle: (item: string) => void
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
            return (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item}
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
  startDate,
  endDate,
  onToggleSport,
  onToggleZone,
  onToggleMedalOnly,
  onSelectDate,
  onClearDates,
  onClearAll,
}: Props) {
  const hasFilters = selectedSports.size > 0 || selectedZones.size > 0 || medalOnly || startDate !== null

  return (
    <aside className="w-60 shrink-0 bg-[#0d1f3c] flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Filters</span>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>
      {hasFilters && (
        <div className="px-4 py-2 flex flex-wrap gap-1 border-b border-slate-700/50">
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
      <div className="px-4 py-4 flex-1">
        {/* Date Range mini-calendar */}
        <DateRangeFilter
          allEvents={allEvents}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={onSelectDate}
          onClear={onClearDates}
        />

        {/* Medal Events checkbox */}
        <div className="mb-5">
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

        <FilterSection
          title="Sports"
          items={allSports}
          selected={selectedSports}
          onToggle={onToggleSport}
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
