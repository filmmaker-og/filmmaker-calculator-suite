import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * WIKI CARD — Single source of truth for content containers
 *
 * The matte card with subtle border used across ALL pages.
 * Always pair with WikiSectionHeader for the header.
 */

interface WikiCardProps {
  children: ReactNode;
  className?: string;
}

const WikiCard = ({ children, className }: WikiCardProps) => (
  <div
    className={cn(
      "overflow-hidden animate-fade-in bg-bg-card border border-border-subtle rounded-[--radius-lg]",
      className
    )}
  >
    {children}
  </div>
);

export default WikiCard;
