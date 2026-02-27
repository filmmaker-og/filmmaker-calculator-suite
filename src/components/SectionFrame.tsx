import { cn } from "@/lib/utils";

const tierStyles = {
  standard: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.025)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  elevated: {
    border: '1px solid rgba(212,175,55,0.20)',
    background: 'linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(255,255,255,0.04) 15%, rgba(255,255,255,0.04) 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(212,175,55,0.04)',
  },
  minimal: {
    border: 'none',
    background: 'transparent',
    boxShadow: 'none',
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
  tier?: 'standard' | 'elevated' | 'minimal';
}) => {
  return (
    <section id={id} className="px-6 py-16 md:py-24">
      <div
        className={cn(
          "max-w-md mx-auto",
          tier !== 'minimal' && "p-8 md:p-10 rounded-2xl",
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
