import { ReactNode } from "react";

interface WikiCalloutProps {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}

const WikiCallout = ({ label, children, icon }: WikiCalloutProps) => (
  <div
    className="p-4 rounded-xl"
    style={{
      border: '1px solid rgba(212,175,55,0.15)',
      background: 'rgba(212,175,55,0.03)',
    }}
  >
    <div className="flex gap-3">
      {icon && (
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-2 text-gold">
          {label}
        </p>
        <div className="text-[16px] leading-relaxed text-ink-body">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default WikiCallout;
