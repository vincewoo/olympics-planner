import { useMemo } from 'react'
import type { OlympicEvent } from '../types'
import { CANADA_MEDAL_WATCH } from '../data/canadaMedalWatch'

const MEDAL_SESSION_TYPES = new Set(['Final', 'Bronze'])

function hasMedalInDescription(desc: string): boolean {
  if (/(Gold|Silver|Bronze)\s+Medal/i.test(desc)) return true
  return desc.split('\n').some(line => {
    const t = line.trim()
    if (!/\bFinals?\b/i.test(t)) return false
    if (/\d+\/\d+\s+Finals?\b/i.test(t)) return false   // e.g. "1/32 Final" (elimination round)
    if (/\bFinals?\s+[B-Z]\b/i.test(t)) return false    // e.g. "Final B/C" (consolation)
    if (/\bFinals?\s+\d+-\d+/i.test(t)) return false    // e.g. "Final 7-12" (consolation)
    if (/\bFinals?\s+for\s+Places/i.test(t)) return false
    return true
  })
}

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
      const medalOk = !medalOnly || MEDAL_SESSION_TYPES.has(e.sessionType) || hasMedalInDescription(e.sessionDescription)
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
