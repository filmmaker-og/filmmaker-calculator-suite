import { cn } from "@/lib/utils";

const tierStyles = {
  standard: {
    border: '1px solid rgba(255,255,255,0.06)',
    background: '#000000',
    boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.35)',
  },
  elevated: {
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, #000000 15%, #000000 100%)',
    boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.35), 0 0 40px rgba(212,175,55,0.08)',
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
    <section id={id} className="px-6 py-10 md:py-16">
      <div
        className={cn(
          "max-w-md mx-auto",
          tier !== 'minimal' && "p-6 md:p-8 rounded-none",
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
