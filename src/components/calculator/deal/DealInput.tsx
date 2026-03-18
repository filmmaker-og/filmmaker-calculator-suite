import React, { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { WaterfallInputs, GuildState, CapitalSelections, CAM_PCT } from "@/lib/waterfall";
import ChapterCard, { cardH, cardHSub } from "../ChapterCard";

interface DealInputProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack?: () => void;
  onNext: () => void;
  genre?: string;
}

const GENRE_RANGES: Record<string, string> = {
  Action: '$1.2M – $4.5M',
  Thriller: '$800K – $3.2M',
  Comedy: '$600K – $2.5M',
  Drama: '$400K – $2M',
  Horror: '$500K – $3M',
  Romance: '$400K – $1.8M',
  'Sci-Fi / Fantasy': '$1M – $4M',
  'Sci-Fi': '$1M – $4M',
  Documentary: '$200K – $1.2M',
  Animation: '$800K – $3.5M',
  Other: '$500K – $3M',
};

const MAX_ACQ = 5000000;

const formatCurrency = (n: number): string => {
  return '$' + Math.abs(Math.round(n)).toLocaleString();
};

const formatShort = (n: number): string => {
  const a = Math.abs(n);
  if (a >= 1e6) return '$' + (a / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1) + 'M';
  if (a >= 1e3) return '$' + (a / 1e3).toFixed(0) + 'K';
  return '$' + a;
};

const formatValue = (value: number | undefined) => {
  if (value === undefined || value === 0) return '';
  return value.toLocaleString();
};

const parseValue = (str: string) => {
  return parseInt(str.replace(/[^0-9]/g, '')) || 0;
};

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  heroZone: {
    textAlign: "center" as const,
    padding: "28px 20px 20px",
    position: "relative" as const,
    zIndex: 1,
  },
  heroPrice: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "2px",
    padding: "8px 0 16px",
    position: "relative" as const,
  },
  heroSign: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "rgba(212,175,55,0.40)",
    lineHeight: 1,
    transition: "color 0.4s",
  },
  heroSignLit: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "1.6rem",
    fontWeight: 500,
    color: "#D4AF37",
    lineHeight: 1,
    transition: "color 0.4s",
  },
  heroInput: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "3.4rem",
    fontWeight: 500,
    color: "#fff",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center" as const,
    width: "100%",
    maxWidth: "300px",
    padding: 0,
    caretColor: "#D4AF37",
    minHeight: "52px",
  },
  heroCursor: {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(8px, -50%)",
    width: "2px",
    height: "32px",
    background: "#D4AF37",
    borderRadius: "1px",
    animation: "cursorBlink 1s step-end infinite",
    pointerEvents: "none" as const,
    opacity: 0.6,
  },
  heroBar: {
    height: "2px",
    margin: "0 auto",
    maxWidth: "260px",
    background: "rgba(212,175,55,0.10)",
    borderRadius: "1px",
    position: "relative" as const,
    overflow: "hidden",
  },
  heroBarFill: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(90deg, rgba(212,175,55,0.60), #D4AF37)",
    borderRadius: "1px",
    transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 0 12px rgba(212,175,55,0.3)",
  },
  heroBarShimmer: {
    position: "absolute" as const,
    top: 0,
    left: "-100%",
    width: "50%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
    animation: "barShimmer 12s ease-in-out infinite",
    pointerEvents: "none" as const,
  },
  heroBarTick: {
    position: "absolute" as const,
    top: "-4px",
    width: "1px",
    height: "10px",
    background: "rgba(212,175,55,0.25)",
    pointerEvents: "none" as const,
    transition: "background 0.3s",
  },
  heroBarTickHit: {
    position: "absolute" as const,
    top: "-4px",
    width: "1px",
    height: "10px",
    background: "rgba(212,175,55,0.60)",
    pointerEvents: "none" as const,
    transition: "background 0.3s",
  },
  heroHint: {
    textAlign: "center" as const,
    marginTop: "14px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.30)",
    lineHeight: 1.5,
  },
  // Market context
  mkt: {
    marginTop: "12px",
    padding: "12px 16px",
    background: "rgba(212,175,55,0.03)",
    border: "1px solid rgba(212,175,55,0.10)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  mktText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.4,
  },
  // Verdict card
  verdict: {
    marginTop: "20px",
    opacity: 0,
    transform: "translateY(24px) scale(0.98)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
    pointerEvents: "none" as const,
  },
  verdictVis: {
    marginTop: "20px",
    opacity: 1,
    transform: "translateY(0) scale(1)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
    pointerEvents: "auto" as const,
  },
  vHero: {
    padding: "24px 20px 20px",
    textAlign: "center" as const,
    position: "relative" as const,
  },
  vHeroLine: {
    position: "absolute" as const,
    bottom: 0,
    left: "20px",
    right: "20px",
    height: "1px",
    background: "rgba(255,255,255,0.06)",
  },
  vTagPos: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    marginBottom: "12px",
    color: "#D4AF37",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.20)",
  },
  vTagNeg: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    marginBottom: "12px",
    color: "rgba(220,38,38,0.85)",
    background: "rgba(220,38,38,0.06)",
    border: "1px solid rgba(220,38,38,0.15)",
  },
  vAmtPos: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: "6px",
    color: "#D4AF37",
    textShadow: "0 0 20px rgba(212,175,55,0.25)",
  },
  vAmtNeg: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: "6px",
    color: "rgba(220,38,38,0.85)",
  },
  vSub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.40)",
  },
  // Breakdown rows
  vbRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  vbLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  vbLbl: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.55)",
  },
  vbDetail: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    marginTop: "2px",
  },
  vbVal: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.70)",
  },
  vbValNeg: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(220,38,38,0.60)",
  },
  vbNet: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "rgba(212,175,55,0.04)",
    borderTop: "1px solid rgba(212,175,55,0.15)",
  },
  vbNetLbl: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#D4AF37",
  },
  vbNetVal: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "18px",
    fontWeight: 600,
    color: "#D4AF37",
  },
  // Levers
  levTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "14px 16px",
    marginTop: "16px",
    cursor: "pointer",
    background: "#0A0A0A",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.15)",
  },
  levLeft: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    textAlign: "left" as const,
  },
  levTitle: {
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.55)",
  },
  levVals: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    color: "rgba(255,255,255,0.30)",
  },
  levBody: {
    maxHeight: 0,
    overflow: "hidden",
    opacity: 0,
    transition: "max-height 0.35s ease, opacity 0.25s ease",
  },
  levBodyOpen: {
    maxHeight: "400px",
    overflow: "hidden",
    opacity: 1,
    transition: "max-height 0.35s ease, opacity 0.25s ease",
  },
  levCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "8px",
  },
  levHdr: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  levLbl: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.55)",
  },
  levVal: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "14px",
    fontWeight: 500,
    color: "#fff",
  },
  levRange: {
    WebkitAppearance: "none" as const,
    appearance: "none" as const,
    width: "100%",
    height: "6px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "3px",
    outline: "none",
    cursor: "pointer",
  },
  levScale: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.25)",
  },
  levInline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levInput: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "14px",
    fontWeight: 500,
    color: "#fff",
    background: "#0A0A0A",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "4px",
    padding: "10px 12px",
    textAlign: "right" as const,
    width: "120px",
    outline: "none",
    transition: "border-color 0.2s",
    minHeight: "44px",
  },
  levSub: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    marginTop: "2px",
  },
  // CTA reveal
  reveal: {
    opacity: 0,
    transform: "translateY(12px)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "none" as const,
  },
  revealVis: {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "auto" as const,
  },
  cta: {
    width: "100%",
    padding: "18px",
    background: "#F9E076",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "20px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "transform 0.12s",
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.08)",
    minHeight: "56px",
  },
  disc: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "16px",
    marginTop: "24px",
    background: "#0A0A0A",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
  },
  discText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.5,
  },
};

const DealInput = ({ inputs, guilds, selections, onUpdateInput, onNext, genre }: DealInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [leversOpen, setLeversOpen] = useState(false);

  const hasRevenue = inputs.revenue > 0;
  const budget = inputs.budget;
  const revenue = inputs.revenue;
  const fillPct = Math.min(100, (revenue / MAX_ACQ) * 100);
  const tickPct = budget > 0 ? Math.min(100, (budget / MAX_ACQ) * 100) : 0;
  const tickHit = budget > 0 && revenue >= budget;
  const isBreathing = !hasFocused && !hasRevenue;

  // Calculations
  const camFee = revenue * CAM_PCT;
  const salesAgentFee = revenue * (inputs.salesFee / 100);
  const totalOffTop = camFee + salesAgentFee + inputs.salesExp;
  const netRevenue = Math.max(0, revenue - totalOffTop);
  const margin = revenue - budget;

  // Verdict state
  const isPositive = margin > 0;
  const isNegative = margin < 0;
  const glowState = hasRevenue && budget > 0
    ? (isPositive ? 'positive' : isNegative ? 'negative' : null)
    : null;

  const placeholder = '0';

  // Genre range
  const genreRange = genre ? GENRE_RANGES[genre] || GENRE_RANGES['Other'] : null;

  // Completion pulse
  useEffect(() => {
    if (hasRevenue && !hasPulsed) {
      setHasPulsed(true);
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 700);
      return () => clearTimeout(timer);
    }
    if (!hasRevenue) {
      setHasPulsed(false);
    }
  }, [hasRevenue, hasPulsed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      if (hasRevenue) {
        setTimeout(() => onNext(), 100);
      }
    }
  };

  const handleFocus = () => {
    setHasFocused(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleMktInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const n = parseInt(raw) || 0;
    onUpdateInput('salesExp', n);
  };

  return (
    <div style={s.wrapper}>
      <ChapterCard
        chapter="03"
        title="The Market"
        variant="warm"
        breathing={isBreathing}
        pulsing={isPulsing}
        noPad
      >
        <div style={s.heroZone}>
          <div style={cardH}>What's It Worth?</div>
          <div style={cardHSub}>
            You're building for{' '}
            <span style={{ fontFamily: "'Roboto Mono', monospace", color: "rgba(255,255,255,0.70)" }}>
              {budget > 0 ? formatCurrency(budget) : '$0'}
            </span>
          </div>

          <div style={s.heroPrice}>
            <span style={hasRevenue ? s.heroSignLit : s.heroSign}>$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              enterKeyHint="done"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={placeholder}
              style={{
                ...s.heroInput,
                ...(!hasRevenue ? { color: "rgba(255,255,255,0.10)" } : {}),
              }}
            />
            {!hasFocused && !hasRevenue && <div style={s.heroCursor} />}
          </div>

          {/* Gold underline bar with budget tick */}
          <div style={s.heroBar}>
            <div style={{ ...s.heroBarFill, width: `${fillPct}%` }} />
            {!hasRevenue && <div style={s.heroBarShimmer} />}
            {tickPct > 0 && (
              <div style={{ ...(tickHit ? s.heroBarTickHit : s.heroBarTick), left: `${tickPct}%` }} />
            )}
          </div>

          <div style={s.heroHint}>Typical SVOD acquisition: $500K – $5M</div>
        </div>
      </ChapterCard>

      {/* Market context — genre-based */}
      {genre && genreRange && (
        <div style={s.mkt}>
          <svg style={{ color: "rgba(212,175,55,0.40)", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={s.mktText}>
            Recent indie <strong style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{genre.toLowerCase()}</strong> acquisitions: {genreRange}
          </span>
        </div>
      )}

      {/* Verdict card */}
      <div style={hasRevenue && budget > 0 ? s.verdictVis : s.verdict}>
        <ChapterCard
          chapter=""
          title=""
          hideEyebrow
          variant="feature"
          glowState={glowState as 'positive' | 'negative' | null}
          noPad
        >
          <div style={s.vHero}>
            <div style={isNegative ? s.vTagNeg : s.vTagPos}>
              {isPositive ? 'GROSS MARGIN' : isNegative ? 'SHORTFALL' : 'BREAK-EVEN'}
            </div>
            <div style={isNegative ? s.vAmtNeg : s.vAmtPos}>
              {isPositive ? '+' : isNegative ? '-' : ''}{formatCurrency(Math.abs(margin))}
            </div>
            <div style={s.vSub}>
              {isPositive ? 'Build for less, sell for more' : isNegative ? 'Acquisition below budget' : 'No margin'}
            </div>
            <div style={s.vHeroLine} />
          </div>

          {/* Breakdown rows */}
          <div style={{ padding: "0 20px" }}>
            <div style={s.vbRow}>
              <div style={s.vbLeft}>
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: "rgba(212,175,55,0.60)", flexShrink: 0 }} />
                <div style={s.vbLbl}>Acquisition</div>
              </div>
              <div style={s.vbVal}>{formatCurrency(revenue)}</div>
            </div>
            <div style={s.vbRow}>
              <div style={s.vbLeft}>
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: "rgba(255,255,255,0.20)", flexShrink: 0 }} />
                <div style={s.vbLbl}>Budget</div>
              </div>
              <div style={s.vbVal}>{formatCurrency(budget)}</div>
            </div>
            <div style={{ ...s.vbRow, borderBottom: "none" }}>
              <div style={s.vbLeft}>
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: "rgba(220,38,38,0.40)", flexShrink: 0 }} />
                <div>
                  <div style={s.vbLbl}>Off-the-Tops</div>
                  <div style={s.vbDetail}>
                    CAM {formatShort(camFee)} · Sales {formatShort(salesAgentFee)} · Mktg {formatShort(inputs.salesExp)}
                  </div>
                </div>
              </div>
              <div style={s.vbValNeg}>-{formatCurrency(totalOffTop)}</div>
            </div>
          </div>

          {/* Net to Waterfall footer */}
          <div style={s.vbNet}>
            <span style={s.vbNetLbl}>Net to Waterfall</span>
            <span style={s.vbNetVal}>{formatCurrency(netRevenue)}</span>
          </div>
        </ChapterCard>
      </div>

      {/* Adjust Assumptions lever */}
      <button style={s.levTrigger} onClick={() => setLeversOpen(!leversOpen)}>
        <div style={s.levLeft}>
          <span style={s.levTitle}>Adjust Assumptions</span>
          <span style={s.levVals}>Sales fee {inputs.salesFee}% · Marketing {formatShort(inputs.salesExp)}</span>
        </div>
        <ChevronDown style={{
          width: "16px",
          height: "16px",
          color: "rgba(212,175,55,0.40)",
          transition: "transform 0.25s",
          transform: leversOpen ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
        }} />
      </button>

      <div style={leversOpen ? s.levBodyOpen : s.levBody}>
        <div style={{ paddingTop: "8px" }}>
          {/* Sales Fee slider */}
          <div style={s.levCard}>
            <div style={s.levHdr}>
              <span style={s.levLbl}>Sales Agent Fee</span>
              <span style={s.levVal}>{inputs.salesFee}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              value={inputs.salesFee}
              onChange={(e) => onUpdateInput('salesFee', parseInt(e.target.value))}
              style={s.levRange}
            />
            <div style={s.levScale}>
              <span>Direct (0%)</span>
              <span>Standard (15%)</span>
              <span>Full (25%+)</span>
            </div>
          </div>

          {/* Marketing cap */}
          <div style={s.levCard}>
            <div style={s.levInline}>
              <div>
                <span style={s.levLbl}>Marketing Cap</span>
                <div style={s.levSub}>Sales agent expense cap</div>
              </div>
              <input
                type="text"
                inputMode="decimal"
                enterKeyHint="done"
                value={inputs.salesExp > 0 ? inputs.salesExp.toLocaleString() : ''}
                onChange={handleMktInputChange}
                placeholder="75,000"
                style={s.levInput}
                onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.35)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={hasRevenue ? s.revealVis : s.reveal}>
        <button style={s.cta} onClick={onNext}>
          See the Waterfall
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <div style={s.disc}>
        <svg style={{ color: "rgba(212,175,55,0.35)", flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span style={s.discText}>Educational model only. Not financial, legal, or investment advice.</span>
      </div>
    </div>
  );
};

export default DealInput;
