/**
 * FILMMAKER.OG Design System Constants
 *
 * Premium mobile-first design tokens matching reference calculator
 * All values are standardized for consistency across the app
 */

// ===== COLOR PALETTE =====
export const colors = {
  // Backgrounds
  void: '#000000',        // Pure black - page background
  surface: '#070707',     // Off-black - elevated surfaces
  matte: '#0A0A0A',       // Matte black - headers, cards
  card: '#0D0D0D',        // Card background
  cardElevated: '#111111', // Elevated card (hover states)

  // Borders
  border: '#1A1A1A',      // Subtle borders
  borderMedium: '#2A2A2A', // Medium borders
  borderStrong: '#3A3A3A', // Strong borders (active states)

  // Gold palette
  gold: '#D4AF37',        // Primary gold
  goldHighlight: '#F9E076', // Highlight/glow gold
  goldShadow: '#7A5C12',  // Shadow gold (depth)
  goldMuted: 'rgba(212, 175, 55, 0.7)', // Muted gold

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textSubtle: 'rgba(255, 255, 255, 0.3)',
  textDisabled: 'rgba(255, 255, 255, 0.2)',

  // Status colors
  success: '#10B981',      // Emerald
  successMuted: 'rgba(16, 185, 129, 0.2)',
  warning: '#F59E0B',      // Amber
  warningMuted: 'rgba(245, 158, 11, 0.2)',
  error: '#EF4444',        // Red
  errorMuted: 'rgba(239, 68, 68, 0.2)',
} as const;

// ===== SPACING =====
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px',
} as const;

// ===== BORDER RADIUS =====
export const radius = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '12px',  // Match reference calculator
  full: '9999px',
} as const;

// ===== SHADOWS =====
export const shadows = {
  none: 'none',
  subtle: '0 2px 8px rgba(0, 0, 0, 0.3)',
  card: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.4)',
  goldGlow: '0 0 20px rgba(212, 175, 55, 0.3)',
  goldGlowStrong: '0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.2)',
  inputFocus: '0 0 0 3px rgba(212, 175, 55, 0.15), 0 0 20px rgba(212, 175, 55, 0.1)',
} as const;

// ===== GRADIENTS =====
export const gradients = {
  gold: 'linear-gradient(135deg, #D4AF37 0%, #F9E076 100%)',
  goldSubtle: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(249, 224, 118, 0.05) 100%)',
  matteCard: 'linear-gradient(180deg, #0D0D0D 0%, #080808 100%)',
  divider: 'linear-gradient(90deg, transparent 0%, #2A2A2A 20%, #2A2A2A 80%, transparent 100%)',
  dividerGold: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.5) 80%, transparent 100%)',
  fadeBottom: 'linear-gradient(to top, #000000 0%, #000000 85%, transparent 100%)',
  successFill: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
  errorFill: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
} as const;

// ===== MATTE CARD STYLES =====
// These match the reference calculator styling
export const matteCard = {
  background: gradients.matteCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.none, // Sharp corners for premium feel
  boxShadow: shadows.card,
} as const;

export const matteCardHeader = {
  background: 'rgba(10, 10, 10, 0.8)',
  borderBottom: `1px solid ${colors.border}`,
  padding: `${spacing.md} ${spacing.xl}`,
} as const;

// ===== BUTTON STYLES =====
export const buttons = {
  primary: {
    background: colors.gold,
    color: '#000000',
    fontWeight: 900,
    boxShadow: `${shadows.goldGlow}, 0 4px 20px rgba(0, 0, 0, 0.3)`,
    hoverBackground: colors.goldHighlight,
  },
  secondary: {
    background: colors.matte,
    border: `1px solid ${colors.borderMedium}`,
    color: 'rgba(255, 255, 255, 0.7)',
    hoverBorder: colors.borderStrong,
    hoverColor: colors.textPrimary,
  },
  ghost: {
    background: 'transparent',
    border: `1px solid ${colors.gold}`,
    color: colors.gold,
    hoverBackground: 'rgba(212, 175, 55, 0.1)',
  },
  disabled: {
    background: colors.border,
    color: 'rgba(255, 255, 255, 0.3)',
    boxShadow: 'none',
  },
} as const;

// ===== INPUT STYLES =====
export const inputs = {
  background: 'transparent',
  border: `1px solid ${colors.borderMedium}`,
  borderRadius: radius.none,
  focusBorder: colors.goldHighlight,
  focusShadow: shadows.inputFocus,
  placeholderColor: 'rgba(255, 255, 255, 0.2)',
  minHeight: '48px', // Touch-friendly
} as const;

// ===== TYPOGRAPHY =====
export const typography = {
  // Bebas Neue - Headlines
  headline: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  // Inter - Body text
  body: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
  },
  bodyBold: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
  },
  // Roboto Mono - Financial numbers
  mono: {
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  // Label styles
  label: {
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
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
    bgColor: colors.successMuted,
    description: 'This return profile will attract institutional capital.',
  },
  good: {
    label: 'SOLID DEAL',
    color: colors.gold,
    bgColor: 'rgba(212, 175, 55, 0.15)',
    description: 'Healthy returns for all parties involved.',
  },
  marginal: {
    label: 'MARGINAL',
    color: colors.warning,
    bgColor: colors.warningMuted,
    description: 'Consider renegotiating terms for better returns.',
  },
  underwater: {
    label: 'UNDERWATER',
    color: colors.error,
    bgColor: colors.errorMuted,
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
