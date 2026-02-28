/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — Phase 2: Finance Plan Builder Architecture
   ═══════════════════════════════════════════════════════════════════ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  featured: boolean;
  isAddOn?: boolean;
  requiresBase?: string[];
  shortDescription: string;
  fullDescription: string;
  features: string[];
  whatsIncluded: { title: string; body: string }[];
  whoItsFor: string;
  whatYoullBuild: string;
  upgradePrompt: { title: string; body: string; cta: string; link: string } | null;
}

export const products: Product[] = [
  {
    id: "the-blueprint",
    slug: "the-blueprint",
    name: "The Blueprint",
    price: 197,
    originalPrice: null,
    badge: null,
    featured: false,
    shortDescription: "Your complete finance plan, documented.",
    fullDescription:
      "Your complete finance plan — documented, structured, and ready to reference.\n\nWe take your project details, budget, capital stack, and deal structure and build a professional finance plan PDF. Every assumption explained, every number sourced, every waterfall tier documented. This is the document your attorney reviews, your accountant references, and your co-producers align around.\n\nTell us about your project. We build the plan.",
    features: [
      "Finance Plan Summary PDF",
      "Capital Stack Breakdown",
      "Scenario Comparison Sheet",
      "Assumptions Reference",
    ],
    whatsIncluded: [
      {
        title: "Finance Plan Summary PDF",
        body: "Your complete financial model across all sections — Budget, Capital Stack, Deal Terms, Waterfall Breakdown, and Scenario Analysis — formatted as a single professional document.",
      },
      {
        title: "Capital Stack Breakdown",
        body: "Detailed breakdown of every funding source, priority positions, and recoupment structure. Shows exactly who gets paid and in what order.",
      },
      {
        title: "Scenario Comparison Sheet",
        body: "Three revenue scenarios showing investor returns at conservative, target, and optimistic acquisition prices.",
      },
      {
        title: "Assumptions Reference",
        body: "Every default value, industry standard, and assumption documented with source and range — so your attorney knows exactly what to review.",
      },
    ],
    whoItsFor:
      "Producers who need a clear, professional record of their project's financial structure. Use it for internal planning, co-producer alignment, or as the foundation document when investors ask for the numbers.",
    whatYoullBuild:
      "A complete financial plan showing exactly how money flows — from gross receipts through sales agent commissions, distribution fees, debt service, equity recoupment, and profit splits — formatted for anyone to read and understand.",
    upgradePrompt: {
      title: "WANT THE FULL TREATMENT?",
      body: "The Pitch Package adds a presentation-ready PowerPoint deck, individual investor return profiles, a one-page executive summary, and deal terms summary — everything you need to walk into the room.",
      cta: "Upgrade to The Pitch Package →",
      link: "/store/the-pitch-package",
    },
  },
  {
    id: "the-pitch-package",
    slug: "the-pitch-package",
    name: "The Pitch Package",
    price: 497,
    originalPrice: 697,
    badge: "RECOMMENDED · SAVE $200",
    featured: true,
    shortDescription: "Your finance plan, presentation-ready for the room.",
    fullDescription:
      "Everything in The Blueprint, plus the full investor-facing treatment.\n\nYour finance plan redesigned for the room — a presentation-ready PowerPoint deck, individual investor return profiles, a one-page executive summary leave-behind, and a deal terms summary. The kind of materials that make investors take you seriously before you say a word.\n\nFour additional deliverables on top of your complete finance plan. One purchase. You walk into the room prepared.",
    features: [
      "Everything in The Blueprint",
      "Individual Investor Return Profiles",
      "Pitch Deck (PowerPoint)",
      "One-Page Executive Summary",
      "Deal Terms Summary",
    ],
    whatsIncluded: [
      {
        title: "Everything in The Blueprint",
        body: "Finance Plan Summary PDF, Capital Stack Breakdown, Scenario Comparison Sheet, and Assumptions Reference — all included.",
      },
      {
        title: "Individual Investor Return Profiles",
        body: "Per-investor documents showing their specific investment amount, priority position, preferred return, profit participation, and projected returns across all three scenarios.",
      },
      {
        title: "Pitch Deck (PowerPoint)",
        body: "10 slides built from your actual project data. Title slide, budget overview, capital structure, deal terms, waterfall flow, scenario analysis, investor returns, and executive summary. Speaker notes included on every slide.",
      },
      {
        title: "One-Page Executive Summary",
        body: "The leave-behind. A single-page document with your project's key financials — budget, acquisition target, capital structure, investor return projections — designed to sit on an investor's desk after the meeting ends.",
      },
      {
        title: "Deal Terms Summary",
        body: "A clean, structured summary of all deal terms — distribution model, commission rates, fee structures, and recoupment waterfall — formatted for attorney review and investor due diligence.",
      },
    ],
    whoItsFor:
      "Producers preparing to sit in front of investors, equity partners, or co-financiers. You have a meeting coming up — or you want to be ready when one lands. This package gives you the complete set of materials that institutional capital expects to see.",
    whatYoullBuild:
      "A professional capital-raise package showing your project's complete financial architecture — how the money comes in, how it flows through the waterfall, and what investors can expect in return — presented across coordinated documents that cover every moment from the pitch to the follow-up.",
    upgradePrompt: null,
  },
  {
    id: "the-working-model",
    slug: "the-working-model",
    name: "The Working Model",
    price: 99,
    originalPrice: null,
    badge: "ADD-ON",
    featured: false,
    isAddOn: true,
    requiresBase: ["the-blueprint", "the-pitch-package"],
    shortDescription:
      "The live Excel engine behind your finance plan. Reuse on every project.",
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
        body: "Every formula is documented. A companion reference explaining what each calculation does, why it's structured that way, and what assumptions it relies on.",
      },
      {
        title: "Reusable Across Unlimited Projects",
        body: "Clear the inputs and start fresh with a new project. The model structure, formulas, and documentation work for any production in the $1M–$10M budget range. Buy it once, use it forever.",
      },
    ],
    whoItsFor:
      "Producers and production companies who model multiple projects, want to stress-test deal structures before committing, or need a reusable financial tool they can bring to every negotiation.",
    whatYoullBuild:
      "A complete, living financial model that lets you test any combination of budget, capital structure, deal terms, and revenue scenarios — and instantly see how every change affects investor returns and recoupment timelines.",
    upgradePrompt: null,
  },
];

/** Get the two main (non-add-on) products */
export const mainProducts: Product[] = products.filter((p) => !p.isAddOn);

/** Get the add-on product */
export const addOnProduct: Product | undefined = products.find((p) => p.isAddOn);

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

/* ═══════════════════════════════════════════════════════════════════
   COMPARISON TABLE DATA
   ═══════════════════════════════════════════════════════════════════ */

export type FeatureValue = boolean | string;

export interface ComparisonSection {
  title: string;
  features: {
    label: string;
    theBlueprint: FeatureValue;
    thePitchPackage: FeatureValue;
  }[];
}

export const comparisonSections: ComparisonSection[] = [
  {
    title: "Documents",
    features: [
      { label: "Finance Plan Summary PDF", theBlueprint: true, thePitchPackage: true },
      { label: "Capital Stack Breakdown", theBlueprint: true, thePitchPackage: true },
      { label: "Scenario Comparison Sheet", theBlueprint: true, thePitchPackage: true },
      { label: "Assumptions Reference", theBlueprint: true, thePitchPackage: true },
      { label: "Individual Investor Return Profiles", theBlueprint: false, thePitchPackage: true },
      { label: "Pitch Deck (PowerPoint)", theBlueprint: false, thePitchPackage: true },
      { label: "One-Page Executive Summary", theBlueprint: false, thePitchPackage: true },
      { label: "Deal Terms Summary", theBlueprint: false, thePitchPackage: true },
    ],
  },
  {
    title: "Features",
    features: [
      { label: "White-labeled with your company/project", theBlueprint: true, thePitchPackage: true },
      { label: "Budget breakdown", theBlueprint: true, thePitchPackage: true },
      { label: "Capital stack structure", theBlueprint: true, thePitchPackage: true },
      { label: "Deal terms summary", theBlueprint: true, thePitchPackage: true },
      { label: "Waterfall cascade (full tier-by-tier)", theBlueprint: true, thePitchPackage: true },
      { label: "Scenario comparison (Conservative/Target/Optimistic)", theBlueprint: true, thePitchPackage: true },
      { label: "Per-investor return profiles", theBlueprint: false, thePitchPackage: true },
      { label: "Speaker notes for pitch presentation", theBlueprint: false, thePitchPackage: true },
    ],
  },
  {
    title: "Use Case",
    features: [
      { label: "Best for", theBlueprint: "Internal planning & documentation", thePitchPackage: "Investor meetings & capital raises" },
      { label: "You need this when", theBlueprint: "You want a professional finance plan for your project", thePitchPackage: "You're preparing to pitch investors or co-financiers" },
      { label: "Deliverables", theBlueprint: "4 documents", thePitchPackage: "8 documents" },
    ],
  },
];
