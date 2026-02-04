import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface PremiumInputProps extends React.ComponentProps<"input"> {
  /** Field has a valid value */
  isCompleted?: boolean;
  /** Field is the next one to fill (triggers attention animation) */
  isNext?: boolean;
  /** Field is currently focused */
  isActive?: boolean;
  /** Show currency prefix */
  showCurrency?: boolean;
  /** Show percent suffix */
  showPercent?: boolean;
  /** Container className */
  containerClassName?: string;
  /** Label text */
  label?: string;
  /** Step number for multi-input steps */
  stepNumber?: number;
  /** Example text shown when empty */
  example?: string;
  /** Hint text that shows what to enter */
  actionHint?: string;
  /** Validation hint shown below input */
  hint?: React.ReactNode;
  /** Make this a "hero" input with extra prominence */
  isHero?: boolean;
}

/**
 * Premium Input Component
 *
 * Luxurious input field with:
 * - Continuous pulsing glow when needs attention
 * - Clear visual states (empty, focused, completed)
 * - Elegant micro-interactions
 * - Action hints guiding the user
 */
const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      className,
      containerClassName,
      type,
      isCompleted = false,
      isNext = false,
      isActive = false,
      showCurrency = false,
      showPercent = false,
      label,
      stepNumber,
      example,
      actionHint,
      hint,
      isHero = false,
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const haptics = useHaptics();
    const [focused, setFocused] = React.useState(false);
    const localActive = isActive || focused;
    const isEmpty = !value || value === "" || value === "0";
    const needsAttention = isNext && isEmpty && !localActive;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      haptics.light();
      e.target.select();
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <div
        className={cn(
          "relative group",
          containerClassName
        )}
      >
        {/* Ambient glow for attention state - CONTINUOUS */}
        {needsAttention && (
          <div
            className="absolute -inset-3 pointer-events-none animate-attention-glow rounded-sm"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(249, 224, 118, 0.15) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Hero glow effect */}
        {isHero && !isEmpty && (
          <div
            className="absolute -inset-4 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, transparent 60%)',
              filter: 'blur(20px)',
            }}
          />
        )}

        {/* Main input container */}
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300 ease-out",
            // Base styling
            "bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A]",
            // Border states with clear hierarchy
            "border-2",
            localActive
              ? "border-gold-highlight shadow-[0_0_30px_rgba(249,224,118,0.35),inset_0_0_20px_rgba(249,224,118,0.05)] scale-[1.02]"
              : isCompleted
              ? "border-gold/60 bg-gradient-to-b from-[#0F0E0A] to-[#0A0908]"
              : needsAttention
              ? "border-gold/50 animate-border-glow"
              : "border-[#1A1A1A] hover:border-[#2A2A2A]",
            // Hero styling
            isHero && "border-gold/40 shadow-[0_0_60px_rgba(212,175,55,0.15)]",
            isHero && isCompleted && "shadow-[0_0_80px_rgba(212,175,55,0.25)]"
          )}
        >
          {/* Shimmer effect on focus */}
          {localActive && (
            <div
              className="absolute inset-0 pointer-events-none animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(249, 224, 118, 0.03) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          )}

          {/* Label row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              {/* Step number badge */}
              {stepNumber && (
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center text-xs font-mono font-bold transition-colors",
                    isCompleted
                      ? "bg-gold text-black"
                      : needsAttention
                      ? "bg-gold/20 text-gold border border-gold/50"
                      : "bg-[#1A1A1A] text-white/50 border border-[#2A2A2A]"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNumber}
                </div>
              )}

              {/* Label */}
              {label && (
                <label
                  className={cn(
                    "text-xs uppercase tracking-[0.2em] font-semibold transition-colors",
                    localActive
                      ? "text-gold"
                      : isCompleted
                      ? "text-gold/80"
                      : "text-white/50"
                  )}
                >
                  {label}
                </label>
              )}
            </div>

            {/* Completion indicator (if no step number) */}
            {!stepNumber && isCompleted && !localActive && (
              <div className="w-6 h-6 bg-gold flex items-center justify-center animate-scale-in">
                <Check className="w-3.5 h-3.5 text-black" />
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="relative flex items-center px-4 pb-4">
            {showCurrency && (
              <span
                className={cn(
                  "font-mono text-2xl mr-3 flex-shrink-0 transition-all duration-300",
                  localActive
                    ? "text-gold scale-110"
                    : isCompleted
                    ? "text-gold/70"
                    : "text-white/30"
                )}
                style={{
                  textShadow: localActive ? '0 0 20px rgba(212, 175, 55, 0.5)' : 'none',
                }}
              >
                $
              </span>
            )}

            <input
              type={type}
              className={cn(
                "flex-1 bg-transparent border-0 outline-none",
                "font-mono text-right transition-all tabular-nums",
                isHero ? "h-16" : "h-12",
                localActive
                  ? isHero ? "text-white text-4xl" : "text-white text-2xl"
                  : isCompleted
                  ? isHero ? "text-white text-4xl" : "text-white text-2xl"
                  : isHero ? "text-white/60 text-3xl" : "text-white/60 text-xl",
                "placeholder:text-white/20",
                "focus:outline-none focus:ring-0",
                className
              )}
              style={{
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum" 1',
              }}
              ref={ref}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />

            {showPercent && (
              <span
                className={cn(
                  "font-mono text-2xl ml-3 flex-shrink-0 transition-all duration-300",
                  localActive
                    ? "text-gold scale-110"
                    : isCompleted
                    ? "text-gold/70"
                    : "text-white/30"
                )}
                style={{
                  textShadow: localActive ? '0 0 20px rgba(212, 175, 55, 0.5)' : 'none',
                }}
              >
                %
              </span>
            )}
          </div>

          {/* Action hint - shows what to do */}
          {needsAttention && (
            <div className="px-4 pb-4 animate-fade-in">
              <div className="flex items-center gap-2 text-gold">
                <ChevronRight className="w-4 h-4 animate-bounce-right" />
                <span className="text-xs font-medium tracking-wide">
                  {actionHint || `Enter ${label?.toLowerCase() || 'value'} to continue`}
                </span>
              </div>
            </div>
          )}

          {/* Example hint - shows format */}
          {isEmpty && example && !needsAttention && !localActive && (
            <div className="px-4 pb-4">
              <span className="text-xs text-white/25">
                e.g., {example}
              </span>
            </div>
          )}

          {/* Validation/contextual hint */}
          {hint && localActive && (
            <div className="px-4 pb-4 animate-fade-in">
              {hint}
            </div>
          )}

          {/* Completed state left accent bar */}
          {isCompleted && !localActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold to-gold/50" />
          )}
        </div>

        {/* Bottom connector line for visual flow */}
        {needsAttention && (
          <div className="flex justify-center mt-3">
            <div className="w-px h-6 bg-gradient-to-b from-gold/50 to-transparent animate-pulse-slow" />
          </div>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };
