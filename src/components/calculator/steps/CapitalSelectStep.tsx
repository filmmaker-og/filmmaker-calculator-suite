import { Check } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

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
    onToggle(key);
  };

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-gold mb-2">
          CAPITAL STACK
        </h2>
        <p className="text-white/50 text-sm">
          Which financing sources are in your deal?
        </p>
      </div>

      {/* Selection Grid */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selections[option.key];
          return (
            <button
              key={option.key}
              onClick={() => handleToggle(option.key)}
              className={`w-full p-5 border text-left transition-all touch-feedback ${
                isSelected
                  ? 'bg-gold/10 border-gold'
                  : 'bg-card border-border hover:border-gold/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-base font-semibold ${isSelected ? 'text-gold' : 'text-foreground'}`}>
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
                <div className={`w-8 h-8 flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-gold border-gold'
                    : 'bg-transparent border-border'
                }`}>
                  {isSelected && <Check className="w-5 h-5 text-black" />}
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
            <span className="text-amber-400">Select at least one financing source</span>
          ) : (
            <span>{selectedCount} source{selectedCount !== 1 ? 's' : ''} selected</span>
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
