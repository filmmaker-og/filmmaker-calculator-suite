import { WaterfallResult, WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { ArrowRight, Lock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallTab = ({ result, inputs }: WaterfallTabProps) => {
  const isLocked = inputs.budget === 0 || inputs.revenue === 0;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center h-[50vh]">
        <div className="p-4 rounded-full bg-bg-surface border border-border-default">
          <Lock className="w-8 h-8 text-text-dim" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bebas tracking-wide text-text-primary">
            Waterfall Protocol Locked
          </h3>
          <p className="text-sm text-text-dim max-w-[280px]">
            Please complete the <span className="text-gold">Budget</span> and <span className="text-gold">Deal</span> sections to generate your simulation.
          </p>
        </div>
      </div>
    );
  }

  // Calculate producer's net share percentage
  const producerNetPercent = result.producer > 0 && inputs.revenue > 0
    ? (result.producer / inputs.revenue) * 100 
    : 0;

  return (
    <StandardStepLayout
      chapter="04"
      title="WATERFALL"
      subtitle="Final position and net distribution"
      className="pb-24"
    >
      <div className="space-y-6">
        {/* Top Level Summary Card */}
        <div className="bg-bg-card border border-gold-muted rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="font-bebas text-6xl text-gold">NET</span>
          </div>
          
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-text-dim">
              Producer's Net Position
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-mono font-bold text-gold">
                {formatCompactCurrency(result.producer)}
              </span>
              <span className="text-sm font-mono text-gold-bright">
                ({producerNetPercent.toFixed(1)}%)
              </span>
            </div>
            <p className="text-xs text-text-dim mt-2">
              After all fees, expenses, and investor recoupment.
            </p>
          </div>
        </div>

        {/* Action Link to Full Breakdown - NOW A PROMINENT BUTTON */}
        <Link 
          to="/waterfall-info"
          className="flex items-center justify-between p-5 bg-bg-elevated border border-gold/30 hover:border-gold rounded-lg transition-all group shadow-[0_4px_14px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 bg-gold/10 rounded-md border border-gold/20 text-gold group-hover:text-gold-bright transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white group-hover:text-gold transition-colors">
                  View Full Protocol Breakdown
                </span>
                <span className="text-xs text-text-dim group-hover:text-text-mid transition-colors">
                  See the line-by-line distribution logic
                </span>
              </div>
           </div>
           
           <div className="relative z-10 p-1 rounded-full border border-transparent group-hover:border-gold/30 transition-colors">
             <ArrowRight className="w-5 h-5 text-text-dim group-hover:text-gold transition-colors" />
           </div>
        </Link>
      </div>
    </StandardStepLayout>
  );
};

export default WaterfallTab;
