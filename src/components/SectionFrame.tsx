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
      {/* Gradient border wrapper — 1px padding reveals the gradient as a border */}
      <div
        className="max-w-md mx-auto rounded-2xl"
        style={{
          padding: '1px',
          background: isGold
            ? 'linear-gradient(to bottom, rgba(212,175,55,0.30), rgba(212,175,55,0.10))'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
          boxShadow: isGold
            ? '0 2px 8px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.25), 0 0 20px rgba(212,175,55,0.06)'
            : '0 2px 8px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        <div
          className={cn(
            "px-7 py-8 md:px-10 md:py-10 rounded-[15px]",
            isGold && "px-8 py-10 md:px-11 md:py-12",
            className,
          )}
          style={{
            background: 'rgb(18, 18, 18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionFrame;
