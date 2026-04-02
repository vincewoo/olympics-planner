import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OlympicEvent } from '../../types'
import { groupByDate, formatDate } from '../../utils/groupByDate'
import { DayColumn } from './DayColumn'

const PX_PER_HOUR = 80
const START_HOUR = 7
const END_HOUR = 24
const TOTAL_HOURS = END_HOUR - START_HOUR

const HOURS = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i)

interface Props {
  events: OlympicEvent[]
  watchlistIds: Set<string>
  onToggleWatch: (id: string) => void
}

export function CalendarView({ events, watchlistIds, onToggleWatch }: Props) {
  const grouped = groupByDate(events)
  const dates = [...grouped.keys()]
  const [dayIndex, setDayIndex] = useState(0)

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <span className="text-4xl">📅</span>
        <p className="text-sm">No events match your filters.</p>
      </div>
    )
  }

  const clampedIndex = Math.min(dayIndex, dates.length - 1)
  const currentDate = dates[clampedIndex]
  const dayEvents = grouped.get(currentDate) ?? []

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day navigation */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setDayIndex(i => Math.max(0, i - 1))}
          disabled={clampedIndex === 0}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">{formatDate(currentDate)}</p>
          <p className="text-xs text-slate-400">{dayEvents.length} sessions</p>
        </div>
        <button
          onClick={() => setDayIndex(i => Math.min(dates.length - 1, i + 1))}
          disabled={clampedIndex === dates.length - 1}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Scrollable calendar body */}
      <div className="flex flex-1 overflow-auto">
        {/* Time gutter */}
        <div
          className="shrink-0 w-10 sm:w-14 bg-[#0d1f3c] relative"
          style={{ height: TOTAL_HOURS * PX_PER_HOUR }}
        >
          {HOURS.map(h => (
            <div
              key={h}
              className="absolute right-2 text-[10px] text-slate-400 -translate-y-2"
              style={{ top: (h - START_HOUR) * PX_PER_HOUR }}
            >
              {h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`}
            </div>
          ))}
        </div>

        {/* Day column */}
        <div className="flex-1 px-2 py-0 bg-slate-50">
          <DayColumn
            events={dayEvents}
            watchlistIds={watchlistIds}
            onToggleWatch={onToggleWatch}
          />
        </div>
      </div>
    </div>
  )
}
