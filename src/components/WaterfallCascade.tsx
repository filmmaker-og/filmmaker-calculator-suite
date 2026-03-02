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
      const dur = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
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
    <div ref={containerRef} className="pt-2 pb-2">
      {/* Ledger card — gold border, black interior */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid rgba(212,175,55,0.12)", background: "#000" }}
      >
        {/* Acquisition price header row */}
        <div className="flex justify-between items-baseline px-5 pt-5 pb-4">
          <span className="font-bebas text-[22px] tracking-[0.06em] text-gold-text">
            Acquisition Price
          </span>
          <span className="font-mono text-[16px] font-medium text-gold tabular-nums">
            {fmt(TOTAL)}
          </span>
        </div>

        {/* Gold divider */}
        <div
          className="mx-5 h-[1px]"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.30), rgba(212,175,55,0.08))",
            opacity: revealed ? 1 : 0,
            transition: "opacity 600ms ease-out",
          }}
        />

        {/* Deduction rows — zebra-striped with gold tint */}
        <div className="px-5 pt-2 pb-4">
          {deductions.map((d, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={d.name}
                className="flex justify-between items-baseline rounded-md"
                style={{
                  padding: "9px 8px",
                  margin: "0 -8px",
                  background: isEven ? "rgba(212,175,55,0.03)" : "transparent",
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 500ms ease-out, transform 500ms ease-out",
                  transitionDelay: `${(i + 1) * 180}ms`,
                }}
              >
                <span className="text-[14px] font-medium text-ink-secondary">
                  {d.name}
                </span>
                <span className="font-mono text-[14px] font-medium text-ink-body tabular-nums">
                  <span className="text-ink-secondary">{"\u2212"}</span>{fmt(d.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profit box — thick gold border + glow */}
      <div
        className="mt-2 rounded-[10px] py-5 bg-black text-center"
        style={{
          border: "2px solid rgba(212,175,55,0.60)",
          boxShadow: "0 0 16px 0px rgba(212,175,55,0.10), inset 0 1px 0 rgba(212,175,55,0.08)",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          transitionDelay: "1400ms",
        }}
      >
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase font-semibold mb-1 text-gold-text">
          Net Profits
        </p>
        <span className="font-mono text-[32px] font-bold text-gold tracking-tight tabular-nums">
          ${profitCount.toLocaleString()}
        </span>
      </div>

      {/* Producer / Investor split — two small gold-bordered cards */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {([
          { label: "Producer", amount: "$208,750", delay: 0 },
          { label: "Investor", amount: "$208,750", delay: 150 },
        ]).map((c) => (
          <div
            key={c.label}
            className="px-3.5 py-3.5 text-center rounded-lg"
            style={{
              border: "1px solid rgba(212,175,55,0.15)",
              background: "rgba(212,175,55,0.03)",
              opacity: splitVisible ? 1 : 0,
              transform: splitVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: `${c.delay}ms`,
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase font-semibold mb-1 text-gold-text">
              {c.label}
            </p>
            <span className="font-mono text-[22px] font-bold text-gold tabular-nums">
              {c.amount}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-ink-secondary text-center mt-3.5">
        Hypothetical $1.8M budget{"\u00A0"}{"\u00B7"}{"\u00A0"}$3M
        acquisition{"\u00A0"}{"\u00B7"}{"\u00A0"}50/50 net profit split
      </p>
    </div>
  );
};

export default WaterfallCascade;
