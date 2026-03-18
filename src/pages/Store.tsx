import { useState, useEffect, useRef } from "react";
import { Check, Mail, X as XIcon, Clock, ChevronDown } from "lucide-react";

import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import {
  selfServeProducts,
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
    q: "How do the on-demand products work?",
    a: "After purchase, your calculator data is used to generate your deliverables automatically. Professional, white-labeled documents delivered to your email.",
  },
  {
    q: "How do the turnkey services work?",
    a: "After purchase, you complete a short intake form with your project details — logline, genre, budget, cast, tone references, and raise amount. We build your complete investor package and deliver it within 5 business days.",
  },
  {
    q: "What is The Working Model?",
    a: "A live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It\u2019s the engine behind your finance plan — reusable across unlimited future projects. Add it at checkout for $79 when bundled with any package.",
  },
  {
    q: "What if the deliverables don\u2019t meet my expectations?",
    a: "If your deliverables don\u2019t meet the institutional standard described, we\u2019ll revise them. These are the same financial models used in real production financing — if something doesn\u2019t hold up, we fix it.",
  },
  {
    q: "Can I upgrade later?",
    a: "Contact us and we\u2019ll apply what you\u2019ve already paid toward the higher tier.",
  },
];


/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS & STYLES
   ═══════════════════════════════════════════════════════════════════ */
const s: Record<string, React.CSSProperties> = {
  /* Eyebrow */
  eyebrowRuled: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px",
  },
  eyebrowLine: {
    flex: 1, height: "1px", background: "rgba(212,175,55,0.40)",
  },
  eyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "13px",
    letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4AF37",
  },
  /* Card base */
  cardStandard: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
    overflow: "hidden",
    transition: "transform 0.3s ease, border-color 0.3s ease",
    position: "relative" as const,
  },
  cardFeatured: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: "12px",
    boxShadow: "0 24px 50px rgba(0,0,0,0.8)",
    overflow: "hidden",
    transition: "transform 0.3s ease, border-color 0.3s ease",
    position: "relative" as const,
  },
  /* Card top line */
  topLineStandard: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
  },
  topLineFeatured: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
  },
  /* Card header */
  cardHeaderStandard: {
    padding: "24px 24px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  cardHeaderFeatured: {
    padding: "24px 24px 20px",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  /* Price block */
  priceBlock: {
    padding: "24px 24px 20px",
  },
  priceStandard: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1,
  },
  priceFeatured: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "3.2rem",
    fontWeight: 700,
    color: "#D4AF37",
    lineHeight: 1,
  },
  shortDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "rgba(255,255,255,0.55)",
    marginTop: "8px",
    lineHeight: 1.5,
  },
  /* Features */
  featuresBlock: {
    padding: "0 24px 28px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  featureRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  featureCheck: {
    color: "#3CB371",
    opacity: 0.9,
    flexShrink: 0,
    marginTop: "2px",
  },
  featureText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },
  /* Actions */
  actionBlock: {
    padding: "0 24px 28px",
  },
  btnOutline: {
    width: "100%",
    padding: "16px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#D4AF37",
    background: "rgba(212,175,55,0.03)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
  },
  btnCta: {
    width: "100%",
    padding: "16px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#000",
    background: "#F9E076",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 0 20px rgba(249,224,118,0.3), 0 0 60px rgba(249,224,118,0.1)",
    transition: "transform 0.15s, box-shadow 0.3s",
  },
  detailsLink: {
    display: "block",
    textAlign: "center" as const,
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    color: "rgba(212,175,55,0.60)",
    padding: "8px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s",
    marginTop: "4px",
  },
  /* Badge base */
  badgeBase: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "4px",
    color: "#D4AF37",
    whiteSpace: "nowrap" as const,
  },
  /* Pick this if */
  pickThisIf: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    color: "rgba(212,175,55,0.7)",
    fontStyle: "normal",
    marginTop: "4px",
    lineHeight: 1.4,
  },
  /* Name */
  cardName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2rem",
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.95)",
    textTransform: "uppercase" as const,
    lineHeight: 1.1,
    margin: 0,
  },
  /* Turnaround badge */
  turnaroundBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.03)",
    padding: "4px 8px",
    borderRadius: "4px",
  },
};


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
          padding: "4px 12px",
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
          fontSize: "26px",
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)",
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
              color: "rgba(255,255,255,0.95)",
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
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "16px" }} />

        {/* Feature list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          {[
            "Formula-driven Excel engine",
            "Change any input \u2014 everything recalculates",
            "Reusable across unlimited projects",
          ].map((feat) => (
            <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <Check style={{ width: "14px", height: "14px", marginTop: "2px", flexShrink: 0, color: "#3CB371" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
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
              fontSize: "15px",
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
              fontSize: "13px",
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
   BADGE RENDERER
   ═══════════════════════════════════════════════════════════════════ */
const getBadgeStyle = (badge: string | null): React.CSSProperties => {
  if (!badge) return {};
  const base = { ...s.badgeBase };
  switch (badge) {
    case "DATA":
      return { ...base, color: "#3CB371", background: "rgba(60,179,113,0.06)", border: "1px solid rgba(60,179,113,0.25)" };
    case "TURNKEY":
      return { ...base, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.35)" };
    case "CUSTOM":
      return { ...base, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.50)", boxShadow: "0 0 12px rgba(212,175,55,0.10)" };
    case "ADD-ON":
      return { ...base, color: "rgba(255,255,255,0.70)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" };
    default:
      return { ...base, background: "transparent", border: "1px solid rgba(212,175,55,0.25)" };
  }
};


/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD — self-serve tiers (1-2)
   ═══════════════════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  onBuy,
  onBuy10,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  onBuy10?: () => void;
  visible: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const haptics = useHaptics();
  const isFeatured = product.featured;

  const cardStyle: React.CSSProperties = {
    ...(isFeatured ? s.cardFeatured : s.cardStandard),
    opacity: visible ? 1 : 0,
    transform: visible
      ? (hovered ? (isFeatured ? "translateY(-4px)" : "translateY(-2px)") : "translateY(0)")
      : "translateY(20px)",
    transition: "opacity 700ms ease-out, transform 400ms ease-out, border-color 0.3s ease",
    transitionDelay: visible ? `${index * 120}ms` : "0ms",
    borderColor: hovered
      ? (isFeatured ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.25)")
      : undefined,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top line */}
      <div style={isFeatured ? s.topLineFeatured : s.topLineStandard} />

      {/* Header */}
      <div style={isFeatured ? s.cardHeaderFeatured : s.cardHeaderStandard}>
        {product.badge && (
          <div style={{ marginBottom: "12px" }}>
            <span style={getBadgeStyle(product.badge)}>{product.badge}</span>
          </div>
        )}
        <h3 style={s.cardName}>{product.name.toUpperCase()}</h3>
        {product.pickThisIf && (
          <p style={s.pickThisIf}>Pick this one if {product.pickThisIf}</p>
        )}
      </div>

      {/* Price block */}
      <div style={s.priceBlock}>
        <span style={isFeatured ? s.priceFeatured : s.priceStandard}>
          ${product.price.toLocaleString()}
        </span>
        {product.priceNote && (
          <span style={{
            display: "block",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.40)",
            letterSpacing: "0.06em",
            marginTop: "4px",
          }}>
            {product.priceNote}
          </span>
        )}
        <p style={s.shortDesc}>{product.shortDescription}</p>
      </div>

      {/* Subdivider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* Features */}
      <div style={{ ...s.featuresBlock, paddingTop: "20px" }}>
        {product.features.map((feature) => (
          <div key={feature} style={s.featureRow}>
            <Check style={{ width: "13px", height: "13px", ...s.featureCheck }} />
            <span style={s.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <div style={s.actionBlock}>
        <button
          onClick={(e) => { haptics.medium(e); onBuy(); }}
          style={isFeatured ? s.btnCta : s.btnOutline}
          onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
          onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
        >
          {product.ctaLabel}
        </button>
        {onBuy10 && (
          <button
            onClick={(e) => { haptics.medium(e); onBuy10(); }}
            style={{ ...s.btnOutline, marginTop: "8px", fontSize: "12px" }}
            onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
          >
            OR GET 10 COMPS — $995
          </button>
        )}
        <button
          onClick={(e) => {
            haptics.light(e);
            e.stopPropagation();
            window.location.href = `/store/${product.slug}`;
          }}
          style={s.detailsLink}
          onMouseEnter={(e) => { (e.currentTarget.style.color = "rgba(212,175,55,1)"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "rgba(212,175,55,0.60)"); }}
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
  const isTop = product.tier === 4;

  const cardStyle: React.CSSProperties = {
    ...(isTop ? s.cardFeatured : s.cardStandard),
    opacity: visible ? 1 : 0,
    transform: visible
      ? (hovered ? (isTop ? "translateY(-4px)" : "translateY(-2px)") : "translateY(0)")
      : "translateY(20px)",
    transition: "opacity 700ms ease-out, transform 400ms ease-out, border-color 0.3s ease",
    transitionDelay: visible ? `${index * 120}ms` : "0ms",
    borderColor: hovered
      ? (isTop ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.25)")
      : undefined,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top line */}
      <div style={isTop ? s.topLineFeatured : s.topLineStandard} />

      {/* Header */}
      <div style={isTop ? s.cardHeaderFeatured : s.cardHeaderStandard}>
        {product.badge && (
          <div style={{ marginBottom: "12px" }}>
            <span style={getBadgeStyle(product.badge)}>{product.badge}</span>
          </div>
        )}
        <h3 style={s.cardName}>{product.name.toUpperCase()}</h3>
        {product.pickThisIf && (
          <p style={s.pickThisIf}>Pick this one if {product.pickThisIf}</p>
        )}
      </div>

      {/* Price block + turnaround */}
      <div style={s.priceBlock}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={isTop ? s.priceFeatured : s.priceStandard}>
            ${product.price.toLocaleString()}
          </span>
          {product.turnaround && (
            <span style={s.turnaroundBadge}>
              <Clock style={{ width: "12px", height: "12px", color: "rgba(212,175,55,0.7)" }} />
              {product.turnaround}
            </span>
          )}
        </div>
        {product.priceNote && (
          <span style={{
            display: "block",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.40)",
            letterSpacing: "0.06em",
            marginTop: "4px",
          }}>
            {product.priceNote}
          </span>
        )}
        <p style={s.shortDesc}>{product.shortDescription}</p>
      </div>

      {/* Subdivider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* Features */}
      <div style={{ ...s.featuresBlock, paddingTop: "20px" }}>
        {product.features.map((feature) => (
          <div key={feature} style={s.featureRow}>
            <Check style={{ width: "13px", height: "13px", ...s.featureCheck }} />
            <span style={s.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <div style={s.actionBlock}>
        <button
          onClick={(e) => { haptics.medium(e); onBuy(); }}
          style={isTop ? s.btnCta : s.btnOutline}
          onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
          onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
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
          onMouseEnter={(e) => { (e.currentTarget.style.color = "rgba(212,175,55,1)"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.color = "rgba(212,175,55,0.60)"); }}
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
  <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <button
      onClick={(e) => { haptics.light(e); onToggle(); }}
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
        if (t && !isOpen) t.style.color = "rgba(255,255,255,0.92)";
      }}
    >
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.3rem",
        letterSpacing: "0.04em",
        color: isOpen ? "#D4AF37" : "rgba(255,255,255,0.92)",
        transition: "color 0.2s",
        lineHeight: 1.2,
      }}>
        {faq.q}
      </span>
      <ChevronDown style={{
        width: "18px",
        height: "18px",
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
          fontSize: "15px",
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
  const { ref: turnkeyHeroRef, inView: turnkeyHeroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
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
      window.location.href = "mailto:hello@filmmakerog.com?subject=Boutique%20Inquiry&body=I%27m%20interested%20in%20a%20custom%20engagement.";
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

  // Mobile sort: featured first for products
  const sortedProducts = [...selfServeProducts].sort((a, b) => {
    if (a.featured) return -1;
    if (b.featured) return 1;
    return a.tier - b.tier;
  });

  // Services: highest tier first
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

      {/* ──────────────────────────────────────────────────────────
           § 1  SELF-SERVE — Hero
         ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          padding: "40px 24px 48px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", ...reveal(heroVisible) }}>
          <EyebrowRuled text="On Demand" />
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "3.5rem",
            lineHeight: 0.95,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
          }}>
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Your Numbers.</span>
            <br />
            <span style={{ color: "#D4AF37" }}>Investor-Ready.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Professional financial documents built from your calculator data. Purchase and download.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
           § 1  SELF-SERVE — Cards
         ────────────────────────────────────────────────────────── */}
      <div
        ref={productsRef}
        style={{
          display: "flex", flexDirection: "column", gap: "24px",
          padding: "0 24px 48px",
        }}
      >
        {sortedProducts.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={() => handleBuyProduct(product)}
            onBuy10={product.id === "comp-report" ? () => startCheckout("comp-report-10") : undefined}
            visible={productsVisible}
            index={i}
          />
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────
           DIVIDER — diamond ornament
         ────────────────────────────────────────────────────────── */}
      <div style={{
        margin: "24px 24px 48px",
        height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.20) 20%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.20) 80%, transparent 100%)",
      }} />

      {/* ──────────────────────────────────────────────────────────
           § 2  TURNKEY — Hero
         ────────────────────────────────────────────────────────── */}
      <section
        ref={turnkeyHeroRef}
        style={{
          padding: "0 24px 32px",
          textAlign: "center",
        }}
      >
        <div style={reveal(turnkeyHeroVisible)}>
          <EyebrowRuled text="Turnkey" />
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "3.2rem",
            lineHeight: 0.95,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
          }}>
            <span style={{ color: "rgba(255,255,255,0.95)" }}>We Build It</span>
            <br />
            <span style={{ color: "#D4AF37" }}>With You.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Tell us about your project. We build the complete investor package — turnkey, custom, delivered in 5 business days.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
           § 2  TURNKEY — Cards
         ────────────────────────────────────────────────────────── */}
      <div
        ref={servicesRef}
        style={{
          display: "flex", flexDirection: "column", gap: "24px",
          padding: "0 24px 48px",
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

      {/* ──────────────────────────────────────────────────────────
           § 3  FAQ
         ────────────────────────────────────────────────────────── */}
      <section
        ref={faqRef}
        style={{ padding: "48px 24px 24px" }}
      >
        <div style={reveal(faqVisible)}>
          <EyebrowRuled text="Questions" />
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "3.2rem",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.04em",
            }}>
              <span style={{ color: "rgba(255,255,255,0.95)" }}>Common</span>{" "}
              <span style={{ color: "#D4AF37" }}>Questions</span>
            </h2>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
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

      {/* ──────────────────────────────────────────────────────────
           BESPOKE CARD (Closer)
         ────────────────────────────────────────────────────────── */}
      <div
        ref={bespokeRef}
        style={{
          margin: "0 24px 64px",
          ...reveal(bespokeVisible),
        }}
      >
        <div style={{
          background: "#0A0A0A",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "12px",
          padding: "40px 24px",
          textAlign: "center",
          outline: "1px solid rgba(212,175,55,0.08)",
          outlineOffset: "-6px",
        }}>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.8rem",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.95)",
            margin: "0 0 12px 0",
            lineHeight: 1.1,
          }}>
            NEED SOMETHING <span style={{ color: "#D4AF37" }}>DIFFERENT?</span>
          </h3>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
            maxWidth: "90%",
            margin: "0 auto 24px",
          }}>
            Bespoke financial modeling, custom comp research, or institutional-grade investor materials beyond what these packages cover.
          </p>
          <a
            href="mailto:hello@filmmakerog.com?subject=Custom%20Inquiry"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#D4AF37",
              background: "rgba(212,175,55,0.05)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "8px",
              padding: "14px 24px",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseDown={(e) => { haptics.medium(e); (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
          >
            <Mail style={{ width: "16px", height: "16px" }} />
            Get In Touch →
          </a>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
           FOOTER
         ────────────────────────────────────────────────────────── */}
      <footer
        ref={footerRef}
        style={{
          background: "#000",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 24px 64px",
          ...reveal(footerVisible),
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          lineHeight: 1.6,
          margin: 0,
        }}>
          For educational and informational purposes only. Not legal, tax, or investment advice. Consult a qualified entertainment attorney before making financing decisions.
        </p>
      </footer>
    </div>
  );
};

export default Store;
