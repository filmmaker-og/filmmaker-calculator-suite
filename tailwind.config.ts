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
        sans: ["DM Sans", "sans-serif"],
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
          bg:        "rgba(10, 10, 10, 0.88)",       // pill background
          "bg-solid": "rgba(0, 0, 0, 0.85)",         // tab bar (slightly darker)
          border:    "rgba(212, 175, 55, 0.50)",      // confident gold border
          glow:      "rgba(212, 175, 55, 0.30)",      // edge gradient peaks
          "glow-faint": "rgba(212, 175, 55, 0.10)",   // outer shadow rings
          active:    "rgba(212, 175, 55, 0.06)",       // active tab bg tint
          ripple:    "rgba(212, 175, 55, 0.30)",       // tap ripple
        },

        // ── GOLD: content hierarchy (6 tiers, no drift) ──
        gold: {
          DEFAULT:   "#D4AF37",                        // headlines, wordmarks, icons — FULL
          label:     "rgba(212, 175, 55, 0.72)",       // micro-labels, category text
          accent:    "rgba(212, 175, 55, 0.40)",       // dividers, connectors, accent stripes
          border:    "rgba(212, 175, 55, 0.25)",       // card/section borders
          ghost:     "rgba(212, 175, 55, 0.15)",       // watermarks, ghost text
          glow:      "rgba(212, 175, 55, 0.06)",       // ambient radial backgrounds
          cta:       "#F9E076",                        // CTA buttons ONLY
          "cta-muted": "rgba(249, 224, 118, 0.45)",
          "cta-subtle": "rgba(249, 224, 118, 0.12)",
        },

        // ── WHITE TEXT: 4 tiers, no drift ──
        ink: {
          DEFAULT:   "#FFFFFF",                        // headlines, key numbers — FULL
          body:      "rgba(255, 255, 255, 0.80)",      // paragraph text, descriptions
          secondary: "rgba(255, 255, 255, 0.62)",      // supporting info, metadata
          ghost:     "rgba(255, 255, 255, 0.30)",      // disclaimers, fine print
        },

        // ── BACKGROUNDS ──
        bg: {
          void:      "#000000",
          surface:   "#111111",
          elevated:  "#0C0C0C",                        // quote cards, featured
          card:      "rgba(255, 255, 255, 0.04)",      // content card fill
          "card-border": "rgba(255, 255, 255, 0.10)",  // content card stroke
          "card-rule":   "rgba(255, 255, 255, 0.06)",  // inner divider lines
          overlay:   "rgba(0, 0, 0, 0.85)",
        },

        // ── WATERFALL BARS ──
        bar: {
          DEFAULT:   "rgba(212, 175, 55, 0.65)",       // standard tier bar
          final:     "rgba(212, 175, 55, 0.85)",       // net profits bar
        },

        // ── LEGACY COMPAT (other pages still using old tokens) ──
        border: {
          default: "rgba(212, 175, 55, 0.25)",
          active:  "rgba(212, 175, 55, 0.50)",
          subtle:  "#2A2A2A",
        },
        text: {
          primary: "#FFFFFF",
          mid:     "#D4D4D4",
          dim:     "#999999",
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
        "cta-glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,175,55,0.25), 0 0 60px rgba(212,175,55,0.08)" },
          "50%": { boxShadow: "0 0 30px rgba(212,175,55,0.45), 0 0 80px rgba(212,175,55,0.15)" },
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
        "cta-glow-pulse": "cta-glow-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
