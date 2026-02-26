import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { X, ExternalLink } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
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
// INDUSTRY LINKS
// ------------------------------------------------------------------
const INDUSTRY_LINKS = [
  { name: "Producers Guild (PGA)", url: "https://producersguild.org", desc: "The guild for film & TV producers" },
  { name: "Writers Guild (WGA)", url: "https://www.wga.org", desc: "Union for screenwriters" },
  { name: "Directors Guild (DGA)", url: "https://www.dga.org", desc: "Union for directors & teams" },
  { name: "SAG-AFTRA", url: "https://www.sagaftra.org", desc: "Actors & performers union" },
  { name: "IATSE", url: "https://iatse.net", desc: "Below-the-line crew union" },
  { name: "Box Office Mojo", url: "https://www.boxofficemojo.com", desc: "Box office tracking & data" },
  { name: "The Numbers", url: "https://www.the-numbers.com", desc: "Film financial analysis" },
  { name: "Film Independent", url: "https://www.filmindependent.org", desc: "Indie filmmaker resources" },
  { name: "@filmmaker.og", url: "https://www.instagram.com/filmmaker.og", desc: "Follow us on Instagram" },
];

// ------------------------------------------------------------------
// TAB IDS
// ------------------------------------------------------------------
type TabId = "terms" | "waterfall";

const TABS: { id: TabId; label: string }[] = [
  { id: "terms", label: "TERMS" },
  { id: "waterfall", label: "WATERFALL" },
];

// ------------------------------------------------------------------
// WATERFALL CONTENT (extracted from WaterfallInfo)
// ------------------------------------------------------------------
const WaterfallContent = () => (
  <div className="space-y-8">
    {/* The Bucket Metaphor */}
    <div className="relative bg-white/[0.04] border border-white/[0.10] p-6 pl-7 space-y-4 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
      <h2 className="font-bebas text-[22px] tracking-[0.06em] text-gold">
        The &ldquo;Bucket&rdquo; Metaphor
      </h2>
      <p className="text-[15px] text-white/75 leading-[1.7]">
        Imagine a series of buckets arranged vertically. Water (revenue) is poured into the top bucket.
        Only when the first bucket is full does it spill over into the next one.
      </p>
      <p className="text-[15px] text-white/75 leading-[1.7]">
        If the flow of water stops, the buckets at the bottom stay dry.
        <span className="text-gold font-semibold"> You (the Producer) are at the very bottom.</span>
      </p>
    </div>

    {/* Recoupment Schedule */}
    <div className="space-y-4">
      <h2 className="font-bebas text-[22px] tracking-[0.06em] text-gold">
        The Recoupment Schedule
      </h2>
      <div className="bg-white/[0.03] border border-white/[0.10] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr] gap-0 divide-y divide-white/[0.06]">
          {[
            { num: '01', title: 'CAM', desc: 'Takes ~1% off the top to manage the money. Protects you from the distributor holding your cash.' },
            { num: '02', title: 'Sales Fees & Expenses', desc: 'Sales Agent takes 10–25% commission + capped expenses.', trap: 'TRAP: Ensure expenses are "Capped" in your contract.' },
            { num: '03', title: 'Guild Residuals', desc: 'SAG-AFTRA, DGA, WGA deposits. Don\'t pay = they shut you down.' },
            { num: '04', title: 'Senior Debt', desc: 'Banks get paid first — least risk, lowest cost (SOFR + 5–10%).' },
            { num: '05', title: 'Gap / Mezzanine Debt', desc: 'Higher risk lenders charging higher interest behind the bank.' },
            { num: '06', title: 'Equity Investors', desc: '100% principal back + 20% premium. Only then does "Net Profit" split begin.' },
          ].map((row) => (
            <div key={row.num} className="contents">
              <div className="p-3 bg-white/[0.03] text-gold font-mono font-medium border-r border-white/[0.06] flex items-center justify-center min-w-[48px] text-[14px]">
                {row.num}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-[15px] mb-1">{row.title}</h3>
                <p className="text-[14px] text-white/70 leading-[1.7]">
                  {row.desc}
                  {row.trap && (
                    <span className="block mt-1.5 text-gold text-[13px] font-semibold tracking-wide">{row.trap}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Backend Split */}
    <div className="space-y-4">
      <h2 className="font-bebas text-[22px] tracking-[0.06em] text-gold">
        The Backend Split
      </h2>
      <p className="text-[14px] text-white/70 leading-[1.7]">
        Once everyone above is paid, the remaining revenue enters the "Net Profit" pool — typically split 50/50.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative border border-gold/25 bg-gold/[0.06] p-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold/50" />
          <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gold/70 mb-2">Producer Corridor</p>
          <div className="font-mono text-[32px] font-bold text-gold leading-none mb-2">50%</div>
          <p className="text-[13px] text-gold/70 leading-[1.6]">You, the director, and talent points.</p>
        </div>
        <div className="relative border border-white/[0.15] bg-white/[0.05] p-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.15]" />
          <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/60 mb-2">Investor Corridor</p>
          <div className="font-mono text-[32px] font-bold text-white/80 leading-none mb-2">50%</div>
          <p className="text-[13px] text-white/60 leading-[1.6]">Pro-rata share to equity financiers.</p>
        </div>
      </div>
    </div>

    {/* Common Traps */}
    <div className="relative bg-gold/[0.04] border border-gold/20 p-6 pl-7 space-y-4 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35), transparent)' }} />
      <h2 className="font-bebas text-[18px] tracking-[0.08em] uppercase text-gold">
        Common Traps
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-white font-semibold text-[14px] mb-1">Cross-Collateralization</h3>
          <p className="text-[13px] text-white/70 leading-[1.65]">
            When a distributor uses your film's profits to cover losses on another film.
            <span className="block mt-1.5 text-gold text-[12px] font-semibold tracking-wide">
              Never allow this. Require "Single Picture Accounting".
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold text-[14px] mb-1">Overhead Fees</h3>
          <p className="text-[13px] text-white/70 leading-[1.65]">
            Distributors charge 10-15% "overhead" on top of commission. Pure profit for them. Fight to cap or remove it.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "terms";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [selectedTerm, setSelectedTerm] = useState<Top10Term | null>(null);
  const revTop10 = useReveal();
  const haptics = useHaptics();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleTabChange = (tab: TabId) => {
    haptics.light();
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white page-safe pb-8 font-sans">

        {/* PAGE TITLE */}
        <div className="px-6 md:px-10 pt-2 pb-1">
          <div className="max-w-4xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/80 mb-3">
              Film Finance
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl tracking-wide text-white leading-none">
              The <span className="text-gold">Resource</span>
            </h1>
            <p className="text-[15px] text-white/55 leading-relaxed mt-3 max-w-xl">
              The film industry uses jargon to keep outsiders out. This is your definitive resource.
            </p>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="px-6 md:px-10 pt-4 pb-2">
          <div className="max-w-4xl mx-auto flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="font-bebas text-[15px] tracking-[0.14em] px-5 py-2.5 border transition-all"
                style={{
                  borderRadius: 0,
                  background: activeTab === tab.id ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                  borderColor: activeTab === tab.id ? "rgba(212,175,55,0.50)" : "rgba(255,255,255,0.10)",
                  color: activeTab === tab.id ? "rgba(212,175,55,1)" : "rgba(255,255,255,0.55)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "terms" && (
          <div
            ref={revTop10.ref}
            style={{
              opacity: revTop10.visible ? 1 : 0,
              transform: revTop10.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <SectionFrame id="top10">
              <SectionHeader
                eyebrow="The Essential 10"
                title="KNOW THESE FIRST"
                plainSubtitle
              />

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
                    <span className="font-mono text-[11px] font-bold text-gold/65 group-hover:text-gold/80 transition-colors flex-shrink-0 tabular-nums leading-none">
                      {item.num}
                    </span>
                    <span className="font-bebas text-[17px] tracking-wide text-white/80 group-hover:text-white transition-colors leading-none truncate">
                      {item.term}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-center text-[11px] text-white/35 font-mono uppercase tracking-widest mt-4">
                Tap any term to read the definition
              </p>
            </SectionFrame>
          </div>
        )}

        {activeTab === "waterfall" && (
          <div className="px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <WaterfallContent />
            </div>
          </div>
        )}

        {/* INDUSTRY LINKS — always visible */}
        <div className="px-6 md:px-10 pt-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.35) 0%, transparent 100%)" }} />
              <span className="font-bebas text-[12px] text-gold/60 uppercase tracking-[0.25em] flex-shrink-0">Industry Links</span>
              <div className="h-[1px] flex-1" style={{ background: "linear-gradient(270deg, rgba(212,175,55,0.35) 0%, transparent 100%)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INDUSTRY_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-4 py-3 border border-white/[0.08] bg-white/[0.02] hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                  style={{ borderRadius: 0 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.40), transparent)" }} />
                  <div className="flex-1 min-w-0">
                    <span className="font-bebas text-[15px] tracking-wide text-white/80 group-hover:text-white transition-colors leading-none block">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-white/35 group-hover:text-white/50 transition-colors leading-none mt-1 block">
                      {link.desc}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gold/40 group-hover:text-gold/70 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
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
                  <span className="font-bebas text-xl tracking-[0.15em] text-black leading-none">
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

export default Resources;
