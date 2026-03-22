import { useState, useEffect } from "react";
import { Mail, X as XIcon, Clock, ChevronDown } from "lucide-react";

import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import {
  selfServeProducts,
  researchProducts,
  turnkeyServices,
  type Product,
} from "@/lib/store-products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const storeFaqs = [
  {
    q: "What do you need from me?",
    a: "Depends on the product. The Full Analysis pulls straight from your calculator \u2014 buy it, it builds. The Comp Report needs a few details from you (genre, cast tier, budget range) so we research the right deals. Turnkey builds start with a short intake after checkout.",
  },
  {
    q: "Can I see what I\u2019m getting before I buy?",
    a: "Run the free calculator. That\u2019s the engine. Paid products take those same numbers and present them at the quality you\u2019d hand an investor without thinking twice. Tap \u2018See full details\u2019 on any product for the complete breakdown.",
  },
  {
    q: "What happens if the deliverables don\u2019t hold up?",
    a: "If the work doesn\u2019t hold up, we revise it. These models are built on the same waterfall and capital stack mechanics used in real production deals \u2014 if something\u2019s off, we fix it until it\u2019s right.",
  },
  {
    q: "What\u2019s The Working Model and when do I see it?",
    a: "A live, formula-driven Excel workbook where every output cell is connected to every input. Change any assumption and the entire model recalculates. It appears as a $79 add-on at checkout when you purchase any product.",
  },
  {
    q: "Can I upgrade and apply what I\u2019ve already paid?",
    a: "Yes. Contact us and we\u2019ll apply your prior purchase toward the higher tier. The credit upgrade path works across all products.",
  },
];


/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS & STYLES
   ═══════════════════════════════════════════════════════════════════ */
const s: Record<string, React.CSSProperties> = {
  /* ── Eyebrow (matches Index.tsx eyebrow) ── */
  eyebrowRuled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "14px",
  },
  eyebrowLine: {
    flex: 1,
    height: "1px",
    background: "rgba(212,175,55,0.40)",
    boxShadow: "0 0 8px rgba(212,175,55,0.15)",
  },
  eyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "15px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#D4AF37",
    whiteSpace: "nowrap" as const,
  },
  /* ── Card base ── */
  cardBase: {
    background: "#0A0A0A",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
    overflow: "hidden",
    transition: "transform 0.3s ease, border-color 0.3s ease",
    position: "relative" as const,
  },
  /* ── Card header (matches Index.tsx tierHeaderAlt: 28px 24px 20px) ── */
  cardHeader: {
    padding: "28px 24px 20px",
    borderBottom: "1px solid rgba(212,175,55,0.12)",
  },
  /* ── Card name (matches Index.tsx tierTitleCard: 2.6rem) ── */
  cardName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.6rem",
    letterSpacing: "0.04em",
    color: "#fff",
    textTransform: "uppercase" as const,
    lineHeight: 1,
    marginBottom: "8px",
  },
  /* ── Pick this if (matches feature desc tier: 16px) ── */
  pickThisIf: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    color: "rgba(212,175,55,0.80)",
    marginTop: "6px",
    lineHeight: 1.45,
  },
  /* ── Badge (matches Index.tsx trendingBadge: 6px 12px) ── */
  badgeBase: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: "4px",
    color: "#D4AF37",
    whiteSpace: "nowrap" as const,
  },
  /* ── Price block ── */
  priceBlock: {
    padding: "24px 24px 20px",
  },
  priceStandard: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1,
  },
  priceNote: {
    display: "block",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.06em",
    marginTop: "4px",
  },
  /* ── Short desc (matches Index.tsx tierSubFree: 18px, 0.72) ── */
  shortDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "18px",
    color: "rgba(255,255,255,0.72)",
    marginTop: "8px",
    lineHeight: 1.55,
  },
  /* ── Subdivider (gold, not white) ── */
  subdivider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)",
    margin: "0 24px",
  },
  /* ── Features (matches Index.tsx tierFeatures: padding 24px, gap 16px) ── */
  featuresBlock: {
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  featureRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  featureCheck: {
    color: "#D4AF37",
    fontSize: "20px",
    flexShrink: 0,
    marginTop: "1px",
    fontFamily: "'Roboto Mono', monospace",
    textShadow: "0 0 12px rgba(212,175,55,0.4)",
  },
  featureText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.3,
  },
  /* ── Turnaround badge ── */
  turnaroundBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    color: "rgba(255,255,255,0.55)",
    background: "rgba(255,255,255,0.08)",
    padding: "5px 10px",
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  /* ── Action block (matches Index.tsx tierAction: 0 24px 36px) ── */
  actionBlock: {
    padding: "0 24px 36px",
  },
  /* ── Buttons (matches Index.tsx btnGold: 16px, 0.10em, radius 6px) ── */
  btnOutline: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#D4AF37",
    background: "rgba(212,175,55,0.05)",
    border: "1px solid rgba(212,175,55,0.30)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },
  btnGreen: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#3CB371",
    background: "rgba(60,179,113,0.05)",
    border: "1px solid rgba(60,179,113,0.25)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },
  btnGreenSecondary: {
    width: "100%",
    padding: "16px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "14px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#3CB371",
    background: "rgba(60,179,113,0.03)",
    border: "1px solid rgba(60,179,113,0.15)",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.2s, border-color 0.2s",
  },
  btnPurpleOutline: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "rgb(180,140,255)",
    background: "rgba(120,60,180,0.05)",
    border: "1px solid rgba(120,60,180,0.30)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },
  btnPurple: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#fff",
    background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(120,60,180,0.35), 0 0 60px rgba(212,175,55,0.10)",
    transition: "transform 0.15s, box-shadow 0.3s",
  },
  btnCta: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#000",
    background: "#F9E076",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(249,224,118,0.3), 0 0 60px rgba(249,224,118,0.1)",
    transition: "transform 0.15s, box-shadow 0.3s",
  },
  btnGoldSolid: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#000",
    background: "#D4AF37",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(212,175,55,0.35), 0 0 50px rgba(212,175,55,0.10)",
    transition: "transform 0.15s, box-shadow 0.3s",
  },
  btnGreenSolid: {
    width: "100%",
    padding: "18px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    color: "#000",
    background: "#3CB371",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(60,179,113,0.35), 0 0 50px rgba(60,179,113,0.10)",
    transition: "transform 0.15s, box-shadow 0.3s",
  },
  /* ── Details link (matches Index.tsx detailsLink: 15px Inter, white 0.85) ── */
  detailsLink: {
    display: "block",
    width: "100%",
    textAlign: "center" as const,
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    color: "rgba(255,255,255,0.85)",
    padding: "8px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s",
    marginTop: "16px",
  },
};


/* ═══════════════════════════════════════════════════════════════════
   TIER COLOR SYSTEM
   ═══════════════════════════════════════════════════════════════════ */
const tierStyles = {
  gold: {
    card: {
      border: "none",
      background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.16) 0%, #0A0A0A 70%)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.12)",
    },
    gradientBorder: "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)",
    topline: {
      height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)",
      boxShadow: "0 0 12px rgba(212,175,55,0.25)",
    },
    headerBorder: "1px solid rgba(212,175,55,0.12)",
    headerBg: undefined as string | undefined,
    subdivider: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)",
    featureCheck: { color: "#D4AF37", textShadow: "0 0 12px rgba(212,175,55,0.4)" },
    pickThis: { color: "rgba(212,175,55,0.80)" },
    price: { color: "#D4AF37" },
    badge: { color: "#D4AF37", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.35)" },
    btn: "btnGoldSolid" as const,
    btnHover: { boxShadow: "0 0 28px rgba(212,175,55,0.50), 0 0 70px rgba(212,175,55,0.15)" } as Record<string, string>,
    btnRest: { boxShadow: "0 0 20px rgba(212,175,55,0.35), 0 0 50px rgba(212,175,55,0.10)" } as Record<string, string>,
    hoverLift: "-2px",
  },
  green: {
    card: {
      border: "none",
      background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.15) 0%, #0A0A0A 70%)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(60,179,113,0.10)",
    },
    gradientBorder: "linear-gradient(180deg, rgba(60,179,113,0.50) 0%, rgba(60,179,113,0.20) 50%, rgba(60,179,113,0.35) 100%)",
    topline: {
      height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.50), transparent)",
      boxShadow: "0 0 12px rgba(60,179,113,0.3)",
    },
    headerBorder: "1px solid rgba(60,179,113,0.12)",
    headerBg: undefined as string | undefined,
    subdivider: "linear-gradient(90deg, transparent, rgba(60,179,113,0.12), transparent)",
    featureCheck: { color: "#3CB371", textShadow: "0 0 12px rgba(60,179,113,0.4)" },
    pickThis: { color: "rgba(60,179,113,0.80)" },
    price: { color: "#3CB371" },
    badge: { color: "#3CB371", background: "rgba(60,179,113,0.08)", border: "1px solid rgba(60,179,113,0.30)" },
    btn: "btnGreenSolid" as const,
    btnHover: { boxShadow: "0 0 28px rgba(60,179,113,0.50), 0 0 70px rgba(60,179,113,0.15)" } as Record<string, string>,
    btnRest: { boxShadow: "0 0 20px rgba(60,179,113,0.35), 0 0 50px rgba(60,179,113,0.10)" } as Record<string, string>,
    hoverLift: "-4px",
  },
  purple: {
    card: {
      border: "none",
      background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.22) 0%, rgba(212,175,55,0.06) 30%, #0A0A0A 70%)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 50px rgba(120,60,180,0.18)",
    },
    gradientBorder: "linear-gradient(180deg, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.15) 40%, rgba(120,60,180,0.30) 70%, rgba(120,60,180,0.50) 100%)",
    topline: {
      height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(120,60,180,0.50), rgba(212,175,55,0.40), transparent)",
    },
    headerBorder: "1px solid rgba(120,60,180,0.12)",
    headerBg: undefined as string | undefined,
    subdivider: "linear-gradient(90deg, transparent, rgba(120,60,180,0.12), transparent)",
    featureCheck: { color: "rgb(160,100,255)", textShadow: "0 0 14px rgba(140,80,240,0.5)" },
    pickThis: { color: "rgba(180,140,255,0.80)" },
    price: {},
    badge: { color: "rgb(180,140,255)", background: "rgba(120,60,180,0.10)", border: "1px solid rgba(120,60,180,0.35)" },
    btn: "btnPurple" as const,
    btnHover: { background: "rgba(120,60,180,0.10)", borderColor: "rgba(120,60,180,0.45)" } as Record<string, string>,
    btnRest: { background: "rgba(120,60,180,0.05)", borderColor: "rgba(120,60,180,0.30)" } as Record<string, string>,
    hoverLift: "-2px",
  },
  purpleTop: {
    card: {
      border: "none",
      background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.25) 0%, rgba(212,175,55,0.08) 30%, #0A0A0A 70%)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,180,0.25), 0 0 120px rgba(212,175,55,0.10)",
    },
    gradientBorder: "linear-gradient(180deg, rgb(110,50,170) 0%, rgba(120,60,180,0.5) 30%, rgba(212,175,55,0.4) 70%, #D4AF37 100%)",
    topline: {
      height: "3px",
      background: "linear-gradient(90deg, transparent, rgb(110,50,170), #D4AF37, transparent)",
    },
    headerBorder: "1px solid rgba(120,60,180,0.15)",
    headerBg: "radial-gradient(ellipse at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 70%)",
    subdivider: "linear-gradient(90deg, transparent, rgba(120,60,180,0.15), transparent)",
    featureCheck: { color: "rgb(160,100,255)", textShadow: "0 0 14px rgba(140,80,240,0.5)" },
    pickThis: { color: "rgba(180,140,255,0.80)" },
    price: {},
    badge: { color: "rgb(180,140,255)", background: "rgba(120,60,180,0.10)", border: "1px solid rgba(120,60,180,0.35)", boxShadow: "0 0 12px rgba(120,60,180,0.10)" },
    btn: "btnPurple" as const,
    btnHover: { boxShadow: "0 0 32px rgba(120,60,180,0.50), 0 0 80px rgba(212,175,55,0.15)" } as Record<string, string>,
    btnRest: { boxShadow: "0 0 24px rgba(120,60,180,0.35), 0 0 60px rgba(212,175,55,0.10)" } as Record<string, string>,
    hoverLift: "-4px",
  },
};

const z2: React.CSSProperties = { position: "relative", zIndex: 2 };

const getTier = (product: Product) => {
  if (product.id === "the-full-analysis") return tierStyles.gold;
  if (product.id === "comp-report") return tierStyles.green;
  if (product.id === "boutique") return tierStyles.purpleTop;
  if (product.category === "service") return tierStyles.purple;
  return tierStyles.gold; // fallback
};


/* ═══════════════════════════════════════════════════════════════════
   GRADIENT BORDER (CSS-mask technique)
   ═══════════════════════════════════════════════════════════════════ */
const GradientBorder = ({ gradient }: { gradient: string }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "12px",
      padding: "1px",
      pointerEvents: "none",
      background: gradient,
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      zIndex: 1,
    } as React.CSSProperties}
  />
);


/* ═══════════════════════════════════════════════════════════════════
   SHIMMER KEYFRAMES (injected once)
   ═══════════════════════════════════════════════════════════════════ */
const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes faqOpen {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const StyleInjector = () => {
  useEffect(() => {
    const id = "store-shimmer-css";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = shimmerCSS;
    document.head.appendChild(tag);
    return () => { tag.remove(); };
  }, []);
  return null;
};


/* ═══════════════════════════════════════════════════════════════════
   EYEBROW RULED
   ═══════════════════════════════════════════════════════════════════ */
const EyebrowRuled = ({ text }: { text: string }) => (
  <div style={s.eyebrowRuled}>
    <div style={s.eyebrowLine} />
    <span style={s.eyebrowLabel}>{text}</span>
    <div style={s.eyebrowLine} />
  </div>
);


/* ═══════════════════════════════════════════════════════════════════
   COMP PRICING BLOCK
   ═══════════════════════════════════════════════════════════════════ */
const CompPricingBlock = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "12px",
      padding: "16px",
      background: "rgba(60,179,113,0.04)",
      border: "1px solid rgba(60,179,113,0.12)",
      borderRadius: "8px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>10 Comparable Deals</span>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "18px", color: "#3CB371", fontWeight: 700 }}>$995</span>
    </div>
    <div style={{ height: "1px", background: "rgba(60,179,113,0.10)" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>5 Comparable Deals</span>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "18px", color: "#3CB371", fontWeight: 700 }}>$595</span>
    </div>
  </div>
);


/* ═══════════════════════════════════════════════════════════════════
   WORKING MODEL POPUP
   ═══════════════════════════════════════════════════════════════════ */
const WorkingModelPopup = ({
  onAccept,
  onDecline,
  onClose,
  loading,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
  loading: boolean;
}) => {
  const haptics = useHaptics();
  return (
  <div style={{
    position: "fixed", inset: 0, zIndex: 200,
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  }}>
    <div
      style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.80)", backdropFilter: "blur(4px)",
      }}
      onClick={loading ? undefined : onClose}
    />
    <div
      style={{
        position: "relative", width: "100%", maxWidth: "430px",
        borderTopLeftRadius: "12px", borderTopRightRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,0.35)",
        borderBottom: "none",
        background: "#0A0A0A",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.06)",
        animation: "faqOpen 0.3s ease-out",
      }}
    >
      {/* Close */}
      <button
        onClick={(e) => { haptics.light(e); onClose(); }}
        disabled={loading}
        aria-label="Close"
        style={{
          position: "absolute", top: "16px", right: "16px", zIndex: 10,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.55)", transition: "color 0.2s",
        }}
      >
        <XIcon style={{ width: "20px", height: "20px" }} />
      </button>

      {/* Header band */}
      <div style={{
        padding: "24px 24px 16px",
        background: "linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%)",
      }}>
        <span style={{
          display: "inline-block",
          padding: "6px 12px",
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.3)",
          color: "#D4AF37",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 700,
          borderRadius: "4px",
          marginBottom: "12px",
          fontFamily: "'Roboto Mono', monospace",
        }}>
          ONE-TIME OFFER
        </span>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "2.2rem",
          letterSpacing: "0.06em",
          color: "#fff",
          lineHeight: 1.1,
          margin: 0,
        }}>
          ADD THE LIVE EXCEL MODEL
        </h3>
      </div>

      {/* Body */}
      <div style={{ padding: "0 24px 24px" }}>
        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "16px",
              color: "rgba(255,255,255,0.55)",
              textDecoration: "line-through",
            }}>
              $149
            </span>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "1.8rem",
              fontWeight: 600,
              color: "#fff",
            }}>
              $79
            </span>
          </div>
          <span style={{
            marginLeft: "auto",
            padding: "4px 10px",
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "#D4AF37",
            fontSize: "12px",
            letterSpacing: "0.08em",
            fontWeight: 600,
            borderRadius: "6px",
            fontFamily: "'Roboto Mono', monospace",
          }}>
            SAVE $70
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)", marginBottom: "16px" }} />

        {/* Feature list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" }}>
          {[
            "Formula-driven Excel engine",
            "Change any input \u2014 everything recalculates",
            "Reusable across unlimited projects",
          ].map((feat) => (
            <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ fontSize: "20px", color: "#3CB371", flexShrink: 0, marginTop: "1px", fontFamily: "'Roboto Mono', monospace", textShadow: "0 0 12px rgba(60,179,113,0.4)" }}>✓</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
                {feat}
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
          <button
            onClick={(e) => { haptics.medium(e); onAccept(); }}
            disabled={loading}
            style={{
              ...s.btnCta,
              height: "52px",
              fontSize: "16px",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
          >
            {loading ? "CONNECTING..." : "YES, ADD FOR $79"}
          </button>
          <button
            onClick={(e) => { haptics.light(e); onDecline(); }}
            disabled={loading}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.04em",
              padding: "8px",
              transition: "color 0.2s",
            }}
          >
            {loading ? "Connecting..." : "No thanks, just the plan"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD — self-serve tiers (1-2)
   ═══════════════════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  onBuy,
  onBuySecondary,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  onBuySecondary?: () => void;
  visible: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const haptics = useHaptics();
  const isComp = product.id === "comp-report";
  const tier = getTier(product);

  const cardStyle: React.CSSProperties = {
    ...s.cardBase,
    ...tier.card,
    opacity: visible ? 1 : 0,
    transform: visible
      ? (hovered ? `translateY(${tier.hoverLift})` : "translateY(0)")
      : "translateY(20px)",
    transition: "opacity 700ms ease-out, transform 400ms ease-out, box-shadow 0.3s ease",
    transitionDelay: visible ? `${index * 120}ms` : "0ms",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient border overlay */}
      <GradientBorder gradient={tier.gradientBorder} />

      {/* Topline */}
      <div style={{ ...tier.topline, ...z2 }} />

      {/* Header */}
      <div style={{ ...s.cardHeader, borderBottom: tier.headerBorder, ...z2 }}>
        {product.badge && (
          <div style={{ marginBottom: "12px" }}>
            <span style={{ ...s.badgeBase, ...tier.badge }}>{product.badge}</span>
          </div>
        )}
        <h3 style={s.cardName}>{product.name.toUpperCase()}</h3>
        {product.pickThisIf && (
          <p style={{ ...s.pickThisIf, ...tier.pickThis }}>Pick this one if {product.pickThisIf}</p>
        )}
      </div>

      {/* Price block */}
      <div style={{ ...s.priceBlock, ...z2 }}>
        {isComp ? (
          <CompPricingBlock />
        ) : (
          <>
            <span style={{ ...s.priceStandard, ...tier.price }}>
              ${product.price.toLocaleString()}
            </span>
            {product.priceNote && (
              <span style={s.priceNote}>
                {product.priceNote}
              </span>
            )}
          </>
        )}
        <p style={s.shortDesc}>{product.shortDescription}</p>
      </div>

      {/* Subdivider */}
      <div style={{ ...s.subdivider, background: tier.subdivider, ...z2 }} />

      {/* Features */}
      <div style={{ ...s.featuresBlock, ...z2 }}>
        {product.features.map((feature) => (
          <div key={feature} style={s.featureRow}>
            <span style={{ ...s.featureCheck, ...tier.featureCheck }}>✓</span>
            <span style={s.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <div style={{ ...s.actionBlock, ...z2 }}>
        <button
          onClick={(e) => { haptics.medium(e); onBuy(); }}
          style={s[tier.btn]}
          onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
          onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
          onMouseEnter={(e) => { if (tier.btnHover.background) e.currentTarget.style.background = tier.btnHover.background; if (tier.btnHover.borderColor) e.currentTarget.style.borderColor = tier.btnHover.borderColor; if (tier.btnHover.boxShadow) e.currentTarget.style.boxShadow = tier.btnHover.boxShadow; }}
          onMouseLeave={(e) => { if (tier.btnRest.background) e.currentTarget.style.background = tier.btnRest.background; if (tier.btnRest.borderColor) e.currentTarget.style.borderColor = tier.btnRest.borderColor; if (tier.btnRest.boxShadow) e.currentTarget.style.boxShadow = tier.btnRest.boxShadow; }}
        >
          {product.ctaLabel}
        </button>
        {onBuySecondary && (
          <button
            onClick={(e) => { haptics.medium(e); onBuySecondary(); }}
            style={s.btnGreenSecondary}
            onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(60,179,113,0.08)"; e.currentTarget.style.borderColor = "rgba(60,179,113,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(60,179,113,0.03)"; e.currentTarget.style.borderColor = "rgba(60,179,113,0.15)"; }}
          >
            OR GET 5 COMPS — $595
          </button>
        )}
        <button
          onClick={(e) => {
            haptics.light(e);
            e.stopPropagation();
            window.location.href = `/store/${product.slug}`;
          }}
          style={s.detailsLink}
          onMouseEnter={(e) => { (e.currentTarget.style.color = "#fff"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "rgba(255,255,255,0.85)"); }}
        >
          See full details →
        </button>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   SERVICE CARD — turnkey tiers (3-4)
   ═══════════════════════════════════════════════════════════════════ */
const ServiceCard = ({
  product,
  onBuy,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  visible: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const haptics = useHaptics();
  const tier = getTier(product);

  const cardStyle: React.CSSProperties = {
    ...s.cardBase,
    ...tier.card,
    opacity: visible ? 1 : 0,
    transform: visible
      ? (hovered ? `translateY(${tier.hoverLift})` : "translateY(0)")
      : "translateY(20px)",
    transition: "opacity 700ms ease-out, transform 400ms ease-out, box-shadow 0.3s ease",
    transitionDelay: visible ? `${index * 120}ms` : "0ms",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient border overlay */}
      <GradientBorder gradient={tier.gradientBorder} />

      {/* Topline */}
      <div style={{ ...tier.topline, ...z2 }} />

      {/* Header */}
      <div style={{
        ...s.cardHeader,
        borderBottom: tier.headerBorder,
        ...(tier.headerBg ? { background: tier.headerBg } : {}),
        ...z2,
      }}>
        {product.badge && (
          <div style={{ marginBottom: "12px" }}>
            <span style={{ ...s.badgeBase, ...tier.badge }}>{product.badge}</span>
          </div>
        )}
        <h3 style={s.cardName}>{product.name.toUpperCase()}</h3>
        {product.pickThisIf && (
          <p style={{ ...s.pickThisIf, ...tier.pickThis }}>Pick this one if {product.pickThisIf}</p>
        )}
      </div>

      {/* Price block + turnaround */}
      <div style={{ ...s.priceBlock, ...z2 }}>
        <span style={{ ...s.priceStandard, ...tier.price }}>
          ${product.price.toLocaleString()}
        </span>
        {product.priceNote && (
          <span style={s.priceNote}>
            {product.priceNote}
          </span>
        )}
        {product.turnaround && (
          <div style={{ marginTop: "8px" }}>
            <span style={s.turnaroundBadge}>
              <Clock style={{ width: "12px", height: "12px", color: "rgba(212,175,55,0.7)" }} />
              {product.turnaround}
            </span>
          </div>
        )}
        <p style={s.shortDesc}>{product.shortDescription}</p>
      </div>

      {/* Subdivider */}
      <div style={{ ...s.subdivider, background: tier.subdivider, ...z2 }} />

      {/* Features */}
      <div style={{ ...s.featuresBlock, ...z2 }}>
        {product.features.map((feature) => (
          <div key={feature} style={s.featureRow}>
            <span style={{ ...s.featureCheck, ...tier.featureCheck }}>✓</span>
            <span style={s.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <div style={{ ...s.actionBlock, ...z2 }}>
        <button
          onClick={(e) => { haptics.medium(e); onBuy(); }}
          style={s[tier.btn]}
          onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
          onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
          onMouseEnter={(e) => { if (tier.btnHover.background) e.currentTarget.style.background = tier.btnHover.background; if (tier.btnHover.borderColor) e.currentTarget.style.borderColor = tier.btnHover.borderColor; if (tier.btnHover.boxShadow) e.currentTarget.style.boxShadow = tier.btnHover.boxShadow; }}
          onMouseLeave={(e) => { if (tier.btnRest.background) e.currentTarget.style.background = tier.btnRest.background; if (tier.btnRest.borderColor) e.currentTarget.style.borderColor = tier.btnRest.borderColor; if (tier.btnRest.boxShadow) e.currentTarget.style.boxShadow = tier.btnRest.boxShadow; }}
        >
          {product.ctaLabel}
        </button>
        <button
          onClick={(e) => {
            haptics.light(e);
            e.stopPropagation();
            window.location.href = `/store/${product.slug}`;
          }}
          style={s.detailsLink}
          onMouseEnter={(e) => { (e.currentTarget.style.color = "#fff"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "rgba(255,255,255,0.85)"); }}
        >
          See full details →
        </button>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   FAQ ITEM
   ═══════════════════════════════════════════════════════════════════ */
const FaqItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const haptics = useHaptics();
  return (
  <div style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
    <button
      onClick={(e) => { haptics.light(e); onToggle(); }}
      aria-expanded={isOpen}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 0",
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        const t = e.currentTarget.querySelector("span") as HTMLElement;
        if (t) t.style.color = "#D4AF37";
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget.querySelector("span") as HTMLElement;
        if (t && !isOpen) t.style.color = "#fff";
      }}
    >
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.5rem",
        letterSpacing: "0.04em",
        color: isOpen ? "#D4AF37" : "#fff",
        transition: "color 0.2s",
        lineHeight: 1.2,
      }}>
        {faq.q}
      </span>
      <ChevronDown style={{
        width: "20px",
        height: "20px",
        color: isOpen ? "#D4AF37" : "rgba(212,175,55,0.5)",
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease, color 0.2s",
        flexShrink: 0,
      }} />
    </button>
    {isOpen && (
      <div style={{
        padding: "0 0 24px",
        animation: "faqOpen 0.3s ease-out",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "19px",
          color: "rgba(255,255,255,0.70)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          {faq.a}
        </p>
      </div>
    )}
  </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const haptics = useHaptics();
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Reduced motion check
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(30px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 100}ms`,
  });

  // Reveal refs
  const { ref: heroRef, inView: heroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: productsRef, inView: productsVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: researchHeroRef, inView: researchHeroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: servicesRef, inView: servicesVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: faqRef, inView: faqVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: bespokeRef, inView: bespokeVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  /* ─── CHECKOUT — DIRECT TO STRIPE ─── */
  const startCheckout = async (productId: string, addonId?: string) => {
    setCheckoutLoading(true);
    try {
      const body: Record<string, unknown> = addonId
        ? { items: [productId, addonId] }
        : { productId };

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { body }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* ─── BUY HANDLERS ─── */
  const handleBuyProduct = (product: Product) => {
    haptics.medium();
    setShowPopup(product);
  };

  const handleBuyService = (product: Product) => {
    haptics.medium();
    if (product.id === "boutique") {
      window.location.href = "mailto:thefilmmaker.og@gmail.com?subject=Boutique%20Inquiry&body=I%27m%20interested%20in%20a%20custom%20engagement.";
      return;
    }
    setShowPopup(product);
  };

  const handlePopupAccept = () => {
    if (!showPopup) return;
    haptics.medium();
    startCheckout(showPopup.id, "the-working-model-discount");
  };

  const handlePopupDecline = () => {
    if (!showPopup) return;
    haptics.light();
    startCheckout(showPopup.id);
  };

  // Services: lowest tier first
  const sortedServices = [...turnkeyServices].sort(
    (a, b) => a.tier - b.tier
  );

  /* ─── RENDER ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#000", maxWidth: "430px", margin: "0 auto" }}>
      <StyleInjector />

      {/* Working Model Popup */}
      {showPopup && (
        <WorkingModelPopup
          onAccept={handlePopupAccept}
          onDecline={handlePopupDecline}
          onClose={() => !checkoutLoading && setShowPopup(null)}
          loading={checkoutLoading}
        />
      )}

      {/* Checkout loading overlay */}
      {checkoutLoading && !showPopup && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            color: "#D4AF37",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "14px",
            letterSpacing: "0.15em",
          }}>
            CONNECTING TO CHECKOUT...
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
           § 1 — ON DEMAND
         ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ padding: "40px 24px 32px", textAlign: "center", position: "relative" }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", ...reveal(heroVisible) }}>
          <EyebrowRuled text="On Demand" />
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "3.8rem",
            lineHeight: 0.95,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
            color: "#fff",
          }}>
            Your Numbers.<br />
            <span style={{ color: "#D4AF37" }}>Investor-Ready.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "19px",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.55,
            margin: 0,
          }}>
            Professional financial documents. Investor-grade. Yours.
          </p>
        </div>
      </section>

      {/* § 1 — On Demand Card (Full Analysis only) */}
      <div
        ref={productsRef}
        style={{ padding: "0 24px" }}
      >
        {selfServeProducts.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={() => handleBuyProduct(product)}
            visible={productsVisible}
            index={i}
          />
        ))}
      </div>

      {/* §1 → §2 spacer (no breath line) */}
      <div style={{ height: "48px" }} />

      {/* ═══════════════════════════════════════
           § 2 — RESEARCH
         ═══════════════════════════════════════ */}
      <section
        ref={researchHeroRef}
        style={{ padding: "16px 24px 32px", textAlign: "center", position: "relative" }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(60,179,113,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", ...reveal(researchHeroVisible) }}>
          <EyebrowRuled text="Research" />
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "3.2rem",
            lineHeight: 0.95,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
            color: "#fff",
          }}>
            Defend Your<br />
            <span style={{ color: "#3CB371" }}>Valuation.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "19px",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.55,
            margin: 0,
          }}>
            Real comparable acquisition data in your genre and budget range. We research it. You present the evidence.
          </p>
        </div>
      </section>

      {/* § 2 — Research Card (Comp Report) */}
      <div style={{ padding: "0 24px" }}>
        {researchProducts.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={product.id === "comp-report" ? () => handleBuyProduct({ ...product, id: "comp-report-10" }) : () => handleBuyProduct(product)}
            onBuySecondary={product.id === "comp-report" ? () => handleBuyProduct(product) : undefined}
            visible={researchHeroVisible}
            index={i}
          />
        ))}
      </div>

      {/* §2 → §3 spacer (no breath line) */}
      <div style={{ height: "48px" }} />

      {/* ═══════════════════════════════════════
           § 3 — TURNKEY
         ═══════════════════════════════════════ */}
      <section
        ref={servicesRef}
        style={{ padding: "16px 24px 32px", textAlign: "center", position: "relative" }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", ...reveal(servicesVisible) }}>
          <EyebrowRuled text="Turnkey" />
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "3.2rem",
            lineHeight: 0.95,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
            color: "#fff",
          }}>
            We Build It<br />
            <span style={{ color: "#D4AF37" }}>With You.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "19px",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.55,
            margin: 0,
          }}>
            Tell us about your project. We build the complete investor package — turnkey, custom, delivered in 5 business days.
          </p>
        </div>
      </section>

      {/* § 3 — Turnkey Cards */}
      <div
        style={{
          display: "flex", flexDirection: "column", gap: "28px",
          padding: "0 24px",
        }}
      >
        {sortedServices.map((product, i) => (
          <ServiceCard
            key={product.id}
            product={product}
            onBuy={() => handleBuyService(product)}
            visible={servicesVisible}
            index={i}
          />
        ))}
      </div>

      {/* ── Breath Line (tightened: §3→§4) ── */}
      <div style={{ padding: "24px 0" }}>
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 50%, transparent 95%)",
          boxShadow: "0 0 12px rgba(212,175,55,0.2)",
          margin: "0 24px",
        }} />
      </div>

      {/* ═══════════════════════════════════════
           § 4 — FAQ
         ═══════════════════════════════════════ */}
      <section
        ref={faqRef}
        style={{ padding: "0 24px 32px", position: "relative" }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", ...reveal(faqVisible) }}>
          <EyebrowRuled text="Questions" />
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "3.2rem",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.04em",
              color: "#fff",
            }}>
              Before You <span style={{ color: "#D4AF37" }}>Buy</span>
            </h2>
          </div>

          <div>
            {storeFaqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Breath Line (compressed: §4→CTA) ── */}
      <div style={{ padding: "16px 0" }}>
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 50%, transparent 95%)",
          boxShadow: "0 0 12px rgba(212,175,55,0.2)",
          margin: "0 24px",
        }} />
      </div>

      {/* ═══════════════════════════════════════
           BESPOKE CLOSER
         ═══════════════════════════════════════ */}
      <div
        ref={bespokeRef}
        style={{ margin: "0 24px 48px", position: "relative", ...reveal(bespokeVisible) }}
      >
        {/* Closer atmospheric canopy */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 50% 100%, rgba(120,60,180,0.15) 0%, transparent 65%)",
        }} />
        <div style={{
          background: "#0A0A0A",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "12px",
          padding: "36px 24px",
          textAlign: "center",
          position: "relative",
          transition: "border-color 0.3s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.40)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }}
        >
          <div style={{
            position: "absolute", inset: "6px", borderRadius: "8px",
            border: "1px solid rgba(212,175,55,0.08)", pointerEvents: "none",
          }} />
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.2rem",
            letterSpacing: "0.06em",
            color: "#fff",
            margin: "0 0 12px 0",
            lineHeight: 1.1,
          }}>
            NEED SOMETHING <span style={{ color: "#D4AF37" }}>DIFFERENT?</span>
          </h3>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "19px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
            maxWidth: "90%",
            margin: "0 auto 24px",
          }}>
            Custom financial modeling, specialized comp research, or investor materials beyond what these packages cover — scoped to your project.
          </p>
          <a
            href="mailto:thefilmmaker.og@gmail.com?subject=Custom%20Inquiry"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "15px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#D4AF37",
              background: "rgba(212,175,55,0.05)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "6px",
              padding: "16px 24px",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseDown={(e) => { haptics.medium(e); (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.08)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.05)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
          >
            <Mail style={{ width: "16px", height: "16px" }} />
            Get In Touch →
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════
           FOOTER (synced with Index.tsx)
         ═══════════════════════════════════════ */}
      <footer
        ref={footerRef}
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(212,175,55,0.12)",
          padding: "32px 24px 40px",
          ...reveal(footerVisible),
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px" }}>
          <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="Instagram" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="https://www.tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="TikTok" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/></svg>
          </a>
          <a href="https://www.facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="Facebook" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.35)"; }}>Shop</span>
          <span style={{ color: "rgba(212,175,55,0.20)", fontSize: "12px" }}>·</span>
          <span onClick={() => window.location.href = "/resources"} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.35)"; }}>Resources</span>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "rgba(255,255,255,0.48)",
          textAlign: "center",
          lineHeight: 1.55,
          margin: 0,
        }}>
          For educational and informational purposes only. Not legal, tax, or investment advice. Consult a qualified entertainment attorney before making financing decisions.
        </p>
      </footer>
    </div>
  );
};

export default Store;
