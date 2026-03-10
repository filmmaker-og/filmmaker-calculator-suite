import React, { useState } from "react";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import BudgetInput from "../budget/BudgetInput";
import { Check } from "lucide-react";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance: () => void;
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "32px",
  },
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
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    cursor: "pointer",
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

const guilds = [
  { key: "sag" as const, label: "SAG-AFTRA", desc: "Actors" },
  { key: "dga" as const, label: "DGA", desc: "Directors" },
  { key: "wga" as const, label: "WGA", desc: "Writers" },
];

const BudgetTab = ({ inputs, guilds: guildState, onUpdateInput, onToggleGuild, onAdvance }: BudgetTabProps) => {
  const [pressedGuild, setPressedGuild] = useState<string | null>(null);

  return (
    <div style={s.wrapper}>
      {/* 1. Main Budget Input */}
      <BudgetInput
        inputs={inputs}
        onUpdateInput={onUpdateInput}
        onNext={onAdvance}
      />

      {/* 2. Guild Toggle Cards */}
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
          {guilds.map((guild) => {
            const isSelected = guildState[guild.key];
            const isPressed = pressedGuild === guild.key;
            return (
              <button
                key={guild.key}
                style={{
                  ...(isSelected ? s.guildOn : s.guild),
                  ...(isPressed ? { transform: "scale(0.96)" } : {}),
                }}
                onClick={() => onToggleGuild(guild.key)}
                onMouseDown={() => setPressedGuild(guild.key)}
                onMouseUp={() => setPressedGuild(null)}
                onMouseLeave={() => setPressedGuild(null)}
                onTouchStart={() => setPressedGuild(guild.key)}
                onTouchEnd={() => setPressedGuild(null)}
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
    </div>
  );
};

export default BudgetTab;
