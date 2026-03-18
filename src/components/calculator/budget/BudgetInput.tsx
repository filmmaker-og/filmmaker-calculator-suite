import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import ChapterCard, { cardH, cardHSub } from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface BudgetInputProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onBack?: () => void;
  onNext: () => void;
}

const quickAmounts = [
  { value: 250000, label: "$250K", tier: "Micro" },
  { value: 750000, label: "$750K", tier: "Low" },
  { value: 1500000, label: "$1.5M", tier: "Mid" },
  { value: 2500000, label: "$2.5M", tier: "Standard" },
  { value: 5000000, label: "$5M", tier: "Premium" },
];

const guildItems = [
  { key: "sag" as const, label: "SAG", desc: "Actors" },
  { key: "dga" as const, label: "DGA", desc: "Directors" },
  { key: "wga" as const, label: "WGA", desc: "Writers" },
];

const MAX_BUDGET = 5000000;

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  heroZone: {
    textAlign: "center" as const,
    padding: "28px 24px 20px",
    position: "relative" as const,
    zIndex: 1,
  },
  heroPrice: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "2px",
    padding: "8px 0 16px",
    position: "relative" as const,
  },
  heroSign: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "rgba(212,175,55,0.40)",
    lineHeight: 1,
    transition: "color 0.4s",
  },
  heroSignLit: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "#D4AF37",
    lineHeight: 1,
    transition: "color 0.4s",
  },
  heroInput: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "3.4rem",
    fontWeight: 500,
    color: "#fff",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center" as const,
    width: "100%",
    maxWidth: "300px",
    padding: 0,
    caretColor: "#D4AF37",
    minHeight: "52px",
  },
  // Gold cursor
  heroCursor: {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(8px, -50%)",
    width: "2px",
    height: "32px",
    background: "#D4AF37",
    borderRadius: "1px",
    animation: "cursorBlink 1s step-end infinite",
    pointerEvents: "none" as const,
    opacity: 0.6,
  },
  // Bar
  heroBar: {
    height: "2px",
    margin: "0 auto",
    maxWidth: "260px",
    background: "rgba(212,175,55,0.10)",
    borderRadius: "1px",
    position: "relative" as const,
    overflow: "hidden",
  },
  heroBarFill: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(90deg, rgba(212,175,55,0.60), #D4AF37)",
    borderRadius: "1px",
    transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 0 12px rgba(212,175,55,0.3)",
  },
  heroBarShimmer: {
    position: "absolute" as const,
    top: 0,
    left: "-100%",
    width: "50%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
    animation: "barShimmer 12s ease-in-out infinite",
    pointerEvents: "none" as const,
  },
  heroBarTick: {
    position: "absolute" as const,
    top: "-4px",
    width: "1px",
    height: "10px",
    background: "rgba(212,175,55,0.25)",
    pointerEvents: "none" as const,
    transition: "background 0.3s",
  },
  heroBarTickHit: {
    position: "absolute" as const,
    top: "-4px",
    width: "1px",
    height: "10px",
    background: "rgba(212,175,55,0.60)",
    pointerEvents: "none" as const,
    transition: "background 0.3s",
  },
  heroHint: {
    textAlign: "center" as const,
    marginTop: "14px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.25)",
    lineHeight: 1.5,
  },
  // Quick pills
  quickRow: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    padding: "16px 24px 4px",
    flexWrap: "wrap" as const,
  },
  quickBtn: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    fontWeight: 500,
    padding: "8px 6px",
    minHeight: "48px",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.15)",
    background: "rgba(212,175,55,0.03)",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  quickBtnOn: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    fontWeight: 500,
    padding: "8px 6px",
    minHeight: "48px",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.40)",
    background: "rgba(212,175,55,0.10)",
    color: "#D4AF37",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    flex: 1,
    minWidth: 0,
    boxShadow: "0 0 12px rgba(212,175,55,0.18)",
  },
  quickLabel: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.25)",
  },
  quickLabelOn: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "rgba(212,175,55,0.60)",
  },
  // Divider
  innerDiv: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "20px 24px 12px",
  },
  innerDivLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.55)",
    whiteSpace: "nowrap" as const,
  },
  innerDivLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
  },
  // Guild — horizontal layout
  guildRow: {
    display: "flex",
    gap: "8px",
    padding: "0 24px",
  },
  guild: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 10px",
    background: "rgba(212,175,55,0.02)",
    border: "1px solid rgba(212,175,55,0.18)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s",
    minHeight: "48px",
  },
  guildOn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 10px",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.50)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s",
    minHeight: "48px",
    boxShadow: "0 0 16px rgba(212,175,55,0.18)",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: "1.5px solid rgba(212,175,55,0.20)",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxOn: {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: "1.5px solid #D4AF37",
    background: "#D4AF37",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  guildTxt: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1px",
    minWidth: 0,
  },
  guildName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.65)",
    transition: "color 0.15s",
    whiteSpace: "nowrap" as const,
  },
  guildNameOn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: "#D4AF37",
    transition: "color 0.15s",
    whiteSpace: "nowrap" as const,
  },
  guildDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
  },
  guildHint: {
    textAlign: "center" as const,
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
    padding: "10px 24px 0",
  },
  // CTA reveal
  reveal: {
    opacity: 0,
    transform: "translateY(12px)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "none" as const,
    padding: "4px 20px 24px",
  },
  revealVis: {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "auto" as const,
    padding: "4px 20px 24px",
  },
  cta: {
    width: "100%",
    padding: "18px",
    background: "#F9E076",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "20px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "transform 0.12s",
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.08)",
    minHeight: "56px",
  },
  // Disclaimer
  disc: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "16px",
    marginTop: "24px",
    background: "#0A0A0A",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
  },
  discText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.5,
  },
};

const formatValue = (value: number | undefined): string => {
  if (value === undefined || value === 0) return "";
  return value.toLocaleString();
};

const parseValue = (str: string): number => {
  return parseInt(str.replace(/[^0-9]/g, "")) || 0;
};

const BudgetInput = ({ inputs, guilds, onUpdateInput, onToggleGuild, onNext }: BudgetInputProps) => {
  const haptics = useHaptics();
  const [pressedGuild, setPressedGuild] = useState<string | null>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCompleted = inputs.budget > 0;
  const fillPct = Math.min(100, (inputs.budget / MAX_BUDGET) * 100);
  const tickHit = inputs.budget >= 1000000;
  const isBreathing = !hasFocused && !isCompleted;

  // Completion pulse on first valid input
  useEffect(() => {
    if (isCompleted && !hasPulsed) {
      setHasPulsed(true);
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 700);
      return () => clearTimeout(timer);
    }
    if (!isCompleted) {
      setHasPulsed(false);
    }
  }, [isCompleted, hasPulsed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      if (inputs.budget > 0) {
        setTimeout(() => onNext(), 100);
      }
    }
  };

  const handleFocus = () => {
    setHasFocused(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  return (
    <div style={s.wrapper}>
      <ChapterCard
        chapter="01"
        title="Production Budget"
        variant="warm"
        breathing={isBreathing}
        pulsing={isPulsing}
        noPad
        glossaryTrigger={<GlossaryTrigger {...GLOSSARY.negativeCost} />}
      >
        {/* Hero zone */}
        <div style={s.heroZone}>
          <div style={cardH}>What Does It Cost?</div>
          <div style={cardHSub}>Total negative cost — everything to deliver the film</div>

          <div style={s.heroPrice}>
            <span style={isCompleted ? s.heroSignLit : s.heroSign}>$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              enterKeyHint="next"
              value={formatValue(inputs.budget)}
              onChange={(e) => onUpdateInput("budget", parseValue(e.target.value))}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="0"
              style={{
                ...s.heroInput,
                ...(inputs.budget === 0 ? { color: "rgba(255,255,255,0.10)" } : {}),
              }}
            />
            {/* Blinking gold cursor — disappears on focus */}
            {!hasFocused && !isCompleted && <div style={s.heroCursor} />}
          </div>

          {/* Gold underline bar */}
          <div style={s.heroBar}>
            <div style={{ ...s.heroBarFill, width: `${fillPct}%` }} />
            {/* Shimmer at rest — hidden when filled */}
            {!isCompleted && <div style={s.heroBarShimmer} />}
            {/* Tick at $1M position (20% of 5M) */}
            <div style={{ ...(tickHit ? s.heroBarTickHit : s.heroBarTick), left: "20%" }} />
          </div>

          <div style={s.heroHint}>Typical indie range: $250K – $5M</div>
        </div>

        {/* Quick-select pills with staggered entrance */}
        <div style={s.quickRow}>
          {quickAmounts.map((qa, i) => {
            const isOn = inputs.budget === qa.value;
            return (
              <button
                key={qa.value}
                style={{
                  ...(isOn ? s.quickBtnOn : s.quickBtn),
                  opacity: 0,
                  animation: `pillIn 0.3s ease-out ${0.05 + i * 0.05}s forwards`,
                }}
                onClick={(e) => { haptics.light(e); onUpdateInput("budget", qa.value); }}
              >
                <span>{qa.label}</span>
                <span style={isOn ? s.quickLabelOn : s.quickLabel}>{qa.tier}</span>
              </button>
            );
          })}
        </div>

        {/* Union Signatories divider */}
        <div style={s.innerDiv}>
          <span style={s.innerDivLabel}>Union Signatories</span>
          <div style={s.innerDivLine} />
        </div>

        {/* Guild cards — horizontal layout */}
        <div style={s.guildRow}>
          {guildItems.map((guild) => {
            const isSelected = guilds[guild.key];
            const isPressed = pressedGuild === guild.key;
            return (
              <button
                key={guild.key}
                style={{
                  ...(isSelected ? s.guildOn : s.guild),
                  ...(isPressed ? { transform: "scale(0.96)" } : {}),
                }}
                onClick={(e) => { haptics.light(e); onToggleGuild(guild.key); }}
                onPointerDown={() => setPressedGuild(guild.key)}
                onPointerUp={() => setPressedGuild(null)}
                onPointerLeave={() => setPressedGuild(null)}
              >
                <span style={isSelected ? s.checkboxOn : s.checkbox}>
                  {isSelected && (
                    <Check style={{ width: "11px", height: "11px", color: "#000" }} />
                  )}
                </span>
                <div style={s.guildTxt}>
                  <span style={isSelected ? s.guildNameOn : s.guildName}>{guild.label}</span>
                  <span style={s.guildDesc}>{guild.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        <p style={s.guildHint}>Select any guilds your production is signatory to</p>

        {/* CTA — fades in when budget > 0 */}
        <div style={isCompleted ? s.revealVis : s.reveal}>
          <button style={s.cta} onClick={onNext}>
            Continue to Capital Stack
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </ChapterCard>

      {/* Disclaimer */}
      <div style={s.disc}>
        <svg style={{ color: "rgba(212,175,55,0.35)", flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span style={s.discText}>Educational model only. Not financial, legal, or investment advice.</span>
      </div>
    </div>
  );
};

export default BudgetInput;
