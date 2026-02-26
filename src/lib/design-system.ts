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
 */

// ===== COLOR PALETTE (matches index.css exactly) =====
export const colors = {
  // Backgrounds (layered system)
  void: '#000000',           // --bg-void
  card: '#141414',           // --bg-card
  surface: '#111111',        // --bg-surface
  elevated: '#0D0D0D',       // --bg-elevated
  header: '#0A0A0A',         // --bg-header

  // Borders
  borderDefault: 'rgba(212, 175, 55, 0.20)',  // --border-default (metallic gold 20%)
  borderSubtle: '#2A2A2A',                     // --border-subtle
  borderActive: 'rgba(212, 175, 55, 0.50)',    // --border-active

  // Gold palette — Metallic (non-interactive brand elements, 8 tiers)
  gold: '#D4AF37',                             // --gold (metallic)
  goldLabel: 'rgba(212, 175, 55, 0.60)',       // --gold-label
  goldMuted: 'rgba(212, 175, 55, 0.45)',       // --gold-muted
  goldGlow: 'rgba(212, 175, 55, 0.25)',        // --gold-glow
  goldGhost: 'rgba(212, 175, 55, 0.15)',       // --gold-ghost
  goldSubtle: 'rgba(212, 175, 55, 0.10)',      // --gold-subtle
  goldAmbient: 'rgba(212, 175, 55, 0.06)',     // --gold-ambient

  // CTA Gold — EXCLUSIVELY for clickable elements
  goldCta: '#F9E076',                          // --gold-cta (bright, warm)
  goldCtaMuted: 'rgba(249, 224, 118, 0.45)',   // --gold-cta-muted
  goldCtaSubtle: 'rgba(249, 224, 118, 0.12)',  // --gold-cta-subtle

  // Text hierarchy
  textPrimary: '#FFFFFF',    // --text-primary
  textMid: '#D4D4D4',        // --text-mid
  textDim: '#999999',        // --text-dim
} as const;

// ===== SPACING (matches index.css) =====
export const spacing = {
  xs: '4px',     // --space-xs
  sm: '8px',     // --space-sm
  md: '12px',    // --space-md
  lg: '16px',    // --space-lg
  xl: '24px',    // --space-xl
  '2xl': '32px', // --space-2xl
} as const;

// ===== BORDER RADIUS (matches index.css) =====
export const radius = {
  none: '0px',    // --radius-none
  sm: '8px',      // --radius-sm
  md: '12px',     // --radius-md
  lg: '14px',     // --radius-lg
  xl: '18px',     // --radius-xl
  full: '999px',  // --radius-full
} as const;

// ===== SHADOWS (matches index.css) =====
export const shadows = {
  none: 'none',                                      // --shadow-none
  focus: '0 0 0 1px rgba(212, 175, 55, 0.16)',      // --shadow-focus
  cardActive: '0 0 20px rgba(212, 175, 55, 0.08)',  // --shadow-card-active
  button: '0 10px 26px rgba(249, 224, 118, 0.15)',  // --shadow-button (CTA glow)
  modal: '0 20px 50px rgba(0, 0, 0, 0.8)',          // --shadow-modal
} as const;

// ===== GRADIENTS =====
export const gradients = {
  gold: 'linear-gradient(135deg, #D4AF37 0%, #E6C84A 100%)',
  goldCta: 'linear-gradient(135deg, #F9E076 0%, #F5D55A 100%)',
  goldSubtle: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
  dividerGold: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.4) 20%, rgba(212, 175, 55, 0.4) 80%, transparent 100%)',
  fadeBottom: 'linear-gradient(to top, #000000 0%, #000000 85%, transparent 100%)',
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
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
  },
  bodyBold: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
  },
  mono: {
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: colors.textDim,
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
    bgColor: colors.goldGhost,
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
    color: colors.goldMuted,
    bgColor: colors.goldAmbient,
    description: 'Consider renegotiating terms for better returns.',
  },
  underwater: {
    label: 'UNDERWATER',
    color: colors.textDim,
    bgColor: 'rgba(255, 255, 255, 0.04)',
    description: 'The acquisition price doesn\'t cover all costs.',
  },
} as const;

// ===== HELPER FUNCTIONS =====
export const getVerdictStatus = (multiple: number, isProfitable: boolean) => {
  if (!isProfitable) return verdictStatus.underwater;
  if (multiple >= 1.3) return verdictStatus.excellent;
  if (multiple >= 1.15) return verdictStatus.good;
  return verdictStatus.marginal;
};
