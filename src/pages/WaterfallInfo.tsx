import { useEffect } from "react";
import Header from "@/components/Header";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, Printer, ShieldAlert, BadgeDollarSign, Calculator, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WaterfallInfo = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  // Fix scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToCalculator = () => {
    haptics.medium();
    navigate('/calculator');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-12 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <button
              onClick={() => { haptics.light(); navigate(-1); }}
              className="flex items-center gap-2 text-[15px] text-text-dim hover:text-text-mid transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            <button
              onClick={handleReturnToCalculator}
              className="btn-cta-secondary h-10 w-auto px-4 text-[13px]"
            >
              <Calculator className="w-3.5 h-3.5 mr-2" />
              Open Calculator
            </button>
          </div>

          {/* Title Section */}
          <div className="space-y-4 border-b border-border-default pb-8">
            <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
              The <span className="text-gold">Waterfall</span> Protocol
            </h1>
            <p className="text-[18px] md:text-xl text-text-mid leading-relaxed max-w-2xl">
              Understanding the priority of payments is the single most critical skill for a producer.
              This is the proprietary logic used by sales agents to distribute revenue.
            </p>
          </div>

          {/* Core Concept: The Bucket Metaphor */}
          <div className="relative bg-bg-surface border border-border-default rounded-lg p-8 space-y-6 overflow-hidden">
            {/* Gold left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
            <h2 className="text-2xl font-bebas text-gold tracking-wide">The &ldquo;Bucket&rdquo; Metaphor</h2>
            <div className="space-y-4">
              <p className="text-[16px] text-text-mid leading-relaxed">
                Imagine a series of buckets arranged vertically. Water (revenue) is poured into the top bucket.
                Only when the first bucket is full does it spill over into the next one.
              </p>
              <p className="text-[16px] text-text-mid leading-relaxed">
                If the flow of water stops, the buckets at the bottom stay dry.
                <span className="text-gold font-semibold"> You (the Producer) are at the very bottom.</span>
              </p>
            </div>
          </div>

          {/* Detailed Flow Table */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gold/10 rounded-md border border-border-default">
                  <BadgeDollarSign className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-2xl font-bebas text-gold tracking-wide">The Recoupment Schedule</h2>
              </div>

            <div className="bg-bg-card border border-border-default rounded-lg overflow-hidden">
              <div className="grid grid-cols-[auto_1fr] gap-0 divide-y divide-border-subtle">

                {/* Row 1 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center min-w-[60px]">01</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Collection Account Management (CAM)</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">Before anything happens, the CAM takes ~1% off the top to manage the money. This protects you from the distributor holding your cash.</p>
                </div>

                {/* Row 2 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center">02</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Sales Fees & Expenses</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">
                    The Sales Agent takes their commission (10-25%) and recoups capped expenses (marketing, festivals, deliverables).
                    <span className="block mt-1.5 text-gold text-[13px] font-semibold">TRAP: Ensure expenses are &ldquo;Capped&rdquo; in your contract.</span>
                  </p>
                </div>

                {/* Row 3 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center">03</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Guild Residuals (Setup)</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">SAG-AFTRA, DGA, WGA deposits. If you don&rsquo;t pay these, they can shut you down.</p>
                </div>

                {/* Row 4 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center">04</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Senior Debt (Banks)</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">They took the least risk (often against tax credits), so they get paid first among lenders.</p>
                </div>

                {/* Row 5 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center">05</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Gap / Mezzanine Debt</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">Higher risk lenders. They charge higher interest because they sit behind the bank.</p>
                </div>

                {/* Row 6 */}
                <div className="p-4 bg-bg-elevated text-gold font-mono font-medium border-r border-border-subtle flex items-center justify-center">06</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1">Equity Investors (Principal + Premium)</h3>
                  <p className="text-[15px] text-text-dim leading-relaxed">Your investors get 100% of their money back, plus a premium (usually 20%). Only after they are 120% whole does the &ldquo;Net Profit&rdquo; split begin.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Net Profit Split */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bebas text-gold tracking-wide">The Backend Split</h2>
              <p className="text-[16px] text-text-mid leading-relaxed">
                Once everyone above is paid, the remaining water falls into the &ldquo;Net Profit&rdquo; pool. This is typically split 50/50.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3 bg-white/[0.04] p-4 rounded border border-white/[0.10]">
                  <div className="w-7 h-7 rounded-full bg-white/[0.08] text-white/60 flex items-center justify-center font-semibold text-xs flex-shrink-0">A</div>
                  <div>
                    <span className="text-white/80 font-semibold block text-[15px]">Investor&rsquo;s Pool (50%)</span>
                    <span className="text-[13px] text-text-dim">Pro-rata share to equity financiers.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gold/[0.06] p-4 rounded border border-gold/25">
                  <div className="w-7 h-7 rounded-full bg-gold text-black flex items-center justify-center font-semibold text-xs flex-shrink-0">B</div>
                  <div>
                    <span className="text-gold font-semibold block text-[15px]">Producer&rsquo;s Pool (50%)</span>
                    <span className="text-[13px] text-text-dim">This is where you, the director, and talent points come from.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Visual Diagram */}
            <div className="bg-bg-card border border-border-default rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

               <div className="w-48 space-y-2 relative z-10">
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-[13px] text-text-dim">Distributor</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-white/10" /></div>
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-[13px] text-text-dim">Lenders</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-white/10" /></div>
                  <div className="h-12 border-2 border-white/20 rounded flex items-center justify-center text-[13px] text-text-dim">Investors</div>
                  <div className="h-4 flex justify-center"><div className="w-0.5 h-full bg-gold" /></div>
                  <div className="flex gap-2">
                    <div className="h-20 flex-1 border-2 border-white/[0.12] bg-white/[0.04] rounded flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[11px] font-semibold text-white/60">Investors</span>
                      <span className="text-[11px] text-white/40">50%</span>
                    </div>
                    <div className="h-20 flex-1 border-2 border-gold/50 bg-gold/10 rounded flex flex-col items-center justify-center text-center p-1 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                      <span className="text-[11px] font-semibold text-gold">Producers</span>
                      <span className="text-[11px] text-gold/70">50%</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* COMMON TRAPS — Gold-only warning styling */}
          <div className="relative bg-gold/[0.04] border border-gold/20 rounded-lg p-6 space-y-4 overflow-hidden">
            {/* Gold left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35), transparent)' }} />
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bebas text-gold uppercase tracking-widest">Common Traps</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1">Cross-Collateralization</h3>
                <p className="text-[14px] text-text-dim leading-relaxed">
                  When a distributor uses the profits from your film to pay for the losses of <em>another</em> film they bought.
                  <span className="block mt-1.5 text-gold text-[13px] font-semibold">Never allow this. Require &ldquo;Single Picture Accounting&rdquo;.</span>
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1">Overhead Fees</h3>
                <p className="text-[14px] text-text-dim leading-relaxed">
                  Distributors often charge a flat &ldquo;Overhead&rdquo; fee (10-15%) on top of their commission for &ldquo;office expenses.&rdquo;
                  This is pure profit for them. Fight to cap or remove it.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-border-default flex flex-col items-center gap-4">
            <p className="text-text-dim text-[15px] max-w-md text-center leading-relaxed">
              Now that you understand the rules, use the calculator to see if your deal actually makes money.
            </p>
            <button
              onClick={handleReturnToCalculator}
              className="btn-cta-primary w-full max-w-xs h-14 px-8"
            >
              BUILD YOUR WATERFALL
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>

            <button
              onClick={() => { haptics.light(); window.print(); }}
              className="flex items-center gap-2 text-[13px] tracking-wider text-text-dim hover:text-text-mid transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Protocol
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
