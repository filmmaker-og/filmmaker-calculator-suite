import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntakeFormData } from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const fmt = (v: number | null): string =>
  v === null || v === 0 ? "" : v.toLocaleString("en-US");
const parse$ = (s: string): number | null => {
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
};

const CurrencyInput = ({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  required?: boolean;
}) => (
  <div>
    <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
      {label} {required && <span className="text-gold">*</span>}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim text-lg font-mono">
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={fmt(value)}
        onChange={(e) => onChange(parse$(e.target.value))}
        placeholder="0"
        className="w-full h-14 pl-8 pr-4 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-xl font-mono focus:outline-none focus:border-gold/50"
      />
    </div>
  </div>
);

const getTargetContext = (
  budget: number | null,
  target: number | null
): { color: string; text: string } | null => {
  if (!budget || !target) return null;
  if (target < budget)
    return {
      color: "text-yellow-500/80",
      text: "Your target scenario is below your production budget. This means investors may not fully recoup even in your expected case. Consider whether your budget can be reduced or your revenue assumptions are too conservative.",
    };
  const ratio = target / budget;
  if (ratio <= 1.1)
    return {
      color: "text-yellow-500/80",
      text: "Your target scenario roughly matches your budget. After waterfall deductions (agent fees, distribution costs, CAM), investors will likely recoup 60-80% of principal at this revenue level. The arbitrage opportunity is thin.",
    };
  if (ratio <= 1.5)
    return {
      color: "text-green-400/80",
      text: "Healthy margin. If your revenue assumptions are based on real comparables, this gives investors a credible path to full recoupment plus premium.",
    };
  return {
    color: "text-gold",
    text: "Strong upside scenario. Make sure your comparable films data supports this valuation \u2014 overestimating acquisition prices is the most common mistake in indie film financial projections.",
  };
};

const IntakeStep5 = ({ formData, updateFormData, onNext, onBack }: Props) => {
  const { scenario_conservative, scenario_target, scenario_optimistic } =
    formData;

  // Validation
  const errors: string[] = [];
  if (
    scenario_conservative &&
    scenario_target &&
    scenario_conservative >= scenario_target
  ) {
    errors.push("Conservative scenario must be less than Target.");
  }
  if (
    scenario_target &&
    scenario_optimistic &&
    scenario_target >= scenario_optimistic
  ) {
    errors.push("Target scenario must be less than Optimistic.");
  }

  const canProceed =
    scenario_conservative !== null &&
    scenario_conservative > 0 &&
    scenario_target !== null &&
    scenario_target > 0 &&
    scenario_optimistic !== null &&
    scenario_optimistic > 0 &&
    errors.length === 0;

  const targetContext = getTargetContext(formData.total_budget, scenario_target);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          MODEL YOUR REVENUE SCENARIOS
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          Enter three acquisition price points. Your finance plan will show
          exactly how revenue flows through the waterfall — and what each
          investor gets back — at each scenario.
        </p>
      </div>

      {/* Teaching Copy */}
      <div className="p-4 rounded-xl bg-gold/[0.04] border border-gold/15">
        <p className="text-text-mid text-[11px] leading-relaxed">
          Think of these as: <strong>Conservative</strong> = "what if the market
          is cold and we take the best available deal." <strong>Target</strong> =
          "what comparable films in our genre/budget range actually sold for."{" "}
          <strong>Optimistic</strong> = "what happens if we over-deliver —
          festival buzz, bidding war, breakout cast performance."
        </p>
      </div>

      {/* Scenario Fields */}
      <div className="space-y-5">
        <CurrencyInput
          label="Conservative Scenario"
          value={scenario_conservative}
          onChange={(v) => updateFormData({ scenario_conservative: v })}
          required
        />
        <CurrencyInput
          label="Target Scenario"
          value={scenario_target}
          onChange={(v) => updateFormData({ scenario_target: v })}
          required
        />
        <CurrencyInput
          label="Optimistic Scenario"
          value={scenario_optimistic}
          onChange={(v) => updateFormData({ scenario_optimistic: v })}
          required
        />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err) => (
            <p key={err} className="text-red-400/80 text-xs">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Contextual guidance */}
      {targetContext && (
        <div className="p-4 rounded-xl bg-gold/[0.04] border border-gold/15">
          <p className={cn("text-[11px] leading-relaxed", targetContext.color)}>
            {targetContext.text}
          </p>
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

export default IntakeStep5;
