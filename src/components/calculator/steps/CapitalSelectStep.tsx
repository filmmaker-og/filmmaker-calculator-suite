import { Check, Sparkles, Landmark, Receipt, CreditCard, Users, ChevronRight } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CapitalSelections } from "@/lib/waterfall";

// Re-export for convenience
export type { CapitalSelections } from "@/lib/waterfall";

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
      icon: Receipt,
      recommended: false,
    },
    {
      key: 'seniorDebt' as keyof CapitalSelections,
      title: 'Senior Debt',
      subtitle: 'Bank/presale loan',
      description: 'First position, secured against presales',
      icon: Landmark,
      recommended: true,
    },
    {
      key: 'gapLoan' as keyof CapitalSelections,
      title: 'Gap / Bridge Loan',
      subtitle: 'Mezzanine financing',
      description: 'Higher risk, subordinate to senior',
      icon: CreditCard,
      recommended: false,
    },
    {
      key: 'equity' as keyof CapitalSelections,
      title: 'Equity Investment',
      subtitle: 'Private investors',
      description: 'Last in, first out after debt',
      icon: Users,
      recommended: true,
    },
  ];

  const selectedCount = Object.values(selections).filter(Boolean).length;
  const hasSelection = selectedCount > 0;

  const handleToggle = (key: keyof CapitalSelections) => {
    haptics.light();
    setJustToggled(key);
    onToggle(key);
    setTimeout(() => setJustToggled(null), 200);
  };

  return (
    <div className="step-enter">
      {/* Step Header with icon */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          How did you <span className="text-gold">fund this</span>?
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Everyone who put money in gets paid back. With interest. Before you.
        </p>
      </div>

      {/* Instruction banner */}
      <div className={cn(
        "mb-5 py-3 px-4 border flex items-center justify-center gap-2 transition-all duration-300",
        hasSelection
          ? "bg-gold/5 border-gold/30"
          : "bg-[#0A0A0A] border-[#1A1A1A] animate-border-glow"
      )}>
        {hasSelection ? (
          <>
            <Check className="w-4 h-4 text-gold" />
            <span className="text-xs text-gold tracking-wide font-medium">
              {selectedCount} source{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4 text-gold/50 animate-bounce-right" />
            <span className="text-xs text-white/50 tracking-wide">
              Tap to select your funding sources
            </span>
          </>
        )}
      </div>

      {/* Selection cards */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Capital Stack
          </span>
          <span className="text-[10px] text-white/30">
            SELECT ALL THAT APPLY
          </span>
        </div>

        {/* Options */}
        <div className="divide-y divide-[#1A1A1A]">
          {options.map((option, index) => {
            const isSelected = selections[option.key];
            const wasJustToggled = justToggled === option.key;
            const Icon = option.icon;

            return (
              <button
                key={option.key}
                onClick={() => handleToggle(option.key)}
                className={cn(
                  "w-full p-5 text-left transition-all duration-200 relative overflow-hidden",
                  isSelected
                    ? "bg-gradient-to-r from-gold/10 to-transparent"
                    : "bg-transparent hover:bg-[#0D0D0D]",
                  wasJustToggled && "scale-[1.01]"
                )}
              >
                {/* Selected left accent */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
                )}

                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 flex items-center justify-center border transition-all",
                      isSelected
                        ? "border-gold/50 bg-gold/10"
                        : "border-[#2A2A2A] bg-[#0A0A0A]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSelected ? "text-gold" : "text-white/40"
                      )}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn(
                          "text-base font-semibold transition-colors",
                          isSelected ? "text-gold" : "text-white"
                        )}
                      >
                        {option.title}
                      </span>
                      {option.recommended && !isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold/70 uppercase tracking-wider">
                          Common
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">
                      {option.description}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={cn(
                      "w-7 h-7 flex items-center justify-center border-2 transition-all duration-200",
                      isSelected
                        ? "bg-gold border-gold"
                        : "bg-transparent border-[#3A3A3A]"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-black animate-check-pop" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro tip */}
      <div className="mt-6 glass-card-gold p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gold/10 border border-gold/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-gold/70" />
          </div>
          <div>
            <p className="text-xs text-gold/80 font-semibold mb-1">PRO TIP</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Most indie films use <span className="text-white/70">Senior Debt + Equity</span>.
              Add Tax Credits if shooting in an incentive state. Gap loans fill budget shortfalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalSelectStep;
