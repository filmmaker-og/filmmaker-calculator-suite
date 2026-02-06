import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, radius } from "@/lib/design-system";

/**
 * WIKI SECTION HEADER — Single source of truth
 *
 * The gold-accented section header used across ALL pages.
 * Features: Radiant gold left bar, gradient background, section number + title.
 *
 * This replaces the 5 separate SectionHeader implementations that existed
 * in IntroView, BudgetInfo, CapitalInfo, FeesInfo, and WaterfallInfo.
 */

const tokens = {
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldGlow: colors.goldGlow,
  goldFill: colors.goldSubtle,
  goldRadiant: colors.goldGlow,
  bgHeader: colors.elevated,
  borderMatte: colors.borderSubtle,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textDim: colors.textDim,
};

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
      "flex items-stretch",
      isClickable && "cursor-pointer hover:bg-white/[0.02] transition-colors"
    )}
    style={{
      background: `linear-gradient(90deg, ${tokens.goldRadiant} 0%, ${tokens.bgHeader} 15%, ${tokens.bgHeader} 100%)`,
      borderBottom: isExpanded !== false ? `1px solid ${tokens.borderMatte}` : "none",
    }}
    onClick={onClick}
  >
    {/* Gold Left Bar — THE signature element */}
    <div
      className="w-1 flex-shrink-0"
      style={{
        background: `linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldMuted} 100%)`,
        boxShadow: `0 0 12px ${tokens.goldGlow}`,
      }}
    />

    {/* Section Number */}
    <div
      className="flex items-center justify-center px-4 py-4"
      style={{
        borderRight: `1px solid ${tokens.borderSubtle}`,
        minWidth: "56px",
        background: tokens.goldFill,
      }}
    >
      <span
        className="font-bebas text-xl tracking-wide"
        style={{ color: tokens.gold }}
      >
        {number}
      </span>
    </div>

    {/* Title + Chevron */}
    <div className="flex items-center flex-1 px-4 py-4 justify-between">
      <h2
        className="font-bold text-xs uppercase tracking-widest"
        style={{ color: tokens.textPrimary }}
      >
        {title}
      </h2>

      {isClickable && (
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
          style={{ color: isExpanded ? tokens.gold : tokens.textDim }}
        />
      )}
    </div>
  </div>
);

export default WikiSectionHeader;
