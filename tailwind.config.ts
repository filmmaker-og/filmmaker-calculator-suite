import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* ═══════════════════════════════════════════════════════════════════
           FILMMAKER.OG DESIGN SYSTEM v2.0 - Electric Gold
           ═══════════════════════════════════════════════════════════════════ */

        // BACKGROUND LAYERS
        "bg-void": "var(--bg-void)",
        "bg-card": "var(--bg-card)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",

        // GOLD SYSTEM (Electric)
        gold: {
          DEFAULT: "#FFD700",           // Electric Gold - primary accent
          muted: "rgba(255, 215, 0, 0.45)",
          subtle: "rgba(255, 215, 0, 0.12)",
          glow: "rgba(255, 215, 0, 0.3)",
        },

        // TEXT HIERARCHY
        "text-primary": "var(--text-primary)",
        "text-mid": "var(--text-mid)",
        "text-dim": "var(--text-dim)",

        // BORDERS
        "border-default": "var(--border-default)",
        "border-subtle": "var(--border-subtle)",
        "border-active": "var(--border-active)",

        // STATUS
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-danger": "var(--status-danger)",

        // Legacy compatibility
        panel: "#111111",
        surface: "var(--bg-surface)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bebas: ['Bebas Neue', 'Impact', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",         // 8px - Status badges, small elements
        md: "var(--radius-md)",         // 12px - Buttons, inputs, KPI cards
        lg: "var(--radius-lg)",         // 14px - Cards, sections, containers
        xl: "var(--radius-xl)",         // 18px - Modals, sheets
        full: "var(--radius-full)",     // 999px - Pills, circular icons
      },
      spacing: {
        "xs": "var(--space-xs)",        // 4px
        "sm": "var(--space-sm)",        // 8px
        "md": "var(--space-md)",        // 12px
        "lg": "var(--space-lg)",        // 16px
        "xl": "var(--space-xl)",        // 24px
        "2xl": "var(--space-2xl)",      // 32px
        "appbar": "var(--appbar-h)",    // 56px
        "tabbar": "var(--tabbar-h)",    // 62px
      },
      boxShadow: {
        "focus": "var(--shadow-focus)",
        "card-active": "var(--shadow-card-active)",
        "button": "var(--shadow-button)",
        "modal": "var(--shadow-modal)",
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
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)" },
          "50%": { boxShadow: "0 0 35px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.2)" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "rgba(255, 215, 0, 0.3)" },
          "50%": { borderColor: "rgba(255, 215, 0, 0.7)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(100%)", opacity: "0" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "number-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-gold": "pulse-gold 4s ease-in-out infinite",
        "pulse-border": "pulse-border 1.5s ease-in-out 3",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-out forwards",
        "shake": "shake 0.3s ease-in-out",
        "count-up": "count-up 0.3s ease-out forwards",
        "number-pop": "number-pop 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;