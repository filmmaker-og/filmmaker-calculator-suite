import { ReactNode } from "react";
import ChapterCard from "./ChapterCard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StandardStepLayoutProps {
  chapter: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  isComplete?: boolean;
  className?: string;
}

/**
 * StandardStepLayout - The "Gold Standard" container for all calculator steps.
 * 
 * Replaces the inconsistent "Hero Header" + "Matte Section" pattern.
 * Uses ChapterCard for the premium gold-gradient header.
 * 
 * Structure:
 * - ChapterCard Container
 *   - Header (Built-in to ChapterCard)
 *   - Body (NOW LIGHTER: bg-bg-elevated)
 *     - Subtitle (Optional)
 *     - Children (Input fields, etc)
 *     - Action Button (Continue)
 */
const StandardStepLayout = ({
  chapter,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "Continue",
  isComplete = false,
  className,
}: StandardStepLayoutProps) => {
  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <ChapterCard
        chapter={chapter}
        title={title}
        isActive={true}
        className="overflow-visible min-h-[500px]" 
      >
        <div className="flex flex-col h-full justify-between space-y-6">
          {/* Top Content */}
          <div className="space-y-6">
            {/* Context / Subtitle */}
            {subtitle && (
              <p className="text-sm text-text-dim border-b border-border-subtle pb-4 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Main Content (Inputs) - WRAPPED IN ELEVATED SURFACE */}
            {/* This fixes the "too black" issue by giving inputs a defined surface to sit on */}
            <div className="bg-bg-elevated border border-border-subtle rounded-lg p-5 space-y-6 shadow-sm">
              {children}
            </div>
          </div>

          {/* Action Button - Pinned to bottom of content flow, but stable */}
          {onNext && isComplete && (
            <div className="pt-4">
              <button
                onClick={onNext}
                className={cn(
                  "w-full py-4 flex items-center justify-center gap-3",
                  "bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta",
                  "hover:bg-gold-cta-subtle hover:border-gold-cta transition-all",
                  "active:scale-[0.98]",
                  "shadow-button"
                )}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span className="text-sm font-bold uppercase tracking-wider">{nextLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </ChapterCard>
    </div>
  );
};

export default StandardStepLayout;
