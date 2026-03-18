import { Check, Receipt, Landmark, Coins, Users2, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useState } from "react";
import ChapterCard, { cardH, cardHSub } from "../ChapterCard";
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
    description: 'Louisiana, Georgia, New Mexico, etc.',
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
  headerPad: {
    padding: "20px 24px 0",
  },
  subLine: {
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
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
    color: "rgba(255,255,255,0.55)",
  },
  stackCnt: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    color: "rgba(212,175,55,0.60)",
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
    borderLeft: "3px solid #D4AF37",
    minHeight: "64px",
    background: "rgba(212,175,55,0.02)",
    width: "100%",
    border: "none",
    textAlign: "left" as const,
  },
  siLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  siIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "4px",
    color: "rgba(212,175,55,0.30)",
    background: "#000",
    transition: "all 0.15s",
  },
  siIconOn: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #D4AF37",
    borderRadius: "4px",
    color: "#D4AF37",
    background: "rgba(212,175,55,0.05)",
    transition: "all 0.15s",
  },
  siTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.70)",
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
    color: "rgba(255,255,255,0.35)",
    marginTop: "2px",
  },
  siRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  siPri: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    borderRadius: "4px",
    background: "rgba(212,175,55,0.04)",
    color: "rgba(212,175,55,0.40)",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  siPriOn: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    borderRadius: "4px",
    background: "rgba(212,175,55,0.10)",
    color: "rgba(212,175,55,0.80)",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  siChk: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    border: "1px solid rgba(212,175,55,0.15)",
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
    color: "rgba(255,255,255,0.35)",
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
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.08)",
    minHeight: "56px",
  },
};

const CapitalSelect = ({ selections, onToggle, onNext }: CapitalSelectProps) => {
  const haptics = useHaptics();
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const selectedCount = Object.values(selections).filter(Boolean).length;

  const handleToggle = (key: keyof CapitalSourceSelections) => {
    haptics.light();
    setJustToggled(key);
    onToggle(key);
    setTimeout(() => setJustToggled(null), 200);
  };

  return (
    <div style={s.wrapper}>
      <ChapterCard chapter="02" title="Capital Stack" variant="data" noPad>
        <div style={s.headerPad}>
          <div style={cardH}>How's It Funded?</div>
          <div style={{ ...cardHSub, ...s.subLine }}>
            Select the capital sources in your deal
          </div>
        </div>

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
                onClick={() => handleToggle(option.key)}
                style={{
                  ...(isSelected ? s.siOn : s.si),
                  // Re-apply borderBottom separately since si/siOn override border
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  borderLeft: isSelected ? "3px solid #D4AF37" : "3px solid transparent",
                  ...(justToggled === option.key ? { transform: "scale(1.01)" } : {}),
                }}
              >
                <div style={s.siLeft}>
                  <div style={isSelected ? s.siIconOn : s.siIcon}>
                    <Icon style={{ width: "20px", height: "20px" }} />
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

      <button style={s.cta} onClick={onNext}>
        {selectedCount > 0 ? "Continue" : "Skip — Self-Financed"}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};

export default CapitalSelect;
