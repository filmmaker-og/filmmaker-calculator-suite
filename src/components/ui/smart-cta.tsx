import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface SmartCTAProps {
  /** Primary button text when enabled */
  ctaText: string;
  /** What the user needs to do to enable the button */
  requirement?: string;
  /** Whether the button can be clicked */
  canProceed: boolean;
  /** Click handler for next */
  onNext: () => void;
  /** Click handler for previous */
  onPrev?: () => void;
  /** Whether to show the back button */
  showBack?: boolean;
  /** Whether this is the final step */
  isFinal?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Smart CTA Component
 *
 * A luxurious call-to-action button that:
 * - Clearly explains WHY it's disabled
 * - Visually connects to the required input
 * - Provides satisfying feedback when enabled
 * - Has elegant micro-interactions
 */
const SmartCTA = ({
  ctaText,
  requirement,
  canProceed,
  onNext,
  onPrev,
  showBack = false,
  isFinal = false,
  className,
}: SmartCTAProps) => {
  const haptics = useHaptics();
  const [isPressed, setIsPressed] = React.useState(false);
  const [showShake, setShowShake] = React.useState(false);

  const handleClick = () => {
    if (!canProceed) {
      // Shake and provide feedback
      haptics.error();
      setShowShake(true);
      setTimeout(() => setShowShake(false), 500);
      return;
    }

    haptics.step();
    onNext();
  };

  const handleBack = () => {
    haptics.light();
    onPrev?.();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Requirement hint when disabled */}
      {!canProceed && requirement && (
        <div className="mb-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0D0D0D] border border-[#1A1A1A] text-center">
            <div className="w-5 h-5 rounded-full border border-gold/50 flex items-center justify-center animate-pulse-slow">
              <AlertCircle className="w-3 h-3 text-gold" />
            </div>
            <span className="text-xs text-white/60 tracking-wide">
              {requirement}
            </span>
          </div>

          {/* Connector line pointing up */}
          <div className="flex justify-center">
            <div className="w-px h-4 bg-gradient-to-t from-gold/30 to-transparent" />
          </div>
        </div>
      )}

      {/* Button row */}
      <div className="flex gap-3">
        {/* Back button */}
        {showBack && onPrev && (
          <button
            onClick={handleBack}
            className={cn(
              "h-14 px-5 flex items-center justify-center",
              "bg-[#0A0A0A] border border-[#2A2A2A]",
              "text-white/60 hover:text-white hover:border-[#3A3A3A]",
              "transition-all duration-200",
              "active:scale-95"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Main CTA button */}
        <button
          onClick={handleClick}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={cn(
            "flex-1 h-14 relative overflow-hidden",
            "font-black text-sm tracking-[0.15em] uppercase",
            "transition-all duration-200",
            showShake && "animate-shake",
            isPressed && canProceed && "scale-[0.98]",
            canProceed
              ? "bg-gold-cta text-black hover:brightness-110"
              : "bg-[#1A1A1A] text-white/30 cursor-not-allowed"
          )}
          style={{
            boxShadow: canProceed
              ? '0 0 40px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(0, 0, 0, 0.3)'
              : 'none',
          }}
        >
          {/* Shimmer effect when enabled */}
          {canProceed && (
            <div
              className="absolute inset-0 pointer-events-none animate-shimmer-slow"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          )}

          {/* Glow pulse when enabled */}
          {canProceed && (
            <div
              className="absolute inset-0 pointer-events-none animate-glow-pulse"
              style={{
                boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.1)',
              }}
            />
          )}

          {/* Button content */}
          <span className="relative flex items-center justify-center gap-3">
            {ctaText}
            {!isFinal && <ChevronRight className="w-5 h-5" />}
          </span>
        </button>
      </div>
    </div>
  );
};

export { SmartCTA };
