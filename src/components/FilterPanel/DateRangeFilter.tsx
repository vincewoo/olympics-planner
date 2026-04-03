import { useMemo } from 'react'
import type { OlympicEvent } from '../../types'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const WEEKEND_COLS = new Set([5, 6]) // Saturday, Sunday (0-indexed)

// Olympics run July 10–30, 2028 — exactly 3 weeks (Mon–Sun)
const FIRST_DAY = 10
const LAST_DAY = 30

function dayToDate(day: number): string {
  return `2028-07-${String(day).padStart(2, '0')}`
}

function dateToDay(date: string): number {
  return parseInt(date.slice(-2), 10)
}

// 3 intensity levels based on event count
function activityLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 15) return 1
  if (count <= 45) return 2
  return 3
}

interface Props {
  allEvents: OlympicEvent[]
  startDate: string | null
  endDate: string | null
  weekendsOnly: boolean
  afternoonOnly: boolean
  onSelectDate: (date: string) => void
  onClear: () => void
  onToggleWeekendsOnly: () => void
  onToggleAfternoonOnly: () => void
}

export function DateRangeFilter({
  allEvents,
  startDate,
  endDate,
  weekendsOnly,
  afternoonOnly,
  onSelectDate,
  onClear,
  onToggleWeekendsOnly,
  onToggleAfternoonOnly,
}: Props) {
  // Count events per day
  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allEvents.forEach(e => {
      counts[e.date] = (counts[e.date] || 0) + 1
    })
    return counts
  }, [allEvents])

  const hasSelection = startDate !== null

  // Build 3 weeks of days
  const weeks: number[][] = []
  for (let d = FIRST_DAY; d <= LAST_DAY; d += 7) {
    const week: number[] = []
    for (let i = 0; i < 7 && d + i <= LAST_DAY; i++) {
      week.push(d + i)
    }
    weeks.push(week)
  }

  function isInRange(day: number): boolean {
    if (!startDate) return false
    const s = dateToDay(startDate)
    if (!endDate) return day === s
    const e = dateToDay(endDate)
    return day >= s && day <= e
  }

  function isEndpoint(day: number): boolean {
    if (!startDate) return false
    if (day === dateToDay(startDate)) return true
    if (endDate && day === dateToDay(endDate)) return true
    return false
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Dates
        </span>
        {hasSelection && (
          <button
            onClick={onClear}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Time-based toggles */}
      <div className="flex gap-1.5 mb-2">
        <button
          onClick={onToggleWeekendsOnly}
          className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-colors ${
            weekendsOnly
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500'
          }`}
        >
          Weekends only
        </button>
        <button
          onClick={onToggleAfternoonOnly}
          className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-colors ${
            afternoonOnly
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500'
          }`}
        >
          After work
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className={`text-center text-[9px] font-medium py-0.5 ${
              WEEKEND_COLS.has(i) ? 'text-violet-400' : 'text-slate-600'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col gap-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.5">
            {week.map((day, di) => {
              const date = dayToDate(day)
              const count = eventCounts[date] || 0
              const level = activityLevel(count)
              const inRange = isInRange(day)
              const endpoint = isEndpoint(day)
              const isWeekend = WEEKEND_COLS.has(di)

              return (
                <button
                  key={day}
                  onClick={() => onSelectDate(date)}
                  aria-label={`Jul ${day} — ${count} sessions`}
                  className={`
                    relative flex flex-col items-center justify-center
                    rounded-md py-1.5 text-[11px] font-medium
                    transition-all duration-150 cursor-pointer
                    ${endpoint
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : inRange
                        ? 'bg-blue-600/20 text-blue-300'
                        : isWeekend
                          ? 'text-violet-300 hover:bg-violet-700/40 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                    }
                  `}
                >
                  {day}
                  {/* Activity dot */}
                  <div className="flex gap-px mt-0.5">
                    {level >= 1 && (
                      <span className={`block w-[3px] h-[3px] rounded-full ${
                        endpoint ? 'bg-white/60' : inRange ? 'bg-blue-400/60' : 'bg-slate-600'
                      }`} />
                    )}
                    {level >= 2 && (
                      <span className={`block w-[3px] h-[3px] rounded-full ${
                        endpoint ? 'bg-white/60' : inRange ? 'bg-blue-400/60' : 'bg-slate-600'
                      }`} />
                    )}
                    {level >= 3 && (
                      <span className={`block w-[3px] h-[3px] rounded-full ${
                        endpoint ? 'bg-white/60' : inRange ? 'bg-blue-400/60' : 'bg-slate-600'
                      }`} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Selection summary */}
      {hasSelection && (
        <p className="text-[10px] text-blue-400/80 mt-2 text-center">
          {startDate && !endDate
            ? `Jul ${dateToDay(startDate)}`
            : startDate && endDate
              ? `Jul ${dateToDay(startDate)} — ${dateToDay(endDate)}`
              : ''
          }
        </p>
      )}
    </div>
  )
}
