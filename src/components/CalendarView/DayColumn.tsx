import type { OlympicEvent } from '../../types'
import { assignOverlapColumns } from '../../utils/timeUtils'
import { EventBlock } from './EventBlock'

const PX_PER_HOUR = 80
const START_HOUR = 7
const END_HOUR = 24
const TOTAL_HOURS = END_HOUR - START_HOUR

interface Props {
  events: OlympicEvent[]
  watchlistIds: Set<string>
  onToggleWatch: (id: string) => void
}

export function DayColumn({ events, watchlistIds, onToggleWatch }: Props) {
  const positioned = assignOverlapColumns(events)
  const totalHeight = TOTAL_HOURS * PX_PER_HOUR

  return (
    <div className="relative flex-1 min-w-48" style={{ height: totalHeight }}>
      {/* Hour grid lines */}
      {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-slate-100"
          style={{ top: i * PX_PER_HOUR }}
        />
      ))}
      {/* Event blocks — offset by START_HOUR */}
      {positioned.map(({ event, colIndex, totalCols }) => (
        <div
          key={event.id}
          className="absolute inset-x-0"
          style={{ top: -START_HOUR * PX_PER_HOUR }}
        >
          <EventBlock
            event={event}
            colIndex={colIndex}
            totalCols={totalCols}
            isWatched={watchlistIds.has(event.id)}
            onToggleWatch={onToggleWatch}
          />
        </div>
      ))}
    </div>
  )
}
