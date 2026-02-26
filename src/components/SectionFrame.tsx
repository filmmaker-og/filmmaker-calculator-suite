import { cn } from "@/lib/utils";

const SectionFrame = ({
  id,
  children,
  className,
  variant,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
  variant?: "default" | "gold";
}) => {
  const isGold = variant === "gold";

  return (
    <section id={id} className="snap-section px-4 py-10 md:py-14">
      <div
        className={cn(
          "px-7 py-8 md:px-10 md:py-10 max-w-md mx-auto rounded-2xl",
          isGold && "px-8 py-10 md:px-11 md:py-12",
          className,
        )}
        style={{
          background: 'transparent',
          borderTop: isGold
            ? '1px solid rgba(212,175,55,0.30)'
            : '1px solid rgba(255,255,255,0.14)',
          borderLeft: isGold
            ? '1px solid rgba(212,175,55,0.18)'
            : '1px solid rgba(255,255,255,0.09)',
          borderRight: isGold
            ? '1px solid rgba(212,175,55,0.18)'
            : '1px solid rgba(255,255,255,0.09)',
          borderBottom: isGold
            ? '1px solid rgba(212,175,55,0.10)'
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: isGold
            ? [
                'inset 0 1px 0 rgba(255,255,255,0.06)',
                '0 2px 8px rgba(0,0,0,0.40)',
                '0 8px 32px rgba(0,0,0,0.25)',
                '0 0 20px rgba(212,175,55,0.06)',
              ].join(', ')
            : [
                'inset 0 1px 0 rgba(255,255,255,0.06)',
                '0 2px 8px rgba(0,0,0,0.40)',
                '0 8px 32px rgba(0,0,0,0.25)',
              ].join(', '),
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionFrame;
