import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import StandardStepLayout from "../StandardStepLayout";
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
  { value: 250000, label: "$250K" },
  { value: 750000, label: "$750K" },
  { value: 1500000, label: "$1.5M" },
  { value: 2500000, label: "$2.5M" },
  { value: 5000000, label: "$5M" },
];

const guildItems = [
  { key: "sag" as const, label: "SAG-AFTRA", desc: "Actors" },
  { key: "dga" as const, label: "DGA", desc: "Directors" },
  { key: "wga" as const, label: "WGA", desc: "Writers" },
];

const s: Record<string, React.CSSProperties> = {
  hero: {
    textAlign: "center" as const,
    padding: "8px 0 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "20px",
  },
  heroLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.40)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  heroAmount: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "4px",
    marginTop: "12px",
  },
  heroSign: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "rgba(212,175,55,0.35)",
    lineHeight: 1,
  },
  heroSignLit: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "#D4AF37",
    lineHeight: 1,
  },
  heroInput: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "2.4rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.02em",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "right" as const,
    width: "auto",
    minWidth: "60px",
    maxWidth: "250px",
    padding: 0,
  },
  scale: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "0 4px",
    marginBottom: "4px",
    position: "relative" as const,
  },
  scaleLine: {
    position: "absolute" as const,
    top: "5px",
    left: "16px",
    right: "16px",
    height: "1px",
    background: "rgba(255,255,255,0.10)",
  },
  scaleStep: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0 2px",
    position: "relative" as const,
    zIndex: 1,
    transition: "transform 0.15s",
  },
  scaleDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.15)",
    background: "transparent",
    transition: "all 0.2s",
  },
  scaleDotOn: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "1.5px solid #D4AF37",
    background: "#D4AF37",
    boxShadow: "0 0 10px rgba(212,175,55,0.4)",
    transition: "all 0.2s",
  },
  scaleLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.30)",
    transition: "color 0.2s",
  },
  scaleLabelOn: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    color: "#D4AF37",
    transition: "color 0.2s",
  },
  // Guild styles
  guilds: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "20px",
  },
  guildHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  guildTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.40)",
  },
  guildRow: {
    display: "flex",
    gap: "8px",
  },
  guild: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
    padding: "14px 8px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(220,200,160,0.16)",
    borderRadius: "10px",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.15s",
  },
  guildOn: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
    padding: "14px 8px",
    background: "rgba(212,175,55,0.06)",
    border: "1px solid #D4AF37",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: "1.5px solid rgba(255,255,255,0.15)",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  },
  guildName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.65)",
    transition: "color 0.15s",
  },
  guildNameOn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "#D4AF37",
    transition: "color 0.15s",
  },
  guildDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
  },
  guildHint: {
    textAlign: "center" as const,
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    color: "rgba(255,255,255,0.20)",
    marginTop: "10px",
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
  const [pressedStep, setPressedStep] = useState<number | null>(null);
  const [pressedGuild, setPressedGuild] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCompleted = inputs.budget > 0;
  const isLargeNumber = inputs.budget >= 10000000;
  const heroFontSize = isLargeNumber ? "1.8rem" : "2.4rem";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      if (inputs.budget > 0) {
        setTimeout(() => onNext(), 100);
      }
    }
  };

  const handleQuickAmount = (amount: number) => {
    onUpdateInput("budget", amount);
  };

  return (
    <StandardStepLayout
      chapter="01"
      title="Production Budget"
      isComplete={isCompleted}
      onNext={onNext}
      nextLabel="Continue to Capital Stack"
      glossaryTrigger={
        <GlossaryTrigger {...GLOSSARY.negativeCost} />
      }
    >
      {/* Hero zone */}
      <div style={s.hero}>
        <span style={s.heroLabel}>
          Total Negative Cost
          {isCompleted && (
            <Check
              style={{ width: "14px", height: "14px", color: "#D4AF37" }}
            />
          )}
        </span>
        <div style={s.heroAmount}>
          <span style={isCompleted ? s.heroSignLit : s.heroSign}>$</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.budget)}
            onChange={(e) => onUpdateInput("budget", parseValue(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="0"
            style={{
              ...s.heroInput,
              fontSize: heroFontSize,
              ...(inputs.budget === 0
                ? { color: "rgba(255,255,255,0.15)" }
                : {}),
            }}
          />
        </div>
      </div>

      {/* Stepped scale */}
      <div style={s.scale}>
        <div style={s.scaleLine} />
        {quickAmounts.map((qa, i) => {
          const isOn = inputs.budget === qa.value;
          const isPressed = pressedStep === i;
          return (
            <button
              key={qa.value}
              style={{
                ...s.scaleStep,
                ...(isPressed ? { transform: "scale(0.92)" } : {}),
              }}
              onClick={() => handleQuickAmount(qa.value)}
              onPointerDown={() => setPressedStep(i)}
              onPointerUp={() => setPressedStep(null)}
              onPointerLeave={() => setPressedStep(null)}
            >
              <span style={isOn ? s.scaleDotOn : s.scaleDot} />
              <span style={isOn ? s.scaleLabelOn : s.scaleLabel}>
                {qa.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guild Toggle Cards */}
      <div style={s.guilds}>
        <div style={s.guildHeader}>
          <span style={s.guildTitle}>Union Signatories</span>
          <GlossaryTrigger
            term="Union Signatories"
            title="UNION SIGNATORIES"
            description="Check these if your production is signatory to any guilds. This adds mandatory P&H and Residual reserves to the waterfall."
          />
        </div>

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
                onClick={() => onToggleGuild(guild.key)}
                onPointerDown={() => setPressedGuild(guild.key)}
                onPointerUp={() => setPressedGuild(null)}
                onPointerLeave={() => setPressedGuild(null)}
              >
                <span style={isSelected ? s.checkboxOn : s.checkbox}>
                  {isSelected && (
                    <Check style={{ width: "11px", height: "11px", color: "#000" }} />
                  )}
                </span>
                <span style={isSelected ? s.guildNameOn : s.guildName}>{guild.label}</span>
                <span style={s.guildDesc}>{guild.desc}</span>
              </button>
            );
          })}
        </div>

        <p style={s.guildHint}>
          Most indie productions are non-union. Leave unchecked if unsure.
        </p>
      </div>
    </StandardStepLayout>
  );
};

export default BudgetInput;
