import { useMemo } from 'react'
import type { OlympicEvent } from '../types'
import { CANADA_MEDAL_WATCH } from '../data/canadaMedalWatch'

const MEDAL_SESSION_TYPES = new Set(['Final', 'Bronze'])

export function useFilteredEvents(
  events: OlympicEvent[],
  selectedSports: Set<string>,
  selectedZones: Set<string>,
  medalOnly: boolean,
  canadaMedalWatch: boolean,
  startDate: string | null,
  endDate: string | null,
  weekendsOnly: boolean
): OlympicEvent[] {
  return useMemo(() => {
    return events.filter(e => {
      const sportOk = selectedSports.size === 0 || selectedSports.has(e.sport)
      const zoneOk = selectedZones.size === 0 || selectedZones.has(e.zone)
      const medalOk = !medalOnly || MEDAL_SESSION_TYPES.has(e.sessionType)
      const canadaProfile = CANADA_MEDAL_WATCH[e.sport]
      const canadaOk = !canadaMedalWatch || (() => {
        if (!canadaProfile) return false
        if (canadaProfile.eventKeywords && canadaProfile.eventKeywords.length > 0) {
          return canadaProfile.eventKeywords.some(et => e.sessionDescription.includes(et.keyword))
        }
        return true
      })()
      const dateOk =
        !startDate ||
        (e.date >= startDate && e.date <= (endDate ?? startDate))
      const weekendOk = !weekendsOnly || (() => {
        const [y, m, d] = e.date.split('-').map(Number)
        const dow = new Date(y, m - 1, d).getDay()
        return dow === 0 || dow === 6
      })()
      return sportOk && zoneOk && medalOk && canadaOk && dateOk && weekendOk
    })
  }, [events, selectedSports, selectedZones, medalOnly, canadaMedalWatch, startDate, endDate, weekendsOnly])
}
