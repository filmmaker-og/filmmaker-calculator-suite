import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightContainerProps {
  children: React.ReactNode;
  /** Currently active field index */
  activeIndex?: number;
  /** Total number of fields */
  totalFields?: number;
  className?: string;
}

interface SpotlightFieldProps {
  children: React.ReactNode;
  index: number;
  activeIndex: number;
  isCompleted?: boolean;
  className?: string;
}

/**
 * Wraps child fields and applies spotlight effect
 * Fields not active fade to 50% opacity with subtle blur
 */
const SpotlightContainer = ({
  children,
  activeIndex = -1,
  className,
}: SpotlightContainerProps) => {
  return (
    <div className={cn("space-y-4 spotlight-container", className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex;
        const isNext = index === activeIndex + 1;
        
        return (
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              // Inactive fields fade and blur
              activeIndex >= 0 && !isActive && !isCompleted && !isNext && "opacity-40 blur-[0.5px]",
              // Completed fields stay visible but muted
              isCompleted && "opacity-80",
              // Next field pulses
              isNext && "opacity-100"
            )}
          >
            {React.cloneElement(child as React.ReactElement<any>, {
              isActive,
              isCompleted,
              isNext,
            })}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Individual field wrapper for spotlight effect
 */
const SpotlightField = ({
  children,
  index,
  activeIndex,
  isCompleted = false,
  className,
}: SpotlightFieldProps) => {
  const isActive = index === activeIndex;
  const isNext = index === activeIndex + 1;
  const isInactive = activeIndex >= 0 && !isActive && !isCompleted && !isNext;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isInactive && "opacity-40 blur-[0.5px]",
        isCompleted && !isActive && "opacity-80",
        className
      )}
    >
      {children}
    </div>
  );
};

export { SpotlightContainer, SpotlightField };
