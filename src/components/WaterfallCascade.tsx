import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const TOTAL = 3_000_000;

interface Tier {
  name: string;
  amount: number;
  type: "source" | "deduction" | "profit";
}

interface Block extends Tier {
  startPct: number;
  widthPct: number;
}

const tiers: Tier[] = [
  { name: "Acquisition Price",  amount: 3_000_000, type: "source" },
  { name: "CAM Fees",           amount: 22_500,    type: "deduction" },
  { name: "Sales Agent",        amount: 450_000,   type: "deduction" },
  { name: "Senior Debt",        amount: 440_000,   type: "deduction" },
  { name: "Mezzanine",          amount: 230_000,   type: "deduction" },
  { name: "Equity Recoupment",  amount: 1_440_000, type: "deduction" },
  { name: "Net Profits",        amount: 417_500,   type: "profit" },
];

const buildBlocks = (): Block[] => {
  let running = TOTAL;
  return tiers.map((tier) => {
    if (tier.type === "source") {
      return { ...tier, startPct: 0, widthPct: 100 };
    }
    const startPct = ((TOTAL - running) / TOTAL) * 100;
    const widthPct = (tier.amount / TOTAL) * 100;
    if (tier.type === "deduction") running -= tier.amount;
    return { ...tier, startPct, widthPct };
  });
};

const blocks = buildBlocks();

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
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
      const target = 417_500;
      const dur = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProfitCount(Math.round(eased * target));
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, 2000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    const timeout = setTimeout(() => setCorridorVisible(true), 2200);
    return () => clearTimeout(timeout);
  }, [revealed]);

  return (
    <div ref={containerRef}>
      <div className="border border-white/[0.08] bg-black overflow-hidden rounded-xl">
        {blocks.map((block, i) => {
          if (block.type === "profit") return null;
          const isSource = block.type === "source";
          const delay = i * 250;
          const barOpacity = Math.max(0.25, 0.55 - i * 0.05);

          return (
            <div
              key={block.name}
              className={cn(i > 0 && "border-t border-white/[0.07]")}
            >
              <div className="flex justify-between items-baseline px-4 pt-[10px] pb-[5px]">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-white/50 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={
                      isSource
                        ? "font-bebas text-[22px] tracking-[0.06em] text-white/90"
                        : "text-[14px] tracking-[0.01em] font-medium text-white/65"
                    }
                  >
                    {block.name}
                  </span>
                </div>
                <span
                  className={
                    isSource
                      ? "font-mono text-[17px] font-semibold text-white/90"
                      : "font-mono text-[14px] font-medium text-white/65"
                  }
                >
                  {isSource ? fmtFull(block.amount) : `\u2212${fmt(block.amount)}`}
                </span>
              </div>

              <div className="px-4 pb-[10px]">
                <div
                  className={cn(
                    "w-full relative overflow-hidden rounded-sm",
                    isSource ? "h-4" : "h-[10px]"
                  )}
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {isSource ? (
                    <div
                      className="absolute left-0 top-0 h-full rounded-sm"
                      style={{
                        width: revealed ? "100%" : "0%",
                        background:
                          "linear-gradient(90deg, rgba(212,175,55,0.70), rgba(212,175,55,0.45))",
                        transition: "width 1000ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  ) : (
                    <>
                      <div
                        className="absolute top-0 h-full rounded-sm"
                        style={{
                          left: "0%",
                          width: revealed
                            ? `${block.startPct + block.widthPct}%`
                            : "0%",
                          background: "rgba(212,175,55,0.08)",
                          transition:
                            "width 800ms cubic-bezier(0.16,1,0.3,1)",
                          transitionDelay: `${delay}ms`,
                        }}
                      />
                      <div
                        className="absolute top-0 h-full rounded-sm"
                        style={{
                          left: revealed ? `${block.startPct}%` : "0%",
                          width: revealed ? `${block.widthPct}%` : "0%",
                          background: `rgba(212,175,55,${barOpacity})`,
                          transition:
                            "left 800ms cubic-bezier(0.16,1,0.3,1), width 800ms cubic-bezier(0.16,1,0.3,1)",
                          transitionDelay: `${delay}ms`,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-3.5 rounded-[10px] px-[18px] py-5 bg-black"
        style={{ border: "2px solid rgba(212,175,55,0.60)" }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold text-gold mb-1">
              Net Profits
            </p>
            <span className="font-mono text-[32px] font-bold text-white tracking-tight">
              ${profitCount.toLocaleString()}
            </span>
          </div>
          <div
            className="w-20 h-9 rounded overflow-hidden relative"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded"
              style={{
                width: revealed
                  ? `${(417_500 / TOTAL) * 100}%`
                  : "0%",
                background: "rgba(212,175,55,0.75)",
                transition: "width 1000ms cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: "2000ms",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { label: "Producer", amount: "$208,750", extraDelay: 0 },
          { label: "Investor", amount: "$208,750", extraDelay: 150 },
        ].map((c) => (
          <div
            key={c.label}
            className="border border-white/[0.08] bg-black px-3.5 py-3.5 text-center rounded-lg"
            style={{
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
            <span className="font-mono text-[20px] font-bold text-white/90">
              {c.amount}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-white/35 text-center mt-3.5">
        Hypothetical $1.8M budget{"\u00A0"}{"\u00B7"}{"\u00A0"}$3M
        acquisition{"\u00A0"}{"\u00B7"}{"\u00A0"}50/50 net profit split
      </p>
    </div>
  );
};

export default WaterfallCascade;
