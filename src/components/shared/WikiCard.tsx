import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WikiCardProps {
  children: ReactNode;
  className?: string;
}

const WikiCard = ({ children, className }: WikiCardProps) => (
  <div
    className={cn(
      "overflow-hidden animate-fade-in border border-gold-border bg-black rounded-xl",
      className
    )}
    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
  >
    {children}
  </div>
);

export default WikiCard;
