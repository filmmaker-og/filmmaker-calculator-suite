import { WaterfallResult, WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ChapterCard from "../ChapterCard";
import { cn } from "@/lib/utils";

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
  const producerNetPercent = result.producerPool.net > 0 
    ? (result.producerPool.net / result.distributor.gross) * 100 
    : 0;

  return (
    <div className="space-y-6 pb-24">
      <ChapterCard
        chapter="04"
        title="WATERFALL"
        isActive={true}
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
                  {formatCompactCurrency(result.producerPool.net)}
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

          {/* Action Link to Full Breakdown */}
          <Link 
            to="/waterfall-info"
            className="flex items-center justify-between p-4 bg-bg-surface border border-border-default rounded-md hover:border-gold-muted hover:bg-bg-card transition-all group"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary group-hover:text-gold transition-colors">
                View Full Protocol Breakdown
              </span>
              <span className="text-xs text-text-dim">
                See line-by-line distribution logic
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-gold transition-colors" />
          </Link>
        </div>
      </ChapterCard>
    </div>
  );
};

export default WaterfallTab;
