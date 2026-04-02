import type { OlympicEvent } from '../types'

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export interface PositionedEvent {
  event: OlympicEvent
  colIndex: number
  totalCols: number
}

export function assignOverlapColumns(events: OlympicEvent[]): PositionedEvent[] {
  if (events.length === 0) return []

  const sorted = [...events].sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  // Build overlap clusters
  const clusters: OlympicEvent[][] = []
  let current: OlympicEvent[] = []
  let clusterEnd = -1

  for (const ev of sorted) {
    const start = timeToMinutes(ev.startTime)
    const end = timeToMinutes(ev.endTime)
    if (current.length === 0 || start < clusterEnd) {
      current.push(ev)
      clusterEnd = Math.max(clusterEnd, end)
    } else {
      clusters.push(current)
      current = [ev]
      clusterEnd = end
    }
  }
  if (current.length > 0) clusters.push(current)

  const result: PositionedEvent[] = []

  for (const cluster of clusters) {
    // Greedy column assignment
    const cols: number[] = [] // end-time of last event in each column
    const assignments: number[] = []

    for (const ev of cluster) {
      const start = timeToMinutes(ev.startTime)
      const end = timeToMinutes(ev.endTime)
      let placed = false
      for (let c = 0; c < cols.length; c++) {
        if (cols[c] <= start) {
          assignments.push(c)
          cols[c] = end
          placed = true
          break
        }
      }
      if (!placed) {
        assignments.push(cols.length)
        cols.push(end)
      }
    }

    const totalCols = cols.length
    cluster.forEach((ev, i) => {
      result.push({ event: ev, colIndex: assignments[i], totalCols })
    })
  }

  return result
}
