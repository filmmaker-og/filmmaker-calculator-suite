import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PremiumInputProps extends React.ComponentProps<"input"> {
  /** Field has a valid value */
  isCompleted?: boolean;
  /** Field is the next one to fill */
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
  /** Example text shown when empty */
  example?: string;
  /** Validation hint shown below input */
  hint?: React.ReactNode;
  /** Info button click handler */
  onInfoClick?: () => void;
}

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
      example,
      hint,
      onInfoClick,
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const localActive = isActive || focused;
    const isEmpty = !value || value === "" || value === "0";

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
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
          // Base container
          "relative transition-all duration-200 ease-out",
          // Background gradient for premium feel
          "bg-gradient-to-b from-background to-[hsl(0_0%_3%)]",
          // Border states
          "border-2",
          localActive
            ? "border-gold-highlight shadow-[0_0_24px_rgba(249,224,118,0.4)] scale-[1.02] bg-[rgba(249,224,118,0.06)]"
            : isCompleted
            ? "border-gold/70"
            : isNext
            ? "border-gold/50 animate-pulse-border"
            : "border-border",
          // Completed state
          isCompleted && !localActive && "bg-[rgba(212,175,55,0.04)]",
          containerClassName
        )}
      >
        {/* Label row */}
        {label && (
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {label}
            </label>
            {isCompleted && !localActive && (
              <div className="w-5 h-5 bg-gold flex items-center justify-center animate-scale-in">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
        )}

        {/* Input row */}
        <div className="relative flex items-center px-4 pb-3">
          {showCurrency && (
            <span className="font-mono text-xl text-muted-foreground mr-2 flex-shrink-0">
              $
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none",
              "h-12 text-xl font-mono text-foreground text-right",
              "placeholder:text-muted-foreground/40",
              "focus:outline-none focus:ring-0",
              className
            )}
            ref={ref}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {showPercent && (
            <span className="font-mono text-xl text-muted-foreground ml-2 flex-shrink-0">
              %
            </span>
          )}
        </div>

        {/* Example hint */}
        {isEmpty && example && !localActive && (
          <div className="px-4 pb-3 animate-fade-in">
            <span className="text-xs text-muted-foreground/50">
              e.g., {example}
            </span>
          </div>
        )}

        {/* Validation hint */}
        {hint && localActive && (
          <div className="px-4 pb-3 animate-fade-in">{hint}</div>
        )}

        {/* Completed checkmark (if no label) */}
        {!label && isCompleted && !localActive && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-gold flex items-center justify-center animate-scale-in">
            <Check className="w-3 h-3 text-black" />
          </div>
        )}
      </div>
    );
  }
);
PremiumInput.displayName = "PremiumInput";

export { PremiumInput };
