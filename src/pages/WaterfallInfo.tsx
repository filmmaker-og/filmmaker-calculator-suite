import { useEffect } from "react";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Share2, Printer, Lock, AlertTriangle, ShieldAlert, BadgeDollarSign, Calculator, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WaterfallInfo = () => {
  const navigate = useNavigate();

  // Fix scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToCalculator = () => {
    // Navigate to calculator. If they have data, it will show their last state.
    // NOTE: We do NOT force ?tab=waterfall here, because the Calculator component
    // has logic to determine the correct tab based on completion status.
    // If we force tab=waterfall but inputs are empty, it might show a locked screen.
    // Ideally, we just go back to the calculator.
    navigate('/calculator'); 
  };

  const handleStartFresh = () => {
    navigate('/calculator?reset=true');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-12 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
          
          {/* Breadcrumb / Nav Actions - IMPROVED */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            {/* Back Link */}
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-sm text-text-dim hover:text-text-mid transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* Direct Calculator Access */}
            <div className="flex items-center gap-3">
               <Button 
                onClick={handleStartFresh}
                variant="ghost" 
                className="text-xs text-text-dim hover:text-white h-8"
              >
                Start Fresh
              </Button>
              <button
                onClick={handleReturnToCalculator}
                className="btn-vault h-9 w-auto px-4 text-xs"
              >
                <Calculator className="w-3 h-3 mr-2" />
                Open Calculator
              </button>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-4 border-b border-border-default pb-8">
            <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
              The <span className="text-gold">Waterfall</span> Protocol
            </h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-2xl">
              Understanding the priority of payments is the single most critical skill for a producer. 
              This is the proprietary logic used by sales agents to distribute revenue.
            </p>
          </div>

          {/* Core Concept: The Bucket Metaphor */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bebas text-white">The "Bucket" Metaphor</h2>
            <div className="prose prose-invert prose-p:text-text-mid max-w-none">
              <p>
                Imagine a series of buckets arranged vertically. Water (revenue) is poured into the top bucket. 
                Only when the first bucket is full does it spill over into the next one.
              </p>
              <p>
                If the flow of water stops, the buckets at the bottom stay dry. 
                <span className="text-gold font-bold"> You (the Producer) are at the very bottom.</span>
              </p>
            </div>
          </div>

          {/* Detailed Flow Table */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gold/10 rounded-md border border-border-default">
                  <BadgeDollarSign className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-2xl font-bebas text-white">The Recoupment Schedule</h2>
              </div>
            
            <div className="bg-bg-card border border-border-default rounded-lg overflow-hidden">
              <div className="grid grid-cols-[auto_1fr] gap-0 divide-y divide-border-subtle">
                
                {/* Row 1 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center min-w-[60px]">01</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Collection Account Management (CAM)</h3>
                  <p className="text-sm text-text-dim">Before anything happens, the CAM takes ~1% off the top to manage the money. This protects you from the distributor holding your cash.</p>
                </div>

                {/* Row 2 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center">02</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Sales Fees & Expenses</h3>
                  <p className="text-sm text-text-dim">
                    The Sales Agent takes their commission (10-25%) and recoups capped expenses (marketing, festivals, deliverables).
                    <span className="block mt-1 text-gold text-xs font-semibold">TRAP: Ensure expenses are "Capped" in your contract.</span>
                  </p>
                </div>

                {/* Row 3 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center">03</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Guild Residuals (Setup)</h3>
                  <p className="text-sm text-text-dim">SAG-AFTRA, DGA, WGA deposits. If you don't pay these, they can shut you down.</p>
                </div>

                {/* Row 4 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center">04</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Senior Debt (Banks)</h3>
                  <p className="text-sm text-text-dim">They took the least risk (often against tax credits), so they get paid first among lenders.</p>
                </div>

                {/* Row 5 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center">05</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Gap / Mezzanine Debt</h3>
                  <p className="text-sm text-text-dim">Higher risk lenders. They charge higher interest because they sit behind the bank.</p>
                </div>

                {/* Row 6 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-bold border-r border-border-subtle flex items-center justify-center">06</div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-1">Equity Investors (Principal + Premium)</h3>
                  <p className="text-sm text-text-dim">Your investors get 100% of their money back, plus a premium (usually 20%). Only after they are 120% whole does the "Net Profit" split begin.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Net Profit Split */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bebas text-white">The Backend Split</h2>
              <p className="text-text-mid leading-relaxed">
                Once everyone above is paid, the remaining water falls into the "Net Profit" pool. This is typically split 50/50.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3 bg-bg-surface p-3 rounded border border-border-subtle">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">A</div>
                  <div>
                    <span className="text-white font-bold block text-sm">Investor's Pool (50%)</span>
                    <span className="text-xs text-text-dim">Pro-rata share to equity financiers.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gold/10 p-3 rounded border border-border-default">
                  <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center font-bold text-xs">B</div>
                  <div>
                    <span className="text-gold font-bold block text-sm">Producer's Pool (50%)</span>
                    <span className="text-xs text-text-dim">This is where you, the director, and talent points come from.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Visual Diagram */}
            <div className="bg-bg-card border border-border-default rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
               
               <div className="w-48 space-y-2 relative z-10">
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-xs text-text-dim">Distributor</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-white/10" /></div>
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-xs text-text-dim">Lenders</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-white/10" /></div>
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-xs text-text-dim">Investors</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-gold" /></div>
                  <div className="flex gap-2">
                    <div className="h-20 flex-1 border-2 border-blue-500/30 bg-blue-500/5 rounded flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[10px] font-bold text-blue-200">Investors</span>
                      <span className="text-[10px] text-blue-200/50">50%</span>
                    </div>
                    <div className="h-20 flex-1 border-2 border-gold/50 bg-gold/10 rounded flex flex-col items-center justify-center text-center p-1 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                      <span className="text-[10px] font-bold text-gold">Producers</span>
                      <span className="text-[10px] text-gold/70">50%</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* COMMON TRAPS — Gold-only warning styling */}
          <div className="bg-gold/[0.04] border border-border-default rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-gold uppercase tracking-widest">Common Traps</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Cross-Collateralization</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  When a distributor uses the profits from your film to pay for the losses of *another* film they bought.
                  <span className="block mt-1 text-gold font-semibold">Never allow this. Require "Single Picture Accounting".</span>
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Overhead Fees</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Distributors often charge a flat "Overhead" fee (10-15%) on top of their commission for "office expenses."
                  This is pure profit for them. Fight to cap or remove it.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-border-default flex flex-col items-center gap-4">
            <p className="text-text-dim text-sm max-w-md text-center">
              Now that you understand the rules, use the calculator to see if your deal actually makes money.
            </p>
            <button
              onClick={handleReturnToCalculator}
              className="btn-vault w-full max-w-xs h-12 px-8 text-sm"
            >
              Open Calculator
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-[11px] tracking-wider text-text-dim hover:text-text-mid transition-colors"
            >
              <Printer className="w-3 h-3" />
              Print Protocol
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
