import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

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
  allSports: string[]
  allZones: string[]
  selectedSports: Set<string>
  selectedZones: Set<string>
  onToggleSport: (sport: string) => void
  onToggleZone: (zone: string) => void
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
  allSports,
  allZones,
  selectedSports,
  selectedZones,
  onToggleSport,
  onToggleZone,
  onClearAll,
}: Props) {
  const hasFilters = selectedSports.size > 0 || selectedZones.size > 0

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
