import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { colors, radius } from "@/lib/design-system";

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT BIBLE v2.0 — NOTION MEETS APPS

   Design DNA:
   - Notion: Clean hierarchy, toggle sections, database-level organization
   - Apps: Gold left border accent, dark matte surfaces, premium sparse gold

   WIKI ARCHITECTURE:
   - Main Wiki (/intro) with collapsible pillar sections + deep dive links
   - Mini wikis can ONLY link back to /intro (no cross-wiki navigation)
   - Only "Start Simulation" exits to calculator
   - All content is SVOD-only (streamer acquisitions, not theatrical)
   ═══════════════════════════════════════════════════════════════════════════ */
const tokens = {
  bgVoid: colors.void,
  bgMatte: colors.card,
  bgHeader: colors.elevated,
  bgSurface: colors.surface,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  goldGlow: colors.goldGlow,
  goldFill: colors.goldSubtle,
  goldRadiant: colors.goldGlow,
  borderMatte: colors.borderSubtle,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this legal financial advice?",
    answer: "No. This is an educational planning tool designed to help you understand waterfall mechanics before entering real negotiations. Every deal is unique. Always consult an entertainment attorney before finalizing any deal structures, operating agreements, or interparty agreements."
  },
  {
    question: "What types of deals does this model?",
    answer: "This tool models SVOD (streaming) acquisitions — deals where a platform like Netflix, Amazon, Apple TV+, or a FAST channel acquires your completed film for a license fee. It does not model theatrical P&A waterfalls, which involve exhibitor splits, prints & advertising recoupment, and significantly more complexity."
  },
  {
    question: "How accurate are the calculations?",
    answer: "The waterfall logic mirrors real Operating Agreements used in independent film finance. The recoupment order, fee structures, and profit split mechanics are based on current industry standards. Specific percentages will vary by deal, but the underlying math is the same whether your film costs $250K or $10M."
  },
  {
    question: "I'm new to film finance. Where should I start?",
    answer: "Start by reading through the four pillars below — Budget, Capital Stack, Fees, and Waterfall. Each one builds on the last. Once you understand the concepts, hit Start Simulation and the calculator will walk you through entering your own deal. Every input includes context so you're never guessing."
  },
  {
    question: "Why do I need to enter my email?",
    answer: "We ask for your email right before the waterfall reveal — the final step where your full deal breakdown is calculated. This gives you access to the complete simulation results. We occasionally share insights on film finance, but we never spam and you can unsubscribe anytime."
  }
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER — Radiant Gold Left Border + Matte Gray Surface
   ═══════════════════════════════════════════════════════════════════════════ */
interface SectionHeaderProps {
  number: string;
  title: string;
  isExpanded?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}

const SectionHeader = ({ number, title, isExpanded, onClick, isClickable = false }: SectionHeaderProps) => (
  <div
    className={cn(
      "flex items-stretch",
      isClickable && "cursor-pointer hover:bg-white/[0.02] transition-colors"
    )}
    style={{
      background: `linear-gradient(90deg, ${tokens.goldRadiant} 0%, ${tokens.bgHeader} 15%, ${tokens.bgHeader} 100%)`,
      borderBottom: isExpanded ? `1px solid ${tokens.borderMatte}` : 'none',
    }}
    onClick={onClick}
  >
    <div
      className="w-1 flex-shrink-0"
      style={{
        background: `linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldMuted} 100%)`,
        boxShadow: `0 0 12px ${tokens.goldGlow}`,
      }}
    />

    <div
      className="flex items-center justify-center px-4 py-4"
      style={{
        borderRight: `1px solid ${tokens.borderSubtle}`,
        minWidth: '56px',
        background: tokens.goldFill,
      }}
    >
      <span
        className="font-bebas text-xl tracking-wide"
        style={{ color: tokens.gold }}
      >
        {number}
      </span>
    </div>

    <div className="flex items-center flex-1 px-4 py-4 justify-between">
      <h2
        className="font-bold text-xs uppercase tracking-widest"
        style={{ color: tokens.textPrimary }}
      >
        {title}
      </h2>

      {isClickable && (
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
          style={{ color: isExpanded ? tokens.gold : tokens.textDim }}
        />
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PILLAR DATA — Structured content for each accordion section
   ═══════════════════════════════════════════════════════════════════════════ */
interface KeyPoint {
  label: string;
  detail: string;
}

interface PillarData {
  number: string;
  title: string;
  subtitle: string;
  overview: string;
  keyPoints: KeyPoint[];
  learnMorePath: string;
}

const pillars: PillarData[] = [
  {
    number: "01",
    title: "Production Budget",
    subtitle: "Your negative cost — the number everything else is built on",
    overview: "The production budget (also called negative cost) is the total amount required to produce your film from development through delivery. In an SVOD deal, your budget is the single most important variable — it determines how much capital you need to raise, what financing structures are available, and what license fee a streamer needs to pay for the deal to make economic sense. Independent films typically range from $100K to $15M, with each tier opening different doors for cast, crew, distribution, and investor appetite. A $500K micro-budget has a very different capital stack and break-even profile than a $5M film with name talent.",
    keyPoints: [
      {
        label: "SVOD license fees",
        detail: "Streamers base acquisition prices on your budget, genre, cast, and market demand. For first-time producers, realistic license fees typically range from 0.8x to 1.5x your production budget. Established track records can push this to 2x–3x."
      },
      {
        label: "Budget composition",
        detail: "A professional budget breaks into above-the-line (writer, director, producers, cast — 20–35%), below-the-line (crew, equipment, locations — 45–60%), post-production (edit, VFX, sound, color — 10–15%), and contingency plus insurance (10–12%)."
      },
      {
        label: "Delivery costs matter",
        detail: "Streamers require specific technical deliverables — Dolby Vision masters, M&E tracks, closed captions, artwork packages. Budget $7K–$30K+ for delivery depending on platform specs. Netflix has the most demanding technical requirements."
      },
    ],
    learnMorePath: "/budget-info",
  },
  {
    number: "02",
    title: "Capital Stack",
    subtitle: "How your film gets funded — and who gets paid back first",
    overview: "The capital stack is the combination of all funding sources used to finance your production. Most independent films can't be financed from a single source — producers piece together a layered stack from equity investors, senior lenders, gap financiers, and tax incentives. Each capital source occupies a specific position in the repayment hierarchy, and that position determines when (and if) each party gets their money back. Understanding how these layers interact is essential because the capital stack directly defines your waterfall — who recoups first, at what rate, and how much is left for profit participation.",
    keyPoints: [
      {
        label: "Senior debt (8–12% interest)",
        detail: "The safest position in the stack — senior lenders get repaid first. These loans are typically secured against tax credits, pre-sales, or minimum guarantees. Common sources include entertainment banks (City National, Comerica, East West Bank) and specialty lenders."
      },
      {
        label: "Gap financing (12–20% interest)",
        detail: "Bridges the gap between your secured collateral and total budget — typically covering 10–25% of production costs. Gap lenders take real risk by betting that unsold territories or uncommitted platforms will eventually buy. Higher interest rates and sometimes equity kickers reflect this risk."
      },
      {
        label: "Equity (10–20% premium + profit split)",
        detail: "The riskiest capital — equity investors fund the remaining budget in exchange for priority recoupment of their principal plus a negotiated premium (typically 110–120% of investment), followed by a share of net profits. The standard structure is '120 and 50' — investors recoup 120%, then profits split 50/50 between investor and producer pools."
      },
    ],
    learnMorePath: "/capital-info",
  },
  {
    number: "03",
    title: "Distribution Fees",
    subtitle: "What comes off the top before your waterfall begins",
    overview: "When a streamer acquires your film, the license fee doesn't flow directly into your waterfall. Distribution fees are deducted first — before senior debt, before equity recoupment, before anyone in your Operating Agreement sees a cent. For SVOD-only deals, the fee structure is simpler than theatrical (no exhibitor splits or P&A recoupment), but the percentages still add up fast. On a $2M SVOD acquisition, fees can easily total 15–25%, meaning $300K–$500K disappears before your capital providers receive anything. These are contractual obligations to the entities who sold, delivered, and collected on your film.",
    keyPoints: [
      {
        label: "Sales agent (10–20% + marketing fee)",
        detail: "Represents your film to streamers and international buyers. The commission (10–20%) comes off gross revenues. On top of that, most agents charge a separate hardcapped marketing & distribution fee ($20K–$75K) for festival attendance, screeners, market presentations, and travel. Both the commission and the marketing fee are recoupable off the top."
      },
      {
        label: "Collection agent / CAM (1–5%)",
        detail: "A neutral third party (like Fintage House or FilmChain) who receives all revenues, applies the waterfall, and distributes payments to each party. Budget $8K–$15K for setup plus 1–2% of revenues. Most institutional financiers and senior lenders require a CAM before funding."
      },
      {
        label: "Delivery costs ($7K–$30K+)",
        detail: "Separate from the sales agent's marketing fee — this covers technical deliverables the streamer requires: Dolby Vision masters, M&E audio stems, closed captions, artwork, and chain-of-title documentation. These costs are also recoupable from revenues."
      },
    ],
    learnMorePath: "/fees-info",
  },
  {
    number: "04",
    title: "Recoupment Waterfall",
    subtitle: "The legally binding order that determines who gets paid",
    overview: "The recoupment waterfall is the contractual hierarchy that determines how every dollar of revenue flows through your deal. Defined in the Operating Agreement or Interparty Agreement, it's a legally binding document — not a guideline. Like water flowing through a series of pools, money fills each position completely before spilling over to the next. For SVOD acquisitions, the waterfall is more compressed than theatrical (no exhibitor split, no P&A recoupment), but the fundamental mechanics are identical: fees come off first, then debt service, then equity recovery, and only after all senior positions are satisfied does any money reach the profit pool.",
    keyPoints: [
      {
        label: "Standard SVOD waterfall order",
        detail: "1) Collection agent fee → 2) Sales agent fee + recoupable expenses → 3) Delivery costs → 4) Senior debt (principal + interest) → 5) Gap financing (principal + interest + fees) → 6) Equity recoupment (principal + 10–20% premium) → 7) Profit participation (typically 50/50 investor/producer split)."
      },
      {
        label: "The harsh math",
        detail: "On most independent films, the waterfall never reaches profit participation. A $1.5M film that sells for $2M might look profitable — but after 20% in fees ($400K), $30K in delivery, and $1.5M in capital recoupment with premiums, there's almost nothing left for the profit pool."
      },
      {
        label: "Protecting your position",
        detail: "As a producer, negotiate a fixed producer fee in the budget (paid regardless of performance), consider a first-position profit corridor, and always model your waterfall against realistic SVOD acquisition prices before signing your Operating Agreement. This tool does exactly that."
      },
    ],
    learnMorePath: "/waterfall-info",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PILLAR ACCORDION — Expanded shows structured content
   ═══════════════════════════════════════════════════════════════════════════ */
interface PillarAccordionProps {
  pillar: PillarData;
  isExpanded: boolean;
  onToggle: () => void;
}

const PillarAccordion = ({ pillar, isExpanded, onToggle }: PillarAccordionProps) => {
  const navigate = useNavigate();

  const handleDeepDive = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(pillar.learnMorePath);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="overflow-hidden animate-fade-in"
      style={{
        background: tokens.bgMatte,
        border: `1px solid ${tokens.borderMatte}`,
        borderRadius: tokens.radiusLg,
      }}
    >
      <SectionHeader
        number={pillar.number}
        title={pillar.title}
        isExpanded={isExpanded}
        onClick={onToggle}
        isClickable={true}
      />

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 space-y-4">
          {/* Subtitle */}
          <p
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: tokens.goldMuted }}
          >
            {pillar.subtitle}
          </p>

          {/* Overview */}
          <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
            {pillar.overview}
          </p>

          {/* Key Points */}
          <div className="space-y-3 pt-1">
            {pillar.keyPoints.map((point, i) => (
              <div
                key={i}
                className="pl-4"
                style={{
                  borderLeft: `2px solid ${tokens.goldMuted}`,
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: tokens.gold }}
                >
                  {point.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                  {point.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Divider + Deep dive link */}
          <div
            className="h-px w-full"
            style={{ background: tokens.borderSubtle }}
          />
          <button
            onClick={handleDeepDive}
            className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: tokens.gold }}
          >
            <span>Read the full chapter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const IntroView = () => {
  const navigate = useNavigate();
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const togglePillar = (index: number) => {
    setExpandedPillar(expandedPillar === index ? null : index);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=budget');
  };

  return (
    <>
      <Header />

      <div
        className="min-h-screen text-white pt-16 pb-12 px-4 md:px-8 font-sans"
        style={{ background: tokens.bgVoid }}
      >
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ═══════════════════════════════════════════════════════════════
              PAGE HEADER — Premium hero section
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-5 pt-8 animate-fade-in">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
                style={{ color: tokens.goldMuted }}
              >
                Film Finance Knowledge Base
              </p>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
                The Waterfall <span style={{ color: tokens.gold }}>Protocol</span>
              </h1>
            </div>

            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: tokens.textMid }}
            >
              A complete guide to how money moves through an independent film deal —
              from SVOD acquisition to your pocket. Built for producers who want to
              understand the math before they sign.
            </p>

            <p
              className="text-sm leading-relaxed max-w-xl"
              style={{ color: tokens.textDim }}
            >
              Every dollar your film earns follows a strict contractual path:
              fees come off the top, then debt gets serviced, then investors recoup,
              and only then — if anything remains — do profits get split. Most first-time
              producers don't see this math until they've already signed. This changes that.
            </p>

            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)`
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              PILLARS 01-04 — Accordion Pattern
              ═══════════════════════════════════════════════════════════════ */}
          {pillars.map((pillar, index) => (
            <PillarAccordion
              key={pillar.number}
              pillar={pillar}
              isExpanded={expandedPillar === index}
              onToggle={() => togglePillar(index)}
            />
          ))}

          {/* ═══════════════════════════════════════════════════════════════
              WHY THIS MATTERS
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="overflow-hidden animate-fade-in"
            style={{
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="05" title="Why This Matters" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                The streaming acquisition market has shifted dramatically. Streamers are buying
                fewer independent films, favoring originals over volume-based pickups. License
                fees have compressed — pay-one window values are roughly a third of what they
                were just a few years ago. In this environment, understanding your waterfall
                isn't just helpful — it's the difference between building a sustainable career
                and signing deals that leave you with nothing.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Investors back producers who can walk through collection fees, recoupment
                positions, and profit corridors with confidence. When you sit across the
                table from a financier and model exactly how their money flows back to them,
                you're not just pitching a film — you're demonstrating you understand the business.
              </p>

              <div
                className="p-4 mt-2"
                style={{
                  background: tokens.goldSubtle,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.goldMuted}`,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: tokens.gold }}
                >
                  The Reality
                </p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textPrimary }}>
                  A $2M SVOD acquisition doesn't mean $2M in your pocket. After 15–25% in
                  distribution fees, delivery costs, and full capital recoupment with premiums,
                  that number can shrink to almost nothing. This tool shows you exactly where
                  every dollar goes — before you sign anything.
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              FAQ
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className="overflow-hidden animate-fade-in"
            style={{
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="06" title="FAQ" />

            <div>
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  style={{ borderTop: index > 0 ? `1px solid ${tokens.borderMatte}` : 'none' }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left transition-all duration-150"
                    style={{
                      background: openFAQ === index ? tokens.goldSubtle : 'transparent',
                    }}
                  >
                    <span
                      className="text-sm font-medium pr-4"
                      style={{ color: openFAQ === index ? tokens.textPrimary : tokens.textMid }}
                    >
                      {item.question}
                    </span>

                    <ChevronDown
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                        openFAQ === index && "rotate-180"
                      )}
                      style={{ color: openFAQ === index ? tokens.gold : tokens.textDim }}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      openFAQ === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div
                      className="px-4 pb-4 text-sm leading-relaxed"
                      style={{ color: tokens.textDim }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CTA SECTION
              ═══════════════════════════════════════════════════════════════ */}
          <div className="pt-8 flex flex-col items-center gap-6 animate-fade-in">
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${tokens.goldMuted} 50%, transparent 90%)`
              }}
            />

            <p
              className="text-sm text-center max-w-sm leading-relaxed"
              style={{ color: tokens.textDim }}
            >
              Ready to model your deal? Enter your numbers and see exactly
              how the waterfall plays out.
            </p>

            <Button
              onClick={handleStartSimulation}
              className="group px-10 py-6 text-sm font-black uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${tokens.gold} 0%, #E6C200 100%)`,
                border: 'none',
                borderRadius: tokens.radiusMd,
                color: '#000000',
                boxShadow: `0 8px 24px ${tokens.goldGlow}`,
              }}
            >
              Start Simulation
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: tokens.textDim }}
              onMouseEnter={(e) => e.currentTarget.style.color = tokens.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = tokens.textDim}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default IntroView;
