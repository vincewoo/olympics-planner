import { Star } from 'lucide-react'
import type { OlympicEvent } from '../../types'

const SPORT_COLORS: Record<string, string> = {
  'Aquatics': '#0057A8',
  'Athletics': '#E63329',
  'Basketball': '#F97316',
  '3x3 Basketball': '#FB923C',
  'Boxing': '#7C3AED',
  'Breaking': '#EC4899',
  'Canoe': '#059669',
  'Cycling': '#0891B2',
  'Equestrian': '#92400E',
  'Fencing': '#6366F1',
  'Football': '#16A34A',
  'Golf': '#4D7C0F',
  'Gymnastics': '#DB2777',
  'Handball': '#EA580C',
  'Hockey': '#0F766E',
  'Judo': '#B45309',
  'Modern Pentathlon': '#7E22CE',
  'Rowing': '#0284C7',
  'Rugby Sevens': '#15803D',
  'Sailing': '#0369A1',
  'Shooting': '#9F1239',
  'Skateboarding': '#7C3AED',
  'Sport Climbing': '#B45309',
  'Surfing': '#0891B2',
  'Table Tennis': '#DC2626',
  'Taekwondo': '#6D28D9',
  'Tennis': '#65A30D',
  'Triathlon': '#0E7490',
  'Volleyball': '#D97706',
  'Weightlifting': '#1D4ED8',
  'Wrestling': '#B91C1C',
  'Archery': '#047857',
  'Badminton': '#BE185D',
  'Baseball': '#1E3A8A',
  'Softball': '#1D4ED8',
  'Cricket': '#166534',
  'Lacrosse': '#7E22CE',
}

function sportColor(sport: string): string {
  return SPORT_COLORS[sport] ?? '#64748B'
}

interface Props {
  event: OlympicEvent
  isWatched: boolean
  onToggleWatch: (id: string) => void
  conflict?: boolean
}

export function EventCard({ event, isWatched, onToggleWatch, conflict }: Props) {
  const color = sportColor(event.sport)
  const isMedalEvent = event.sessionType === 'Final' || event.sessionType === 'Bronze'

  return (
    <div
      className="relative flex gap-2 sm:gap-3 rounded-xl bg-white shadow-sm border border-slate-100 px-3 py-2 sm:px-4 sm:py-3 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      {conflict && (
        <span className="absolute top-2 right-10 text-xs bg-orange-100 text-orange-700 rounded px-1.5 py-0.5 font-medium">
          ⚠ Conflict
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            {isMedalEvent && <span className="mr-1">🏅</span>}
            {event.sport}
          </span>
          <span className="text-xs text-slate-400 shrink-0">
            {event.startTime}–{event.endTime}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-800 mt-0.5 leading-snug whitespace-pre-line">
          {event.sessionDescription}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
            {event.sessionType}
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
            {event.zone}
          </span>
          <span className="text-xs text-slate-400 px-1">
            {event.venue}
          </span>
        </div>
      </div>
      <button
        onClick={() => onToggleWatch(event.id)}
        className="shrink-0 self-start mt-0.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
        aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Star
          size={16}
          className={isWatched ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
        />
      </button>
    </div>
  )
}
