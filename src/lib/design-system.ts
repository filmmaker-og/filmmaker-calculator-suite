/**
 * FILMMAKER.OG Design System Constants
 *
 * Aligned to index.css (single source of truth)
 * These TS constants exist for components that need inline styles.
 * For Tailwind classes, use the CSS custom properties directly.
 *
 * TWO-GOLD SYSTEM:
 *   Metallic Gold #D4AF37 — borders, icons, dividers, brand elements (non-interactive)
 *   CTA Gold #F9E076 — EXCLUSIVELY for clickable elements (buttons, links, CTAs)
 *
 * GOLD OPACITIES — Standard 4-tier system:
 *   strong  rgba(212,175,55,0.25) — active borders, hover states
 *   medium  rgba(212,175,55,0.15) — card borders, section dividers
 *   subtle  rgba(212,175,55,0.08) — background tints, hover fills
 *   ghost   rgba(212,175,55,0.03) — ambient glow, large area tints
 *   Extended values permitted for gradients, animations, and premium treatments.
 *
 * WHITE OPACITIES — Standard 4-tier system:
 *   strong  rgba(255,255,255,0.70) — secondary text
 *   medium  rgba(255,255,255,0.40) — tertiary text, borders
 *   subtle  rgba(255,255,255,0.15) — dividers, faint borders
 *   ghost   rgba(255,255,255,0.06) — hover backgrounds, surface tints
 *   Extended values permitted for gradients, animations, and premium treatments.
 */

// ===== COLOR PALETTE =====
export const colors = {
  // Backgrounds — #000, #111, #1A1A1A only
  void: '#000000',
  elevated: '#111111',
  surface: '#1A1A1A',

  // Borders
  borderDefault: 'rgba(212, 175, 55, 0.15)',   // gold-medium
  borderSubtle: 'rgba(255, 255, 255, 0.15)',    // white-subtle
  borderActive: 'rgba(212, 175, 55, 0.25)',     // gold-strong

  // Gold palette — 4 opacity tiers only
  gold: '#D4AF37',
  goldStrong: 'rgba(212, 175, 55, 0.25)',
  goldMedium: 'rgba(212, 175, 55, 0.15)',
  goldSubtle: 'rgba(212, 175, 55, 0.08)',
  goldGhost: 'rgba(212, 175, 55, 0.03)',
  goldDeep: '#7A5C12',

  // CTA Gold — EXCLUSIVELY for clickable elements
  goldCta: '#F9E076',

  // Red danger — risk/warning indicators
  redDanger: '#DC2626',
  redStrong: 'rgba(220, 38, 38, 0.25)',
  redMedium: 'rgba(220, 38, 38, 0.15)',
  redSubtle: 'rgba(220, 38, 38, 0.08)',
  redGhost: 'rgba(220, 38, 38, 0.03)',

  // Text hierarchy — 6 tiers
  textPrimary: '#FFFFFF',
  textSubhead: 'rgba(255, 255, 255, 0.75)',
  textSecondary: 'rgba(255, 255, 255, 0.70)',
  textMuted: 'rgba(255, 255, 255, 0.55)',
  textTertiary: 'rgba(255, 255, 255, 0.40)',
  textGhost: 'rgba(255, 255, 255, 0.06)',

  // Green accent — profit/positive indicators
  greenAccent: 'rgba(60, 179, 113, 0.50)',

  // Gold label text
  goldText: 'rgba(212, 175, 55, 0.60)',

  // White opacity helpers
  whiteStrong: 'rgba(255, 255, 255, 0.70)',
  whiteMedium: 'rgba(255, 255, 255, 0.40)',
  whiteSubtle: 'rgba(255, 255, 255, 0.15)',
  whiteGhost: 'rgba(255, 255, 255, 0.06)',
} as const;

// ===== SPACING =====
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
} as const;

// ===== BORDER RADIUS — 8px max, 4-6px typical =====
export const radius = {
  none: '0px',
  sm: '4px',    // CTAs, small elements
  md: '6px',    // cards, typical
  lg: '8px',    // absolute maximum
  full: '999px',
} as const;

// ===== SHADOWS =====
export const shadows = {
  none: 'none',
  focus: `0 0 0 1px ${colors.goldMedium}`,
  cardActive: `0 0 20px ${colors.goldSubtle}`,
  button: `0 10px 26px ${colors.goldMedium}`,
  modal: '0 20px 50px rgba(0, 0, 0, 0.8)',
} as const;

// ===== GRADIENTS =====
export const gradients = {
  dividerGold: `linear-gradient(90deg, transparent 0%, ${colors.goldMedium} 20%, ${colors.goldMedium} 80%, transparent 100%)`,
  fadeBottom: 'linear-gradient(to top, #000 0%, #000 85%, transparent 100%)',
} as const;

// ===== TYPOGRAPHY =====
export const typography = {
  headline: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
  },
  bodyBold: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
  },
  mono: {
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: colors.textTertiary,
  },
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  base: 0,
  card: 10,
  sticky: 20,
  header: 50,
  overlay: 100,
  modal: 200,
  toast: 300,
} as const;

// ===== TRANSITIONS =====
export const transitions = {
  fast: '0.1s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
  spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ===== VERDICT STATUS (gold-intensity only — no green/red) =====
export const verdictStatus = {
  excellent: {
    label: 'EXCELLENT DEAL',
    color: colors.gold,
    bgColor: colors.goldMedium,
    description: 'This return profile will attract institutional capital.',
  },
  good: {
    label: 'SOLID DEAL',
    color: colors.gold,
    bgColor: colors.goldSubtle,
    description: 'Healthy returns for all parties involved.',
  },
  marginal: {
    label: 'MARGINAL',
    color: colors.textSecondary,
    bgColor: colors.goldGhost,
    description: 'Consider renegotiating terms for better returns.',
  },
  underwater: {
    label: 'UNDERWATER',
    color: colors.textTertiary,
    bgColor: colors.whiteGhost,
    description: 'The acquisition price doesn\'t cover all costs.',
  },
} as const;

// Waterfall Brief badge states — used by the unified document output
export const waterfallBadgeStates = {
  fully_recouped: {
    label: "FULLY RECOUPED",
    color: "#3CB371",
    bgColor: "rgba(60,179,113,0.08)",
    borderColor: "rgba(60,179,113,0.20)",
  },
  partially_recouped: {
    label: "PARTIALLY RECOUPED",
    color: "#F0A830",
    bgColor: "rgba(240,168,48,0.10)",
    borderColor: "rgba(240,168,48,0.25)",
  },
  equity_exposed: {
    label: "EQUITY EXPOSED",
    color: "#E67830",
    bgColor: "rgba(230,120,48,0.08)",
    borderColor: "rgba(230,120,48,0.20)",
  },
  underwater: {
    label: "UNDERWATER",
    color: "#DC2626",
    bgColor: "rgba(220,38,38,0.08)",
    borderColor: "rgba(220,38,38,0.20)",
  },
} as const;

// ===== HELPER FUNCTIONS =====
export const getVerdictStatus = (multiple: number, isProfitable: boolean) => {
  if (!isProfitable) return verdictStatus.underwater;
  if (multiple >= 1.3) return verdictStatus.excellent;
  if (multiple >= 1.15) return verdictStatus.good;
  return verdictStatus.marginal;
};
