import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Instagram } from "lucide-react";
/*
  PAGE STACK — v12 Producer's Cut:
    1. PILL NAV     — fixed floating, logo + hamburger
    2. HERO         — Bebas hierarchy, primary CTA
    3. HOW IT WORKS — 5-step vertical stepper
    4. WATERFALL    — acquisition callout, tier table, flow diagram
    5. WHY THIS MATTERS — 4 badge cards
    6. ARSENAL      — 3 tier cards (core/snapshot/package)
    7. REALITY      — blockquote + WITH/WITHOUT grid
    8. CLOSER       — final CTA card
    9. FOOTER

  CTA: All go through auth check → LeadCaptureModal if no session.
*/

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const [showLeadCapture, setShowLeadCapture] = useState(false);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Magic link callback landed here instead of /calculator —
        // catch it and forward. Only fires on fresh sign-in, not
        // on TOKEN_REFRESHED or returning visitors.
        if (event === 'SIGNED_IN') {
          navigate('/calculator');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const gatedNavigate = useCallback(async (destination: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      navigate(destination);
    } else {
      setShowLeadCapture(true);
    }
  }, [navigate]);

  const handleCTA = async () => {
    haptics.medium();
    await gatedNavigate("/calculator");
  };

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

  /* ── Scroll refs ── */
  const { ref: heroRef, inView: heroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: howRef, inView: howVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: whyRef, inView: whyVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: arsenalRef, inView: arsenalVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: realityRef, inView: realityVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });


  /* ── Data ── */
  const waterfallTiers = [
    { num: "01", name: "CAM Fee", amt: "$30,000" },
    { num: "02", name: "Sales Agent Fee (10%)", amt: "$300,000" },
    { num: "03", name: "Sales Agent Expenses", amt: "$50,000" },
    { num: "04", name: "E&O / Delivery", amt: "$18,000" },
    { num: "05", name: "Senior Debt Recoupment", amt: "$1,200,000" },
    { num: "06", name: "Mezzanine Debt", amt: "$300,000" },
    { num: "07", name: "Equity Recoupment", amt: "$450,000" },
    { num: "08", name: "Deferments", amt: "$52,000" },
  ];

  const badgeCards = [
    { num: "1", title: "Don't Sell The Same Dollar Twice", body: "Track exactly where the money goes so you never over-promise equity and accidentally collapse your own backend." },
    { num: "2", title: "Know What You're Giving Away", body: "Every sales fee, CAMA, and deferment eats into the profit before you see a dime. See the reality before you sign." },
    { num: "3", title: "Explain The Deal Clearly", body: "Walk into the pitch with institutional-grade math. Answer recoupment questions with absolute confidence and look professional." },
    { num: "4", title: "Protect Early Investors", body: "Keep your earliest, riskiest backers from getting blindsided by senior debt and off-the-top distribution deductions." },
  ];

  const withItems = [
    "Model fees before they hit you",
    "Show investors exact recoupment",
    "Know what's negotiable",
    "Know break-even before you raise",
  ];
  const withoutItems = [
    "Guessing when investors ask",
    "Overpromising returns",
    "Leaving leverage on the table",
    "Backend killed after signing",
  ];

  const steps = [
    { n: "1", title: "Enter Your Budget", body: "Total budget, cash basis after deferments and tax credits, investor equity." },
    { n: "2", title: "Choose Your Scenario", body: "Streamer acquisition or traditional distribution. Guild rates adjust automatically." },
    { n: "3", title: "See the Full Waterfall", body: "Every tier with accurate rates — off-the-tops through net backend profit." },
    { n: "4", title: "Stress-Test Your Deal", body: "Adjust price, negotiate fee caps. Run it until you know what you can't give up." },
    { n: "5", title: "Export & Share", body: "Download a formatted PDF. Share directly with investors, financiers, and co-producers." },
  ];

  /* ── Eyebrow ruled component ── */
  const EyebrowRuled = ({ text }: { text: string }) => (
    <div style={styles.eyebrowRuled}>
      <div style={styles.eyebrowLine} />
      <span style={styles.eyebrowLabel}>{text}</span>
      <div style={styles.eyebrowLine} />
    </div>
  );

  return (
    <>
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
      />

      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes lp-shimmer {
          0% { left: -100%; }
          15% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", paddingTop: "0px", maxWidth: "430px", margin: "0 auto" }}>

        {/* ═══ § 1 HERO ═══ */}
        <section ref={heroRef} style={styles.hero}>
          <div style={styles.heroGlow} />
          <div style={{ ...styles.heroInner, ...reveal(heroVisible) }}>
            <h1 style={styles.heroH1}>
              Model Your
              <em style={styles.heroEm}>Waterfall</em>
            </h1>
            <p style={styles.heroSub}>Your Recoupment Structure Starts Here.</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={handleCTA} style={styles.ctaBtn} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
                <div style={styles.ctaShimmer} />
              </button>
            </div>
          </div>
        </section>

        {/* ═══ § 4 HOW IT WORKS ═══ */}
        <section ref={howRef} style={styles.howSection}>
          <div style={{ ...styles.howHeader, ...reveal(howVisible) }}>
            <EyebrowRuled text="The Process" />
            <h2 style={styles.howH2}>Build in <span style={{ color: "#D4AF37" }}>Minutes</span></h2>
          </div>
          <div style={styles.stepsContainer}>
            <div style={styles.topLineGoldHalf} />
            {steps.map((step, i) => (
              <div key={step.n} style={{ ...styles.step, ...reveal(howVisible, i) }}>
                <div style={styles.stepNumCol}>
                  {i < steps.length - 1 && <div style={styles.stepLine} />}
                  <div style={styles.stepNumBadge}>
                    <span style={styles.stepNumText}>{step.n}</span>
                  </div>
                </div>
                <div style={styles.stepContent}>
                  <p style={styles.stepTitle}>{step.title}</p>
                  <p style={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ § 5 WATERFALL ═══ */}
        <section ref={waterfallRef} style={styles.waterfallSection}>
          <div style={{ ...styles.waterfallHeader, ...reveal(waterfallVisible) }}>
            <EyebrowRuled text="How the money flows" />
            <h2 style={styles.waterfallH2}>The Recoupment<br /><span style={{ color: "#D4AF37" }}>Waterfall</span></h2>
          </div>

          <p style={{ ...styles.waterfallExplainer, ...reveal(waterfallVisible) }}>
            A recoupment waterfall maps who gets paid, in what order, and how much — before you see a dollar of profit.
          </p>

          {/* Acquisition callout */}
          <div style={{ ...styles.acquisitionCallout, ...reveal(waterfallVisible, 1) }}>
            <div style={styles.topLineGoldHalf} />
            <p style={styles.acqLabel}>Streamer Acquisition Price</p>
            <p style={styles.acqSub}>Tier 2 Action Thriller — Example</p>
            <p style={styles.acqAmount}>$3,000,000</p>
          </div>

          {/* Waterfall tiers */}
          <div style={{ ...styles.waterfallTiersBox, ...reveal(waterfallVisible, 2) }}>
            <div style={styles.topLineGold} />
            {waterfallTiers.map((tier, i) => {
              // Group boundaries: after off-the-tops (row 3, i=3), after debt service (row 5, i=5)
              const isGroupBoundary = i === 3 || i === 5;
              const isLastRow = i === waterfallTiers.length - 1;
              const borderBottom = isLastRow
                ? "none"
                : isGroupBoundary
                  ? "2px solid rgba(212,175,55,0.20)"
                  : "1px solid rgba(255,255,255,0.06)";
              return (
                <div key={tier.num} style={{ ...styles.tierRow, borderBottom }}>
                  <div style={styles.tierNum}>{tier.num}</div>
                  <div style={styles.tierName}>{tier.name}</div>
                  <div style={styles.tierAmt}>
                    <span style={styles.tierMinus}>-</span>{tier.amt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow diagram */}
          <div style={{ ...styles.flowDiagram, ...reveal(waterfallVisible, 3) }}>
            <div style={styles.netBackend}>
              <div style={styles.topLineGold} />
              <p style={styles.netLabel}>Net Backend Profit</p>
              <p style={styles.netAmount}>$600,000</p>
            </div>
            <div style={styles.pipeNetwork}>
              <div style={styles.pipeVertical} />
              <div style={styles.pipeFork}>
                <div style={styles.pipeLeft} />
                <div style={styles.pipeRight} />
              </div>
            </div>
            <div style={styles.buckets}>
              {[
                { label: "Investor", amount: "$300,000", pct: "50% of backend" },
                { label: "Producer", amount: "$300,000", pct: "50% of backend" },
              ].map((b) => (
                <div key={b.label} style={styles.bucket}>
                  <p style={styles.bucketLabel}>{b.label}</p>
                  <p style={styles.bucketAmount}>{b.amount}</p>
                  <p style={styles.bucketPct}>{b.pct}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ ...styles.waterfallNote, ...reveal(waterfallVisible, 3) }}>Model only — your numbers will differ</p>
        </section>

        {/* ═══ § 3 WHY THIS MATTERS ═══ */}
        <section ref={whyRef} style={styles.whySection}>
          <div style={{ ...styles.whyHeader, ...reveal(whyVisible) }}>
            <EyebrowRuled text="Why This Matters" />
            <h2 style={styles.whyH2}><span style={{ color: "#D4AF37" }}>4</span> Reasons<br />You Can't Skip This</h2>
          </div>

          <div style={{ ...styles.badgeGridWrapper, ...reveal(whyVisible, 1) }}>
            <div style={styles.topLineGold} />
            <div style={styles.badgeGrid}>
              {badgeCards.map((card, i) => (
                <div key={card.num} style={{ ...styles.badgeCard, ...reveal(whyVisible, i + 2) }}>
                  <div style={styles.badgeNum}>{card.num}</div>
                  <p style={styles.badgeTitle}>{card.title}</p>
                  <p style={styles.badgeBody}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ § 7 ARSENAL ═══ */}
        <section ref={arsenalRef} style={styles.arsenalSection}>
          <div style={{ ...styles.arsenalHeader, ...reveal(arsenalVisible) }}>
            <EyebrowRuled text="What you get" />
            <h2 style={styles.arsenalH2}>The <span style={{ color: "#D4AF37" }}>Arsenal</span></h2>
            <p style={styles.arsenalSub}>Start with the math. Upgrade when you need the documents.</p>
          </div>

          <div style={styles.arsenalCards}>
            {/* Core Engine Card (Free) */}
            <div style={{ ...styles.tierCardCore, ...reveal(arsenalVisible, 1) }}>
              <div style={styles.topLineGoldHalf} />
              <div style={styles.tierHeaderCore}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.tierBadgeCore}>Free Access</span>
                </div>
                <p style={styles.tierTitleCore}>The Modeling Engine</p>
                <p style={styles.tierSubCore}>Your baseline recoupment model.</p>
              </div>
              {/* Subdivider */}
              <div style={{ height: "1px", background: "rgba(212,175,55,0.12)", margin: "0 24px" }} />
              <div style={styles.tierFeaturesCore}>
                <div style={styles.featureItemCore}>
                  <div style={styles.featureTextWrapCore}>
                    <p style={styles.featureNameCore}>11-Tier Recoupment Logic</p>
                    <p style={styles.featureDescCore}>Accurate calculations from gross receipts down to net backend profit.</p>
                  </div>
                </div>
                <div style={styles.featureItemCore}>
                  <div style={styles.featureTextWrapCore}>
                    <p style={styles.featureNameCore}>Profit & Break-Even Scenarios</p>
                    <p style={styles.featureDescCore}>Calculate exactly what your acquisition price needs to be to make investors whole.</p>
                  </div>
                </div>
                <div style={styles.featureItemCore}>
                  <div style={styles.featureTextWrapCore}>
                    <p style={styles.featureNameCore}>Web Sharing & PDF Export</p>
                    <p style={styles.featureDescCore}>Generate a live link or download a clean, formatted PDF to send directly to your financiers.</p>
                  </div>
                </div>
              </div>
              <div style={styles.tierAction}>
                <button onClick={handleCTA} style={styles.btnSnapshot} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>START MODELING</button>
              </div>
            </div>

            {/* The Snapshot Card */}
            <div style={{ ...styles.tierCardSnapshot, ...reveal(arsenalVisible, 2) }}>
              <div style={styles.topLineGold} />
              <div style={styles.tierHeaderAlt}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.trendingBadge}>Essential</span>
                </div>
                <p style={styles.tierTitleAlt}>THE SNAPSHOT</p>
                <p style={styles.tierSubAlt}>Pick this one if you need the numbers documented — clean and professional</p>
              </div>
              {/* Subdivider */}
              <div style={{ height: "1px", background: "rgba(212,175,55,0.12)", margin: "0 24px" }} />
              <p style={styles.tierIntro}>Your financial model. One document. Investor-ready.</p>
              <div style={styles.tierChecklist}>
                {[
                  "Unified Financial Presentation (PDF)",
                  "Budget, capital stack, waterfall, scenarios — one document",
                  "White-labeled with your company and project",
                ].map((text, i) => (
                  <div key={i} style={styles.checkItem}>
                    <span style={styles.checkMark}>✓</span>
                    <p style={styles.checkText}>{text}</p>
                  </div>
                ))}
              </div>
              <div style={styles.tierAction}>
                <button onClick={() => gatedNavigate("/store/snapshot")} style={styles.btnSnapshot} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>GET THE SNAPSHOT</button>
                <a href="/store/snapshot" onClick={(e) => { e.preventDefault(); gatedNavigate("/store/snapshot"); }} style={styles.detailsLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }}>See full details →</a>
              </div>
            </div>

            {/* The Package Card */}
            <div style={{ ...styles.tierCardPackage, ...reveal(arsenalVisible, 3) }}>
              <div style={styles.topLineGoldThick} />
              <div style={{ ...styles.tierHeaderAlt, paddingTop: "28px", borderBottomColor: "rgba(212,175,55,0.15)" }}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.mostPopularBadge}>Complete</span>
                </div>
                <p style={styles.tierTitleAlt}>THE PACKAGE</p>
                <p style={styles.tierSubAlt}>Pick this one if you want the full investor package with standalone documents</p>
              </div>
              {/* Subdivider */}
              <div style={{ height: "1px", background: "rgba(212,175,55,0.12)", margin: "0 24px" }} />
              <p style={styles.tierIntro}>Your complete investor package — financial presentation, standalone documents, visual design.</p>
              <div style={styles.tierChecklist}>
                {[
                  "Enhanced Financial Presentation (PDF)",
                  "Individual Investor Return Profiles",
                  "One-Page Executive Summary",
                  "Deal Terms Summary",
                  "Visual design with genre positioning",
                  "White-labeled with your company and project",
                ].map((text, i) => (
                  <div key={i} style={styles.checkItem}>
                    <span style={styles.checkMark}>✓</span>
                    <p style={styles.checkText}>{text}</p>
                  </div>
                ))}
              </div>
              <div style={styles.tierAction}>
                <button onClick={() => gatedNavigate("/store/the-full-package")} style={styles.btnPackage} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                  <span style={{ position: "relative", zIndex: 1 }}>GET THE PACKAGE</span>
                  <div style={styles.btnPackageShimmer} />
                </button>
                <a href="/store/the-full-package" onClick={(e) => { e.preventDefault(); gatedNavigate("/store/the-full-package"); }} style={styles.detailsLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }}>See full details →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ § 6 REALITY ═══ */}
        <section ref={realityRef} style={styles.realitySection}>
          <blockquote style={{ ...styles.blockquote, ...reveal(realityVisible) }}>
            The waterfall either costs you now — or costs you everything <span style={{ color: "#D4AF37" }}>later</span>.
          </blockquote>

          <div style={{ ...styles.checkGrid, ...reveal(realityVisible, 1) }}>
            <div style={styles.topLineGoldHalf} />
            {/* Header */}
            <div style={styles.checkHeader}>
              <div style={styles.checkHeaderWith}><span style={styles.checkHeaderWithText}>WITH</span></div>
              <div style={styles.checkHeaderWithout}><span style={styles.checkHeaderWithoutText}>WITHOUT</span></div>
            </div>
            {/* Rows */}
            {withItems.map((withItem, i) => (
              <div key={i} style={{ ...styles.checkRow, borderBottom: i < withItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={styles.checkCellLeft}>
                  <span style={styles.checkIconYes}>✓</span>
                  <span style={styles.checkTextYes}>{withItem}</span>
                </div>
                <div style={styles.checkCellRight}>
                  <span style={styles.checkIconNo}>✗</span>
                  <span style={styles.checkTextNo}>{withoutItems[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ § 8 CLOSER ═══ */}
        <section ref={closerRef} style={styles.closerSection}>
          <div style={styles.closerGlowBottom} />
          <div style={{ ...styles.closerCard, ...reveal(closerVisible) }}>
            <div style={styles.topLineGoldBright} />
            <h2 style={styles.closerH2}>Your Investors<br /><span style={{ color: "#D4AF37", display: "block" }}>Will Ask.</span></h2>
            <p style={styles.closerBody}>Stop guessing your backend. Build the model before the pitch.</p>
            <button onClick={handleCTA} style={styles.ctaBtn} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
              <div style={styles.ctaShimmer} />
            </button>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer ref={footerRef} style={{ ...styles.footer, opacity: prefersReducedMotion || footerVisible ? 1 : 0, transition: prefersReducedMotion ? "none" : "opacity 0.8s ease-out" }}>
          <div style={styles.footerLinks}>
            <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Instagram" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <Instagram size={18} />
            </a>
            <a href="https://www.tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="TikTok" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Facebook" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <div style={styles.footerNav}>
            <span onClick={() => navigate("/store")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.35)"; }}>Shop</span>
          </div>
          <p style={styles.footerText}>
            filmmaker.og provides financial modeling tools for educational purposes. This is not legal or financial advice. Consult qualified counsel before executing any investment structure.
          </p>
        </footer>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════
   STYLES — matches HTML v12 exactly
   ══════════════════════════════════════════════════════════════════ */
const styles: Record<string, React.CSSProperties> = {
  /* ── Eyebrow ── */
  eyebrowRuled: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px",
  },
  eyebrowLine: {
    flex: 1, height: "1px", background: "rgba(212,175,55,0.40)",
  },
  eyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "13px",
    letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4AF37",
    whiteSpace: "nowrap",
  },

  /* ── CTA Button ── */
  ctaBtn: {
    position: "relative", overflow: "hidden",
    fontFamily: "'Roboto Mono', monospace", fontWeight: 600,
    textTransform: "uppercase", color: "#000",
    background: "#F9E076", padding: "20px 56px",
    letterSpacing: "0.18em", fontSize: "16px",
    borderRadius: "8px", border: "none", cursor: "pointer",
    display: "inline-block",
    boxShadow:
      "0 0 0 1px rgba(249,224,118,0.55), " +
      "0 0 24px rgba(249,224,118,0.60), " +
      "0 0 60px rgba(249,224,118,0.32), " +
      "0 0 100px rgba(249,224,118,0.14)",
  },
  ctaShimmer: {
    position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
    transform: "skewX(-20deg)",
    animation: "lp-shimmer 5s cubic-bezier(0.16, 1, 0.3, 1) infinite",
  },

  /* ── § 1 HERO ── */
  hero: {
    position: "relative", textAlign: "center",
    background: "#000", padding: "24px 24px 16px",
  },
  heroGlow: {
    position: "absolute", top: "-10%", left: 0, right: 0, height: "65%", pointerEvents: "none",
    background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(212,175,55,0.18) 0%, transparent 70%)",
  },
  heroInner: { position: "relative", zIndex: 1 },
  heroH1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.6rem", color: "#fff",
    textAlign: "center", marginBottom: "4px", lineHeight: 0.86, letterSpacing: "0.01em",
  },
  heroEm: { fontStyle: "normal", color: "#D4AF37", display: "block" },
  heroSub: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", textAlign: "center",
    marginBottom: "28px", lineHeight: 1.1, color: "rgba(255,255,255,0.78)",
    marginTop: "8px",
  },

  /* ── § 4 HOW IT WORKS ── */
  howSection: { background: "#000", padding: "64px 0 0" },
  howHeader: { textAlign: "center", padding: "16px 20px 28px", background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(212,175,55,0.10) 0%, transparent 70%)" },
  howH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.6rem", color: "#fff", lineHeight: 0.95 },
  stepsContainer: { position: "relative", display: "flex", flexDirection: "column", gap: "1px", background: "rgba(212,175,55,0.10)", borderRadius: "12px", overflow: "hidden", margin: "0 20px", border: "1px solid rgba(212,175,55,0.20)" },
  step: {
    display: "grid", gridTemplateColumns: "52px 1fr", background: "#000",
  },
  stepNumCol: {
    position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center",
    background: "radial-gradient(circle at 50% 28px, rgba(212,175,55,0.20) 0%, #0A0A0A 80%)",
    paddingTop: "22px",
  },
  stepLine: {
    position: "absolute", top: "53px", bottom: "-23px", left: "50%", transform: "translateX(-50%)", width: "1px",
    background: "linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.1) 100%)", zIndex: 0,
  },
  stepNumBadge: {
    position: "relative", zIndex: 1, width: "34px", height: "34px", borderRadius: "50%",
    background: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(212,175,55,0.5)",
  },
  stepNumText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.35rem", color: "#000", lineHeight: 1, paddingTop: "2px" },
  stepContent: { padding: "26px 20px 26px 24px", background: "radial-gradient(circle at 0px 50%, rgba(212,175,55,0.14) 0%, transparent 55%)" },
  stepTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.45rem", color: "#D4AF37", lineHeight: 1, marginBottom: "5px" },
  stepBody: { fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 },

  /* ── § 5 WATERFALL ── */
  waterfallSection: { background: "#000", padding: "64px 0 0" },
  waterfallHeader: { textAlign: "center", padding: "0 20px 24px" },
  waterfallH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#fff", lineHeight: 0.95 },
  waterfallExplainer: {
    fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)",
    lineHeight: 1.55, textAlign: "center", padding: "0 24px", marginBottom: "24px",
    maxWidth: "380px", marginLeft: "auto", marginRight: "auto",
  },
  acquisitionCallout: {
    position: "relative", overflow: "hidden", textAlign: "center", margin: "0 20px 10px",
    background: "radial-gradient(circle at 50% 70%, rgba(212,175,55,0.20) 0%, #0A0A0A 75%)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "24px 20px",
    boxShadow: "0 0 24px rgba(212,175,55,0.10)",
  },
  acqLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#D4AF37", marginBottom: "4px" },
  acqSub: { fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.70)", marginBottom: "8px" },
  acqAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.02em" },

  waterfallTiersBox: {
    position: "relative", overflow: "hidden", margin: "0 20px",
    border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", background: "#0A0A0A",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10)",
  },
  tierRow: {
    position: "relative", display: "grid", gridTemplateColumns: "auto 1fr auto",
    gap: "16px", padding: "16px 20px", alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "default",
  },
  tierNum: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "#D4AF37",
    background: "rgba(212,175,55,0.18)", border: "1px solid rgba(212,175,55,0.35)",
    width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "6px", fontWeight: 600,
    boxShadow: "0 0 16px rgba(212,175,55,0.3)",
  },
  tierName: { fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.95)", lineHeight: 1.3 },
  tierAmt: { fontFamily: "'Roboto Mono', monospace", fontSize: "15px", color: "#fff", textAlign: "right", whiteSpace: "nowrap" },
  tierMinus: { color: "rgba(255,255,255,0.3)", marginRight: "4px", fontWeight: 400 },

  /* Flow diagram */
  flowDiagram: { margin: "16px 20px 0" },
  netBackend: {
    position: "relative", textAlign: "center", background: "#000", border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: "12px", padding: "24px 20px", zIndex: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  netLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.70)", marginBottom: "8px" },
  netAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#D4AF37", lineHeight: 0.9, letterSpacing: "0.02em" },
  pipeNetwork: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-1px", position: "relative", zIndex: 1 },
  pipeVertical: { width: "2px", height: "18px", background: "rgba(212,175,55,0.50)" },
  pipeFork: { display: "flex", width: "calc(50% + 10px)" },
  pipeLeft: { flex: 1, height: "18px", borderTop: "2px solid rgba(212,175,55,0.50)", borderLeft: "2px solid rgba(212,175,55,0.50)", borderRadius: "6px 0 0 0" },
  pipeRight: { flex: 1, height: "18px", borderTop: "2px solid rgba(212,175,55,0.50)", borderRight: "2px solid rgba(212,175,55,0.50)", borderRadius: "0 6px 0 0" },
  buckets: { display: "flex", gap: "10px", marginTop: "-1px" },
  bucket: {
    flex: 1, textAlign: "center", background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.25)",
    borderTop: "2px solid #D4AF37", borderRadius: "0 0 10px 10px", padding: "16px 12px",
  },
  bucketLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.70)", marginBottom: "8px" },
  bucketAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#D4AF37", lineHeight: 1 },
  bucketPct: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.50)", marginTop: "5px" },
  waterfallNote: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", textAlign: "center", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", padding: "16px 20px 0" },

  /* ── § 3 WHY THIS MATTERS ── */
  whySection: { background: "#000", textAlign: "center", padding: "64px 0 0" },
  whyHeader: { padding: "20px 20px 24px" },
  whyH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#fff", textAlign: "center", lineHeight: 0.95 },
  badgeGridWrapper: {
    margin: "0 20px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.25)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10)", position: "relative",
  },
  badgeGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "1px", background: "rgba(212,175,55,0.15)" },
  badgeCard: { background: "radial-gradient(circle at 45px 57px, rgba(212,175,55,0.10) 0%, #0A0A0A 65%)", padding: "36px 24px", textAlign: "left" },
  badgeNum: {
    width: "42px", height: "42px", borderRadius: "50%", background: "#D4AF37", color: "#000",
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem",
    marginBottom: "16px", paddingTop: "2px", boxShadow: "0 0 24px rgba(212,175,55,0.55)",
  },
  badgeTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fff", marginBottom: "8px", lineHeight: 1.05, letterSpacing: "0.02em" },
  badgeBody: { fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.70)", lineHeight: 1.55 },

  /* ── § 7 ARSENAL ── */
  arsenalSection: { background: "#000", textAlign: "center", padding: "64px 0 0" },
  arsenalHeader: { padding: "0 20px 16px" },
  arsenalH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#fff", lineHeight: 0.95 },
  arsenalSub: { fontFamily: "'Inter', sans-serif", fontSize: "13px", marginTop: "10px", color: "rgba(255,255,255,0.70)", lineHeight: 1.6 },
  arsenalCards: { display: "flex", flexDirection: "column", gap: "28px", margin: "0 20px" },

  tierCardCore: {
    borderRadius: "12px", position: "relative", overflow: "hidden", textAlign: "left",
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, #0A0A0A 70%)",
    border: "1px solid rgba(212,175,55,0.3)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8)",
  },
  tierHeaderCore: {
    padding: "28px 24px 20px", borderBottom: "1px solid rgba(212,175,55,0.1)",
  },
  tierTitleCore: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", lineHeight: 1, letterSpacing: "0.02em" },
  tierSubCore: { fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", marginTop: "6px" },
  tierBadgeCore: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "10px", textTransform: "uppercase",
    padding: "6px 12px", borderRadius: "4px", letterSpacing: "0.1em",
    background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)",
    whiteSpace: "nowrap", flexShrink: 0,
  },
  tierFeaturesCore: { padding: "28px 24px 24px", display: "flex", flexDirection: "column", gap: "20px" },
  featureItemCore: { display: "flex", gap: "16px", alignItems: "flex-start" },
  featureTextWrapCore: { flex: 1 },
  featureNameCore: { fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: "4px" },
  featureDescCore: { fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.45 },

  tierCardSnapshot: {
    borderRadius: "12px", position: "relative", overflow: "hidden", textAlign: "left",
    border: "1px solid rgba(212,175,55,0.25)",
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0A0A0A 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
  },
  tierCardPackage: {
    borderRadius: "12px", position: "relative", overflow: "hidden", textAlign: "left",
    border: "1px solid rgba(212,175,55,0.5)",
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.10) 0%, #0A0A0A 65%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.08)",
  },
  tierHeaderAlt: {
    padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tierTitleAlt: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#fff", lineHeight: 1, letterSpacing: "0.04em", marginBottom: "8px" },
  tierSubAlt: { fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(212,175,55,0.8)", lineHeight: 1.4 },
  tierIntro: { fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: "28px 24px 0" },
  tierChecklist: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
  checkItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
  checkMark: { color: "#D4AF37", fontSize: "14px", fontWeight: 600, lineHeight: 1.3 },
  checkText: { fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.45 },
  tierAction: { padding: "0 24px 36px" },
  btnSnapshot: {
    display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#D4AF37", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.3)",
    padding: "18px", borderRadius: "6px", cursor: "pointer",
  },
  btnPackage: {
    position: "relative", overflow: "hidden", display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#000", background: "#F9E076", border: "none", padding: "18px", borderRadius: "6px", cursor: "pointer",
    boxShadow: "0 0 20px rgba(249,224,118,0.3), 0 0 60px rgba(249,224,118,0.1)",
  },
  btnPackageShimmer: {
    position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
    transform: "skewX(-20deg)", animation: "lp-shimmer 4s infinite",
  },
  trendingBadge: {
    display: "inline-block", fontFamily: "'Roboto Mono', monospace", fontSize: "10px", textTransform: "uppercase",
    letterSpacing: "0.15em", color: "#D4AF37", background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.35)",
    padding: "6px 12px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap",
  },
  mostPopularBadge: {
    display: "inline-block", fontFamily: "'Roboto Mono', monospace", fontSize: "10px", textTransform: "uppercase",
    letterSpacing: "0.15em", color: "#D4AF37", background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.4)",
    padding: "6px 12px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap",
  },
  detailsLink: { display: "block", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(212,175,55,0.60)", textDecoration: "none", marginTop: "16px", cursor: "pointer", padding: "8px 0" },

  /* ── Top line helpers ── */
  topLineGold: {
    position: "absolute", top: 0, left: 0, right: 0, height: "1px",
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
  },
  topLineGoldHalf: {
    position: "absolute", top: 0, left: 0, right: 0, height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)",
  },
  topLineGoldThick: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
  },
  topLineGoldBright: {
    position: "absolute", top: 0, left: 0, right: 0, height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)",
  },

  /* ── § 6 REALITY ── */
  realitySection: { background: "#000", textAlign: "left", padding: "48px 20px 32px" },
  blockquote: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", lineHeight: 0.95, color: "rgba(255,255,255,0.92)",
    borderLeft: "3px solid #D4AF37", paddingLeft: "20px", marginBottom: "24px",
  },
  checkGrid: {
    position: "relative", border: "1px solid rgba(212,175,55,0.20)", borderRadius: "12px", overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  checkHeader: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  checkHeaderWith: { background: "rgba(212,175,55,0.05)", padding: "16px 20px" },
  checkHeaderWithout: { background: "#000", padding: "16px 20px", borderLeft: "1px solid rgba(255,255,255,0.06)" },
  checkHeaderWithText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#D4AF37", letterSpacing: "0.04em" },
  checkHeaderWithoutText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" },
  checkRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  checkCellLeft: {
    background: "rgba(212,175,55,0.05)", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "18px 20px", alignItems: "flex-start",
  },
  checkCellRight: {
    background: "#000", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "18px 20px", alignItems: "flex-start", borderLeft: "1px solid rgba(212,175,55,0.08)",
  },
  checkIconYes: { fontFamily: "'Roboto Mono', monospace", fontSize: "22px", paddingTop: "2px", color: "#D4AF37", textShadow: "0 0 12px rgba(212,175,55,0.5)" },
  checkIconNo: { fontFamily: "'Roboto Mono', monospace", fontSize: "22px", paddingTop: "2px", color: "rgba(255,80,80,0.85)" },
  checkTextYes: { fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.4, color: "rgba(255,255,255,0.85)" },
  checkTextNo: { fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.4, color: "rgba(255,255,255,0.55)" },

  /* ── § 8 CLOSER ── */
  closerSection: {
    position: "relative", overflow: "hidden", textAlign: "center", marginTop: "48px",
    padding: "48px 24px 80px", borderTop: "1px solid rgba(212,175,55,0.20)", background: "#000",
  },
  closerGlowBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: "80%", pointerEvents: "none",
    background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(212,175,55,0.12) 0%, transparent 60%)",
  },
  closerCard: {
    position: "relative", zIndex: 1, border: "1px solid rgba(212,175,55,0.42)", borderRadius: "16px",
    padding: "24px 24px 36px", background: "#000", maxWidth: "320px", margin: "0 auto",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.1)",
  },
  closerH2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.4rem", color: "#fff", textAlign: "center",
    lineHeight: 0.95, margin: "4px 0 14px",
  },
  closerBody: {
    fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.75)",
    lineHeight: 1.5, maxWidth: "280px", margin: "0 auto 24px",
  },

  /* ── FOOTER ── */
  footer: { background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 20px 40px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px" },
  footerIcon: { color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" },
  footerNav: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" },
  footerNavLink: { fontFamily: "'Roboto Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" } as React.CSSProperties,
  footerDot: { color: "rgba(212,175,55,0.20)", fontSize: "12px" },
  footerText: { fontFamily: "'Inter', sans-serif", fontSize: "13px", textAlign: "center", color: "rgba(255,255,255,0.35)", lineHeight: 1.55 },
};

export default Index;
