import { cn } from "@/lib/utils";

const SectionFrame = ({
  id,
  children,
  className,
  alt: _alt,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
}) => (
  <section id={id} className="snap-section px-4 py-4">
    <div className={cn("px-7 py-5 md:px-10 md:py-7", className)}>
      {children}
    </div>
  </section>
);

export default SectionFrame;
