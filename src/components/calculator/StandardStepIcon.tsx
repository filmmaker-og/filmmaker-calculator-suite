import { LucideIcon } from 'lucide-react';

interface StandardStepIconProps {
  icon: LucideIcon;
  label?: string;
}

/**
 * Standardized icon treatment for all calculator steps
 * - Consistent w-14 h-14 container
 * - Consistent w-7 h-7 icon size
 * - Consistent glow effect (blur 15px, scale 2)
 * - Consistent border and background opacity
 */
export const StandardStepIcon = ({ icon: Icon, label }: StandardStepIconProps) => {
  return (
    <div className="relative inline-block mb-6">
      {/* Standard glow effect */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
          filter: 'blur(15px)',
          transform: 'scale(2)',
        }}
      />
      {/* Standard icon container */}
      <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
        <Icon className="w-7 h-7 text-gold" />
      </div>
      {label && (
        <p className="text-white/40 text-xs mt-3 uppercase tracking-widest text-center">
          {label}
        </p>
      )}
    </div>
  );
};
