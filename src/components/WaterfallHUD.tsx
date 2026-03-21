import { useEffect, useRef, useState, useCallback } from "react";
import { useHaptics } from "@/hooks/use-haptics";

const TOTAL_ACQUISITION = 3_000_000;

interface WaterfallHUDProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  tierRefs: React.RefObject<(HTMLDivElement | null)[]>;
  tierAmounts: number[];
}

function formatCurrency(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function getColorForPercent(pct: number): string {
  if (pct > 0.50) return "#D4AF37";
  if (pct > 0.30) return "rgba(255,255,255,0.88)";
  return "rgba(220,38,38,0.92)";
}

function getGaugeGradient(pct: number): string {
  if (pct > 0.50) return "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.60))";
  if (pct > 0.30) return "linear-gradient(90deg, rgba(255,255,255,0.50), rgba(255,255,255,0.25))";
  return "linear-gradient(90deg, rgba(220,38,38,0.50), rgba(220,38,38,0.25))";
}

export default function WaterfallHUD({ sectionRef, tierRefs, tierAmounts }: WaterfallHUDProps) {
  const haptics = useHaptics();
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [displayValue, setDisplayValue] = useState(TOTAL_ACQUISITION);
  const [targetValue, setTargetValue] = useState(TOTAL_ACQUISITION);
  const intersectedCount = useRef(0);
  const crossedDanger = useRef(false);
  const mountedHaptic = useRef(false);
  const animFrameRef = useRef<number>(0);
  const deductedTiers = useRef<Set<number>>(new Set());

  // Mount/unmount based on context block top reaching pill nav
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkPosition = () => {
      const rect = el.getBoundingClientRect();
      const shouldShow = rect.top <= 56 && rect.bottom > 200;
      setVisible(shouldShow);
      if (shouldShow && !mountedHaptic.current) {
        haptics.medium();
        mountedHaptic.current = true;
      }
      if (!shouldShow) {
        mountedHaptic.current = false;
      }
    };

    window.addEventListener('scroll', checkPosition, { passive: true });
    checkPosition();
    return () => window.removeEventListener('scroll', checkPosition);
  }, [sectionRef, haptics]);

  // Track tier card intersections for HUD deduction
  useEffect(() => {
    const refs = tierRefs.current;
    if (!refs) return;

    const observers: IntersectionObserver[] = [];

    refs.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !deductedTiers.current.has(i)) {
            deductedTiers.current.add(i);
            intersectedCount.current += 1;
            if (intersectedCount.current >= 3) setCollapsed(true);
            haptics.light();

            setTargetValue((prev) => {
              const next = prev - tierAmounts[i];
              const pct = next / TOTAL_ACQUISITION;
              if (pct < 0.30 && !crossedDanger.current) {
                crossedDanger.current = true;
                haptics.heavy();
              }
              return next;
            });
          } else if (!entry.isIntersecting && deductedTiers.current.has(i)) {
            deductedTiers.current.delete(i);
            intersectedCount.current = Math.max(0, intersectedCount.current - 1);

            setTargetValue((prev) => {
              const next = prev + tierAmounts[i];
              const pct = next / TOTAL_ACQUISITION;
              if (pct >= 0.30) crossedDanger.current = false;
              return next;
            });
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [tierRefs, tierAmounts, haptics]);

  // Animated counter (350ms ease-out rolldown)
  useEffect(() => {
    const start = displayValue;
    const diff = targetValue - start;
    if (diff === 0) return;
    const duration = 350;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplayValue(current);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [targetValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct = displayValue / TOTAL_ACQUISITION;
  const color = getColorForPercent(pct);
  const gaugeGradient = getGaugeGradient(pct);
  const gaugePct = Math.max(0, Math.min(100, (displayValue / TOTAL_ACQUISITION) * 100));

  return (
    <div
      style={{
        position: "sticky",
        top: 52,
        zIndex: 39,
        background: "rgba(6,6,6,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "2px solid rgba(120,60,180,0.40)",
        padding: collapsed ? "8px 24px" : "16px 24px 12px",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 300ms ease-out, opacity 200ms ease-out, padding 300ms ease-out",
      }}
    >
      {/* Full mode: labels + values */}
      {!collapsed && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.5rem",
                color: "rgba(120,60,180,0.70)",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              GROSS BUYOUT
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.6rem",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1,
                marginTop: "2px",
              }}
            >
              $3,000,000
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.5rem",
                color: "rgba(120,60,180,0.70)",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              NET REMAINING
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.6rem",
                color: color,
                lineHeight: 1,
                marginTop: "2px",
                transition: "color 0.3s ease",
              }}
            >
              {formatCurrency(displayValue)}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed mode: gauge + net remaining inline */}
      {collapsed && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              flex: 1,
              height: "8px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${gaugePct}%`,
                background: gaugeGradient,
                borderRadius: "5px",
                transition: "width 0.4s ease-out",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.8rem",
              color: color,
              whiteSpace: "nowrap",
              transition: "color 0.3s ease",
            }}
          >
            {formatCurrency(displayValue)}
          </div>
        </div>
      )}

      {/* Gauge bar (full mode) */}
      {!collapsed && (
        <div
          style={{
            marginTop: "10px",
            height: "8px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${gaugePct}%`,
              background: gaugeGradient,
              borderRadius: "5px",
              transition: "width 0.4s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
}
