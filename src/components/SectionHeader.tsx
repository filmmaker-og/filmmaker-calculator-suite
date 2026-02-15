import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER — consistent eyebrow + title + optional subtitle
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  plainSubtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  plainSubtitle?: boolean;
}) => (
  <div className="text-center mb-8">
    <div className="flex items-center gap-2 justify-center mb-3">
      {Icon && <Icon className="w-5 h-5 text-gold" />}
      <p className="text-text-dim text-xs tracking-[0.3em] uppercase font-semibold">
        {eyebrow}
      </p>
    </div>
    <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold">
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "text-center max-w-lg mx-auto mt-4 leading-relaxed",
          plainSubtitle
            ? "text-text-mid text-sm"
            : "text-text-mid text-sm px-4 py-2.5 rounded-xl bg-gold/[0.06] border border-gold/20"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
