import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER — consistent eyebrow + title + optional subtitle
   Variants:
     default     — icon + larger title (Store pages)
     flankingLines + compact — gradient flanking lines + smaller title (Index page)
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  plainSubtitle,
  flankingLines,
  compact,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  plainSubtitle?: boolean;
  flankingLines?: boolean;
  compact?: boolean;
}) => (
  <div className={cn("text-center", compact ? "mb-10" : "mb-8")}>
    <div className={cn("flex items-center justify-center", compact ? "gap-4 mb-4" : "gap-2 mb-3")}>
      {flankingLines && (
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/20" />
      )}
      {Icon && !flankingLines && <Icon className="w-5 h-5 text-gold" />}
      <p className={cn(
        "tracking-[0.3em] uppercase font-semibold",
        compact ? "text-white/50 text-[13px]" : "text-text-dim text-sm"
      )}>
        {eyebrow}
      </p>
      {flankingLines && (
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/20" />
      )}
    </div>
    <h2 className={cn(
      "font-bebas tracking-[0.08em] text-gold",
      compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
    )}>
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "text-center max-w-lg mx-auto mt-4 leading-relaxed",
          plainSubtitle
            ? "text-text-mid text-base"
            : "text-text-mid text-base px-4 py-2.5 bg-gold/[0.06] border border-gold/20 rounded-xl"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
