import type { OlympicEvent } from '../../types'
import { EventCard } from '../EventCard/EventCard'
import { groupByDate, formatDate } from '../../utils/groupByDate'

interface Props {
  events: OlympicEvent[]
  watchlistIds: Set<string>
  onToggleWatch: (id: string) => void
}

export function ListView({ events, watchlistIds, onToggleWatch }: Props) {
  const grouped = groupByDate(events)

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <span className="text-4xl">🏅</span>
        <p className="text-sm">No events match your filters.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-3 sm:px-6 py-4 sm:py-6">
      {[...grouped.entries()].map(([date, dayEvents]) => (
        <section key={date}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 sticky top-0 bg-slate-50 py-2 z-10">
            {formatDate(date)}
            <span className="ml-2 font-normal text-slate-300">
              ({dayEvents.length} sessions)
            </span>
          </h2>
          <div className="flex flex-col gap-2">
            {dayEvents
              .slice()
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isWatched={watchlistIds.has(ev.id)}
                  onToggleWatch={onToggleWatch}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
