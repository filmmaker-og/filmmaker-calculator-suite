import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════
           DESIGN TOKEN SYSTEM — filmmaker.og
           Two-tier luminance hierarchy:
             CHROME = permanent architecture (header/tabbar) → bold
             CONTENT = variable inventory (page body) → restrained
           ═══════════════════════════════════════════════════════ */

        // ── CHROME: header, tab bar, navigation fixtures ──
        chrome: {
          bg:        "#000000",
          "bg-solid": "#000000",
          border:    "rgba(212, 175, 55, 0.60)",
          glow:      "rgba(212, 175, 55, 0.25)",
          "glow-faint": "rgba(212, 175, 55, 0.08)",
          active:    "rgba(212, 175, 55, 0.03)",
          ripple:    "rgba(212, 175, 55, 0.25)",
        },

        // ── GOLD: landing page token system (4-tier) ──
        gold: {
          DEFAULT:   "#D4AF37",                          // brand mark, icons — FULL
          full:      "rgba(212, 175, 55, 1.0)",          // active icons, gold text, section labels
          bright:    "rgba(212, 175, 55, 0.60)",         // borders that matter, chrome borders
          mid:       "rgba(212, 175, 55, 0.35)",         // subtle borders, divider gradients
          ghost:     "rgba(212, 175, 55, 0.08)",         // ambient glows, hover fills
          deep:      "#7A5C12",                          // gradient depth, shadows
          text:      "rgba(212, 175, 55, 0.60)",         // readable gold labels/eyebrows
          cta:       "#F9E076",                          // CTA buttons ONLY
          // Legacy aliases for non-landing pages
          strong:    "rgba(212, 175, 55, 0.25)",
          medium:    "rgba(212, 175, 55, 0.15)",
          subtle:    "rgba(212, 175, 55, 0.08)",
          label:     "rgba(212, 175, 55, 0.25)",
          accent:    "rgba(212, 175, 55, 0.15)",
          border:    "rgba(212, 175, 55, 0.15)",
          glow:      "rgba(212, 175, 55, 0.03)",
          "cta-muted": "rgba(212, 175, 55, 0.25)",
          "cta-subtle": "rgba(212, 175, 55, 0.08)",
        },

        // ── RED DANGER: risk/warning — 4-tier opacity system ──
        danger: {
          DEFAULT:   "#DC3C3C",
          strong:    "rgba(220, 60, 60, 0.25)",
          medium:    "rgba(220, 60, 60, 0.15)",
          subtle:    "rgba(220, 60, 60, 0.08)",
          ghost:     "rgba(220, 60, 60, 0.03)",
        },

        // ── WHITE: landing page token system (4-tier) ──
        white: {
          DEFAULT:   "#FFFFFF",
          primary:   "rgba(255, 255, 255, 0.90)",        // headlines, declarations
          body:      "rgba(255, 255, 255, 0.60)",        // paragraph text, descriptions
          tertiary:  "rgba(255, 255, 255, 0.40)",        // labels, captions, metadata
          surface:   "rgba(255, 255, 255, 0.06)",        // card fills, panel backgrounds
        },

        // ── INK: legacy white text tiers ──
        ink: {
          DEFAULT:   "#FFFFFF",                          // headlines, key numbers — FULL
          body:      "rgba(255, 255, 255, 0.70)",        // secondary / paragraph text
          muted:     "rgba(255, 255, 255, 0.55)",        // readable subordinate text
          secondary: "rgba(255, 255, 255, 0.40)",        // tertiary, metadata
          ghost:     "rgba(255, 255, 255, 0.06)",        // hover bg, surface tints
        },

        // ── BACKGROUNDS — #000, #111, #1A1A1A only ──
        bg: {
          void:      "#000000",
          elevated:  "#111111",
          surface:   "#1A1A1A",
          card:      "#111111",                          // legacy alias
          "card-border": "rgba(255, 255, 255, 0.15)",   // legacy alias
          "card-rule":   "rgba(255, 255, 255, 0.06)",   // legacy alias
          overlay:   "rgba(0, 0, 0, 0.85)",
        },

        // ── WATERFALL BARS ──
        bar: {
          DEFAULT:   "rgba(212, 175, 55, 0.25)",         // standard tier bar
          final:     "#D4AF37",                          // net profits bar
        },

        // ── COMPAT ALIASES ──
        border: {
          default: "rgba(212, 175, 55, 0.15)",
          active:  "rgba(212, 175, 55, 0.25)",
          subtle:  "rgba(255, 255, 255, 0.15)",
        },
        text: {
          primary: "#FFFFFF",
          mid:     "rgba(255, 255, 255, 0.70)",
          dim:     "rgba(255, 255, 255, 0.40)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "spotlight-beam": {
          "0%": { opacity: "0", transform: "scaleX(0.8)" },
          "100%": { opacity: "1", transform: "scaleX(1)" },
        },
        "focal-pulse": {
          "0%, 100%": { opacity: "0.8", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.05)" },
        },
        "progress-draw": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "logo-breathe": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "spotlight-beam": "spotlight-beam 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "focal-pulse": "focal-pulse 4s ease-in-out infinite",
        "progress-draw": "progress-draw 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "logo-breathe": "logo-breathe 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
