import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/**
 * STANDARD STEP LAYOUT
 * Enforces visual consistency across all calculator steps
 * 
 * Design System Rules:
 * - Icon: w-14 h-14 with standard glow
 * - Headers: text-3xl
 * - Section headers: simple, no gradients
 * - Colors: Gold only (no emerald/red)
 * - Completion: ✓ in gold
 */

interface StandardStepLayoutProps {
  // Visual elements
  icon: LucideIcon;
  title: string;
  titleHighlight: string;
  subtitle: string;
  sectionLabel: string;
  sectionIcon?: LucideIcon;
  
  // State
  isCompleted: boolean;
  
  // Content
  children: ReactNode;
  helpContent?: ReactNode;
  quickReference?: ReactNode;
  
  // Optional context card above main section
  contextCard?: ReactNode;
}

const StandardStepLayout = ({
  icon: Icon,
  title,
  titleHighlight,
  subtitle,
  sectionLabel,
  sectionIcon: SectionIcon,
  isCompleted,
  children,
  helpContent,
  quickReference,
  contextCard,
}: StandardStepLayoutProps) => {
  return (
    <div className="step-enter">
      {/* STANDARD HERO HEADER */}
      <div className="text-center mb-8">
        {/* STANDARD ICON WITH GLOW */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Icon className="w-7 h-7 text-gold" />
          </div>
        </div>

        {/* STANDARD HEADER */}
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          {title}
          <br />
          <span className="text-gold">{titleHighlight}</span>
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* OPTIONAL CONTEXT CARD */}
      {contextCard && (
        <div className="mb-6">
          {contextCard}
        </div>
      )}

      {/* MAIN INPUT SECTION */}
      <div className="matte-section">
        {/* STANDARD SECTION HEADER */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {SectionIcon && <SectionIcon className="w-4 h-4 text-gold/60" />}
            <span className="text-xs uppercase tracking-wider text-white/40">
              {sectionLabel}
            </span>
          </div>
          {isCompleted && (
            <span className="text-xs text-gold font-mono">
              ✓
            </span>
          )}
        </div>

        {/* INPUT CONTENT */}
        <div className="p-5">
          {children}
        </div>
      </div>

      {/* OPTIONAL QUICK REFERENCE */}
      {quickReference && (
        <div className="mt-4">
          {quickReference}
        </div>
      )}

      {/* OPTIONAL HELP SECTION */}
      {helpContent && (
        <div className="mt-6">
          {helpContent}
        </div>
      )}
    </div>
  );
};

export default StandardStepLayout;
