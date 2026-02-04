import { Check, Landmark, Receipt, Coins, Users2 } from "lucide-react";
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
      description: 'UK, Georgia, New Mexico, etc.',
      icon: Receipt,
      recommended: false,
      priorityLabel: "Reduces cost",
    },
    {
      key: 'seniorDebt' as keyof CapitalSelections,
      title: 'Senior Debt',
      description: 'Bank/presale loan - first position',
      icon: Landmark,
      recommended: true,
      priorityLabel: "Paid 1st",
    },
    {
      key: 'gapLoan' as keyof CapitalSelections,
      title: 'Gap / Bridge Loan',
      description: 'Higher risk, subordinate to senior',
      icon: Coins,
      recommended: false,
      priorityLabel: "Paid 2nd",
    },
    {
      key: 'equity' as keyof CapitalSelections,
      title: 'Equity Investment',
      description: 'Private investors - last in',
      icon: Users2,
      recommended: true,
      priorityLabel: "Paid last",
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
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero question - minimal */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Capital Stack
        </h2>
        <p className="text-white/40 text-sm">
          Select your funding sources
        </p>
      </div>

      {/* Selection cards */}
      <div className="bg-black border border-[#1A1A1A]">
        <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-white/40">Select all that apply</span>
          {selectedCount > 0 && (
            <span className="text-xs text-white/30">{selectedCount} selected</span>
          )}
        </div>

        <div className="divide-y divide-[#1A1A1A]">
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
                        ? "border-white/20 bg-white/5"
                        : "border-[#2A2A2A] bg-black"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSelected ? "text-white/70" : "text-white/30"
                      )}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isSelected ? "text-white" : "text-white/70"
                        )}
                      >
                        {option.title}
                      </span>
                      {option.recommended && !isSelected && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/40 uppercase tracking-wider">
                          Common
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-white/40 truncate flex-1">
                        {option.description}
                      </p>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex-shrink-0",
                        isSelected ? "bg-white/10 text-white/50" : "bg-[#1A1A1A] text-white/30"
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
                        : "bg-transparent border-[#3A3A3A]"
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

      {/* Hint text */}
      <p className="mt-4 text-center text-xs text-white/30">
        Most indie films use Senior Debt + Equity
      </p>
    </div>
  );
};

export default CapitalSelectStep;
