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
        mono: ["Roboto Mono", "monospace"], // Fixed: was JetBrains Mono
      },
      colors: {
        // Aligned to index.css (single source of truth)
        border: {
          default: "rgba(255, 215, 0, 0.25)",  // --border-default
          active: "rgba(255, 215, 0, 0.5)",     // --border-active
          subtle: "#252525",                      // --border-subtle
        },
        bg: {
          void: "#000000",    // --bg-void
          card: "#070707",    // --bg-card
          surface: "#141414", // --bg-surface
          elevated: "#111111",// --bg-elevated
          header: "#1A1A1A",  // --bg-header
          overlay: "rgba(0, 0, 0, 0.85)",
        },
        text: {
          primary: "#FFFFFF", // --text-primary
          mid: "#CFCFCF",     // --text-mid
          dim: "#8A8A8A",     // --text-dim
        },
        gold: {
          DEFAULT: "#FFD700",                    // --gold
          bright: "#FFD700",
          muted: "rgba(255, 215, 0, 0.45)",     // --gold-muted
          subtle: "rgba(255, 215, 0, 0.12)",     // --gold-subtle
          glow: "rgba(255, 215, 0, 0.3)",        // --gold-glow
        },
        status: {
          success: "#00FF64", // --status-success
          error: "#FF5252",   // --status-danger
          warning: "#FFD700", // --status-warning (gold)
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "spotlight-beam": "spotlight-beam 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "focal-pulse": "focal-pulse 4s ease-in-out infinite",
        "progress-draw": "progress-draw 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
