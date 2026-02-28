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

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) {
    const k = n / 1_000;
    return `$${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${n.toLocaleString()}`;
};

const fmtFull = (n: number) => `$${n.toLocaleString()}`;

const WaterfallCascade = () => {
  const [revealed, setRevealed] = useState(false);
  const [profitCount, setProfitCount] = useState(0);
  const [corridorVisible, setCorridorVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let delay: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delay = setTimeout(() => setRevealed(true), 400);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(delay); };
  }, []);

  useEffect(() => {
    if (!revealed) return;
    let rafId: number;
    const timeout = setTimeout(() => {
      const target = PROFIT;
      const dur = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProfitCount(Math.round(eased * target));
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, 1400);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    const timeout = setTimeout(() => setCorridorVisible(true), 2000);
    return () => clearTimeout(timeout);
  }, [revealed]);

  return (
    <div ref={containerRef}>
      {/* Ledger card */}
      <div className="border border-white/[0.08] bg-black overflow-hidden rounded-xl" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}>
        {/* Source row */}
        <div className="flex justify-between items-baseline px-5 pt-5 pb-4">
          <span className="font-bebas text-[22px] tracking-[0.06em] text-white/90">
            Acquisition Price
          </span>
          <span className="font-mono text-[17px] font-semibold text-white/90 tabular-nums">
            {fmtFull(TOTAL)}
          </span>
        </div>

        {/* Gold divider */}
        <div
          className="mx-5 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.30), rgba(212,175,55,0.08))",
            opacity: revealed ? 1 : 0,
            transition: "opacity 600ms ease-out",
          }}
        />

        {/* Deduction line items */}
        <div className="px-5 pt-2 pb-4">
          {deductions.map((d, i) => {
            const delay = (i + 1) * 180;
            const isEven = i % 2 === 0;
            return (
              <div
                key={d.name}
                className="flex justify-between items-baseline rounded-md"
                style={{
                  padding: "9px 8px",
                  margin: "0 -8px",
                  background: isEven ? "rgba(255,255,255,0.03)" : "transparent",
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(6px)",
                  transition:
                    "opacity 500ms ease-out, transform 500ms ease-out",
                  transitionDelay: `${delay}ms`,
                }}
              >
                <span className="text-[14px] font-medium text-white/70">
                  {d.name}
                </span>
                <span className="font-mono text-[15px] font-medium text-white/70 tabular-nums">
                  {"\u2212"}{fmtFull(d.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profit box */}
      <div
        className="mt-2 rounded-[10px] py-5 bg-black text-center"
        style={{
          border: "2px solid rgba(212,175,55,0.60)",
          boxShadow: "0 0 40px 4px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          transitionDelay: "1400ms",
        }}
      >
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold text-gold mb-1">
          Net Profits
        </p>
        <span className="font-mono text-[32px] font-bold text-white tracking-tight tabular-nums">
          ${profitCount.toLocaleString()}
        </span>
      </div>

      {/* Producer / Investor split */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { label: "Producer", amount: "$208,750", extraDelay: 0 },
          { label: "Investor", amount: "$208,750", extraDelay: 150 },
        ].map((c) => (
          <div
            key={c.label}
            className="border border-white/[0.08] bg-black px-3.5 py-3.5 text-center rounded-lg"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              opacity: corridorVisible ? 1 : 0,
              transform: corridorVisible
                ? "translateY(0)"
                : "translateY(10px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: `${c.extraDelay}ms`,
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-label mb-1">
              {c.label}
            </p>
            <span className="font-mono text-[20px] font-bold text-white/90 tabular-nums">
              {c.amount}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[12px] text-white/45 text-center mt-3.5">
        Hypothetical $1.8M budget{"\u00A0"}{"\u00B7"}{"\u00A0"}$3M
        acquisition{"\u00A0"}{"\u00B7"}{"\u00A0"}50/50 net profit split
      </p>
    </div>
  );
};

export default WaterfallCascade;
