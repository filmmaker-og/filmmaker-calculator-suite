import { LucideIcon } from 'lucide-react';

interface StandardSectionHeaderProps {
  icon: LucideIcon;
  label: string;
  isCompleted?: boolean;
}

/**
 * Standardized section header for all calculator steps
 * - Consistent padding (px-5 py-3)
 * - No gradients, no pulsing dots, no font-weight changes
 * - Consistent completion indicator (gold checkmark)
 */
export const StandardSectionHeader = ({ 
  icon: Icon, 
  label, 
  isCompleted = false 
}: StandardSectionHeaderProps) => {
  return (
    <div className="matte-section-header px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gold/60" />
        <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
          {label}
        </span>
      </div>
      {isCompleted && (
        <span className="text-xs text-gold font-mono">✓</span>
      )}
    </div>
  );
};
