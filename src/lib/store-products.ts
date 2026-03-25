/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — filmmaker.og store
   Current architecture (March 2026):
     1. The Full Analysis ($197) — automated, first paid tier
     2. Comp Report ($595 / $995) — standalone market data
     3. The Producer's Package ($1,797) — turnkey service
     4. Boutique ($2,997+) — custom scope
     5. The Working Model ($79) — checkout upsell add-on

     Credit upgrade path: prior purchases apply toward next tier.

     DEAD PRODUCT NAMES (do not reintroduce):
     "The Snapshot" as a paid product (now FREE calculator output)
     "The Package" at $597 (replaced by Comp Report + Producer's Package)
     "The Full Package" at $2,497 (replaced by Boutique)
   ═══════════════════════════════════════════════════════════════════ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceNote: string | null;
  originalPrice: number | null;
  badge: string | null;
  featured: boolean;
  tier: number;
  category: "product" | "service" | "research";
  isAddOn?: boolean;
  requiresBase?: string[];
  turnaround?: string;
  shortDescription: string;
  fullDescription: string;
  features: (string | { title: string; subtitle: string; group: string })[];
  reassurance?: string;
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
    id: "the-full-analysis",
    slug: "the-full-analysis",
    name: "The Full Analysis",
    price: 197,
    priceNote: null,
    originalPrice: null,
    badge: "TRENDING",
    featured: false,
    tier: 1,
    category: "product",
    shortDescription: "Your financial model. One document. Investor-ready.",
    fullDescription:
      "Your complete financial model — budget, capital stack, waterfall, deal terms, and scenario analysis — presented as a single, designed document that any investor can pick up and understand.\n\nSensitivity modeling across five market conditions shows how your deal performs when the price moves. Not a single scenario — a stress-tested range.\n\nRun your numbers. We make them investor-ready.",
    features: [
      { title: "Complete Financial Model", subtitle: "Every section of your deal in one document", group: "Analyze" },
      { title: "Sensitivity Modeling", subtitle: "What happens when the acquisition price changes", group: "Analyze" },
      { title: "Investor Return Profiles", subtitle: "How your investors make money and when", group: "Analyze" },
      { title: "White-Labeled Branding", subtitle: "Your company name on every page", group: "Present" },
      { title: "Institutional Design", subtitle: "Hand it to your attorney. Hand it to your investor. It holds up.", group: "Present" },
    ],
    reassurance: "ONE-TIME PURCHASE · INSTANT DELIVERY",
    whatsIncluded: [
      {
        title: "Unified Financial Presentation (PDF)",
        body: "Budget overview, capital stack structure, deal terms, full waterfall cascade, scenario analysis, and investor return summary. One cohesive document, designed to flow.",
      },
      {
        title: "Sensitivity Modeling",
        body: "Five market scenarios showing how your deal performs when the acquisition price moves — from base case to distressed. The analysis that turns a single number into a range.",
      },
      {
        title: "White-Labeled Branding",
        body: "Your production company name and project title on every page. Your project, your brand.",
      },
    ],
    pickThisIf: "Your numbers documented, stress-tested, investor-ready.",
    whoItsFor:
      "Producers who have their numbers modeled and need a professional document to reference, send, or attach. When someone asks for the numbers, this is what you hand them.",
    upgradePrompt: {
      title: "NEED TO DEFEND YOUR VALUATION?",
      body: "The Comp Report adds real comparable acquisition data in your genre and budget range — the evidence that turns your valuation from an assumption into a defensible number.",
      cta: "See the Comp Report →",
      link: "/store/comp-report",
    },
    ctaLabel: "GET THE FULL ANALYSIS — $197",
  },
  {
    id: "comp-report",
    slug: "comp-report",
    name: "Comp Report",
    price: 595,
    priceNote: "5 comps · 10 comps for $995",
    originalPrice: null,
    badge: "DATA",
    featured: true,
    tier: 2,
    category: "research",
    shortDescription:
      "Real acquisition deals in your genre and budget range. Defend your valuation with data.",
    fullDescription:
      "The question every investor asks: \"Why is this film worth that?\"\n\nWe research 5 comparable acquisition deals in your genre, budget range, and cast tier. Each comp includes the buyer, reported price range, key deal characteristics, and why it's relevant to your project.\n\nYou get a defensible valuation range with methodology your investors can follow — not a number you made up, but a number grounded in transactions that actually happened.\n\nUpgrade to 10 comps for $995 for a deeper dataset and broader market coverage.",
    features: [
      { title: "Comparable Acquisition Deals", subtitle: "Buyer, price range, and deal terms per comp", group: "Research" },
      { title: "Defensible Valuation Range", subtitle: "Methodology your investors can follow, not a number you made up", group: "Research" },
      { title: "Market Positioning Analysis", subtitle: "Where your project sits in the current landscape", group: "Evidence" },
      { title: "Revenue Scenarios", subtitle: "Three scenarios mapped to actual transactions", group: "Evidence" },
    ],
    reassurance: "ONE-TIME PURCHASE · DELIVERED IN 48 HOURS",
    whatsIncluded: [
      {
        title: "Comparable Acquisition Research",
        body: "5 recent deals in your genre/budget/cast tier with buyer, reported price range, and key deal characteristics. Sourced from trade reporting and market intelligence.",
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
        title: "Market Positioning Analysis",
        body: "Where your project sits in the current acquisition landscape — which buyers are active, what the market supports, and what elements of your package strengthen your position.",
      },
    ],
    pickThisIf: "Defend a valuation with deals that actually closed.",
    whoItsFor:
      "Producers who need evidence behind their asking price. The Comp Report turns your valuation from an assumption into a defensible number backed by deals that actually closed.",
    upgradePrompt: {
      title: "WANT THE FULL INVESTOR PACKAGE?",
      body: "The Producer's Package includes everything — lookbook, pitch deck, financial presentation, 10 comps, and investor documents. Turnkey, delivered in 3-5 business days.",
      cta: "See The Producer's Package →",
      link: "/store/the-producers-package",
    },
    ctaLabel: "GET 10 COMPS — $995",
  },
  {
    id: "the-producers-package",
    slug: "the-producers-package",
    name: "The Producer's Package",
    price: 1797,
    priceNote: null,
    originalPrice: null,
    badge: "TURNKEY",
    featured: false,
    tier: 3,
    category: "service",
    turnaround: "3-5 business days",
    shortDescription: "Custom lookbook, financials, pitch deck, 10 comps. We build it. You present it.",
    fullDescription:
      "Tell us about your project. We build the full investor package.\n\nCustom lookbook with visual identity tailored to your film — tone boards, cast packaging, genre positioning, the visual narrative that shows investors this project is real. Alongside the complete financial package — every document from The Full Analysis, plus a presentation-ready PowerPoint pitch deck with speaker notes, plus 10 comparable acquisition deals defending your valuation.\n\nWe build it. You walk into the room.\n\n3-5 business day turnaround after intake.",
    features: [
      { title: "Custom Lookbook", subtitle: "Tone, cast, genre, visual identity for your film", group: "Build" },
      { title: "Pitch Deck With Speaker Notes", subtitle: "10-12 slides ready for the room", group: "Build" },
      { title: "Enhanced Financial Presentation", subtitle: "Elevated design beyond the standard PDF", group: "Build" },
      { title: "10 Comparable Acquisition Deals", subtitle: "Real transactions defending your valuation", group: "Defend" },
      { title: "Everything Branded to Your Project", subtitle: "Your company and project name throughout", group: "Defend" },
    ],
    reassurance: "3-5 BUSINESS DAY TURNAROUND",
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
        body: "Budget, capital stack, waterfall, scenarios — with elevated visual design and genre positioning.",
      },
      {
        title: "Comparable Acquisition Research (10 deals)",
        body: "10 recent deals in your genre/budget/cast tier with buyer, reported price range, and key deal characteristics.",
      },
      {
        title: "Market Valuation Range & Methodology",
        body: "A defensible valuation range with methodology your investors can follow.",
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
    pickThisIf: "The complete investor package, built for your project.",
    whoItsFor:
      "Producers with an investor meeting on the calendar — or the conviction to go get one. The complete set of materials that institutional capital expects to see, built by someone who knows what belongs in the room.",
    upgradePrompt: {
      title: "NEED SOMETHING CUSTOM?",
      body: "Boutique engagements cover custom scope beyond the standard package — specialized research, alternative deal structures, extended market analysis.",
      cta: "See Boutique →",
      link: "/store/boutique",
    },
    ctaLabel: "START MY BUILD — $1,797",
  },
  {
    id: "boutique",
    slug: "boutique",
    name: "Boutique",
    price: 2997,
    priceNote: null,
    originalPrice: null,
    badge: "CUSTOM",
    featured: false,
    tier: 4,
    category: "service",
    turnaround: "Scoped per engagement",
    shortDescription:
      "Custom scope beyond the standard package. Email-based, priced per engagement.",
    fullDescription:
      "For projects that need more than the standard package covers.\n\nBoutique engagements are scoped per project — specialized research, alternative deal structures, extended market analysis, multi-territory distribution strategies, or anything else that requires custom work.\n\nStarts at $2,997. Priced per engagement based on scope.\n\nReach out to discuss your project.",
    features: [
      { title: "Everything in The Producer's Package", subtitle: "Full baseline included", group: "Includes" },
      { title: "Custom Scope Per Engagement", subtitle: "Tailored to your project's specific needs", group: "Includes" },
      { title: "Specialized Research and Analysis", subtitle: "Multi-territory, alternative structures, extended market work", group: "Includes" },
    ],
    reassurance: "SCOPED PER ENGAGEMENT",
    whatsIncluded: [
      {
        title: "Everything in The Producer's Package",
        body: "Custom lookbook, pitch deck, financial presentation, investor profiles, executive summary, deal terms summary, and 10 comps — all included as the baseline.",
      },
      {
        title: "Custom Scope",
        body: "Additional deliverables scoped to your project — specialized research, alternative deal structures, extended market analysis, multi-territory strategies, or other custom work.",
      },
    ],
    pickThisIf: "Custom scope beyond the standard package.",
    whoItsFor:
      "Producers with complex financing structures, multi-territory deals, or projects that need specialized analysis beyond the standard package.",
    upgradePrompt: null,
    ctaLabel: "CONTACT US →",
  },
  {
    id: "the-working-model",
    slug: "the-working-model",
    name: "The Working Model",
    price: 79,
    priceNote: "Checkout upsell",
    originalPrice: null,
    badge: "ADD-ON",
    featured: false,
    tier: 0,
    category: "product",
    isAddOn: true,
    requiresBase: [
      "the-full-analysis",
      "comp-report",
      "the-producers-package",
      "boutique",
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
    ctaLabel: "ADD THE WORKING MODEL — $79",
  },
];

export const selfServeProducts: Product[] = products.filter(
  (p) => p.category === "product" && !p.isAddOn
);
export const researchProducts: Product[] = products.filter(
  (p) => p.category === "research"
);
export const turnkeyServices: Product[] = products.filter(
  (p) => p.category === "service"
);
export const mainProducts: Product[] = products.filter((p) => !p.isAddOn);
export const addOnProduct: Product | undefined = products.find((p) => p.isAddOn);
export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
