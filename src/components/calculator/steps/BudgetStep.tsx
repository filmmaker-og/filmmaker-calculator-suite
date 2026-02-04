import { WaterfallInputs } from "@/lib/waterfall";
import { Info, Film, HelpCircle, Briefcase, Building2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { StandardStepIcon } from "../StandardStepIcon";
import { useHaptics } from "@/hooks/use-haptics";
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
  const haptics = useHaptics();
  const [showHelp, setShowHelp] = useState(false);
  const [showCamHelp, setShowCamHelp] = useState(false);
  const [showSalesHelp, setShowSalesHelp] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMarketingFocused, setIsMarketingFocused] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.budget > 0;

  // Sales fee stepper handlers
  const incrementSalesFee = () => {
    if (inputs.salesFee < 30) {
      haptics.light();
      onUpdateInput('salesFee', Math.min(30, inputs.salesFee + 5));
    }
  };

  const decrementSalesFee = () => {
    if (inputs.salesFee > 0) {
      haptics.light();
      onUpdateInput('salesFee', Math.max(0, inputs.salesFee - 5));
    }
  };

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

      {/* OFF-THE-TOP FEES SECTION */}
      {isCompleted && (
        <div className="mt-6 space-y-4 animate-reveal-up">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
              Off-the-Top Fees
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          {/* CAM Fee - Display Only */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold/50" />
                <span className="text-sm text-white/60">CAM Fee</span>
                <button
                  onClick={() => setShowCamHelp(true)}
                  className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <HelpCircle className="w-2.5 h-2.5 text-gold" />
                </button>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg text-gold">1%</span>
                <span className="text-xs text-white/30 ml-2">fixed</span>
              </div>
            </div>
          </div>

          {/* Sales Agent Fee */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A]">
            <div className="px-5 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold/50" />
                <span className="text-sm text-white/60">Sales Agent Fee</span>
                <button
                  onClick={() => setShowSalesHelp(true)}
                  className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <HelpCircle className="w-2.5 h-2.5 text-gold" />
                </button>
              </div>
              <span className="text-xs text-white/30">10-25% typical</span>
            </div>
            <div className="p-5">
              {/* Stepper controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={decrementSalesFee}
                  disabled={inputs.salesFee <= 0}
                  className={`
                    w-12 h-12 flex items-center justify-center border transition-all active:scale-95
                    ${inputs.salesFee <= 0
                      ? 'border-[#1A1A1A] text-white/20 cursor-not-allowed'
                      : 'border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold'
                    }
                  `}
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center min-w-[80px]">
                  <span className={`font-mono text-3xl tabular-nums ${inputs.salesFee === 15 ? 'text-gold' : 'text-white'}`}>
                    {inputs.salesFee}%
                  </span>
                  {inputs.salesFee === 15 && (
                    <span className="text-[10px] text-gold/70 mt-1">✓ industry standard</span>
                  )}
                </div>

                <button
                  onClick={incrementSalesFee}
                  disabled={inputs.salesFee >= 30}
                  className={`
                    w-12 h-12 flex items-center justify-center border transition-all active:scale-95
                    ${inputs.salesFee >= 30
                      ? 'border-[#1A1A1A] text-white/20 cursor-not-allowed'
                      : 'border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold'
                    }
                  `}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Marketing / Delivery Cap */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A]">
            <div className="px-5 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Marketing & Delivery</span>
                <button
                  onClick={() => setShowSalesHelp(true)}
                  className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <HelpCircle className="w-2.5 h-2.5 text-gold" />
                </button>
              </div>
              <span className="text-xs text-white/30">AFM, markets, deliverables</span>
            </div>
            <div className="p-5">
              <div
                className={`
                  flex items-center bg-black border transition-all duration-200
                  ${isMarketingFocused
                    ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : inputs.salesExp > 0
                      ? 'border-gold/40'
                      : 'border-[#2A2A2A]'
                  }
                `}
              >
                <span className={`
                  pl-4 pr-2 font-mono text-lg transition-colors
                  ${isMarketingFocused ? 'text-gold' : inputs.salesExp > 0 ? 'text-gold/70' : 'text-white/30'}
                `}>
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.salesExp)}
                  onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                  onFocus={() => setIsMarketingFocused(true)}
                  onBlur={() => setIsMarketingFocused(false)}
                  placeholder="75,000"
                  className="
                    flex-1 bg-transparent py-3 pr-4 outline-none
                    font-mono text-lg text-white text-right
                    placeholder:text-white/20 tabular-nums
                  "
                />
              </div>
              {inputs.salesExp === 75000 && (
                <p className="text-[10px] text-gold/70 mt-2 text-center">✓ industry standard cap</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Dialog - Negative Cost */}
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

      {/* Help Dialog - CAM Fee */}
      <Dialog open={showCamHelp} onOpenChange={setShowCamHelp}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold flex items-center gap-2">
              <Info className="w-5 h-5" />
              WHAT IS CAM FEE?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/60 text-sm leading-relaxed">
            <span className="text-gold font-medium">CAM</span> stands for Collection Account Management fee.
          </DialogDescription>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-white/60 leading-relaxed">
              This is a 1% fee charged by the collection account manager who receives and distributes all revenues from your film.
            </p>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">The CAM agent:</p>
              <div className="space-y-2 text-sm text-white/60">
                <p className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Collects all revenue from distributors
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Pays out each party per the waterfall
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Provides quarterly statements
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog - Sales Agent */}
      <Dialog open={showSalesHelp} onOpenChange={setShowSalesHelp}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold flex items-center gap-2">
              <Info className="w-5 h-5" />
              SALES AGENT FEES
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/60 text-sm leading-relaxed">
            Sales agents represent your film at markets and negotiate distribution deals worldwide.
          </DialogDescription>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">Commission rate:</p>
            <div className="space-y-2 text-sm text-white/60">
              <p className="flex items-start gap-2">
                <span className="text-gold">•</span>
                Domestic sales: 10-15%
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gold">•</span>
                International sales: 15-25%
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gold">•</span>
                Combined world rights: ~15%
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Marketing & Delivery:</p>
              <p className="text-sm text-white/60 leading-relaxed">
                Covers costs for AFM, Cannes, Berlin attendance, screeners, trailers, and deliverables. $75K is standard cap for indie films.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetStep;
