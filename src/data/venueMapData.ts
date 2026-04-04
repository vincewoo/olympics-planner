export interface VenueMapInfo {
  altName?: string
  /** Maps sport name (from schedule.json) to the LA28 seatmap image filename */
  sportMaps: Record<string, string>
}

const BASE = 'https://tickets.la28.org/obj/media/US-LA28/teaser/venue/seatmap/'

// Keyed by exact venue name from schedule.json
// sportMaps keys are exact sport names from schedule.json
// Venues / sports not listed here will show a "no map available" placeholder
export const VENUE_MAPS: Record<string, VenueMapInfo> = {
  '2028 Stadium': {
    altName: 'SoFi Stadium',
    sportMaps: { 'Swimming': '2028_Stadium_Swimming.png' },
  },
  'Alamitos Beach Stadium': {
    sportMaps: { 'Beach Volleyball': 'Alamitos_Beach_Beach_Volleyball.png' },
  },
  'Carson Field': {
    sportMaps: { 'Hockey': 'Carson_Field_Hockey.png' },
  },
  'Carson Stadium': {
    sportMaps: {
      'Archery': 'Carson_Stadium_Archery.png',
      'Rugby Sevens': 'Carson_Stadium_Rugby_Sevens.png',
    },
  },
  'Carson Velodrome': {
    sportMaps: { 'Cycling Track': 'Carson_Velodrome_Cycling_Track.png' },
  },
  'Dodger Stadium': {
    sportMaps: { 'Baseball': 'Dodger_Stadium_Baseball.png' },
  },
  'DTLA Arena': {
    sportMaps: {
      'Artistic Gymnastics': 'DTLA_Arena_Artistic_Gymnastics.png',
      // 'Boxing - Final Stages': '',
      'Trampoline Gymnastics': 'DTLA_Arena_Trampoline_Gymnastics.png',
    },
  },
  'Exposition Park Stadium': {
    sportMaps: {
      'Flag Football': 'Exposition_Park_Stadium_Flag_Football.png',
      'Lacrosse': 'Exposition_Park_Stadium_Lacrosse.png',
    },
  },
  'Galen Center': {
    sportMaps: {
      'Badminton': 'Galen_Center_Badminton.png',
      'Rhythmic Gymnastics': 'Galen_Center_Rhythmic_Gymnastics.png',
    },
  },
  'Honda Center': {
    sportMaps: { 'Volleyball': 'Honda_Center_Volleyball.png' },
  },
  'Intuit Dome': {
    sportMaps: { 'Basketball': 'Intuit_Dome_Basketball.png' },
  },
  'LA Convention Center Hall 1': {
    sportMaps: {
      'Fencing': 'LA_Convention_Center_Hall_1_Fencing.png',
      'Taekwondo': 'LA_Convention_Center_Hall_1_Taekwondo.png',
    },
  },
  'LA Convention Center Hall 2': {
    sportMaps: {
      'Judo': 'LA_Convention_Center_Hall_2_Judo.png',
      'Wrestling': 'LA_Convention_Center_Hall_2_Wrestling.png',
    },
  },
  'LA Convention Center Hall 3': {
    sportMaps: { 'Table Tennis': 'LA_Convention_Center_Hall_3_Table_Tennis.png' },
  },
  'LA Memorial Coliseum': {
    sportMaps: { 'Athletics (Track & Field)': 'LA_Memorial_Coliseum_Athletics.png' },
  },
  'Long Beach Aquatics Center': {
    sportMaps: {
      'Artistic Swimming': 'Long_Beach_Aquatics_Center_Artistic_Swimming.png',
      'Water Polo': 'Long_Beach_Aquatics_Center_Water_Polo.png',
    },
  },
  'Long Beach Arena': {
    sportMaps: { 'Handball': 'Long_Beach_Arena_Handball.png' },
  },
  'Marine Stadium': {
    sportMaps: {
      'Canoe Sprint': 'Marine_Stadium_Canoe_Sprint.png',
      'Rowing': 'Marine_Stadium_Rowing.png',
    },
  },
  'OKC Softball Park': {
    sportMaps: { 'Softball': 'OKC_Softball_Park_Softball.png' },
  },
  'OKC Whitewater Center': {
    sportMaps: { 'Canoe Slalom': 'OKC_Whitewater_Center_Canoe_Slalom.png' },
  },
  'Peacock Theater': {
    sportMaps: {
      // 'Boxing - Preliminary Stages': '',
      'Weightlifting': 'Peacock_Theater_Weightlifting.png',
    },
  },
  'Rose Bowl Aquatics Center': {
    sportMaps: { 'Diving': 'Rose_Bowl_Aquatics_Center_Diving.png' },
  },
  'Santa Anita Park': {
    sportMaps: { 'Equestrian': 'Santa_Anita_Park_Equestrian.png' },
  },
  'Valley Complex 1': {
    sportMaps: {
      'BMX Freestyle': 'Valley_Complex_1_BMX_Freestyle.png',
      'Skateboarding (Street)': 'Valley_Complex_1_Skateboarding_Street.png',
    },
  },
  'Valley Complex 2': {
    sportMaps: {
      'Modern Pentathlon': 'Valley_Complex_2_Modern_Pentathlon.png',
      'Skateboarding (Park)': 'Valley_Complex_2_Skateboarding_Park.png',
    },
  },
  'Valley Complex 4': {
    sportMaps: { 'BMX Racing': 'Valley_Complex_4_BMX_Racing.png' },
  },
  // --- Missing seat maps below — fill in sportMaps values manually ---
  'Belmont Shore': {
    sportMaps: {
      // 'Open Water Swimming': '',
      // 'Rowing Coastal Beach Sprints': '',
      // 'Sailing (Windsurfing & Kite)': '',
    },
  },
  'Carson Center Court': {
    sportMaps: {
      'Tennis': 'Carson_Center_Court_Tennis_Main.png',
    },
  },
  'Carson Court 1': {
    sportMaps: {
      'Tennis': 'Carson_Court_1_Tennis_A.png',
    },
  },
  'Carson Court 2': {
    sportMaps: {
      'Tennis': 'Carson_Court_2_Tennis_B.png',
    },
  },
  'Carson Courts 3-11': {
    sportMaps: {
      // 'Tennis': '',
    },
  },
  'Columbus Stadium': {
    sportMaps: {
      'Football (Soccer)': 'Columbus_Stadium_Football.png',
    },
  },
  'Comcast Squash Center at Universal Studios': {
    sportMaps: {
      'Squash': 'Comcast_Squash_Center_Squash.png',
    },
  },
  'Fairgrounds Cricket Stadium': {
    sportMaps: {
      // 'Cricket': '',
    },
  },
  'Industry Hills MTB Course': {
    sportMaps: {
      // 'Mountain Bike': '',
    },
  },
  'Long Beach Climbing Theater': {
    sportMaps: {
      'Climbing': 'Long_Beach_Climbing_Theater_Sport_Climbing.png',
    },
  },
  'Long Beach Target Shooting Hall': {
    sportMaps: {
      'Shooting (Rifle & Pistol)': 'Long_Beach_Target_Shooting.png',
    },
  },
  'Nashville Stadium': {
    sportMaps: {
      'Football (Soccer)': 'Nashville_Stadium_Football.png',
    },
  },
  'New York Stadium': {
    sportMaps: {
      'Football (Soccer)': 'New_York_Stadium_Football_Soccer.png',
    },
  },
  'Port of Los Angeles': {
    sportMaps: {
      // 'Sailing (Dinghy, Skiff & Multihull)': '',
    },
  },
  'Riviera Country Club': {
    sportMaps: {
      // 'Golf': '',
    },
  },
  'Rose Bowl Stadium': {
    sportMaps: {
      'Football (Soccer)': 'Rose_Bowl_Stadium_Football_Soccer_Final.png',
    },
  },
  'San Diego Stadium': {
    sportMaps: {
      'Football (Soccer)': 'San_Diego_Stadium_Football_Soccer.png',
    },
  },
  'San José Stadium': {
    sportMaps: {
      'Football (Soccer)': 'San_Jose_Stadium_Football.png',
    },
  },
  'St. Louis Stadium': {
    sportMaps: {
      'Football (Soccer)': 'St_Louis_Stadium_Football.png',
    },
  },
  'Trestles State Beach': {
    sportMaps: {
      // 'Surfing': '',
    },
  },
  'Valley Complex 3': {
    sportMaps: {
      '3x3 Basketball': 'VALLEY_COMPLEX_3_3x3_Basketball.png',
    },
  },
  'Venice Beach': {
    sportMaps: {
      // 'Triathlon': '',
    },
  },
  'Venice Beach Boardwalk - Start': {
    sportMaps: {
      // 'Athletics (Marathon)': '',
      // 'Cycling Road (Road Race)': '',
    },
  },
  'Whittier Narrows Clay Shooting Center': {
    sportMaps: {
      'Shooting (Shotgun)': 'Whittier_Narrows_Shotgun_Shooting.png',
    },
  },
}

/** LA28 ticket category colors, in legend order */
export const CATEGORY_COLORS: Record<string, { bg: string; dimBg: string; vibrantText: string; dimText: string }> = {
  A: { bg: '#00A651', dimBg: 'rgba(0,166,81,0.15)',    vibrantText: '#fff', dimText: '#007a3c' },
  B: { bg: '#E4007C', dimBg: 'rgba(228,0,124,0.15)',   vibrantText: '#fff', dimText: '#b3005f' },
  C: { bg: '#009FDA', dimBg: 'rgba(0,159,218,0.15)',   vibrantText: '#fff', dimText: '#0077a3' },
  D: { bg: '#FFD100', dimBg: 'rgba(255,209,0,0.2)',    vibrantText: '#000', dimText: '#7a6300' },
  E: { bg: '#7B2D8B', dimBg: 'rgba(123,45,139,0.15)',  vibrantText: '#fff', dimText: '#5a1f68' },
  F: { bg: '#00B5AD', dimBg: 'rgba(0,181,173,0.15)',   vibrantText: '#fff', dimText: '#007a76' },
  G: { bg: '#F47920', dimBg: 'rgba(244,121,32,0.15)',  vibrantText: '#fff', dimText: '#b85200' },
  H: { bg: '#B0B7BC', dimBg: 'rgba(176,183,188,0.25)', vibrantText: '#000', dimText: '#4a5568' },
  I: { bg: '#F2A0C1', dimBg: 'rgba(242,160,193,0.25)', vibrantText: '#000', dimText: '#9d3366' },
  J: { bg: '#C8102E', dimBg: 'rgba(200,16,46,0.15)',   vibrantText: '#fff', dimText: '#8f000f' },
}

/** Get the seatmap image URL for a venue + sport combo, or undefined if not available */
export function getSeatMapUrl(venue: string, sport: string): string | undefined {
  const venueInfo = VENUE_MAPS[venue]
  if (!venueInfo) return undefined
  const file = venueInfo.sportMaps[sport]
  if (!file) return undefined
  return BASE + file
}
