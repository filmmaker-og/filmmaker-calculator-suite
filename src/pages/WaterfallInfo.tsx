import { useEffect } from "react";
import Header from "@/components/Header";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, Printer, ShieldAlert, BadgeDollarSign, Calculator, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WaterfallInfo = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

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
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-16 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between pb-4">
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

          {/* ─── Title Section ─── */}
          <div className="space-y-6 pb-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-gold/50" />
              <span className="text-[12px] tracking-[0.3em] uppercase font-semibold text-gold/70">
                Producer&rsquo;s Guide
              </span>
            </div>

            <h1 className="text-5xl md:text-[72px] font-bebas text-white tracking-[0.04em] leading-[0.95]">
              The <span className="text-gold">Waterfall</span> Protocol
            </h1>

            <p className="text-[17px] md:text-[19px] text-text-mid leading-[1.65] max-w-2xl">
              Understanding the priority of payments is the single most critical skill for a producer.
              This is the proprietary logic used by sales agents to distribute revenue.
            </p>

            {/* Gold gradient divider */}
            <div className="h-[1px] bg-gradient-to-r from-gold/40 via-gold/25 to-transparent" />
          </div>

          {/* ─── Core Concept: The Bucket Metaphor ─── */}
          <div className="relative bg-white/[0.04] border border-white/[0.10] rounded-none p-7 md:p-9 pl-8 md:pl-10 space-y-5 overflow-hidden"
            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
            {/* Gold left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
            <h2 className="text-2xl font-bebas text-gold tracking-wide">The &ldquo;Bucket&rdquo; Metaphor</h2>
            <div className="space-y-4">
              <p className="text-[16px] text-text-mid leading-[1.7]">
                Imagine a series of buckets arranged vertically. Water (revenue) is poured into the top bucket.
                Only when the first bucket is full does it spill over into the next one.
              </p>
              <p className="text-[16px] text-text-mid leading-[1.7]">
                If the flow of water stops, the buckets at the bottom stay dry.
                <span className="text-gold font-semibold"> You (the Producer) are at the very bottom.</span>
              </p>
            </div>
          </div>

          {/* ─── Recoupment Schedule ─── */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gold/10 rounded-md border border-white/[0.10]">
                <BadgeDollarSign className="w-5 h-5 text-gold" />
              </div>
              <h2 className="text-2xl font-bebas text-gold tracking-wide">The Recoupment Schedule</h2>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.10] overflow-hidden">
              <div className="grid grid-cols-[auto_1fr] gap-0 divide-y divide-white/[0.06]">

                {[
                  { num: '01', title: 'Collection Account Management (CAM)', desc: 'Before anything happens, the CAM takes ~1% off the top to manage the money. This protects you from the distributor holding your cash.' },
                  { num: '02', title: 'Sales Fees & Expenses', desc: 'The Sales Agent takes their commission (10\u201325%) and recoups capped expenses (marketing, festivals, deliverables).', trap: 'TRAP: Ensure expenses are \u201cCapped\u201d in your contract.' },
                  { num: '03', title: 'Guild Residuals (Setup)', desc: 'SAG-AFTRA, DGA, WGA deposits. If you don\u2019t pay these, they can shut you down.' },
                  { num: '04', title: 'Senior Debt (Banks)', desc: 'They took the least risk (often against tax credits), so they get paid first among lenders.' },
                  { num: '05', title: 'Gap / Mezzanine Debt', desc: 'Higher risk lenders. They charge higher interest because they sit behind the bank.' },
                  { num: '06', title: 'Equity Investors (Principal + Premium)', desc: 'Your investors get 100% of their money back, plus a premium (usually 20%). Only after they are 120% whole does the \u201cNet Profit\u201d split begin.' },
                ].map((row) => (
                  <div key={row.num} className="contents">
                    <div className="p-4 bg-white/[0.02] text-gold font-mono font-medium border-r border-white/[0.06] flex items-center justify-center min-w-[60px]">
                      {row.num}
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-[16px] mb-1.5">{row.title}</h3>
                      <p className="text-[15px] text-text-dim leading-[1.65]">
                        {row.desc}
                        {row.trap && (
                          <span className="block mt-2 text-gold text-[13px] font-semibold">{row.trap}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── The Backend Split ─── */}
          <div className="space-y-6 pt-2">
            <h2 className="text-2xl font-bebas text-gold tracking-wide">The Backend Split</h2>
            <p className="text-[16px] text-text-mid leading-[1.7] max-w-2xl">
              Once everyone above is paid, the remaining water falls into the &ldquo;Net Profit&rdquo; pool.
              This is typically split 50/50.
            </p>

            {/* Corridor pattern — matching landing page */}
            <div className="grid grid-cols-2 gap-4">
              {/* Producer Corridor */}
              <div className="relative border border-gold/25 bg-gold/[0.06] p-5 md:p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold/50" />
                <div className="space-y-3">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gold/70">
                    Producer Corridor
                  </p>
                  <div className="font-mono text-3xl md:text-4xl font-bold text-gold">50%</div>
                  <p className="text-[13px] text-gold/60 leading-relaxed">
                    You, the director, and talent points come from this pool. This is the money you actually fight for.
                  </p>
                </div>
              </div>

              {/* Investor Corridor */}
              <div className="relative border border-white/[0.10] bg-white/[0.04] p-5 md:p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.10]" />
                <div className="space-y-3">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/45">
                    Investor Corridor
                  </p>
                  <div className="font-mono text-3xl md:text-4xl font-bold text-white/70">50%</div>
                  <p className="text-[13px] text-white/40 leading-relaxed">
                    Pro-rata share to equity financiers. They already got their principal + premium above.
                  </p>
                </div>
              </div>
            </div>

            {/* Flow diagram — vertical pipeline */}
            <div className="flex justify-center py-4">
              <div className="w-56 space-y-0 relative">
                {/* Connector line behind everything */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.06] -translate-x-1/2 z-0" />

                {['Distributor Revenue', 'Sales Agent Fees', 'Lenders', 'Equity Investors'].map((label, i) => (
                  <div key={label} className="relative z-10">
                    <div className="mx-auto h-10 border border-white/[0.12] bg-bg-void flex items-center justify-center text-[12px] tracking-[0.08em] text-text-dim uppercase">
                      {label}
                    </div>
                    {i < 3 && (
                      <div className="flex justify-center h-5">
                        <div className="w-[1px] h-full bg-white/[0.12]" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Branch to corridors */}
                <div className="flex justify-center h-5">
                  <div className="w-[1px] h-full bg-gold/40" />
                </div>
                <div className="relative h-[1px] bg-gold/30 mx-6">
                  <div className="absolute left-0 top-0 w-[1px] h-4 bg-gold/30" />
                  <div className="absolute right-0 top-0 w-[1px] h-4 bg-gold/30" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="h-12 border border-gold/40 bg-gold/[0.08] flex items-center justify-center text-[11px] font-semibold text-gold tracking-[0.12em] uppercase">
                    Producers
                  </div>
                  <div className="h-12 border border-white/[0.12] bg-white/[0.04] flex items-center justify-center text-[11px] font-semibold text-white/50 tracking-[0.12em] uppercase">
                    Investors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Common Traps ─── */}
          <div className="relative bg-gold/[0.04] border border-gold/20 p-6 md:p-8 space-y-5 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35), transparent)' }} />
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bebas text-gold uppercase tracking-widest">Common Traps</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1.5">Cross-Collateralization</h3>
                <p className="text-[14px] text-text-dim leading-[1.65]">
                  When a distributor uses the profits from your film to pay for the losses of <em>another</em> film they bought.
                  <span className="block mt-2 text-gold text-[13px] font-semibold">Never allow this. Require &ldquo;Single Picture Accounting&rdquo;.</span>
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1.5">Overhead Fees</h3>
                <p className="text-[14px] text-text-dim leading-[1.65]">
                  Distributors often charge a flat &ldquo;Overhead&rdquo; fee (10-15%) on top of their commission for &ldquo;office expenses.&rdquo;
                  This is pure profit for them. Fight to cap or remove it.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="pt-4">
            {/* Gold gradient divider */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

            {/* Closing card */}
            <div className="relative bg-white/[0.04] border border-white/[0.10] p-8 md:p-10 overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(212,175,55,0.06)' }}>
              {/* Radial gold glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(212,175,55,0.08)_0%,_transparent_60%)]" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gold/60" />
                  <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gold/60">
                    Protocol Complete
                  </span>
                  <BookOpen className="w-4 h-4 text-gold/60" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bebas text-white tracking-wide leading-tight">
                  Now see if your deal <span className="text-gold">actually makes money.</span>
                </h3>

                <p className="text-[15px] text-text-dim leading-relaxed max-w-md">
                  Run your numbers through the waterfall calculator. Input your budget,
                  financing, and deal terms &mdash; see exactly where the money lands.
                </p>

                <button
                  onClick={handleReturnToCalculator}
                  className="btn-cta-primary w-full max-w-xs h-14 px-8"
                >
                  BUILD YOUR WATERFALL
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>

                {/* Secondary actions grid */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-2">
                  <button
                    onClick={() => { haptics.light(); navigate(-1); }}
                    className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.12] hover:border-gold/40 py-3 text-[13px] text-text-dim hover:text-gold transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Go Back
                  </button>
                  <button
                    onClick={() => { haptics.light(); window.print(); }}
                    className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.12] hover:border-gold/40 py-3 text-[13px] text-text-dim hover:text-gold transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
