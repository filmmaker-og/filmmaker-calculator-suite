import * as React from "react";
import { cn } from "@/lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  /** Step number (1-indexed) */
  stepNumber?: number;
  /** Total steps */
  totalSteps?: number;
  /** Main title */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Whether this step has required input that's empty */
  needsAttention?: boolean;
  /** Extra className for the container */
  className?: string;
}

/**
 * Premium Step Container
 *
 * Provides elegant visual structure for each calculator step with:
 * - Matte grey background with subtle gradient
 * - Refined border treatment
 * - Clear visual hierarchy
 * - Attention-grabbing state when input is needed
 */
const StepContainer = React.forwardRef<HTMLDivElement, StepContainerProps>(
  (
    {
      children,
      stepNumber,
      totalSteps,
      title,
      subtitle,
      needsAttention = false,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "step-enter relative",
          className
        )}
      >
        {/* Ambient glow when needs attention */}
        {needsAttention && (
          <div
            className="absolute -inset-4 pointer-events-none animate-ambient-pulse"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        )}

        {/* Main container */}
        <div
          className={cn(
            "relative overflow-hidden",
            // Base styling - matte grey with subtle depth
            "bg-gradient-to-b from-[#0D0D0D] to-[#080808]",
            // Border treatment
            "border border-[#1A1A1A]",
            // Subtle inner shadow for depth
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
            // Outer shadow for lift
            "shadow-lg shadow-black/20",
            // Attention state
            needsAttention && "border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
          )}
        >
          {/* Top accent line */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-[1px]",
              "bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent",
              needsAttention && "via-gold/40"
            )}
          />

          {/* Step indicator bar */}
          {(stepNumber || title) && (
            <div className="relative px-5 py-4 border-b border-[#1A1A1A] bg-[#0A0A0A]/50">
              <div className="flex items-center justify-between">
                {/* Title area */}
                <div className="flex-1">
                  {title && (
                    <h2 className="font-bebas text-lg tracking-[0.15em] text-text-primary">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-text-dim mt-0.5 tracking-wide">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Step counter */}
                {stepNumber && totalSteps && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gold/60 tracking-wider">
                      STEP
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-mono text-sm text-gold font-semibold">
                        {stepNumber}
                      </span>
                      <span className="font-mono text-xs text-text-dim">
                        /{totalSteps}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="relative px-5 py-6">
            {children}
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent"
          />
        </div>
      </div>
    );
  }
);

StepContainer.displayName = "StepContainer";

export { StepContainer };
