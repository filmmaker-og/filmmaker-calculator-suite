import { useState, useEffect, useRef } from "react";

const TOTAL = 3_000_000;
const PROFIT = 417_500;

const deductions = [
  { name: "CAM Fees",          amount: 22_500 },
  { name: "Sales Agent",       amount: 450_000 },
  { name: "Senior Debt",       amount: 440_000 },
  { name: "Mezzanine",         amount: 230_000 },
  { name: "Equity Recoupment", amount: 1_440_000 },
];

const fmt = (n: number) => `$${n.toLocaleString()}`;

const WaterfallCascade = () => {
  const [revealed, setRevealed] = useState(false);
  const [profitCount, setProfitCount] = useState(0);
  const [splitVisible, setSplitVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let delay: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delay = setTimeout(() => setRevealed(true), 300);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(delay); };
  }, []);

  useEffect(() => {
    if (!revealed) return;
    let rafId: number;
    const timeout = setTimeout(() => {
      const dur = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProfitCount(Math.round(eased * PROFIT));
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, deductions.length * 140 + 400);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    const timeout = setTimeout(() => setSplitVisible(true), deductions.length * 140 + 1800);
    return () => clearTimeout(timeout);
  }, [revealed]);

  return (
    <div ref={containerRef}>
      {/* Source */}
      <div className="flex justify-between items-baseline mb-8">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          Acquisition
        </span>
        <span className="font-mono text-[20px] font-medium text-white tabular-nums">
          {fmt(TOTAL)}
        </span>
      </div>

      {/* Deductions — no cards, just rows with a faint bottom rule */}
      <div className="space-y-0">
        {deductions.map((d, i) => (
          <div
            key={d.name}
            className="flex justify-between items-baseline py-3"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: `${(i + 1) * 140}ms`,
            }}
          >
            <span
              className="text-[14px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {d.name}
            </span>
            <span
              className="font-mono text-[14px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              {"\u2212"}{fmt(d.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Net Profits — big number, no box */}
      <div
        className="mt-10 mb-2"
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 800ms ease-out",
          transitionDelay: `${deductions.length * 140 + 300}ms`,
        }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-2"
          style={{ color: "rgba(212,175,55,0.40)" }}
        >
          Net Profits
        </p>
        <span className="font-mono text-[36px] font-bold text-gold tracking-tight tabular-nums">
          ${profitCount.toLocaleString()}
        </span>
      </div>

      {/* 50/50 split — inline, not boxed */}
      <div
        className="flex gap-12 mt-6"
        style={{
          opacity: splitVisible ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        {([
          { label: "Producer", amount: "$208,750" },
          { label: "Investor", amount: "$208,750" },
        ]).map((s) => (
          <div key={s.label}>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.2em] mb-1"
              style={{ color: "rgba(255,255,255,0.20)" }}
            >
              {s.label}
            </p>
            <span className="font-mono text-[20px] font-medium text-white tabular-nums">
              {s.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Footnote */}
      <p
        className="mt-10 text-[12px] leading-[1.7]"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        Hypothetical $1.8M budget · $3M acquisition · 50/50 net profit split
      </p>
    </div>
  );
};

export default WaterfallCascade;
