import { useEffect, useState, useRef } from "react";

import { X } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ------------------------------------------------------------------
// SCROLL REVEAL HOOK
// ------------------------------------------------------------------
const useReveal = (threshold = 0.05) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ------------------------------------------------------------------
// TOP 10 MUST-KNOW TERMS
// ------------------------------------------------------------------
type Top10Term = {
  num: string;
  term: string;
  category: string;
  def: string;
};

const TOP_10: Top10Term[] = [
  {
    num: "01",
    term: "Waterfall",
    category: "The Math",
    def: "The strict priority order in which revenue flows from the box office to every stakeholder. Money trickles down: Theaters → Distributor → Sales Agent → Lenders → Investors → Producers. Understanding this is understanding independent film finance.",
  },
  {
    num: "02",
    term: "Recoupment",
    category: "The Math",
    def: "Earning back the initial investment before profits are shared. The recoupment schedule defines who gets paid back first — and at what premium — before anyone sees net profit. This is the core negotiation in any investor deal.",
  },
  {
    num: "03",
    term: "Capital Stack",
    category: "Finance",
    def: "The layered combination of funding sources used to finance a budget: tax credits (lowest risk), senior debt, gap/mezzanine loans, and equity (highest risk). Each tier has its own cost, priority, and return profile.",
  },
  {
    num: "04",
    term: "Negative Cost",
    category: "Finance",
    def: "The actual all-in cost to produce the finished film — development, production, and post — excluding marketing and distribution. This is the number you're financing. Not 'the budget estimate.' The final, locked number.",
  },
  {
    num: "05",
    term: "Senior Debt",
    category: "Finance",
    def: "First-position loans secured by reliable collateral — tax credits or pre-sale contracts. Lowest risk, lowest cost (typically SOFR + 5–10%), and paid back first in the waterfall. Banks write these. They don't lose.",
  },
  {
    num: "06",
    term: "Equity",
    category: "Finance",
    def: "Cash investment in exchange for ownership and backend profits. Highest risk, paid last, but holds a percentage of profits forever. Standard structure: principal back + 20% premium, then 50% of net profits going forward.",
  },
  {
    num: "07",
    term: "Cross-Collateral.",
    category: "Legal",
    def: "A trap. When a distributor uses profits from one film to cover losses on another in their portfolio. Your Film A profit funds their Film B write-off. Always require 'Single Picture Accounting' in any distribution contract.",
  },
  {
    num: "08",
    term: "Sales Agent",
    category: "Roles",
    def: "The broker who sells your international distribution rights — territory by territory — at film markets (Cannes, AFM, Berlin). Takes 10–20% commission off gross receipts. Their estimates can also be used to secure pre-sale bank loans.",
  },
  {
    num: "09",
    term: "Producer's Corridor",
    category: "The Math",
    def: "A percentage of first-dollar gross receipts reserved for the producer — paid before expenses are deducted. Rare, powerful, and a sign of real leverage. If you can negotiate it, do. It fundamentally changes your position in the waterfall.",
  },
  {
    num: "10",
    term: "CAM",
    category: "Roles",
    def: "Collection Account Manager. A neutral third party that receives all revenue and distributes it according to the agreed waterfall. Takes approximately 1% off the top. Essential for transparency and investor confidence. Without a CAM, you're trusting a distributor to pay everyone correctly.",
  },
];

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
const Glossary = () => {
  const [selectedTerm, setSelectedTerm] = useState<Top10Term | null>(null);
  const revTop10 = useReveal();
  const haptics = useHaptics();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      
      <div className="min-h-screen bg-black text-white page-safe pb-8 font-sans">

        {/* PAGE TITLE */}
        <div className="px-6 md:px-10 pt-2 pb-1">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-3">
              Film Finance
            </p>
            <h1 className="font-bebas text-[40px] md:text-7xl tracking-wide text-white leading-none">
              The <span className="text-gold">Resource</span>
            </h1>
            <p className="text-[14px] text-white/40 leading-relaxed mt-3 max-w-xl">
              The film industry uses jargon to keep outsiders out. This is your definitive resource.
            </p>
          </div>
        </div>

        {/* TOP 10 PILL GRID */}
        <div
          ref={revTop10.ref}
          style={{
            opacity: revTop10.visible ? 1 : 0,
            transform: revTop10.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <section id="top10" className="px-6 md:px-10">
            <div className="max-w-4xl mx-auto">
              <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-gold-label mb-2">
                The Essential 10
              </p>
              <h2 className="font-bebas text-[28px] tracking-[0.08em] text-white mb-4">
                KNOW THESE FIRST
              </h2>

            {/* 2×5 pill grid */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {TOP_10.map((item, i) => (
                <button
                  key={item.num}
                  onClick={() => { haptics.light(); setSelectedTerm(item); }}
                  style={{
                    borderRadius: 0,
                    opacity: revTop10.visible ? 1 : 0,
                    transform: revTop10.visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.45s ease ${i * 0.04}s, transform 0.45s ease ${i * 0.04}s`,
                  }}
                  className="group flex items-center gap-3 px-3 py-3 border border-white/[0.08] bg-white/[0.02] hover:border-gold/40 hover:bg-gold/[0.06] transition-all text-left"
                >
                  <span className="font-mono text-[11px] font-bold text-gold/50 group-hover:text-gold/80 transition-colors flex-shrink-0 tabular-nums leading-none">
                    {item.num}
                  </span>
                  <span className="font-bebas text-[17px] tracking-wide text-white/80 group-hover:text-white transition-colors leading-none truncate">
                    {item.term}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] text-white/15 font-mono uppercase tracking-widest mt-4">
              Tap any term to read the definition
            </p>
            </div>
          </section>
        </div>

        <div className="px-6 md:px-10 pt-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-[11px] text-white/20 font-mono uppercase tracking-widest">
              Tap the gold button → to ask the OG bot any film finance question
            </p>
          </div>
        </div>

      </div>

      {/* TERM DEFINITION MODAL */}
      <Dialog open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
        <DialogContent
          className="p-0 overflow-hidden border-gold/30 max-w-[calc(100vw-2rem)] w-full sm:max-w-lg [&>button:last-child]:hidden"
          style={{ borderRadius: 0, background: "#0D0900", boxShadow: "0 0 60px rgba(212,175,55,0.10)" }}
        >
          {selectedTerm && (
            <>
              <div className="flex items-center justify-between px-5 py-3 bg-gold">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-bold text-black/60 tabular-nums">
                    {selectedTerm.num}
                  </span>
                  <span className="font-bebas text-[16px] tracking-[0.15em] text-black leading-none">
                    {selectedTerm.term}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.15em] font-mono text-black/50 hidden sm:block">
                    {selectedTerm.category}
                  </span>
                </div>
                <button
                  onClick={() => { haptics.light(); setSelectedTerm(null); }}
                  className="text-black/50 hover:text-black transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-5">
                <p className="text-[16px] text-white/85 leading-[1.8]">
                  {selectedTerm.def}
                </p>
              </div>

              <div className="flex border-t border-white/[0.06]">
                {(() => {
                  const idx = TOP_10.findIndex(t => t.num === selectedTerm.num);
                  const prev = idx > 0 ? TOP_10[idx - 1] : null;
                  const next = idx < TOP_10.length - 1 ? TOP_10[idx + 1] : null;
                  return (
                    <>
                      <button
                        onClick={() => { if (prev) { haptics.light(); setSelectedTerm(prev); } }}
                        disabled={!prev}
                        className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider text-white/20 hover:text-gold/60 hover:bg-gold/[0.04] disabled:opacity-0 transition-all text-left pl-5"
                      >
                        ← {prev?.term}
                      </button>
                      <div className="w-[1px] bg-white/[0.06]" />
                      <button
                        onClick={() => { if (next) { haptics.light(); setSelectedTerm(next); } }}
                        disabled={!next}
                        className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider text-white/20 hover:text-gold/60 hover:bg-gold/[0.04] disabled:opacity-0 transition-all text-right pr-5"
                      >
                        {next?.term} →
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Glossary;
