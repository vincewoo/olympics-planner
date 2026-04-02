/**
 * Canada Medal Watch — LA 2028
 *
 * Sports where Canada has strong medal potential, based on:
 * - Paris 2024 results (27 medals, record-setting)
 * - 2025 World Championships / World Cup results
 * - Projected 2028 contenders (retirements & nationality changes accounted for)
 *
 * Strength tiers:
 *   "gold"   — Legitimate gold-medal favorites / defending champions
 *   "medal"  — Strong medal contenders (podium likely)
 *   "watch"  — Competitive / dark horse (top-8 likely, podium possible)
 *
 * Last updated: April 2026
 */

export interface EventTarget {
  /** Substring to match against sessionDescription */
  keyword: string
  /** Athlete/reason shown in tooltip (e.g. "Summer McIntosh — 4x gold at 2025 Worlds") */
  athlete: string
}

export interface CanadaSportProfile {
  /** Strength tier */
  tier: 'gold' | 'medal' | 'watch'
  /** Why Canada is competitive in this sport */
  reason: string
  /**
   * Optional list of event targets to match against `sessionDescription`.
   * When present, only sessions whose description contains at least one keyword are shown.
   * When absent, all sessions in the sport are shown.
   */
  eventKeywords?: EventTarget[]
}

/**
 * Map from sport name (matching schedule.json) → Canada's competitive profile.
 * Only includes sports where Canada has realistic medal or near-medal potential.
 */
export const CANADA_MEDAL_WATCH: Record<string, CanadaSportProfile> = {
  // ── GOLD FAVORITES ──────────────────────────────────────────────
  'Swimming': {
    tier: 'gold',
    reason: 'McIntosh 4x gold at 2025 Worlds. Liendo & Knox also medal threats. Kharun switched to USA (Jan 2026).',
    eventKeywords: [
      // Summer McIntosh — dominant in multiple events, 4 golds at 2025 Worlds
      { keyword: "Women's 200m Individual Medley", athlete: 'Summer McIntosh — 2025 World Champion, world record holder' },
      { keyword: "Women's 400m Individual Medley", athlete: 'Summer McIntosh — 2025 World Champion, won by 7+ seconds' },
      { keyword: "Women's 200m Butterfly", athlete: 'Summer McIntosh — 2025 World Champion (championship record)' },
      { keyword: "Women's 400m Freestyle", athlete: 'Summer McIntosh — 2025 World Champion (championship record)' },
      { keyword: "Women's 800m Freestyle", athlete: 'Summer McIntosh — bronze at 2025 Worlds' },
      // Josh Liendo — Paris 2024 silver, 100m fly WR (SCM), emerging 50m free threat
      { keyword: "Men's 100m Butterfly", athlete: 'Josh Liendo — Paris 2024 silver, short-course world record holder' },
      { keyword: "Men's 50m Butterfly", athlete: 'Josh Liendo — Olympic-level butterfly specialist' },
      { keyword: "Men's 50m Freestyle", athlete: 'Josh Liendo — Canadian record 20.31, tied 6th all-time (SCM)' },
      { keyword: "Men's 100m Freestyle", athlete: 'Josh Liendo — NCAA champion, versatile sprinter' },
      // Finlay Knox — defending world champion in Men's 200m IM
      { keyword: "Men's 200m Individual Medley", athlete: 'Finlay Knox — defending World Champion (2024 Doha)' },
      // Kylie Masse — 4th at 2025 Worlds, 9 career World Championship medals
      { keyword: "Women's 100m Backstroke", athlete: 'Kylie Masse — 4th at 2025 Worlds, 9 career World medals' },
      { keyword: "Women's 200m Backstroke", athlete: 'Kylie Masse — veteran backstroke specialist' },
      // Relay teams — mixed medley bronze at 2025 Worlds
      { keyword: '4x100m Freestyle Relay', athlete: 'Canadian relay — deep sprint talent (Liendo, McIntosh)' },
      { keyword: '4x200m Freestyle Relay', athlete: 'Canadian relay — McIntosh anchors women\'s squad' },
      { keyword: '4x100m Medley Relay', athlete: 'Canadian relay — bronze at 2025 Worlds (mixed)' },
      { keyword: '4x100m Mixed Medley Relay', athlete: 'Canadian relay — 2025 World Championship bronze medallists' },
    ],
  },
  'Athletics (Track & Field)': {
    tier: 'gold',
    reason: 'Katzberg & Rogers both defending Olympic+World hammer champions. Arop 3x World 800m medallist. 4x100m relay gold at Paris 2024.',
    eventKeywords: [
      // Ethan Katzberg — Paris 2024 gold, 2025 Worlds gold (championship record)
      { keyword: "Men's Hammer Throw", athlete: 'Ethan Katzberg — defending Olympic & World Champion (championship record at 2025 Worlds)' },
      // Camryn Rogers — Paris 2024 gold, 2025 Worlds gold (Canadian record, #2 all-time)
      { keyword: "Women's Hammer Throw", athlete: 'Camryn Rogers — defending Olympic & World Champion (Canadian record, #2 all-time)' },
      // Marco Arop — Paris 2024 silver, 2025 Worlds bronze, 3 straight World medals
      { keyword: "Men's 800m", athlete: 'Marco Arop — Paris 2024 silver, 3 consecutive World Championship medals' },
      // Damian Warner — Tokyo 2020 gold, withdrew from 2025 Worlds with injury
      { keyword: "Men's Decathlon", athlete: 'Damian Warner — Tokyo 2020 gold (injury concern; withdrew from 2025 Worlds)' },
      // Men's 4x100m relay — GOLD at Paris 2024
      { keyword: "Men's 4x100m Relay", athlete: 'Canadian relay — Paris 2024 Olympic gold medallists' },
      // Women's 4x100m relay — competitive sprint squad
      { keyword: "Women's 4x100m Relay", athlete: 'Canadian relay — competitive sprint depth' },
    ],
  },

  // ── STRONG MEDAL CONTENDERS ─────────────────────────────────────
  'Canoe Sprint': {
    tier: 'medal',
    reason: 'Katie Vincent: Paris 2024 gold (C-2 500m), C-1 500m world record holder, silver at 2025 Worlds.',
    eventKeywords: [
      // Katie Vincent & Sloan MacKenzie — Paris 2024 gold in C-2 500m
      { keyword: "Women's Canoe Double 500m", athlete: 'Katie Vincent & Sloan MacKenzie — Paris 2024 Olympic gold medallists' },
      // Katie Vincent — C-1 500m world record holder. Olympic event is C-1 200m
      { keyword: "Women's Canoe Single 200m", athlete: 'Katie Vincent — C-1 500m world record holder, elite paddler' },
    ],
  },
  'Weightlifting': {
    tier: 'medal',
    reason: 'Maude Charron: Paris 2024 silver, 2025 World Championship silver. Proven medal contender.',
    eventKeywords: [
      { keyword: "Women's 69kg", athlete: 'Maude Charron — Paris 2024 silver, 2025 Worlds silver, Tokyo 2020 gold' },
    ],
  },
  'Basketball': {
    tier: 'medal',
    reason: 'Deep NBA talent pool (SGA, Murray, Barrett, Dort). Men\'s team among FIBA top-10 and building toward first medal since 1936.',
    eventKeywords: [
      { keyword: "Men's", athlete: 'Shai Gilgeous-Alexander, Jamal Murray, RJ Barrett & deep NBA roster' },
    ],
  },
  'Surfing': {
    tier: 'medal',
    reason: 'Erin Brooks: 2025 WSL Rookie of the Year, finished 8th in world. Only women\'s rookie to make mid-season cut.',
    eventKeywords: [
      { keyword: "Women's", athlete: 'Erin Brooks — 2025 WSL Rookie of the Year, ranked 8th in the world' },
    ],
  },
  'Lacrosse': {
    tier: 'medal',
    reason: 'New sport for 2028. Canada is the birthplace of lacrosse with one of the world\'s deepest talent pools in sixes format.',
  },
  'Trampoline Gymnastics': {
    tier: 'medal',
    reason: 'Sophiane Méthot: Paris 2024 bronze, 2025 Worlds bronze, World Cup gold. Consistent podium performer.',
    eventKeywords: [
      { keyword: "Women's", athlete: 'Sophiane Méthot — Paris 2024 bronze, 2025 World Championship bronze' },
    ],
  },

  // ── COMPETITIVE / DARK HORSE ────────────────────────────────────
  'Beach Volleyball': {
    tier: 'watch',
    reason: 'Wilkerson & Humana-Paredes: Paris 2024 silver. Still competing together on World Tour.',
    eventKeywords: [
      { keyword: "Women's", athlete: 'Brandie Wilkerson & Melissa Humana-Paredes — Paris 2024 silver medallists' },
    ],
  },
  'Rugby Sevens': {
    tier: 'watch',
    reason: 'Paris 2024 silver. Men\'s team won 2026 Dubai Sevens. Consistent top-tier program on both sides.',
  },
  'Fencing': {
    tier: 'watch',
    reason: 'Eleanor Harvey: Paris 2024 bronze (first-ever Canadian fencing medal). Women\'s Foil specialist.',
    eventKeywords: [
      { keyword: "Women's Foil", athlete: 'Eleanor Harvey — Paris 2024 bronze, Canada\'s first-ever fencing medal' },
    ],
  },
  'Diving': {
    tier: 'watch',
    reason: 'Emerging synchro pairs. Tessier/Cullen bronze (10m synchro) & Palkhivala/Jasmin silver (3m synchro) at 2025 World Cup.',
    eventKeywords: [
      { keyword: "Men's Synchronized 10m Platform", athlete: 'Tessier & Cullen — 2025 World Cup bronze' },
      { keyword: "Women's Synchronized 3m Springboard", athlete: 'Palkhivala & Jasmin — 2025 World Cup silver' },
      { keyword: "Men's 10m Platform", athlete: 'Canadian diving — historically competitive program' },
      { keyword: "Women's 3m Springboard", athlete: 'Canadian diving — historically competitive program' },
    ],
  },
  'Taekwondo': {
    tier: 'watch',
    reason: 'Skylar Park: Paris 2024 bronze (Women\'s -57kg). Pan American Games champion. Park family targeting LA 2028.',
    eventKeywords: [
      { keyword: "Women's -57kg", athlete: 'Skylar Park — Paris 2024 bronze, Pan American Games champion' },
    ],
  },
  'Tennis': {
    tier: 'watch',
    reason: 'Auger-Aliassime Paris 2024 bronze (mixed doubles). Fernandez & Shapovalov also on tour.',
  },
  'Cycling Track': {
    tier: 'watch',
    reason: 'Kelsey Mitchell: Tokyo 2020 gold (sprint). Switched to bobsled for 2026 Winter Games but may return for LA 2028.',
    eventKeywords: [
      { keyword: 'Sprint', athlete: 'Kelsey Mitchell — Tokyo 2020 gold (may return from bobsled for LA 2028)' },
      { keyword: 'Keirin', athlete: 'Canadian track cycling — historically competitive in short events' },
    ],
  },
  'Rowing': {
    tier: 'watch',
    reason: 'Paris 2024 silver (Women\'s Eight). Rebuilding for 2028 — no medals at 2025 Worlds but historically strong.',
    eventKeywords: [
      { keyword: "Women's Eight", athlete: 'Canadian Women\'s Eight — Paris 2024 silver medallists (rebuilding crew)' },
    ],
  },
}

/** Set of all sport names in the medal watch list, for quick lookup */
export const CANADA_MEDAL_WATCH_SPORTS = new Set(Object.keys(CANADA_MEDAL_WATCH))

/** Tier display config */
export const TIER_CONFIG = {
  gold:  { label: 'Gold Favourite',  opacity: 1 },
  medal: { label: 'Medal Contender', opacity: 0.66 },
  watch: { label: 'Dark Horse',      opacity: 0.33 },
} as const

/**
 * Get athlete/reason tooltip text for a specific event.
 * Returns the matching EventTarget's athlete string, or the sport-level reason as fallback.
 */
export function getCanadaTooltip(sport: string, sessionDescription: string): string | null {
  const profile = CANADA_MEDAL_WATCH[sport]
  if (!profile) return null
  if (!profile.eventKeywords || profile.eventKeywords.length === 0) {
    return `${TIER_CONFIG[profile.tier].label} — ${profile.reason}`
  }
  const match = profile.eventKeywords.find(et => sessionDescription.includes(et.keyword))
  if (match) return `${TIER_CONFIG[match.athlete ? profile.tier : profile.tier].label} — ${match.athlete}`
  return `${TIER_CONFIG[profile.tier].label} — ${profile.reason}`
}
