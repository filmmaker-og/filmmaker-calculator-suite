import { cn } from "@/lib/utils";

const SectionFrame = ({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
}) => (
  <section id={id} className="snap-section px-4 py-10 md:py-14">
    <div
      className={cn("px-7 py-8 md:px-10 md:py-10 max-w-md mx-auto rounded-2xl", className)}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(255, 255, 255, 0.02)",
      }}
    >
      {children}
    </div>
  </section>
);

export default SectionFrame;
