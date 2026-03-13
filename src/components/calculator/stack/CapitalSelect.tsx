import { Check, Landmark, Receipt, Coins, Users2, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useState } from "react";
import StandardStepLayout from "../StandardStepLayout";
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
  recommended: boolean;
}[] = [
  {
    key: 'taxCredits',
    title: 'Tax Credits',
    description: 'UK, Georgia, New Mexico, etc.',
    icon: Receipt,
    priorityLabel: 'Reduces cost',
    recommended: false,
  },
  {
    key: 'seniorDebt',
    title: 'Senior Debt',
    description: 'Bank/presale loan — first position',
    icon: Landmark,
    priorityLabel: 'Paid 1st',
    recommended: true,
  },
  {
    key: 'gapLoan',
    title: 'Gap / Mezzanine',
    description: 'Higher risk, subordinate to senior',
    icon: Coins,
    priorityLabel: 'Paid 2nd',
    recommended: false,
  },
  {
    key: 'equity',
    title: 'Equity Investment',
    description: 'Private investors — last in',
    icon: Users2,
    priorityLabel: 'Paid last',
    recommended: true,
  },
  {
    key: 'deferments',
    title: 'Deferred Compensation',
    description: 'Producer fees, talent defers, etc.',
    icon: Clock,
    priorityLabel: 'After equity',
    recommended: false,
  },
];

/**
 * CapitalSelect — "What do you have?" toggle screen
 *
 * Step 0 of StackTab. User checks which capital sources apply,
 * then only those sources get input screens.
 */
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
    <StandardStepLayout
      chapter="02"
      title="Capital Selection"
      subtitle="Select the funding sources in your deal"
      onNext={onNext}
      nextLabel={selectedCount > 0 ? "Continue" : "Skip — Self-Financed"}
      isComplete={true}
    >
      <div className="space-y-6">

        {/* Selection cards - Store card pattern */}
        <div
          className="overflow-hidden"
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(212,175,55,0.20)",
            borderRadius: "12px",
          }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
              Select all that apply
            </span>
            {selectedCount > 0 && (
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>{selectedCount} selected</span>
            )}
          </div>

          <div>
            {options.map((option, idx) => {
              const isSelected = selections[option.key];
              const wasJustToggled = justToggled === option.key;
              const Icon = option.icon;
              const isLast = idx === options.length - 1;

              return (
                <button
                  key={option.key}
                  onClick={() => handleToggle(option.key)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-150 group",
                    wasJustToggled && "scale-[1.01]"
                  )}
                  style={{
                    background: isSelected ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.03)",
                    ...(!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}),
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon - Gold Only When Selected */}
                    <div
                      className="w-10 h-10 flex items-center justify-center transition-all"
                      style={isSelected
                        ? { border: "1px solid #D4AF37", color: "#D4AF37", background: "rgba(212,175,55,0.05)", borderRadius: "4px" }
                        : { border: "1px solid rgba(255,255,255,0.15)", background: "#000", color: "rgba(255,255,255,0.55)", borderRadius: "4px" }
                      }
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-sm font-semibold transition-colors"
                          style={{ color: isSelected ? "#D4AF37" : "rgba(255,255,255,0.70)" }}
                        >
                          {option.title}
                        </span>
                        {option.recommended && !isSelected && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 uppercase tracking-wider rounded"
                            style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.20)", color: "rgba(255,255,255,0.55)" }}
                          >
                            Common
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs truncate flex-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {option.description}
                        </p>
                        <span
                          className="text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex-shrink-0 rounded"
                          style={isSelected
                            ? { background: "rgba(212,175,55,0.10)", color: "rgba(212,175,55,0.70)" }
                            : { background: "#0A0A0A", color: "rgba(255,255,255,0.55)" }
                          }
                        >
                          {option.priorityLabel}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className="w-5 h-5 flex items-center justify-center transition-all duration-150 rounded-sm"
                      style={isSelected
                        ? { background: "#D4AF37", borderColor: "#D4AF37", border: "1px solid #D4AF37" }
                        : { background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }
                      }
                    >
                      {isSelected && (
                        <Check className="w-3 h-3" style={{ color: "#000" }} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
          Most indie films use Senior Debt + Equity
        </p>

      </div>
    </StandardStepLayout>
  );
};

export default CapitalSelect;
