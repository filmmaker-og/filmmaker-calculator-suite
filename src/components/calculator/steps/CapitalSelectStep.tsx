import { Check, Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface CapitalSelections {
  taxCredits: boolean;
  seniorDebt: boolean;
  gapLoan: boolean;
  equity: boolean;
}

interface CapitalSelectStepProps {
  selections: CapitalSelections;
  onToggle: (key: keyof CapitalSelections) => void;
}

const CapitalSelectStep = ({ selections, onToggle }: CapitalSelectStepProps) => {
  const haptics = useHaptics();
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const options = [
    {
      key: 'taxCredits' as keyof CapitalSelections,
      title: 'Tax Credits',
      subtitle: 'Government incentives',
      description: 'UK, Georgia, New Mexico, etc.',
    },
    {
      key: 'seniorDebt' as keyof CapitalSelections,
      title: 'Senior Debt',
      subtitle: 'Bank/presale loan',
      description: 'First position, secured against presales',
    },
    {
      key: 'gapLoan' as keyof CapitalSelections,
      title: 'Gap / Bridge Loan',
      subtitle: 'Mezzanine financing',
      description: 'Higher risk, subordinate to senior',
    },
    {
      key: 'equity' as keyof CapitalSelections,
      title: 'Equity Investment',
      subtitle: 'Private investors',
      description: 'Last in, first out after debt',
    },
  ];

  const selectedCount = Object.values(selections).filter(Boolean).length;

  const handleToggle = (key: keyof CapitalSelections) => {
    haptics.light();
    setJustToggled(key);
    onToggle(key);
    setTimeout(() => setJustToggled(null), 200);
  };

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          How did you <span className="text-gold">fund this</span>?
        </h2>
        <p className="text-muted-foreground text-sm">
          Everyone who put money in gets paid back. With interest. Before you.
        </p>
      </div>

      {/* Selection Grid */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selections[option.key];
          const wasJustToggled = justToggled === option.key;
          
          return (
            <button
              key={option.key}
              onClick={() => handleToggle(option.key)}
              className={cn(
                "w-full p-5 border-2 text-left transition-all duration-200 touch-feedback",
                isSelected
                  ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'bg-card border-border hover:border-gold/50',
                wasJustToggled && 'scale-[1.02]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn(
                      "text-base font-semibold transition-colors",
                      isSelected ? 'text-gold' : 'text-foreground'
                    )}>
                      {option.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center border-2 transition-all duration-200",
                  isSelected
                    ? 'bg-gold border-gold scale-110'
                    : 'bg-transparent border-border'
                )}>
                  {isSelected && (
                    <Check className="w-5 h-5 text-black animate-scale-in" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Counter */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {selectedCount === 0 ? (
            <span className="text-amber-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Select at least one financing source
            </span>
          ) : (
            <span className="text-gold">
              {selectedCount} source{selectedCount !== 1 ? 's' : ''} selected ✓
            </span>
          )}
        </p>
      </div>

      {/* Helpful Context */}
      <div className="mt-4 p-4 border border-border/50 bg-card/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-gold font-semibold">TIP:</span> Most indie films use a combination of tax credits, senior debt, and equity. Gap loans are used when presales don't cover the full budget.
        </p>
      </div>
    </div>
  );
};

export default CapitalSelectStep;
