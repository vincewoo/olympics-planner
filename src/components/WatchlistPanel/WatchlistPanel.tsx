import { useState } from 'react'
import { Upload, Download, Copy, Check, X, Link } from 'lucide-react'
import type { OlympicEvent } from '../../types'
import { EventCard } from '../EventCard/EventCard'
import { groupByDate, formatDate } from '../../utils/groupByDate'
import { timeToMinutes } from '../../utils/timeUtils'
import { exportWatchlist, importWatchlist } from '../../hooks/useWatchlist'

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
  onReplaceWatchlist: (ids: Set<string>) => void
  onAddToWatchlist: (ids: Set<string>) => void
}

export function WatchlistPanel({ allEvents, watchlistIds, onToggleWatch, onReplaceWatchlist, onAddToWatchlist }: Props) {
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const watchedEvents = allEvents.filter(e => watchlistIds.has(e.id))
  const conflictIds = findConflicts(watchedEvents)
  const grouped = groupByDate(watchedEvents)

  function handleExport() {
    const blob = exportWatchlist(watchlistIds)
    navigator.clipboard.writeText(blob).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleShareLink() {
    const ids = [...watchlistIds].join(',')
    const url = `${window.location.origin}${window.location.pathname}#watchlist=${ids}`
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  function parseImportText(): Set<string> | null {
    try {
      setImportError(null)
      const ids = importWatchlist(importText)
      if (ids.size === 0) {
        setImportError('The imported watchlist is empty.')
        return null
      }
      const validIds = new Set([...ids].filter(id => allEvents.some(e => e.id === id)))
      if (validIds.size === 0) {
        setImportError('No matching events found. The data may be from a different schedule.')
        return null
      }
      return validIds
    } catch {
      setImportError('Invalid watchlist data. Make sure you pasted the full export text.')
      return null
    }
  }

  function handleReplace() {
    const ids = parseImportText()
    if (!ids) return
    onReplaceWatchlist(ids)
    setShowImport(false)
    setImportText('')
  }

  function handleAdd() {
    const ids = parseImportText()
    if (!ids) return
    onAddToWatchlist(ids)
    setShowImport(false)
    setImportText('')
  }

  const transferButtons = (
    <div className="flex gap-2">
      <button
        onClick={handleShareLink}
        disabled={watchlistIds.size === 0}
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {linkCopied ? <Check size={14} /> : <Link size={14} />}
        {linkCopied ? 'Link Copied!' : 'Share Link'}
      </button>
      <button
        onClick={handleExport}
        disabled={watchlistIds.size === 0}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : 'Export'}
      </button>
      <button
        onClick={() => { setShowImport(!showImport); setImportError(null); setImportText('') }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
      >
        {showImport ? <X size={14} /> : <Download size={14} />}
        {showImport ? 'Cancel' : 'Import'}
      </button>
    </div>
  )

  const importPanel = showImport && (
    <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
      <p className="text-sm text-blue-800 mb-2">Paste an exported watchlist below to load it.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={importText}
          onChange={e => { setImportText(e.target.value); setImportError(null) }}
          placeholder="Paste exported watchlist text here..."
          className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          disabled={!importText.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Merge imported events into your current watchlist"
        >
          <Upload size={14} />
          Add
        </button>
        <button
          onClick={handleReplace}
          disabled={!importText.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Replace your current watchlist with the imported events"
        >
          Replace All
        </button>
      </div>
      {importError && (
        <p className="text-sm text-red-600 mt-2">{importError}</p>
      )}
    </div>
  )

  if (watchedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">⭐</span>
          <p className="text-sm">Star events to add them to your watchlist.</p>
        </div>
        {transferButtons}
        {importPanel && <div className="w-full max-w-md px-4">{importPanel}</div>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{watchedEvents.length} event{watchedEvents.length !== 1 ? 's' : ''} saved</span>
        {transferButtons}
      </div>
      {importPanel}
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
