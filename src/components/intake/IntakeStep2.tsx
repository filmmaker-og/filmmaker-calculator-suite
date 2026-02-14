import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntakeFormData } from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const formatCurrency = (value: number | null): string => {
  if (value === null || value === 0) return "";
  return value.toLocaleString("en-US");
};

const parseCurrency = (str: string): number | null => {
  const cleaned = str.replace(/[^0-9]/g, "");
  if (!cleaned) return null;
  return parseInt(cleaned, 10);
};

const getBudgetContext = (budget: number | null): string | null => {
  if (!budget) return null;
  if (budget < 500_000)
    return "Micro-budget range. At this level, deferments and tax credits will be critical to your capital stack. Most financing at this range comes from private equity and personal investment.";
  if (budget <= 2_000_000)
    return "Low-budget independent range. This is where smart packaging and tax credit stacking can create significant arbitrage between production cost and market value.";
  if (budget <= 5_000_000)
    return "Core independent range. Most streamer acquisitions in this range. You'll likely need a mixed capital stack: equity + tax credits + potentially gap financing.";
  if (budget <= 10_000_000)
    return "Upper independent range. At this budget level, presales and/or a bankable cast package become important for closing the financing gap. Institutional lenders may participate.";
  return "Studio-independent range. This budget typically requires completion bonding, institutional debt, and significant presale commitments. Our models are optimized for the $1M\u2013$10M range \u2014 results above $10M should be validated with your finance team.";
};

const IntakeStep2 = ({ formData, updateFormData, onNext, onBack }: Props) => {
  const canProceed =
    formData.total_budget !== null &&
    formData.total_budget >= 100_000 &&
    formData.total_budget <= 50_000_000;

  const contextCopy = getBudgetContext(formData.total_budget);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          WHAT'S YOUR PRODUCTION BUDGET?
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          This is your total production budget — everything from development
          through delivery. If you've already modeled this in the free
          calculator, enter that number here.
        </p>
      </div>

      {/* Budget field */}
      <div>
        <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
          Total Production Budget <span className="text-gold">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim text-lg font-mono">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrency(formData.total_budget)}
            onChange={(e) => {
              const val = parseCurrency(e.target.value);
              updateFormData({ total_budget: val });
            }}
            placeholder="0"
            className="w-full h-14 pl-8 pr-4 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-2xl font-mono focus:outline-none focus:border-gold/50"
          />
        </div>
        {formData.total_budget !== null && formData.total_budget < 100_000 && (
          <p className="text-yellow-500/80 text-xs mt-2">
            Minimum budget: $100,000
          </p>
        )}
        {formData.total_budget !== null && formData.total_budget > 50_000_000 && (
          <p className="text-yellow-500/80 text-xs mt-2">
            Maximum budget: $50,000,000
          </p>
        )}
      </div>

      {/* Contextual teaching copy */}
      {contextCopy && (
        <div className="p-4 rounded-xl bg-gold/[0.04] border border-gold/15">
          <p className="text-text-mid text-sm leading-relaxed">{contextCopy}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-dim text-sm hover:text-text-mid transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-2 h-14 px-8 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
            "bg-gold/[0.22] border-2 border-gold/60 text-gold text-sm",
            "hover:border-gold/80 hover:bg-gold/[0.28]",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IntakeStep2;
