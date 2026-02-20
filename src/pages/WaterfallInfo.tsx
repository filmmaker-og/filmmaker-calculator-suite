import { useEffect } from "react";

import { useHaptics } from "@/hooks/use-haptics";
import { ShieldAlert, BadgeDollarSign, ArrowRight } from "lucide-react";
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
      
      <div className="min-h-screen bg-black text-white page-safe px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

          {/* ─── Title ─── */}
          <div className="space-y-4 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-gold/50" />
              <span className="text-[12px] tracking-[0.3em] uppercase font-semibold text-gold/70">
                Producer&rsquo;s Guide
              </span>
            </div>

            <h1 className="font-bebas text-[52px] md:text-[72px] tracking-[0.04em] leading-[0.95] text-gold">
              The Waterfall <span className="text-white">Protocol</span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-white/70 leading-[1.7] max-w-2xl">
              Understanding the priority of payments is the single most critical skill for a producer.
              This is the proprietary logic used by sales agents to distribute revenue.
            </p>

            <div className="h-[1px] bg-gradient-to-r from-gold/40 via-gold/25 to-transparent" />
          </div>

          {/* ─── The Bucket Metaphor ─── */}
          <div className="relative bg-white/[0.04] border border-white/[0.10] p-7 md:p-9 pl-8 md:pl-10 space-y-5 overflow-hidden"
            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />

            <h2 className="font-bebas text-[24px] md:text-[30px] tracking-[0.06em] text-gold">
              The &ldquo;Bucket&rdquo; Metaphor
            </h2>
            <div className="space-y-4">
              <p className="text-[15px] md:text-base text-white/75 leading-[1.7]">
                Imagine a series of buckets arranged vertically. Water (revenue) is poured into the top bucket.
                Only when the first bucket is full does it spill over into the next one.
              </p>
              <p className="text-[15px] md:text-base text-white/75 leading-[1.7]">
                If the flow of water stops, the buckets at the bottom stay dry.
                <span className="text-gold font-semibold"> You (the Producer) are at the very bottom.</span>
              </p>
            </div>
          </div>

          {/* ─── Recoupment Schedule ─── */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gold/10 border border-white/[0.10]">
                <BadgeDollarSign className="w-5 h-5 text-gold" />
              </div>
              <h2 className="font-bebas text-[24px] md:text-[30px] tracking-[0.06em] text-gold">
                The Recoupment Schedule
              </h2>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.10] overflow-hidden">
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
                    <div className="p-4 bg-white/[0.03] text-gold font-mono font-medium border-r border-white/[0.06] flex items-center justify-center min-w-[60px] text-[15px]">
                      {row.num}
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-base mb-1.5">{row.title}</h3>
                      <p className="text-[15px] text-white/70 leading-[1.7]">
                        {row.desc}
                        {row.trap && (
                          <span className="block mt-2 text-gold text-[13px] font-semibold tracking-wide">{row.trap}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Divider ─── */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {/* ─── The Backend Split ─── */}
          <div className="space-y-6">
            <h2 className="font-bebas text-[24px] md:text-[30px] tracking-[0.06em] text-gold">
              The Backend Split
            </h2>
            <p className="text-[15px] md:text-base text-white/70 leading-[1.7] max-w-2xl">
              Once everyone above is paid, the remaining water falls into the &ldquo;Net Profit&rdquo; pool.
              This is typically split 50/50.
            </p>

            {/* Corridors */}
            <div className="grid grid-cols-2 gap-4">
              {/* Producer Corridor */}
              <div className="relative border border-gold/25 bg-gold/[0.06] p-5 md:p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold/50" />
                <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gold/70 mb-3">
                  Producer Corridor
                </p>
                <div className="font-mono text-[36px] md:text-[48px] font-bold text-gold leading-none mb-3">
                  50%
                </div>
                <p className="text-[14px] text-gold/70 leading-[1.65]">
                  You, the director, and talent points come from this pool. This is the money you actually fight for.
                </p>
              </div>

              {/* Investor Corridor */}
              <div className="relative border border-white/[0.15] bg-white/[0.05] p-5 md:p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.15]" />
                <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-white/60 mb-3">
                  Investor Corridor
                </p>
                <div className="font-mono text-[36px] md:text-[48px] font-bold text-white/80 leading-none mb-3">
                  50%
                </div>
                <p className="text-[14px] text-white/60 leading-[1.65]">
                  Pro-rata share to equity financiers. They already got their principal + premium above.
                </p>
              </div>
            </div>

            {/* Flow diagram */}
            <div className="py-8">
              <div className="relative">
                {/* Vertical spine */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] bg-white/[0.15]" style={{ height: 'calc(100% - 80px)' }} />

                <div className="space-y-0 relative z-10">
                  {['Distributor Revenue', 'Sales Agent Fees', 'Lenders', 'Equity Investors'].map((label, i) => (
                    <div key={label}>
                      <div className="max-w-sm mx-auto h-14 border border-white/[0.25] bg-[#1a1a1a] flex items-center justify-center text-[14px] tracking-[0.08em] text-white/80 uppercase font-medium">
                        {label}
                      </div>
                      {i < 3 && (
                        <div className="flex justify-center h-7">
                          <div className="w-[1px] h-full bg-white/[0.25]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gold branch to corridors */}
                <div className="flex justify-center h-7 relative z-10">
                  <div className="w-[1px] h-full bg-gold/60" />
                </div>

                {/* Horizontal branch */}
                <div className="relative mx-auto max-w-sm">
                  <div className="h-[1px] bg-gold/50" />
                  <div className="absolute left-0 top-0 w-[1px] h-6 bg-gold/50" />
                  <div className="absolute right-0 top-0 w-[1px] h-6 bg-gold/50" />
                </div>

                {/* Terminal boxes */}
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm mx-auto">
                  <div className="h-16 border border-gold/50 bg-gold/[0.12] flex items-center justify-center text-[14px] font-semibold text-gold tracking-[0.14em] uppercase">
                    Producers
                  </div>
                  <div className="h-16 border border-white/[0.25] bg-[#1a1a1a] flex items-center justify-center text-[14px] font-semibold text-white/80 tracking-[0.14em] uppercase">
                    Investors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Divider ─── */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {/* ─── Common Traps ─── */}
          <div className="relative bg-gold/[0.04] border border-gold/20 p-7 md:p-9 pl-8 md:pl-10 space-y-5 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35), transparent)' }} />

            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-gold" />
              <h2 className="font-bebas text-[20px] md:text-[24px] tracking-[0.08em] uppercase text-gold">
                Common Traps
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1.5">Cross-Collateralization</h3>
                <p className="text-[14px] text-white/70 leading-[1.65]">
                  When a distributor uses the profits from your film to pay for the losses of <em>another</em> film they bought.
                  <span className="block mt-2 text-gold text-[13px] font-semibold tracking-wide">
                    Never allow this. Require &ldquo;Single Picture Accounting&rdquo;.
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1.5">Overhead Fees</h3>
                <p className="text-[14px] text-white/70 leading-[1.65]">
                  Distributors often charge a flat &ldquo;Overhead&rdquo; fee (10-15%) on top of their commission for &ldquo;office expenses.&rdquo;
                  This is pure profit for them. Fight to cap or remove it.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="pt-4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

            <div className="relative bg-white/[0.04] border border-white/[0.10] p-8 md:p-10 overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(212,175,55,0.06)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(212,175,55,0.08)_0%,_transparent_60%)]" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <h3 className="font-bebas text-[32px] md:text-[40px] tracking-[0.06em] leading-[1.1] text-white">
                  Now see if your deal<br />
                  <span className="text-gold">actually makes money.</span>
                </h3>

                <p className="text-[17px] text-white/70 leading-[1.7] max-w-sm">
                  Plug in your budget, financing, and deal terms.
                  See where every dollar ends up.
                </p>

                <button
                  onClick={handleReturnToCalculator}
                  className="btn-cta-primary w-full max-w-xs h-14 px-8"
                >
                  BUILD YOUR WATERFALL
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
