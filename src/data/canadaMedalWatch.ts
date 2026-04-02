/**
 * Canada Medal Watch — LA 2028
 *
 * Sports where Canada has strong medal potential, based on:
 * - Paris 2024 results (27 medals, record-setting)
 * - Historical Olympic strength
 * - Projected 2028 contenders
 *
 * Strength tiers:
 *   "gold"   — Legitimate gold-medal favorites / defending champions
 *   "medal"  — Strong medal contenders (podium likely)
 *   "watch"  — Competitive / dark horse (top-8 likely, podium possible)
 */

export interface CanadaSportProfile {
  /** Strength tier */
  tier: 'gold' | 'medal' | 'watch'
  /** Why Canada is competitive in this sport */
  reason: string
  /**
   * Optional list of substrings to match against `sessionDescription`.
   * When present, only sessions whose description contains at least one keyword are shown.
   * When absent, all sessions in the sport are shown.
   */
  eventKeywords?: string[]
}

/**
 * Map from sport name (matching schedule.json) → Canada's competitive profile.
 * Only includes sports where Canada has realistic medal or near-medal potential.
 */
export const CANADA_MEDAL_WATCH: Record<string, CanadaSportProfile> = {
  // ── GOLD FAVORITES ──────────────────────────────────────────────
  'Swimming': {
    tier: 'gold',
    reason: '8 medals at Paris 2024 incl. 3 gold (Summer McIntosh). McIntosh, Kharun & Liendo all in prime for 2028.',
    // McIntosh: 200m/400m IM, 200m/400m Free, 200m Fly; Liendo: 50m/100m Fly; Kharun: 100m/200m Fly; relay teams
    eventKeywords: [
      "Women's 200m Individual Medley",
      "Women's 400m Individual Medley",
      "Women's 200m Butterfly",
      "Women's 400m Freestyle",
      "Men's 50m Butterfly",
      "Men's 100m Butterfly",
      "Men's 200m Butterfly",
      '4x100m Freestyle Relay',
      '4x200m Freestyle Relay',
      '4x100m Medley Relay',
      '4x100m Mixed Medley Relay',
    ],
  },
  'Athletics (Track & Field)': {
    tier: 'gold',
    reason: '5 medals at Paris 2024 incl. 3 gold. Katzberg (hammer), Rogers (hammer), relay team all returning.',
    // Katzberg: Men's Hammer; Rogers: Women's Hammer; relay teams
    eventKeywords: [
      "Men's Hammer Throw",
      "Women's Hammer Throw",
      "Men's 4x100m Relay",
      "Women's 4x100m Relay",
      'Mixed 4x400m Relay',
      "Men's 4x400m Relay",
      "Women's 4x400m Relay",
    ],
  },

  // ── STRONG MEDAL CONTENDERS ─────────────────────────────────────
  'Canoe Sprint': {
    tier: 'medal',
    reason: '2 medals at Paris 2024 (1 gold, 1 bronze). Historically one of Canada\'s strongest paddling programs.',
  },
  'Diving': {
    tier: 'medal',
    reason: 'Bronze at Paris 2024. Consistent medal program across individual and synchro events for decades.',
  },
  'Rowing': {
    tier: 'medal',
    reason: 'Silver at Paris 2024. One of Canada\'s most historically successful Summer Olympic sports.',
  },
  'Weightlifting': {
    tier: 'medal',
    reason: 'Silver at Paris 2024. Maude Charron a returning medal contender.',
    // Charron competed at 71kg (Paris 2024); closest 2028 category is 69kg
    eventKeywords: ["Women's 69kg"],
  },
  'Judo': {
    tier: 'medal',
    reason: 'Gold at Paris 2024 (Christa Deguchi). Rising program with strong depth.',
    // Deguchi competes at Women's -57kg
    eventKeywords: ["Women's -57kg"],
  },
  'Basketball': {
    tier: 'medal',
    reason: 'Deep NBA talent pool (SGA, Murray). Men\'s team building toward first medal since 1936.',
    eventKeywords: ["Men's"],
  },
  'Surfing': {
    tier: 'medal',
    reason: 'Erin Brooks identified as top medal hope for 2028. Rising Canadian surf program.',
  },
  'Lacrosse': {
    tier: 'medal',
    reason: 'New sport for 2028. Canada is the birthplace of lacrosse with one of the world\'s deepest talent pools.',
  },

  // ── COMPETITIVE / DARK HORSE ────────────────────────────────────
  'Beach Volleyball': {
    tier: 'watch',
    reason: 'Silver at Paris 2024. Brandie Wilkerson & Melissa Humana-Paredes among world\'s best teams.',
    eventKeywords: ["Women's"],
  },
  'Rugby Sevens': {
    tier: 'watch',
    reason: 'Silver at Paris 2024. Consistent top-tier sevens program on both men\'s and women\'s sides.',
  },
  'Fencing': {
    tier: 'watch',
    reason: 'Bronze at Paris 2024 (Eleanor Harvey, first-ever Canadian fencing medal). Rising program.',
    // Harvey competes in Women's Foil
    eventKeywords: ["Women's Foil"],
  },
  'Trampoline Gymnastics': {
    tier: 'watch',
    reason: 'Bronze at Paris 2024. Canada has historically been competitive in trampoline.',
  },
  'Taekwondo': {
    tier: 'watch',
    reason: 'Bronze at Paris 2024. Growing program with emerging talent.',
  },
  'Tennis': {
    tier: 'watch',
    reason: 'Bronze at Paris 2024 (Auger-Aliassime). Several top-100 players on tour.',
  },
  'Cycling Track': {
    tier: 'watch',
    reason: 'Historically strong program. Kelsey Mitchell gold at Tokyo 2020. Continued depth at world level.',
  },
  'Cycling Road (Road Race)': {
    tier: 'watch',
    reason: 'Growing WorldTour presence. Potential for breakout result on home-continent roads.',
  },
  'Wrestling': {
    tier: 'watch',
    reason: 'Historical medal sport for Canada. Consistent top-8 finishes across weight classes.',
  },
  'Canoe Slalom': {
    tier: 'watch',
    reason: 'Strong Canadian paddling tradition. Competitive in multiple boat classes.',
  },
  'Artistic Swimming': {
    tier: 'watch',
    reason: 'Historically competitive program with multiple Olympic and World Championship podiums.',
  },
  'Boxing - Final Stages': {
    tier: 'watch',
    reason: 'Long Olympic boxing tradition. Competitive across multiple weight categories.',
  },
  'Boxing - Preliminary Stages': {
    tier: 'watch',
    reason: 'Long Olympic boxing tradition. Competitive across multiple weight categories.',
  },
  '3x3 Basketball': {
    tier: 'watch',
    reason: 'Canada has growing depth in 3x3 with strong streetball culture and NBA feeder talent.',
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
