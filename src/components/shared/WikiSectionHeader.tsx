import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WIKI SECTION HEADER — Single source of truth
 *
 * The gold-accented section header used across ALL pages.
 * Features: Radiant gold left bar, gradient background, section number + title.
 */

interface WikiSectionHeaderProps {
  number: string;
  title: string;
  isClickable?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

const WikiSectionHeader = ({
  number,
  title,
  isClickable = false,
  isExpanded,
  onClick,
}: WikiSectionHeaderProps) => (
  <div
    className={cn(
      "flex items-stretch bg-gradient-to-r from-gold-glow via-bg-elevated to-bg-elevated",
      isExpanded !== false && "border-b border-border-subtle",
      isClickable && "cursor-pointer hover:bg-gold-subtle transition-colors"
    )}
    onClick={onClick}
  >
    {/* Gold Left Bar — THE signature element */}
    <div
      className="w-1 flex-shrink-0 bg-gradient-to-b from-gold to-gold-muted"
      style={{ boxShadow: '0 0 12px var(--gold-glow)' }}
    />

    {/* Section Number */}
    <div className="flex items-center justify-center px-4 py-4 border-r border-border-subtle min-w-[56px] bg-gold-subtle">
      <span className="font-bebas text-xl tracking-wide text-gold">
        {number}
      </span>
    </div>

    {/* Title + Chevron */}
    <div className="flex items-center flex-1 px-4 py-4 justify-between">
      <h2 className="font-bold text-xs uppercase tracking-widest text-text-primary">
        {title}
      </h2>

      {isClickable && (
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isExpanded ? "rotate-180 text-gold" : "text-text-dim"
          )}
        />
      )}
    </div>
  </div>
);

export default WikiSectionHeader;
