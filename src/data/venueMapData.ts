export interface VenueMapInfo {
  imageFile: string
  altName?: string
  sourceUrl?: string
}

// Keyed by exact venue name from schedule.json
// Venues not listed here will show a "no map available" placeholder
export const VENUE_MAPS: Record<string, VenueMapInfo> = {
  '2028 Stadium': { imageFile: '2028-stadium.jpg', altName: 'SoFi Stadium' },
  'Dodger Stadium': { imageFile: 'dodger-stadium.jpg' },
  'Rose Bowl Stadium': { imageFile: 'rose-bowl-stadium.jpg' },
  'LA Memorial Coliseum': { imageFile: 'la-memorial-coliseum.jpg' },
  'Intuit Dome': { imageFile: 'intuit-dome.jpg' },
  'Honda Center': { imageFile: 'honda-center.jpg' },
  'Galen Center': { imageFile: 'galen-center.jpg' },
  'Long Beach Arena': { imageFile: 'long-beach-arena.jpg' },
  'Peacock Theater': { imageFile: 'peacock-theater.jpg' },
  'DTLA Arena': { imageFile: 'dtla-arena.jpg' },
  'Santa Anita Park': { imageFile: 'santa-anita-park.jpg' },
}
