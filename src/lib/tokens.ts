/**
 * FILMMAKER.OG — Color Token System
 *
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR ALL COLORS.
 *
 * USAGE:
 *   import { gold, white, red, green, amber, black } from '@/lib/tokens';
 *   import { GOLD, CTA, RED, GREEN, AMBER, BG } from '@/lib/tokens';
 *
 *   gold(0.25)           →  rgba(212,175,55,0.25)
 *   white(0.55)          →  rgba(255,255,255,0.55)
 *   red(0.08)            →  rgba(220,38,38,0.08)
 *   `1px solid ${gold(0.25)}`  →  1px solid rgba(212,175,55,0.25)
 *
 * WHY FUNCTIONS:
 *   - Base RGB defined ONCE. Can't typo 212,175,55 as 214,176,57.
 *   - Shorter to type. gold(0.25) < rgba(212,175,55,0.25).
 *   - Greppable. Search "gold(" finds every gold usage.
 *   - Notation normalized. gold(0.4) and gold(0.40) produce the same output.
 *   - Color change = one line. Shift gold from D4AF37 to D5B038? Update _GOLD.
 *
 * RULE: Do not use raw rgba() in .tsx or .ts files. Import from here.
 */

// ─── Base RGB (private) ─────────────────────────────────────────

const _GOLD = '212,175,55';
const _WHITE = '255,255,255';
const _BLACK = '0,0,0';
const _RED = '200,64,64';
const _GREEN = '77,175,120';
const _AMBER = '240,168,48';
const _CTA_GOLD = '249,224,118';
const _WARM_WHITE = '250,248,244';
const _GLASS = '6,6,6';

// ─── Color Functions ────────────────────────────────────────────

/** Metallic gold at any opacity. */
export const gold = (opacity: number): string => `rgba(${_GOLD},${opacity})`;

/** White at any opacity. */
export const white = (opacity: number): string => `rgba(${_WHITE},${opacity})`;

/** Warm-white at any opacity. Body text, testimonials, descriptions. */
export const warmWhite = (opacity: number): string => `rgba(${_WARM_WHITE},${opacity})`;

/** Black at any opacity. */
export const black = (opacity: number): string => `rgba(${_BLACK},${opacity})`;

/** Canonical red at any opacity. */
export const red = (opacity: number): string => `rgba(${_RED},${opacity})`;

/** Semantic green at any opacity. */
export const green = (opacity: number): string => `rgba(${_GREEN},${opacity})`;

/** Semantic amber at any opacity. */
export const amber = (opacity: number): string => `rgba(${_AMBER},${opacity})`;

/** CTA gold at any opacity. */
export const ctaGold = (opacity: number): string => `rgba(${_CTA_GOLD},${opacity})`;

/** Glass-effect near-black. For blur backgrounds (TabBar, AppHeader, MobileMenu). */
export const glass = (opacity: number): string => `rgba(${_GLASS},${opacity})`;

// ─── Named Hex Constants ────────────────────────────────────────

/** Metallic gold hex — borders, icons, dividers, brand elements */
export const GOLD = '#D4AF37';

/** CTA gold hex — EXCLUSIVELY for clickable elements */
export const CTA = '#F9E076';

/** Canonical red hex — risk, danger, negative values (OLED-desaturated) */
export const RED = '#C84040';

/** Semantic green hex — positive, funded, profit (OLED-desaturated) */
export const GREEN = '#4DAF78';

/** Semantic amber hex — partial, warning, caution */
export const AMBER = '#F0A830';

/** Gold deep — dark gold for special treatments */
export const GOLD_DEEP = '#7A5C12';

// ─── Backgrounds ────────────────────────────────────────────────

export const BG = {
  /** Deepest layer — overlay/scrim contexts, below void */
  deep: '#0F0F11',
  /** Near-black warm — page background (lifted from #0C0C0E to fix OLED halation) */
  void: '#141416',
  /** Nested cards, content wells — distinct from void (5% white overlay) */
  nested: '#1A1A1E',
  /** Section wrapper — lighter slate that lifts off the void */
  elevated: '#222226',
  /** Inner well — recessed content areas, sits between void and elevated */
  surface: '#1A1A1E',
} as const;

// ─── Standard Tier Presets ──────────────────────────────────────

export const GOLD_TIERS = {
  strong: gold(0.25),
  medium: gold(0.15),
  subtle: gold(0.08),
  ghost: gold(0.03),
} as const;

export const WHITE_TIERS = {
  primary: white(0.95),
  secondary: white(0.75),
  muted: white(0.60),
  tertiary: white(0.50),
  ghost: white(0.06),
} as const;

export const RED_TIERS = {
  strong: red(0.25),
  medium: red(0.15),
  subtle: red(0.08),
  ghost: red(0.03),
} as const;
