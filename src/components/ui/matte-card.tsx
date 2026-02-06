import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Matte Card - Premium section container
 *
 * Matches the reference calculator styling:
 * - Matte gradient background (#0D0D0D → #080808)
 * - 1px border (#1A1A1A)
 * - Sharp corners (no border-radius)
 * - Subtle inset shadow
 */

interface MatteCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const MatteCard = ({ children, className, noPadding }: MatteCardProps) => {
  return (
    <div
      className={cn(
        "matte-section overflow-hidden",
        !noPadding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
};

interface MatteCardHeaderProps {
  children: ReactNode;
  className?: string;
  rightElement?: ReactNode;
}

export const MatteCardHeader = ({
  children,
  className,
  rightElement,
}: MatteCardHeaderProps) => {
  return (
    <div
      className={cn(
        "matte-section-header px-5 py-3 flex items-center justify-between",
        className
      )}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
        {children}
      </span>
      {rightElement}
    </div>
  );
};

interface MatteCardContentProps {
  children: ReactNode;
  className?: string;
}

export const MatteCardContent = ({
  children,
  className,
}: MatteCardContentProps) => {
  return <div className={cn("p-5", className)}>{children}</div>;
};

interface MatteCardFooterProps {
  children: ReactNode;
  className?: string;
}

export const MatteCardFooter = ({
  children,
  className,
}: MatteCardFooterProps) => {
  return (
    <div
      className={cn(
        "border-t border-[#1A1A1A] bg-[#0A0A0A]/50 p-5",
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Status Badge - For verdict displays
 */
interface StatusBadgeProps {
  status: "excellent" | "good" | "marginal" | "underwater";
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const StatusBadge = ({
  status,
  label,
  icon,
  className,
}: StatusBadgeProps) => {
  const statusStyles = {
    excellent: "bg-emerald-500/15 border-emerald-500/50 text-emerald-400",
    good: "bg-gold/15 border-gold/50 text-gold",
    marginal: "bg-amber-500/15 border-amber-500/50 text-amber-400",
    underwater: "bg-red-500/15 border-red-500/50 text-red-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 border font-semibold text-sm tracking-wide",
        statusStyles[status],
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};

/**
 * Verdict Card - Dramatic result display
 */
interface VerdictCardProps {
  title: string;
  value: string;
  status: "excellent" | "good" | "marginal" | "underwater";
  subtitle?: string;
  className?: string;
}

export const VerdictCard = ({
  title,
  value,
  status,
  subtitle,
  className,
}: VerdictCardProps) => {
  const statusColors = {
    excellent: "#10B981",
    good: "#FFD700",
    marginal: "#F59E0B",
    underwater: "#EF4444",
  };

  const glowColors = {
    excellent: "rgba(16, 185, 129, 0.4)",
    good: "rgba(255, 215, 0, 0.4)",
    marginal: "rgba(245, 158, 11, 0.3)",
    underwater: "rgba(239, 68, 68, 0.3)",
  };

  return (
    <div className={cn("relative text-center", className)}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${glowColors[status]} 0%, transparent 70%)`,
          filter: "blur(40px)",
          transform: "scale(1.5)",
        }}
      />

      {/* Label */}
      <p className="text-[11px] uppercase tracking-[0.4em] text-white/50 font-semibold mb-4 relative z-10">
        {title}
      </p>

      {/* The Big Number */}
      <p
        className="font-bebas text-7xl sm:text-8xl tabular-nums leading-none relative z-10"
        style={{
          color: statusColors[status],
          textShadow: `0 0 60px ${glowColors[status]}`,
        }}
      >
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-white/40 mt-3 relative z-10">{subtitle}</p>
      )}
    </div>
  );
};

/**
 * Ledger Row - For waterfall breakdown items
 */
interface LedgerRowProps {
  label: string;
  value: string;
  percentage?: number;
  color?: string;
  isTotal?: boolean;
  className?: string;
}

export const LedgerRow = ({
  label,
  value,
  percentage,
  color = "#FFD700",
  isTotal,
  className,
}: LedgerRowProps) => {
  return (
    <div className={cn("py-4", className)}>
      {/* Label and value row */}
      <div
        className={cn(
          "flex items-center justify-between mb-2",
          isTotal && "pt-2"
        )}
      >
        <span
          className={cn(
            "text-sm",
            isTotal ? "text-white font-semibold" : "text-white/60"
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-mono",
            isTotal ? "text-xl text-gold font-bold" : "text-base text-white/80"
          )}
        >
          {value}
        </span>
      </div>

      {/* Fill bar (only for non-totals with percentage) */}
      {percentage !== undefined && !isTotal && (
        <div className="h-1.5 bg-[#1A1A1A] overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, percentage))}%`,
              background: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * CTA Card - Conversion-focused card for services
 */
interface CtaCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaText: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export const CtaCard = ({
  icon,
  title,
  description,
  ctaText,
  onClick,
  href,
  variant = "secondary",
  className,
}: CtaCardProps) => {
  const isPrimary = variant === "primary";

  const content = (
    <div
      className={cn(
        "p-5 border transition-all duration-200 cursor-pointer group",
        isPrimary
          ? "bg-gradient-to-r from-gold/10 to-transparent border-gold/30 hover:border-gold/50"
          : "bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2A2A2A]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 flex items-center justify-center flex-shrink-0 border",
            isPrimary
              ? "bg-gold/10 border-gold/30"
              : "bg-[#0D0D0D] border-[#2A2A2A]"
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "font-semibold mb-1",
              isPrimary ? "text-gold" : "text-white"
            )}
          >
            {title}
          </h4>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">
            {description}
          </p>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wider transition-colors",
              isPrimary
                ? "text-gold group-hover:text-gold-highlight"
                : "text-white/60 group-hover:text-white"
            )}
          >
            {ctaText} &rarr;
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default MatteCard;
