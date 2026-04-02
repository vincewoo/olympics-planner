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
}
