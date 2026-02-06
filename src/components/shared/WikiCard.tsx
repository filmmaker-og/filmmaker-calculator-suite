import { ReactNode } from "react";
import { colors, radius } from "@/lib/design-system";

/**
 * WIKI CARD — Single source of truth for content containers
 *
 * The matte card with subtle gold border used across ALL pages.
 * Always pair with WikiSectionHeader for the header.
 */

interface WikiCardProps {
  children: ReactNode;
  className?: string;
}

const WikiCard = ({ children, className }: WikiCardProps) => (
  <div
    className={`overflow-hidden animate-fade-in ${className || ""}`}
    style={{
      background: colors.card,
      border: `1px solid ${colors.borderSubtle}`,
      borderRadius: radius.lg,
    }}
  >
    {children}
  </div>
);

export default WikiCard;
