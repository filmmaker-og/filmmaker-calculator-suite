import { LucideIcon } from 'lucide-react';

interface StandardStepIconProps {
  icon: LucideIcon;
  label?: string;
}

/**
 * Clean, minimal icon for calculator steps
 */
export const StandardStepIcon = ({ icon: Icon, label }: StandardStepIconProps) => {
  return (
    <div className="inline-block mb-4">
      <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      {label && (
        <p className="text-white/30 text-[10px] mt-2 uppercase tracking-widest text-center">
          {label}
        </p>
      )}
    </div>
  );
};
