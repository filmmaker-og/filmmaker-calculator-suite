/**
 * FILMMAKER.OG Design System Constants
 *
 * Aligned to index.css (single source of truth)
 * These TS constants exist for components that need inline styles.
 * For Tailwind classes, use the CSS custom properties directly.
 *
 * UNIFIED GOLD: #FFD700 (Electric Gold)
 */

// ===== COLOR PALETTE (matches index.css exactly) =====
export const colors = {
  // Backgrounds (layered system)
  void: '#000000',           // --bg-void
  card: '#070707',           // --bg-card
  surface: '#141414',        // --bg-surface
  elevated: '#111111',       // --bg-elevated
  header: '#1A1A1A',         // --bg-header

  // Borders
  borderDefault: 'rgba(255, 215, 0, 0.25)',  // --border-default
  borderSubtle: '#252525',                     // --border-subtle
  borderActive: 'rgba(255, 215, 0, 0.5)',     // --border-active

  // Gold palette
  gold: '#FFD700',                             // --gold
  goldMuted: 'rgba(255, 215, 0, 0.45)',       // --gold-muted
  goldSubtle: 'rgba(255, 215, 0, 0.12)',      // --gold-subtle
  goldGlow: 'rgba(255, 215, 0, 0.3)',         // --gold-glow

  // Text hierarchy
  textPrimary: '#FFFFFF',    // --text-primary
  textMid: '#CFCFCF',        // --text-mid
  textDim: '#8A8A8A',        // --text-dim

  // Status colors
  success: '#00FF64',        // --status-success
  warning: '#FFD700',        // --status-warning
  error: '#FF5252',          // --status-danger
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
  none: 'none',                                  // --shadow-none
  focus: '0 0 0 1px rgba(255, 215, 0, 0.16)',   // --shadow-focus
  cardActive: '0 0 20px rgba(255, 215, 0, 0.08)', // --shadow-card-active
  button: '0 10px 26px rgba(255, 215, 0, 0.18)', // --shadow-button
  modal: '0 20px 50px rgba(0, 0, 0, 0.8)',       // --shadow-modal
} as const;

// ===== GRADIENTS =====
export const gradients = {
  gold: 'linear-gradient(135deg, #FFD700 0%, #FFE44D 100%)',
  goldSubtle: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 228, 77, 0.05) 100%)',
  dividerGold: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 20%, rgba(255, 215, 0, 0.5) 80%, transparent 100%)',
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

// ===== VERDICT STATUS =====
export const verdictStatus = {
  excellent: {
    label: 'EXCELLENT DEAL',
    color: colors.success,
    bgColor: 'rgba(0, 255, 100, 0.15)',
    description: 'This return profile will attract institutional capital.',
  },
  good: {
    label: 'SOLID DEAL',
    color: colors.gold,
    bgColor: 'rgba(255, 215, 0, 0.15)',
    description: 'Healthy returns for all parties involved.',
  },
  marginal: {
    label: 'MARGINAL',
    color: colors.warning,
    bgColor: 'rgba(255, 215, 0, 0.15)',
    description: 'Consider renegotiating terms for better returns.',
  },
  underwater: {
    label: 'UNDERWATER',
    color: colors.error,
    bgColor: 'rgba(255, 82, 82, 0.15)',
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
