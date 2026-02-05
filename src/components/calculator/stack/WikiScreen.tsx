import { LucideIcon, ArrowRight, Info, Shield, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface WikiSection {
  icon: LucideIcon;
  title: string;
  content: string;
  highlight?: string;
}

interface WikiScreenProps {
  icon: LucideIcon;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  sections: WikiSection[];
  proTip?: {
    text: string;
    highlight?: string;
  };
  onContinue: () => void;
  stepLabel?: string;
}

/**
 * WikiScreen - Educational mini-app screen
 * 
 * Job: Educate the user about a concept → then proceed to input
 * Pattern: Read → Understand → Tap "Got It"
 */
const WikiScreen = ({
  icon: Icon,
  title,
  titleHighlight,
  subtitle,
  sections,
  proTip,
  onContinue,
  stepLabel,
}: WikiScreenProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Label */}
      {stepLabel && (
        <div className="flex items-center space-x-2 text-gold/80 text-xs font-mono uppercase tracking-widest">
          <Info className="w-3 h-3" />
          <span>{stepLabel}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-16 h-16 border border-gold/30 bg-gold/5 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
            <Icon className="w-8 h-8 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          {title}
          {titleHighlight && (
            <>
              <br />
              <span className="text-gold">{titleHighlight}</span>
            </>
          )}
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Wiki Content Card */}
      <div
        className="bg-bg-surface border border-border-default p-5 space-y-5"
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        {sections.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 flex-shrink-0" style={{ borderRadius: 'var(--radius-md)' }}>
                <SectionIcon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{section.title}</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  {section.content}
                  {section.highlight && (
                    <span className="text-white font-medium"> {section.highlight}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tip Callout */}
      {proTip && (
        <div 
          className="bg-blue-900/10 border-l-4 border-blue-500/50 p-4 flex items-start space-x-3" 
          style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
        >
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200/80 leading-relaxed">
            <span className="font-bold text-blue-200">Pro Tip:</span> {proTip.text}
            {proTip.highlight && (
              <span className="text-blue-200 font-medium"> {proTip.highlight}</span>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className={cn(
          "w-full py-4 flex items-center justify-center gap-3",
          "bg-gold/10 border border-gold/30 text-gold",
          "hover:bg-gold/20 hover:border-gold/50 transition-all",
          "active:scale-[0.98]"
        )}
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <span className="text-sm font-bold uppercase tracking-wider">Got It — Enter Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WikiScreen;
