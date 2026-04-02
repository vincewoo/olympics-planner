import { useMemo } from 'react'
import type { OlympicEvent } from '../types'

export function useFilteredEvents(
  events: OlympicEvent[],
  selectedSports: Set<string>,
  selectedZones: Set<string>
): OlympicEvent[] {
  return useMemo(() => {
    return events.filter(e => {
      const sportOk = selectedSports.size === 0 || selectedSports.has(e.sport)
      const zoneOk = selectedZones.size === 0 || selectedZones.has(e.zone)
      return sportOk && zoneOk
    })
  }, [events, selectedSports, selectedZones])
}
