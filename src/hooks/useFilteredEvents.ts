import { useMemo } from 'react'
import type { OlympicEvent } from '../types'
import { CANADA_MEDAL_WATCH_SPORTS } from '../data/canadaMedalWatch'

const MEDAL_SESSION_TYPES = new Set(['Final', 'Bronze'])

export function useFilteredEvents(
  events: OlympicEvent[],
  selectedSports: Set<string>,
  selectedZones: Set<string>,
  medalOnly: boolean,
  canadaMedalWatch: boolean,
  startDate: string | null,
  endDate: string | null
): OlympicEvent[] {
  return useMemo(() => {
    return events.filter(e => {
      const sportOk = selectedSports.size === 0 || selectedSports.has(e.sport)
      const zoneOk = selectedZones.size === 0 || selectedZones.has(e.zone)
      const medalOk = !medalOnly || MEDAL_SESSION_TYPES.has(e.sessionType)
      const canadaOk = !canadaMedalWatch || CANADA_MEDAL_WATCH_SPORTS.has(e.sport)
      const dateOk =
        !startDate ||
        (e.date >= startDate && e.date <= (endDate ?? startDate))
      return sportOk && zoneOk && medalOk && canadaOk && dateOk
    })
  }, [events, selectedSports, selectedZones, medalOnly, canadaMedalWatch, startDate, endDate])
}
