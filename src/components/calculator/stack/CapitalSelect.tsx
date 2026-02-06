import { Check, Landmark, Receipt, Coins, Users2, Clock, ArrowRight } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-2">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div
            className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <Coins className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-2xl tracking-[0.08em] text-white mb-1">
          Capital Stack
        </h2>
        <p className="text-text-dim text-xs max-w-xs mx-auto">
          Select the funding sources in your deal
        </p>
      </div>

      {/* Selection cards */}
      <div className="matte-section overflow-hidden">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-text-dim font-medium">
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
                  "w-full p-4 text-left transition-all duration-150",
                  isSelected ? "bg-white/5" : "bg-transparent hover:bg-white/[0.02]",
                  wasJustToggled && "scale-[1.01]"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center border transition-all",
                      isSelected
                        ? "border-gold/30 bg-gold/5"
                        : "border-border-subtle bg-bg-void"
                    )}
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSelected ? "text-gold" : "text-text-dim"
                      )}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isSelected ? "text-text-primary" : "text-text-mid"
                        )}
                      >
                        {option.title}
                      </span>
                      {option.recommended && !isSelected && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-text-dim uppercase tracking-wider">
                          Common
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-text-dim truncate flex-1">
                        {option.description}
                      </p>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex-shrink-0",
                        isSelected ? "bg-gold/10 text-gold/70" : "bg-bg-elevated text-text-dim"
                      )}>
                        {option.priorityLabel}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={cn(
                      "w-5 h-5 flex items-center justify-center border transition-all duration-150",
                      isSelected
                        ? "bg-gold border-gold"
                        : "bg-transparent border-border-subtle"
                    )}
                    style={{ borderRadius: '4px' }}
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

      {/* Continue */}
      {selectedCount > 0 && (
        <button
          onClick={onNext}
          className={cn(
            "w-full py-4 flex items-center justify-center gap-3",
            "bg-gold/10 border border-gold/30 text-gold",
            "hover:bg-gold/20 hover:border-gold/50 transition-all",
            "active:scale-[0.98]"
          )}
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <span className="text-sm font-bold uppercase tracking-wider">
            Continue
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CapitalSelect;
