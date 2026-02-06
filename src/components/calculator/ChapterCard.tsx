import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChapterCardProps {
  chapter: string;  // "01", "02", etc.
  title: string;
  isActive?: boolean;
  children: ReactNode;
  glossaryTrigger?: ReactNode;
  className?: string;
}

const ChapterCard = ({
  chapter,
  title,
  isActive = true,
  children,
  glossaryTrigger,
  className,
}: ChapterCardProps) => {
  return (
    <section className={cn("chapter-card", isActive && "is-active", className)}>
      {/* Header with 4-column grid: gold bar + number + title + glossary */}
      <header className="chapter-card-header">
        {/* Gold accent bar */}
        <div className="chapter-card-gold-bar" />

        {/* Chapter number */}
        <div className="chapter-card-number">
          {chapter}
        </div>

        {/* Title */}
        <h2 className="chapter-card-title">
          {title}
        </h2>

        {/* Glossary trigger slot */}
        <div className="pr-3">
          {glossaryTrigger}
        </div>
      </header>

      {/* Body */}
      <div className="chapter-card-body">
        {children}
      </div>
    </section>
  );
};

export default ChapterCard;
