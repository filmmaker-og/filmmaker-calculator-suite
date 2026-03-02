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
      {/* Source line */}
      <div className="flex justify-between items-baseline pb-4 mb-1" style={{ borderBottom: "1px solid rgba(212,175,55,0.10)" }}>
        <span className="text-[14px] font-medium text-white">
          Acquisition Price
        </span>
        <span className="font-mono text-[18px] font-semibold text-white tabular-nums">
          {fmt(TOTAL)}
        </span>
      </div>

      {/* Deductions */}
      {deductions.map((d, i) => (
        <div
          key={d.name}
          className="flex justify-between items-baseline py-3"
          style={{
            borderBottom: i < deductions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 500ms ease-out, transform 500ms ease-out",
            transitionDelay: `${(i + 1) * 140}ms`,
          }}
        >
          <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            {d.name}
          </span>
          <span className="font-mono text-[14px] tabular-nums" style={{ color: "rgba(255,255,255,0.50)" }}>
            {"\u2212"}{fmt(d.amount)}
          </span>
        </div>
      ))}

      {/* Gold divider before profit */}
      <div
        className="h-[1px] mt-6 mb-8"
        style={{
          background: "linear-gradient(90deg, rgba(212,175,55,0.20), rgba(212,175,55,0.05))",
          opacity: revealed ? 1 : 0,
          transition: "opacity 800ms ease-out",
          transitionDelay: `${deductions.length * 140 + 200}ms`,
        }}
      />

      {/* Net Profits — big number, centered */}
      <div
        className="text-center mb-8"
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 800ms ease-out",
          transitionDelay: `${deductions.length * 140 + 300}ms`,
        }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-2"
          style={{ color: "rgba(212,175,55,0.50)" }}
        >
          Net Profits
        </p>
        <span className="font-mono text-[38px] font-bold text-gold tracking-tight tabular-nums">
          ${profitCount.toLocaleString()}
        </span>
      </div>

      {/* 50/50 split */}
      <div
        className="flex justify-center gap-16"
        style={{
          opacity: splitVisible ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        {([
          { label: "Producer", amount: "$208,750" },
          { label: "Investor", amount: "$208,750" },
        ]).map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1"
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
        className="text-center mt-10 text-[11px] leading-[1.7]"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        Hypothetical $1.8M budget · $3M acquisition · 50/50 net profit split
      </p>
    </div>
  );
};

export default WaterfallCascade;
