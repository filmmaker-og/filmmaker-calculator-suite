import * as React from "react";
import { ChevronRight } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useMobileKeyboardScroll } from "@/hooks/use-mobile-keyboard";
import { gold, GOLD } from "@/lib/tokens";

interface PremiumInputProps extends React.ComponentProps<"input"> {
  isCompleted?: boolean;
  isNext?: boolean;
  showCurrency?: boolean;
  actionHint?: string;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ isCompleted = false, isNext = false, showCurrency = false, actionHint, value, onFocus, onBlur, ...props }, ref) => {
    const haptics = useHaptics();
    const [focused, setFocused] = React.useState(false);
    const isEmpty = !value || value === "" || value === "0";
    const needsAttention = isNext && isEmpty && !focused;

    const { ref: mobileRef, scrollIntoView } = useMobileKeyboardScroll<HTMLDivElement>();

    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      haptics.light();
      e.target.select();
      scrollIntoView();
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const hasValue = !isEmpty;

    return (
      <div ref={mobileRef}>
        {/* Input row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: focused ? "rgba(255,255,255,0.04)" : "transparent",
          borderRadius: "6px",
          padding: "0 4px",
          transition: "background 0.2s ease",
        }}>
          {showCurrency && (
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "1.5rem",
              fontWeight: 500,
              color: hasValue ? GOLD : gold(0.45),
              lineHeight: 1,
              marginRight: "8px",
              flexShrink: 0,
              transition: "color 0.2s ease",
            }}>
              $
            </span>
          )}

          <input
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "1.5rem",
              fontWeight: 500,
              color: hasValue ? "rgba(255,255,255,1.0)" : "rgba(255,255,255,0.25)",
              textAlign: "right" as const,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0",
              padding: "0 4px 0 0",
              height: "48px",
            }}
            {...props}
          />
        </div>

        {/* Action hint — static, no animation */}
        {needsAttention && actionHint && isEmpty && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "12px",
            color: GOLD,
          }}>
            <ChevronRight style={{ width: "16px", height: "16px" }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}>
              {actionHint}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };
