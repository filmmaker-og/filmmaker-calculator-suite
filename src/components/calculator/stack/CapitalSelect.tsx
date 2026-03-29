import { Check, Receipt, Landmark, Coins, Users2, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useState } from "react";
import ChapterCard from "../ChapterCard";
import { CapitalSelections } from "@/lib/waterfall";

// Re-export as alias for backward compatibility
export type CapitalSourceSelections = CapitalSelections;

export const defaultSelections: CapitalSourceSelections = {
  taxCredits: false,
  seniorDebt: false,
  gapLoan: false,
  equity: false,
  deferments: false,
};

interface CapitalSelectProps {
  selections: CapitalSourceSelections;
  onToggle: (key: keyof CapitalSourceSelections) => void;
  onNext: () => void;
}

const options: {
  key: keyof CapitalSourceSelections;
  title: string;
  description: string;
  icon: typeof Receipt;
  priorityLabel: string;
}[] = [
  {
    key: 'taxCredits',
    title: 'Tax Credits',
    description: 'LA, Georgia, New York, etc.',
    icon: Receipt,
    priorityLabel: 'Off-waterfall',
  },
  {
    key: 'seniorDebt',
    title: 'Senior Debt',
    description: 'Bank/presale — first position',
    icon: Landmark,
    priorityLabel: 'Paid 1st',
  },
  {
    key: 'gapLoan',
    title: 'Gap / Mezzanine',
    description: 'Higher risk, subordinate',
    icon: Coins,
    priorityLabel: 'Paid 2nd',
  },
  {
    key: 'equity',
    title: 'Equity Investment',
    description: 'Private investors — last in',
    icon: Users2,
    priorityLabel: 'Paid last',
  },
  {
    key: 'deferments',
    title: 'Deferred Compensation',
    description: 'Producer fees, talent defers',
    icon: Clock,
    priorityLabel: 'After equity',
  },
];

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  /* ── Glass Hero ── */
  heroOuter: { position: "relative" as const, marginBottom: 20 },
  heroCanopy: {
    display: "none" as const,
  },
  heroCard: {
    position: "relative" as const, textAlign: "center" as const,
    padding: "24px 20px 20px", borderRadius: 8, overflow: "hidden" as const,
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.15)",
  },
  heroGlowBg: {
    display: "none" as const,
  },
  heroInner: { position: "relative" as const, zIndex: 1 },
  heroEyebrow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", padding: "0 8px" },
  heroEyebrowLine: { flex: 1, height: "1px", background: "rgba(212,175,55,0.35)" },
  heroEyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "11px",
    letterSpacing: "0.15em", textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.65)", whiteSpace: "nowrap" as const,
  },
  heroH1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem",
    letterSpacing: "0.02em", lineHeight: 0.90, color: "#fff", marginBottom: "8px",
    textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.5)",
  },
  heroGoldSpan: {
    color: "#D4AF37",
    textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.25)",
  },
  heroSubtext: {
    fontFamily: "'Inter', sans-serif", fontSize: "15px",
    color: "rgba(255,255,255,0.75)", lineHeight: 1.45,
    textShadow: "0 2px 12px rgba(0,0,0,0.9)",
  },
  stackHdr: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stackHdrLbl: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(212,175,55,0.75)",
  },
  stackCnt: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    color: "rgba(212,175,55,0.75)",
  },
  si: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    transition: "all 0.15s",
    borderLeft: "3px solid transparent",
    minHeight: "64px",
    background: "transparent",
    width: "100%",
    border: "none",
    textAlign: "left" as const,
  },
  siOn: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    transition: "all 0.15s",
    borderLeft: "3px solid rgba(212,175,55,0.60)",
    minHeight: "64px",
    background: "rgba(212,175,55,0.03)",
    width: "100%",
    border: "none",
    textAlign: "left" as const,
  },
  siLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    paddingTop: "2px",
  },
  siIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "4px",
    color: "rgba(255,255,255,0.48)",
    background: "#141416",
    transition: "all 0.15s",
  },
  siIconOn: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(212,175,55,0.40)",
    borderRadius: "4px",
    color: "#D4AF37",
    background: "rgba(212,175,55,0.08)",
    transition: "all 0.15s",
  },
  siTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.80)",
    transition: "color 0.15s",
  },
  siTitleOn: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#D4AF37",
    transition: "color 0.15s",
  },
  siDesc: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.48)",
    marginTop: "2px",
  },
  siRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  siPri: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.50)",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  siPriOn: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    borderRadius: "4px",
    background: "rgba(212,175,55,0.08)",
    color: "#D4AF37",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  siChk: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.20)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  siChkOn: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    background: "#D4AF37",
    border: "1px solid #D4AF37",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  hint: {
    textAlign: "center" as const,
    fontSize: "11px",
    color: "rgba(255,255,255,0.48)",
    padding: "16px",
  },
  cta: {
    width: "100%",
    padding: "18px",
    marginTop: "20px",
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
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.15)",
    minHeight: "56px",
  },
};

const CapitalSelect = ({ selections, onToggle, onNext }: CapitalSelectProps) => {
  const haptics = useHaptics();
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const selectedCount = Object.values(selections).filter(Boolean).length;

  const handleToggle = (key: keyof CapitalSourceSelections) => {
    setJustToggled(key);
    onToggle(key);
    setTimeout(() => setJustToggled(null), 200);
  };

  return (
    <div style={s.wrapper}>
      {/* Glass Hero */}
      <div style={s.heroOuter}>
        <div style={s.heroCanopy} />
        <section style={s.heroCard}>
          <div style={s.heroGlowBg} />
          <div style={s.heroInner}>
            <div style={s.heroEyebrow}>
              <div style={s.heroEyebrowLine} />
              <span style={s.heroEyebrowLabel}>Step 02 · Capital Stack</span>
              <div style={s.heroEyebrowLine} />
            </div>
            <h1 style={s.heroH1}>
              How's It<br />
              <span style={s.heroGoldSpan}>Funded?</span>
            </h1>
            <p style={s.heroSubtext}>
              Select the capital sources in your deal.
            </p>
          </div>
        </section>
      </div>

      <ChapterCard chapter="02" title="Capital Stack" variant="data" noPad hideEyebrow>

        {/* Header */}
        <div style={s.stackHdr}>
          <span style={s.stackHdrLbl}>Select all that apply</span>
          {selectedCount > 0 && (
            <span style={s.stackCnt}>{selectedCount} selected</span>
          )}
        </div>

        {/* Stack items */}
        <div>
          {options.map((option, idx) => {
            const isSelected = selections[option.key];
            const Icon = option.icon;
            const isLast = idx === options.length - 1;

            return (
              <button
                key={option.key}
                onClick={(e) => { haptics.light(e); handleToggle(option.key); }}
                style={{
                  ...(isSelected ? s.siOn : s.si),
                  // Re-apply borderBottom separately since si/siOn override border
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  borderLeft: isSelected ? "3px solid rgba(212,175,55,0.60)" : "3px solid transparent",
                  ...(justToggled === option.key ? { transform: "scale(1.01)" } : {}),
                }}
              >
                <div style={s.siLeft}>
                  <div style={isSelected ? s.siIconOn : s.siIcon}>
                    <Icon style={{ width: "24px", height: "24px" }} />
                  </div>
                  <div>
                    <div style={isSelected ? s.siTitleOn : s.siTitle}>{option.title}</div>
                    <div style={s.siDesc}>{option.description}</div>
                  </div>
                </div>
                <div style={s.siRight}>
                  <span style={isSelected ? s.siPriOn : s.siPri}>{option.priorityLabel}</span>
                  <div style={isSelected ? s.siChkOn : s.siChk}>
                    {isSelected && (
                      <Check style={{ width: "12px", height: "12px", color: "#000" }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p style={s.hint}>Most indie films use Senior Debt + Equity</p>
      </ChapterCard>

      <button style={s.cta} onClick={(e) => { haptics.medium(e); onNext(); }}>
        {selectedCount > 0 ? "Enter Your Stack Details" : "Skip — Self-Financed"}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};

export default CapitalSelect;
