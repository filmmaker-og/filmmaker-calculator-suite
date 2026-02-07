import { Check, Landmark, Receipt, Coins, Users2, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useState } from "react";
import StandardStepLayout from "../StandardStepLayout";

/**
 * Selection state for which capital sources the user has.
 * This is the GATEKEEPER — only checked sources show input screens.
 */
export interface CapitalSourceSelections {
  taxCredits: boolean;
  seniorDebt: boolean;
  gapLoan: boolean;
  equity: boolean;
  deferments: boolean;
}

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
      nextLabel="Continue"
      isComplete={selectedCount > 0}
    >
      <div className="space-y-6">
        
        {/* Selection cards - Matte Look with Sparing Gold */}
        <div className="bg-bg-elevated border border-border-default rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
            <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
              Select all that apply
            </span>
            {selectedCount > 0 && (
              <span className="text-xs text-text-dim font-mono">{selectedCount} selected</span>
            )}
          </div>

          <div className="divide-y divide-border-subtle">
            {options.map((option) => {
              const isSelected = selections[option.key];
              const wasJustToggled = justToggled === option.key;
              const Icon = option.icon;

              return (
                <button
                  key={option.key}
                  onClick={() => handleToggle(option.key)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-150 group",
                    isSelected 
                      ? "bg-bg-surface" // REMOVED: gold background
                      : "bg-transparent hover:bg-bg-elevated",
                    wasJustToggled && "scale-[1.01]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon - Gold Only When Selected */}
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center border transition-all",
                        isSelected
                          ? "border-gold text-gold bg-gold/5" // Subtle gold tint
                          : "border-border-subtle bg-bg-void text-text-dim group-hover:text-text-mid"
                      )}
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            isSelected ? "text-gold" : "text-text-mid" // Text turns gold when selected
                          )}
                        >
                          {option.title}
                        </span>
                        {option.recommended && !isSelected && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-bg-elevated border border-border-subtle text-text-dim uppercase tracking-wider rounded">
                            Common
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-text-dim truncate flex-1">
                          {option.description}
                        </p>
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex-shrink-0 rounded",
                          isSelected ? "bg-gold/10 text-gold/70" : "bg-bg-elevated text-text-dim"
                        )}>
                          {option.priorityLabel}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center border transition-all duration-150 rounded-sm",
                        isSelected
                          ? "bg-gold border-gold"
                          : "bg-transparent border-border-subtle group-hover:border-text-dim"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-black" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-text-dim">
          Most indie films use Senior Debt + Equity
        </p>

      </div>
    </StandardStepLayout>
  );
};

export default CapitalSelect;
