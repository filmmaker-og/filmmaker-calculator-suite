import { ReactNode } from "react";

/**
 * WIKI CALLOUT — Gold-accented callout box
 *
 * Used for key insights, rules of thumb, pro tips, and warnings.
 * Gold-only - NO red/green/orange variants. Severity is communicated
 * through label text, not color.
 */

interface WikiCalloutProps {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}

const WikiCallout = ({ label, children, icon }: WikiCalloutProps) => (
  <div className="p-4 bg-gold-subtle rounded-[--radius-md] border border-gold-muted">
    <div className="flex gap-3">
      {icon && (
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-gold">
          {label}
        </p>
        <div className="text-sm leading-relaxed text-text-primary">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default WikiCallout;
