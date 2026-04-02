import { Star } from 'lucide-react'
import type { OlympicEvent } from '../../types'
import { timeToMinutes } from '../../utils/timeUtils'
import { Tooltip } from '../Tooltip/Tooltip'

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

const PX_PER_HOUR = 80

interface Props {
  event: OlympicEvent
  colIndex: number
  totalCols: number
  isWatched: boolean
  onToggleWatch: (id: string) => void
}

export function EventBlock({ event, colIndex, totalCols, isWatched, onToggleWatch }: Props) {
  const color = SPORT_COLORS[event.sport] ?? '#64748B'
  const startMin = timeToMinutes(event.startTime)
  const endMin = timeToMinutes(event.endTime)
  const top = (startMin / 60) * PX_PER_HOUR
  const height = Math.max(((endMin - startMin) / 60) * PX_PER_HOUR, 24)
  const widthPct = 100 / totalCols
  const leftPct = (colIndex / totalCols) * 100

  return (
    <div
      className="absolute rounded-lg overflow-hidden cursor-default group"
      style={{
        top,
        height,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        backgroundColor: color + '22',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <Tooltip text={`${event.sport} — ${event.sessionDescription}\n${event.startTime}–${event.endTime} @ ${event.venue}`} className="absolute inset-0">
        <span className="absolute inset-0" />
      </Tooltip>
      <div className="px-1.5 py-1 flex flex-col h-full overflow-hidden">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[10px] font-bold leading-tight truncate" style={{ color }}>
            {event.sport}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onToggleWatch(event.id) }}
            className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <Star
              size={10}
              className={isWatched ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}
            />
          </button>
        </div>
        {height > 36 && (
          <span className="text-[9px] text-slate-600 leading-tight line-clamp-2 mt-0.5">
            {event.sessionDescription.split('\n')[0]}
          </span>
        )}
        {height > 56 && (
          <span className="text-[9px] text-slate-400 mt-auto">
            {event.startTime}–{event.endTime}
          </span>
        )}
      </div>
    </div>
  )
}
