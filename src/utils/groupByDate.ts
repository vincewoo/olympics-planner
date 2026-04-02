import type { OlympicEvent } from '../types'

export function groupByDate(events: OlympicEvent[]): Map<string, OlympicEvent[]> {
  const map = new Map<string, OlympicEvent[]>()
  for (const ev of events) {
    const list = map.get(ev.date) ?? []
    list.push(ev)
    map.set(ev.date, list)
  }
  // Sort keys chronologically
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)))
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
