import type { OlympicEvent } from '../../types'
import { EventCard } from '../EventCard/EventCard'
import { groupByDate, formatDate } from '../../utils/groupByDate'
import { timeToMinutes } from '../../utils/timeUtils'

function findConflicts(events: OlympicEvent[]): Set<string> {
  const conflictIds = new Set<string>()
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]
      if (a.date !== b.date) continue
      const aStart = timeToMinutes(a.startTime)
      const aEnd = timeToMinutes(a.endTime)
      const bStart = timeToMinutes(b.startTime)
      const bEnd = timeToMinutes(b.endTime)
      if (aStart < bEnd && bStart < aEnd) {
        conflictIds.add(a.id)
        conflictIds.add(b.id)
      }
    }
  }
  return conflictIds
}

interface Props {
  allEvents: OlympicEvent[]
  watchlistIds: Set<string>
  onToggleWatch: (id: string) => void
}

export function WatchlistPanel({ allEvents, watchlistIds, onToggleWatch }: Props) {
  const watchedEvents = allEvents.filter(e => watchlistIds.has(e.id))
  const conflictIds = findConflicts(watchedEvents)
  const grouped = groupByDate(watchedEvents)

  if (watchedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <span className="text-4xl">⭐</span>
        <p className="text-sm">Star events to add them to your watchlist.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-3 sm:px-6 py-4 sm:py-6">
      {conflictIds.size > 0 && (
        <div className="rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
          <span className="font-semibold">⚠ Schedule conflicts detected</span> — some saved events overlap on the same day. Consider attending one and watching the other on TV.
        </div>
      )}
      {[...grouped.entries()].map(([date, dayEvents]) => (
        <section key={date}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">
            {formatDate(date)}
          </h2>
          <div className="flex flex-col gap-2">
            {dayEvents
              .slice()
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isWatched={true}
                  onToggleWatch={onToggleWatch}
                  conflict={conflictIds.has(ev.id)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
