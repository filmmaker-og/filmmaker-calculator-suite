/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — filmmaker.og store
   Four-tier architecture: 2 self-serve products + 2 turnkey services
   Plus reusable Excel add-on
   ═══════════════════════════════════════════════════════════════════ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  featured: boolean;
  tier: number;
  category: "product" | "service";
  isAddOn?: boolean;
  requiresBase?: string[];
  turnaround?: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  whatsIncluded: { title: string; body: string }[];
  whoItsFor: string;
  pickThisIf: string | null;
  upgradePrompt: {
    title: string;
    body: string;
    cta: string;
    link: string;
  } | null;
  ctaLabel: string;
}

export const products: Product[] = [
  {
    id: "the-snapshot",
    slug: "the-snapshot",
    name: "The Snapshot",
    price: 197,
    originalPrice: null,
    badge: null,
    featured: false,
    tier: 1,
    category: "product",
    shortDescription: "Your financial model. One document. Investor-ready.",
    fullDescription:
      "Your complete financial model — budget, capital stack, waterfall, deal terms, and scenario analysis — presented as a single, designed document that any investor can pick up and understand.\n\nA clean, professional presentation built from your calculator data, formatted for the person across the table who's deciding whether to write a check.\n\nRun your numbers. We make them investor-ready.",
    features: [
      "Unified Financial Presentation (PDF)",
      "Budget, capital stack, waterfall, scenarios — one document",
      "White-labeled with your company and project",
    ],
    whatsIncluded: [
      {
        title: "Unified Financial Presentation (PDF)",
        body: "Budget overview, capital stack structure, deal terms, full waterfall cascade, three-scenario analysis, and investor return summary. One cohesive document, designed to flow.",
      },
      {
        title: "White-Labeled Branding",
        body: "Your production company name and project title on every page. Your project, your brand.",
      },
    ],
    pickThisIf: "you need the numbers documented — clean and professional",
    whoItsFor:
      "Producers who have their numbers modeled and need a professional document to reference, send, or attach. When someone asks for the numbers, this is what you hand them.",
    upgradePrompt: {
      title: "WANT THE FULL INVESTOR PACKAGE?",
      body: "The Package adds standalone investor documents, visual design, and genre positioning — everything you need for real conversations with money.",
      cta: "See The Package →",
      link: "/store/the-package",
    },
    ctaLabel: "GET MY SNAPSHOT — $197",
  },
  {
    id: "the-package",
    slug: "the-package",
    name: "The Package",
    price: 597,
    originalPrice: null,
    badge: "COMPLETE",
    featured: true,
    tier: 2,
    category: "product",
    shortDescription:
      "Your complete investor package — financial presentation, standalone documents, visual design.",
    fullDescription:
      "Everything in The Snapshot — elevated.\n\nYour financial model presented with visual hierarchy, genre positioning, and professional design throughout. Plus the standalone documents you need for every stage of the conversation — a one-page executive summary for the leave-behind, individual investor return profiles for each equity participant, and a deal terms summary for attorney review.\n\nThis is an investor package. It looks like one, it reads like one, and it holds up under scrutiny.",
    features: [
      "Enhanced Financial Presentation (PDF)",
      "Individual Investor Return Profiles",
      "One-Page Executive Summary",
      "Deal Terms Summary",
      "Visual design with genre positioning",
      "White-labeled with your company and project",
    ],
    whatsIncluded: [
      {
        title: "Enhanced Financial Presentation (PDF)",
        body: "Everything in The Snapshot with elevated visual design, genre/market positioning section, and visual hierarchy throughout.",
      },
      {
        title: "Individual Investor Return Profiles",
        body: "Per-investor documents showing their specific investment amount, priority position, preferred return, and projected returns across all three scenarios.",
      },
      {
        title: "One-Page Executive Summary",
        body: "The leave-behind. Key financials on a single page, designed for the desk after the meeting ends.",
      },
      {
        title: "Deal Terms Summary",
        body: "All deal terms structured for attorney review and investor due diligence.",
      },
    ],
    pickThisIf: "you want the full investor package with standalone documents",
    whoItsFor:
      "Producers preparing to have real conversations with investors or co-financiers. Professional documents for the pitch, the follow-up, and the due diligence.",
    upgradePrompt: {
      title: "WANT US TO BUILD IT FOR YOU?",
      body: "The Producer's Package includes a custom lookbook, pitch deck, and complete investor package — turnkey, delivered in 5 business days.",
      cta: "See The Producer's Package →",
      link: "/store/the-producers-package",
    },
    ctaLabel: "GET THE PACKAGE — $597",
  },
  {
    id: "the-producers-package",
    slug: "the-producers-package",
    name: "The Producer's Package",
    price: 1497,
    originalPrice: null,
    badge: "TURNKEY",
    featured: false,
    tier: 3,
    category: "service",
    turnaround: "5 business days",
    shortDescription: "Custom lookbook, financials, pitch deck. We build it. You present it.",
    fullDescription:
      "Tell us about your project. We build the full investor package.\n\nCustom lookbook with visual identity tailored to your film — tone boards, cast packaging, genre positioning, the visual narrative that shows investors this project is real. Alongside the complete financial package — every document from The Package, plus a presentation-ready PowerPoint pitch deck with speaker notes.\n\nWe build it. You walk into the room.\n\n5 business day turnaround after intake.",
    features: [
      "Custom Lookbook — tone, cast, genre, visual identity",
      "Pitch Deck (PowerPoint) with speaker notes",
      "Enhanced Financial Presentation (PDF)",
      "Individual Investor Return Profiles",
      "One-Page Executive Summary",
      "Deal Terms Summary",
      "Everything white-labeled to your project",
    ],
    whatsIncluded: [
      {
        title: "Custom Lookbook",
        body: "Bespoke visual presentation with tone/mood boards, cast packaging layout, genre positioning, and director's visual framework. Tailored to your film.",
      },
      {
        title: "Pitch Deck (PowerPoint)",
        body: "10-12 slides built from your project data with speaker notes on every slide. Ready for the room.",
      },
      {
        title: "Enhanced Financial Presentation (PDF)",
        body: "Everything in The Package — budget, capital stack, waterfall, scenarios — with elevated visual design and genre positioning.",
      },
      {
        title: "Individual Investor Return Profiles",
        body: "Per-investor documents showing their specific investment amount, priority position, preferred return, and projected returns across all three scenarios.",
      },
      {
        title: "One-Page Executive Summary",
        body: "The leave-behind. Key financials on a single page, designed for the desk after the meeting ends.",
      },
      {
        title: "Deal Terms Summary",
        body: "All deal terms structured for attorney review and investor due diligence.",
      },
    ],
    pickThisIf: "you want the full treatment — turnkey, custom, ready for the room",
    whoItsFor:
      "Producers with an investor meeting on the calendar — or the conviction to go get one. The complete set of materials that institutional capital expects to see, built by someone who knows what belongs in the room.",
    upgradePrompt: {
      title: "NEED TO DEFEND YOUR VALUATION?",
      body: "The Full Package adds comparable acquisition research, a defensible valuation range, and a market positioning memo.",
      cta: "See The Full Package →",
      link: "/store/the-full-package",
    },
    ctaLabel: "START MY BUILD →",
  },
  {
    id: "the-full-package",
    slug: "the-full-package",
    name: "The Full Package",
    price: 2497,
    originalPrice: null,
    badge: "INSTITUTIONAL GRADE",
    featured: false,
    tier: 4,
    category: "service",
    turnaround: "5 business days",
    shortDescription:
      "The Full Package adds market research and a defensible valuation on top of everything we build for you.",
    fullDescription:
      "Everything in The Producer's Package — plus the market case that answers the question every serious investor asks: \"Why is this film worth that?\"\n\nWe research 3-5 comparable acquisition deals in your genre, budget range, and cast tier. We build a defensible valuation range with methodology your investors can follow. We write a market positioning memo analyzing where your project sits in the current acquisition landscape — which buyers are active, what the market supports, and what elements of your package strengthen your position.\n\nYour three revenue scenarios are calibrated against real transactions. Not hypotheticals. Documented deals.\n\nThis is what institutional capital expects. We build it.\n\n5 business day turnaround after intake.",
    features: [
      "Everything in The Producer's Package",
      "Comparable Acquisition Research (3–5 deals)",
      "Market Valuation Range & Methodology",
      "Revenue Scenarios Tied to Real Comps",
      "Market Positioning Memo",
    ],
    whatsIncluded: [
      {
        title: "Everything in The Producer's Package",
        body: "Custom lookbook, pitch deck, financial presentation, investor profiles, executive summary, and deal terms summary — all included.",
      },
      {
        title: "Comparable Acquisition Research",
        body: "3-5 recent deals in your genre/budget/cast tier with buyer, reported price range, and key deal characteristics. Sourced from trade reporting and market intelligence.",
      },
      {
        title: "Market Valuation Range & Methodology",
        body: "A defensible valuation range with methodology explained — so your investors understand how the number was derived, not just what it is.",
      },
      {
        title: "Revenue Scenarios Tied to Real Comps",
        body: "Three scenarios mapped to actual comparable transactions. Real data behind every number.",
      },
      {
        title: "Market Positioning Memo",
        body: "One-page analysis of where your film sits in the current acquisition landscape — which buyers are active, what price range the market supports, and what elements of your package strengthen your position.",
      },
    ],
    pickThisIf: "you need to defend a valuation to people who do this for a living",
    whoItsFor:
      "Producers raising $1M+ who need to defend their valuation to sophisticated investors or institutional co-financiers. The people across the table have seen a hundred pitches. This is how yours holds up.",
    upgradePrompt: null,
    ctaLabel: "GET THE FULL PACKAGE →",
  },
  {
    id: "the-working-model",
    slug: "the-working-model",
    name: "The Working Model",
    price: 149,
    originalPrice: null,
    badge: "ADD-ON",
    featured: false,
    tier: 0,
    category: "product",
    isAddOn: true,
    requiresBase: [
      "the-snapshot",
      "the-package",
      "the-producers-package",
      "the-full-package",
    ],
    shortDescription: "The live Excel engine behind your finance plan. Reuse on every project.",
    fullDescription:
      "The formula-driven Excel engine behind your finance plan.\n\nEvery output cell is connected to every input. Change your budget — the waterfall recalculates. Adjust the sales agent commission — every downstream tier updates. Swap your equity split — investor returns recompute instantly.\n\nThis isn't a snapshot of one deal. It's a financial modeling tool you'll use for years. Buy it once, use it on every project going forward.",
    features: [
      "Live formula-driven Excel model",
      "Change any input — everything recalculates",
      "Full formula documentation",
      "Reusable across unlimited projects",
    ],
    whatsIncluded: [
      {
        title: "Live Formula-Driven Excel Workbook",
        body: "Every output cell is driven by formulas. Change any input — budget, revenue projections, fee percentages, capital structure, profit splits — and watch every downstream number recalculate in real time.",
      },
      {
        title: "Full Formula Documentation",
        body: "Every formula documented. A companion reference explaining what each calculation does, why it's structured that way, and what assumptions it relies on.",
      },
      {
        title: "Reusable Across Unlimited Projects",
        body: "Clear the inputs and start fresh with a new project. The model structure, formulas, and documentation work for any production in the $1M–10M budget range. Buy it once, use it forever.",
      },
    ],
    pickThisIf: null,
    whoItsFor:
      "Producers and production companies who model multiple projects, want to stress-test deal structures before committing, or need a reusable financial tool they can bring to every negotiation.",
    upgradePrompt: null,
    ctaLabel: "YES, ADD FOR $79",
  },
];

export const selfServeProducts: Product[] = products.filter(
  (p) => p.category === "product" && !p.isAddOn
);
export const turnkeyServices: Product[] = products.filter(
  (p) => p.category === "service"
);
export const mainProducts: Product[] = products.filter((p) => !p.isAddOn);
export const addOnProduct: Product | undefined = products.find((p) => p.isAddOn);
export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
