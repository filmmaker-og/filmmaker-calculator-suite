import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   SECTION FRAME — gold accent border wrapper for every section
   ═══════════════════════════════════════════════════════════════════ */
const SectionFrame = ({
  id,
  children,
  className,
  alt,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
}) => (
  <section id={id} className="snap-section px-4 py-6">
    <div className="flex rounded-2xl overflow-hidden border border-white/[0.06]">
      <div
        className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20"
        style={{ boxShadow: "0 0 16px rgba(212,175,55,0.30)" }}
      />
      <div
        className={cn(
          "flex-1 min-w-0",
          alt ? "bg-bg-surface" : "bg-bg-elevated",
          className
        )}
      >
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  </section>
);

export default SectionFrame;
