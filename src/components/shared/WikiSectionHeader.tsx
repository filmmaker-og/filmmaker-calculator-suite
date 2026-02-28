import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
      isExpanded !== false && "border-b border-bg-card-rule",
      isClickable && "cursor-pointer hover:bg-bg-card transition-colors"
    )}
    style={{ background: 'rgba(212,175,55,0.03)' }}
    onClick={onClick}
  >
    {/* Gold Left Bar */}
    <div
      className="w-1 flex-shrink-0"
      style={{
        background: 'linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0.40))',
        boxShadow: '0 0 12px rgba(212,175,55,0.06)',
      }}
    />

    {/* Section Number */}
    <div
      className="flex items-center justify-center px-4 py-4 min-w-[56px]"
      style={{
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(212,175,55,0.04)',
      }}
    >
      <span className="font-bebas text-[16px] tracking-wide text-gold">
        {number}
      </span>
    </div>

    {/* Title + Chevron */}
    <div className="flex items-center flex-1 px-4 py-4 justify-between">
      <h2 className="font-semibold text-[12px] uppercase tracking-widest text-white">
        {title}
      </h2>

      {isClickable && (
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isExpanded ? "rotate-180 text-gold" : "text-ink-secondary"
          )}
        />
      )}
    </div>
  </div>
);

export default WikiSectionHeader;
