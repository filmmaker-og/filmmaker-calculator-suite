import { LucideIcon, ArrowLeft, ArrowRight, Check, SkipForward, Info } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import StandardStepLayout from "../StandardStepLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RateConfig {
  field: 'seniorDebtRate' | 'mezzanineRate' | 'premium';
  label: string;
  min: number;
  max: number;
  step: number;
  standardValue: number;
  standardLabel: string;
}

interface StackInputCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  amountField: keyof WaterfallInputs;
  amountLabel: string;
  amountPlaceholder: string;
  amountHint: string;
  rateConfig?: RateConfig;
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  typicalRangeLabel?: string;
  helpText?: string;
}

/**
 * StackInputCard - Data collection mini-app screen
 *
 * Job: Collect one capital source amount (+ optional rate)
 * Pattern: Enter value → See calculation → Next/Skip
 */
const StackInputCard = ({
  icon: Icon,
  title,
  subtitle,
  amountField,
  amountLabel,
  amountPlaceholder,
  amountHint,
  rateConfig,
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
  showSkip = true,
  typicalRangeLabel,
  helpText,
}: StackInputCardProps) => {
  const haptics = useHaptics();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const amount = (inputs[amountField] as number) || 0;
  const hasAmount = amount > 0;
  const rateValue = rateConfig ? (inputs[rateConfig.field] as number) : 0;

  // Calculate total with rate if applicable
  const totalRepayment = rateConfig ? amount * (1 + rateValue / 100) : amount;
  const interestAmount = rateConfig ? amount * (rateValue / 100) : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      if (hasAmount) {
        onNext();
      }
    }
  };

  return (
    <StandardStepLayout
      chapter="02"
      title={title}
      subtitle={subtitle}
    >
      <div className="space-y-6">

        {/* Main Input Card - Store card pattern */}
        <div
          className="overflow-hidden"
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
          style={{
            background: "#0A0A0A",
            border: `1px solid rgba(212,175,55,${focused ? "0.45" : "0.15"})`,
            borderRadius: "12px",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            boxShadow: focused ? "0 0 16px rgba(212,175,55,0.12)" : "none",
          }}
        >
          {/* Section header */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                {amountLabel}
              </span>
              {helpText && (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.35)" }} />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-[200px] text-xs"
                      style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.20)" }}
                    >
                      <p>{helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {hasAmount && (
              <span className="text-xs font-mono flex items-center gap-1" style={{ color: "#D4AF37" }}>
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Amount Input */}
          <div className="p-5">
            <PremiumInput
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(amount)}
              onChange={(e) => onUpdateInput(amountField, parseValue(e.target.value))}
              onKeyDown={handleKeyDown}
              placeholder={amountPlaceholder}
              showCurrency
              actionHint={amountHint}
              isCompleted={hasAmount}
              isNext={!hasAmount}
            />
          </div>

          {/* Rate Stepper (if applicable) */}
          {rateConfig && hasAmount && (
            <div className="p-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-medium rounded-sm" style={{ background: "#D4AF37", color: "#000" }}>
                  %
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#D4AF37" }}>
                  {rateConfig.label}
                </span>
              </div>

              <PercentStepper
                value={rateValue}
                onChange={(value) => onUpdateInput(rateConfig.field, value)}
                min={rateConfig.min}
                max={rateConfig.max}
                step={rateConfig.step}
                standardValue={rateConfig.standardValue}
                standardLabel={rateConfig.standardLabel}
                isCompleted={true}
              />
            </div>
          )}

          {/* Calculation Result */}
          {hasAmount && rateConfig && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.55)" }}>Principal</span>
                    <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.55)" }}>+ {rateConfig.label} ({rateValue}%)</span>
                    <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(interestAmount)}</span>
                  </div>
                  <div style={{ height: "1px", background: "rgba(212,175,55,0.20)" }} />
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#D4AF37" }}>Total Repayment</span>
                    <span className="font-mono text-xl font-semibold" style={{ color: "#D4AF37" }}>{formatCompactCurrency(totalRepayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typical Range */}
          {typicalRangeLabel && (
            <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Typical range</span>
                <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{typicalRangeLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {/* Back */}
          <button
            onClick={(e) => { haptics.light(e); onBack(); }}
            className={cn(
              "flex-1 py-3 flex items-center justify-center gap-2",
              "transition-all active:scale-[0.98] rounded-md"
            )}
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
          </button>

          {/* Skip (if no value) or Next (if has value) */}
          {hasAmount ? (
            <button
              onClick={(e) => { haptics.light(e); onNext(); }}
              className={cn(
                "flex-[2] py-3 flex items-center justify-center gap-2",
                "transition-all active:scale-[0.98] rounded-md"
              )}
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", color: "#D4AF37" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : showSkip && onSkip ? (
            <button
              onClick={(e) => { haptics.light(e); onSkip?.(); }}
              className={cn(
                "flex-[2] py-3 flex items-center justify-center gap-2",
                "transition-all active:scale-[0.98] rounded-md"
              )}
              style={{ border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Skip This</span>
              <SkipForward className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </StandardStepLayout>
  );
};

export default StackInputCard;
