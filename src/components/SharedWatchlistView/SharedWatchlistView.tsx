import { useState } from 'react'
import { ArrowLeft, Download, Check } from 'lucide-react'
import type { OlympicEvent } from '../../types'
import { EventCard } from '../EventCard/EventCard'
import { groupByDate, formatDate } from '../../utils/groupByDate'

interface Props {
  sharedIds: Set<string>
  allEvents: OlympicEvent[]
  watchlistIds: Set<string>
  onToggleWatch: (id: string) => void
  onAddToWatchlist: (ids: Set<string>) => void
  onBack: () => void
}

export function SharedWatchlistView({ sharedIds, allEvents, watchlistIds, onToggleWatch, onAddToWatchlist, onBack }: Props) {
  const [importedAll, setImportedAll] = useState(false)

  const sharedEvents = allEvents.filter(e => sharedIds.has(e.id))
  const grouped = groupByDate(sharedEvents)

  const newIds = new Set([...sharedIds].filter(id => !watchlistIds.has(id)))

  function handleImportAll() {
    onAddToWatchlist(sharedIds)
    setImportedAll(true)
  }

  if (sharedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <span className="text-4xl">🔗</span>
        <p className="text-sm">This shared watchlist doesn't contain any valid events.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Schedule
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-3 sm:px-6 py-4 sm:py-6">
      {/* Banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Shared Watchlist
            </p>
            <p className="text-sm text-blue-700">
              Someone shared {sharedEvents.length} event{sharedEvents.length !== 1 ? 's' : ''} with you.
              Star any event to add it to your own watchlist.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleImportAll}
              disabled={importedAll || newIds.size === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {importedAll ? <Check size={14} /> : <Download size={14} />}
              {importedAll ? 'Imported!' : 'Import All'}
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Event list grouped by date */}
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
