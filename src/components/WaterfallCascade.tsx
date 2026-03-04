import { useState, useEffect, useRef } from "react";
/*
  BROWNISH CAST FIX:
  The cast was caused by rgba(212,175,55,0.12) background fills on zebra rows
  and rgba(212,175,55,0.08) on the Net Profits box — gold tint on dark bg
  reads as olive/brown on phone screens.
  NEW RULE: Zero gold fills anywhere in this component.
  Row separation: 1px white divider at 0.06 opacity only.
  Net Profits box: #000 background, full gold BORDER only.
  Producer/Investor: #000 background, gold border 0.20.
  Gold appears ONLY in: border strokes and text color.
*/
const TOTAL  = 3_000_000;
const PROFIT = 417_500;
const deductions = [
  { name: "CAM Fees",          amount:    22_500 },
  { name: "Sales Agent",       amount:   450_000 },
  { name: "Senior Debt",       amount:   440_000 },
  { name: "Mezzanine",         amount:   230_000 },
  { name: "Equity Recoupment", amount: 1_440_000 },
];
const fmt = (n: number) => `$${n.toLocaleString()}`;
const WaterfallCascade = () => {
  const [revealed,     setRevealed    ] = useState(false);
  const [profitCount,  setProfitCount ] = useState(0);
  const [splitVisible, setSplitVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let delay: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delay = setTimeout(() => setRevealed(true), 200);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(delay); };
  }, []);
  useEffect(() => {
    if (!revealed) return;
    let rafId: number;
    const timeout = setTimeout(() => {
      const dur   = 1400;
      const start = performance.now();
      const step  = (now: number) => {
        const t     = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProfitCount(Math.round(eased * PROFIT));
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, 1400);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [revealed]);
  useEffect(() => {
    if (!revealed) return;
    const timeout = setTimeout(() => setSplitVisible(true), 2000);
    return () => clearTimeout(timeout);
  }, [revealed]);
  return (
    <div ref={containerRef}>
      {/* ── Eyebrow — HOW THE MONEY FLOWS ──
          Gradient strip gives the section header visual weight without
          breaking the pure-black rule (fills are 0.08–0.10 opacity max).
          Bebas headline + mono sub-label = two-tier hierarchy in gold. */}
      <div
        className="text-center mb-8"
        style={{
          padding:      "12px 24px 14px",
          borderRadius: "6px",
          background:   "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 25%, rgba(212,175,55,0.10) 50%, rgba(212,175,55,0.08) 75%, transparent 100%)",
          border:       "1px solid rgba(212,175,55,0.14)",
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold-full mb-1.5"
          style={{ opacity: 0.60 }}
        >
          Recoupment Waterfall
        </p>
        <p className="font-bebas text-[clamp(2rem,6vw,3rem)] leading-none tracking-[0.06em] text-gold-full">
          HOW THE MONEY FLOWS
        </p>
      </div>
      {/* Intro */}
      <p
        className="text-center text-ink-body text-[16px] md:text-[18px] leading-relaxed mb-6 px-2"
        style={{ textWrap: "balance" as never }}
      >
        This is what happens to{" "}
        <span className="text-white font-semibold">$3M in revenue</span>{" "}
        before you see a dollar.
      </p>
      {/* Ledger — pure black, no fills */}
      <div
        style={{
          borderRadius: "8px",
          background:   "#000000",
          border:       "1px solid rgba(212,175,55,0.20)",
          overflow:     "hidden",
        }}
      >
        {/* Acquisition Price row */}
        <div
          className="flex justify-between items-baseline px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="font-mono text-[14px] uppercase tracking-[0.12em] text-ink-body">
            Acquisition Price
          </span>
          <span className="font-mono text-[18px] md:text-[20px] font-bold text-gold-full tabular-nums">
            {fmt(TOTAL)}
          </span>
        </div>
        {/* Deduction rows — white dividers only, zero gold fill */}
        <div
          className="px-5 pt-1 pb-4"
          style={{
            opacity:         revealed ? 1 : 0,
            transform:       revealed ? "translateY(0)" : "translateY(16px)",
            transition:      "opacity 500ms ease-out, transform 500ms ease-out",
            transitionDelay: "150ms",
          }}
        >
          {deductions.map((d, i) => (
            <div
              key={d.name}
              className="flex justify-between items-baseline"
              style={{
                padding:      "10px 0",
                borderBottom: i < deductions.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              <span className="text-[14px] font-medium text-ink-body">{d.name}</span>
              <span className="font-mono text-[14px] font-medium text-white tabular-nums">
                <span className="text-ink-secondary">{"\u2212"}</span>{fmt(d.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Net Profits — #000 bg, full gold border, gold text only */}
      <div
        className="mt-2 py-5 text-center"
        style={{
          borderRadius:    "8px",
          border:          "1px solid rgba(212,175,55,1.0)",
          background:      "#000000",
          opacity:         revealed ? 1 : 0,
          transform:       revealed ? "translateY(0)" : "translateY(16px)",
          transition:      "opacity 500ms ease-out, transform 500ms ease-out",
          transitionDelay: "1400ms",
        }}
      >
        <p className="font-mono text-[12px] tracking-[0.14em] uppercase font-semibold mb-1 text-gold-full">
          Net Profits
        </p>
        <span className="font-mono text-[28px] md:text-[32px] font-bold text-gold-full tracking-tight tabular-nums">
          ${profitCount.toLocaleString()}
        </span>
      </div>
      {/* Producer / Investor — #000 bg, gold border */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {([
          { label: "Producer", amount: "$208,750", delay: 0   },
          { label: "Investor", amount: "$208,750", delay: 150 },
        ]).map((c) => (
          <div
            key={c.label}
            className="px-3.5 py-3.5 text-center"
            style={{
              borderRadius:    "8px",
              border:          "1px solid rgba(212,175,55,0.20)",
              background:      "#000000",
              opacity:         splitVisible ? 1 : 0,
              transform:       splitVisible ? "translateY(0)" : "translateY(16px)",
              transition:      "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: `${c.delay}ms`,
            }}
          >
            <p className="font-mono text-[12px] tracking-[0.14em] uppercase font-semibold mb-1 text-ink-secondary">
              {c.label}
            </p>
            <span className="font-mono text-[18px] md:text-[20px] font-bold text-white tabular-nums">
              {c.amount}
            </span>
          </div>
        ))}
      </div>
      {/* Footnote */}
      <p className="font-mono text-[12px] text-ink-secondary text-center mt-3.5">
        Hypothetical $1.8M budget{"\u00A0"}{"\u00B7"}{"\u00A0"}$3M
        acquisition{"\u00A0"}{"\u00B7"}{"\u00A0"}50/50 net profit split
      </p>
    </div>
  );
};
export default WaterfallCascade;
