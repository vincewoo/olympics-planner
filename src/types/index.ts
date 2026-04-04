export interface OlympicEvent {
  id: string;
  sessionCode: string;
  sport: string;
  venue: string;
  zone: string;
  date: string;            // "2028-07-16"
  gamesDay: number;
  sessionType: string;
  sessionDescription: string;
  startTime: string;       // "HH:MM"
  endTime: string;         // "HH:MM"
  prices?: Record<string, number>; // e.g. { "A": 514.72, "B": 279.07 } — Category A is most expensive
}
