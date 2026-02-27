import { cn } from "@/lib/utils";

const tierStyles = {
  standard: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.025)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  elevated: {
    border: '1px solid rgba(212,175,55,0.20)',
    background: 'rgba(255,255,255,0.04)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(212,175,55,0.04)',
  },
};

const SectionFrame = ({
  id,
  children,
  className,
  tier = 'standard',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tier?: 'standard' | 'elevated';
}) => {
  return (
    <section id={id} className="px-6 py-16 md:py-20">
      <div
        className={cn(
          "p-8 md:p-10 max-w-md mx-auto rounded-2xl",
          className,
        )}
        style={tierStyles[tier]}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionFrame;
