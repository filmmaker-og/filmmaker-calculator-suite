import { WaterfallInputs } from "@/lib/waterfall";
import { Info, Film, HelpCircle } from "lucide-react";
import { useState } from "react";
import { StandardStepIcon } from "../StandardStepIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.budget > 0;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero question */}
      <div className="text-center mb-8">
        <StandardStepIcon icon={Film} label="First things first..." />

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          What did it cost
          <br />
          <span className="text-gold">to make your film?</span>
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
          All-in production cost. Development through delivery.
        </p>
      </div>

      {/* Clean Input Card */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A]">
        {/* Header with label + info button */}
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-white/40">
              Production Budget
            </span>
            {isCompleted && (
              <span className="text-gold text-xs">✓</span>
            )}
          </div>
        </div>

        {/* Input Row */}
        <div className="p-5">
          {/* Label with info button */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-white/60">Negative Cost</span>
            <button
              onClick={() => setShowHelp(true)}
              className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-gold" />
            </button>
          </div>

          {/* Simple Input Field */}
          <div
            className={`
              flex items-center bg-black border transition-all duration-200
              ${isFocused
                ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : isCompleted
                  ? 'border-gold/40'
                  : 'border-[#2A2A2A]'
              }
            `}
          >
            <span className={`
              pl-4 pr-2 font-mono text-xl transition-colors
              ${isFocused ? 'text-gold' : isCompleted ? 'text-gold/70' : 'text-white/30'}
            `}>
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.budget)}
              onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="2,000,000"
              className="
                flex-1 bg-transparent py-4 pr-4 outline-none
                font-mono text-xl text-white text-right
                placeholder:text-white/20 tabular-nums
              "
              style={{
                fontVariantNumeric: 'tabular-nums',
              }}
            />
          </div>

          {/* Hint text */}
          {!isCompleted && !isFocused && (
            <p className="text-[11px] text-white/30 mt-3 text-center">
              Enter your total production budget to continue
            </p>
          )}
        </div>

        {/* Reference footer */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-[11px] text-white/30">Typical indie range</span>
            <span className="text-[11px] font-mono text-white/40">$500K – $10M</span>
          </div>
        </div>
      </div>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold flex items-center gap-2">
              <Info className="w-5 h-5" />
              WHAT IS NEGATIVE COST?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/60 text-sm leading-relaxed">
            <span className="text-gold font-medium">Negative Cost</span> is the film industry term for the total amount spent to produce a finished master copy of your film.
          </DialogDescription>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">Includes:</p>
            <div className="space-y-2 text-sm text-white/60">
              <p className="flex items-start gap-2">
                <span className="text-gold">+</span>
                Above-the-Line (talent, director, writer fees)
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gold">+</span>
                Below-the-Line (crew, equipment, locations)
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gold">+</span>
                Post-production & deliverables
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Does NOT include:</p>
              <p className="text-sm text-white/40">
                Marketing, sales fees, financing costs, or distribution expenses
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetStep;
