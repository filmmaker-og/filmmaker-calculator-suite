import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { GOLD, CTA, BG, AMBER, gold, white, ctaGold, amber } from "@/lib/tokens";

/* ═══════════════════════════════════════════════════════════════════
   Pricing Page — 4-tier layout (Free, Founding Member, Standard, Power)
   ═══════════════════════════════════════════════════════════════════ */

const LAUNCH_DATE = new Date("2026-04-03");
const FOUNDING_WINDOW_DAYS = 90;

function getFoundingDaysLeft(): number {
  const now = new Date();
  const elapsed = Math.floor(
    (now.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, FOUNDING_WINDOW_DAYS - elapsed);
}

interface Tier {
  name: string;
  price: string;
  period: string;
  features: { text: string; included: boolean }[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  countdown?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Founding Member",
    price: "$19",
    period: "/mo",
    badge: "FOUNDING",
    countdown: true,
    highlight: true,
    cta: "Get Started",
    features: [
      { text: "Unlimited runs", included: true },
      { text: "Save 1 deal", included: true },
      { text: "Export PDF (filmmaker.og branding)", included: true },
      { text: '"Founding" badge on account', included: true },
    ],
  },
  {
    name: "Standard",
    price: "$49",
    period: "/mo",
    cta: "Get Started",
    features: [
      { text: "Save up to 2 deals", included: true },
      { text: "Compare up to 2 deals side by side", included: true },
      { text: "Export clean PDF (no watermark)", included: true },
      { text: "Export to Google Sheets", included: true },
      { text: "Generate shareable investor link", included: true },
      { text: "Basic white-label (company name on PDF)", included: true },
    ],
  },
  {
    name: "Power",
    price: "$97",
    period: "/mo",
    cta: "Upgrade",
    features: [
      { text: "Save up to 10 deals", included: true },
      { text: "Compare up to 3 deals side by side", included: true },
      { text: "Full white-label PDF (logo + colors)", included: true },
      { text: "Fully branded shareable links", included: true },
      { text: "Revoke shareable links", included: true },
      { text: "Analytics on shared links (view count)", included: true },
      { text: "2 seats", included: true },
    ],
  },
];

const freeTier = {
  name: "Free",
  price: "$0",
  cta: "Start Free",
  features: [
    { text: "1 run per day", included: true },
    { text: "Branded PDF (filmmaker.og watermark)", included: true },
    { text: "Cannot save deals", included: false },
    { text: "Cannot compare deals", included: false },
    { text: "Cannot share deals", included: false },
  ],
};

const adHocServices = [
  { name: "Comp Report", price: "starts at $90" },
  { name: "Custom Financial Model", price: "starts at $2,500" },
  { name: "Lookbook", price: "starts at $1,500" },
];

const Pricing = () => {
  const navigate = useNavigate();
  const daysLeft = getFoundingDaysLeft();
  const endDate = new Date(LAUNCH_DATE.getTime() + FOUNDING_WINDOW_DAYS * 86400000);
  const endDateStr = endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG.void,
        padding: "0 0 60px",
      }}
    >
      {/* ── Cinematic Hero ── */}
      <div
        className="grain-surface"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          paddingTop: "80px",
          paddingBottom: "64px",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" as const,
        }}
      >
        {/* Gold glow orb — top center */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${gold(0.10)} 0%, ${gold(0.03)} 40%, transparent 70%)`,
            pointerEvents: "none" as const,
          }}
        />
        {/* Gold glow orb — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${gold(0.06)} 0%, transparent 60%)`,
            pointerEvents: "none" as const,
          }}
        />

        {/* Text content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, padding: "0 20px" }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 8vw, 72px)",
              color: white(0.95),
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              margin: "0 0 24px",
              textShadow: `0 0 20px ${gold(0.25)}, 0 0 50px ${gold(0.10)}`,
            }}
          >
            LOCK IN $19/MO FOR LIFE
          </h1>

          {daysLeft > 0 && (
            <p
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 700,
                color: AMBER,
                letterSpacing: "0.08em",
                margin: "0 0 20px",
                textShadow: `0 0 24px ${amber(0.40)}, 0 0 60px ${amber(0.12)}`,
              }}
            >
              {daysLeft} DAYS LEFT
            </p>
          )}

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(15px, 2vw, 18px)",
              color: white(0.65),
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Founding members get unlimited access. Offer ends {endDateStr}.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 20px 0" }}>
        {/* ── 3-column paid tiers ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                background: BG.elevated,
                border: `1px solid ${tier.highlight ? gold(0.30) : gold(0.10)}`,
                borderRadius: "10px",
                padding: "28px 24px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = gold(0.40);
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${gold(0.08)}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tier.highlight ? gold(0.30) : gold(0.10);
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`;
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.14em",
                    color: "#000",
                    background: GOLD,
                    padding: "3px 14px",
                    borderRadius: "4px",
                  }}
                >
                  {tier.badge}
                </span>
              )}

              {/* Tier name */}
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "22px",
                  color: white(0.92),
                  letterSpacing: "0.06em",
                  marginBottom: "4px",
                  textAlign: "center",
                }}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "36px",
                    fontWeight: 700,
                    color: white(0.92),
                  }}
                >
                  {tier.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    color: white(0.48),
                  }}
                >
                  {tier.period}
                </span>
              </div>

              {/* Early bird countdown */}
              {tier.countdown && daysLeft > 0 && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${gold(0.06)}, ${gold(0.02)})`,
                    border: `1px solid ${gold(0.15)}`,
                    borderRadius: "6px",
                    padding: "10px 12px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: AMBER,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Lock in $19/mo for life.{" "}
                    <span
                      style={{
                        fontFamily: "'Roboto Mono', monospace",
                        fontWeight: 600,
                      }}
                    >
                      Ends in {daysLeft} days.
                    </span>
                  </p>
                </div>
              )}

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1 }}>
                {tier.features.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      color: white(0.78),
                      lineHeight: 1.5,
                      marginBottom: "8px",
                    }}
                  >
                    <Check
                      size={15}
                      style={{ color: GOLD, flexShrink: 0, marginTop: "3px" }}
                    />
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate("/signup")}
                className="btn-cta-primary"
                style={{
                  width: "100%",
                  height: "48px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── Free tier banner ── */}
        <div
          style={{
            background: BG.elevated,
            border: `1px solid ${gold(0.08)}`,
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "64px",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "22px",
                color: white(0.92),
                letterSpacing: "0.06em",
                marginBottom: "8px",
              }}
            >
              Free —{" "}
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "22px",
                }}
              >
                $0
              </span>
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {freeTier.features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: f.included ? white(0.78) : white(0.40),
                    lineHeight: 1.5,
                    marginBottom: "6px",
                  }}
                >
                  {f.included ? (
                    <Check
                      size={15}
                      style={{ color: GOLD, flexShrink: 0, marginTop: "3px" }}
                    />
                  ) : (
                    <X
                      size={15}
                      style={{ color: white(0.30), flexShrink: 0, marginTop: "3px" }}
                    />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="btn-cta-primary"
            style={{
              width: "180px",
              height: "48px",
              fontSize: "18px",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Start Free
          </button>
        </div>

        {/* ── Ad Hoc Services ── */}
        <div
          style={{
            borderTop: `1px solid ${gold(0.15)}`,
            paddingTop: "48px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "28px",
              color: white(0.92),
              letterSpacing: "0.06em",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            NEED MORE THAN THE CALCULATOR?
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: white(0.65),
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            One-time services. Not part of the subscription.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {adHocServices.map((svc) => (
              <div
                key={svc.name}
                style={{
                  background: BG.elevated,
                  border: `1px solid ${gold(0.08)}`,
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "18px",
                    color: white(0.92),
                    letterSpacing: "0.05em",
                    marginBottom: "6px",
                  }}
                >
                  {svc.name}
                </h4>
                <p
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "14px",
                    color: gold(0.80),
                    margin: 0,
                  }}
                >
                  {svc.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
