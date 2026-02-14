/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — Phase 1: Store UI + Copy + Stripe Configuration
   ═══════════════════════════════════════════════════════════════════ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  featured: boolean;
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
    id: "the-export",
    slug: "the-export",
    name: "The Export",
    price: 97,
    originalPrice: null,
    badge: null,
    featured: false,
    shortDescription: "Your complete financial model as a clean, professional PDF.",
    fullDescription:
      "Your complete waterfall model exported as a clean, professional PDF — white-labeled with your production company name and project title.\n\nEvery section of your financial model formatted for clarity: budget breakdown, capital stack structure, deal terms, full waterfall cascade, and scenario analysis. Clean design, standard professional formatting, ready to reference, print, or attach to an email.\n\nThis is the document you send when someone asks \"can you walk me through the numbers?\"",
    features: [
      "Complete multi-page PDF",
      "White-labeled with your company name",
      "Budget, Stack, Deal, Waterfall, Scenarios",
      "Clean professional formatting",
    ],
    whatsIncluded: [
      {
        title: "Complete Multi-Page PDF",
        body: "Your full financial model across all sections — Budget, Capital Stack, Deal Terms, Waterfall Breakdown, and Scenario Analysis — formatted as a single professional document.",
      },
      {
        title: "White-Labeled With Your Identity",
        body: "Your production company name and project title on the cover and headers. No filmmaker.og branding anywhere in the document.",
      },
      {
        title: "Clean Professional Formatting",
        body: "White background, standard professional typography, well-organized tables and data layouts. Readable, presentable, print-ready.",
      },
      {
        title: "All Calculator Sections Included",
        body: "Every input and output from your model: budget totals, funding source breakdown, deal term assumptions, complete waterfall tier-by-tier flow, and all scenario comparisons.",
      },
    ],
    whoItsFor:
      "Producers who need a clean reference document of their financial model. Use it for internal planning, co-producer discussions, or as a supporting attachment when investors ask for the numbers behind your pitch.",
    whatYoullBuild:
      "A complete financial overview of your project showing exactly how money flows — from gross receipts through sales agent commissions, distribution fees, debt service, equity recoupment, and profit splits — formatted for anyone to read and understand.",
    upgradePrompt: {
      title: "WANT THE FULL TREATMENT?",
      body: "The Pitch Package adds premium cinematic design, an investor-ready PowerPoint deck, a static Excel workbook, and a one-page executive summary — everything you need to walk into a meeting fully prepared.",
      cta: "Upgrade for $150 more →",
      link: "/store/the-pitch-package",
    },
  },
  {
    id: "the-pitch-package",
    slug: "the-pitch-package",
    name: "The Pitch Package",
    price: 247,
    originalPrice: 347,
    badge: "MOST POPULAR · SAVE $100",
    featured: true,
    shortDescription: "Walk into any meeting with institutional-grade materials.",
    fullDescription:
      "Everything in The Export, plus the full premium treatment.\n\nYour financial model redesigned with the same visual standard used by finance boutiques and institutional advisors — dark cinematic layouts, data visualizations, professional charts, and infographic-style waterfall breakdowns. The kind of document that makes investors take you seriously before you say a word.\n\nPlus a ready-to-present PowerPoint deck that turns your numbers into a 10-slide investor pitch with built-in speaker notes. Plus a static Excel workbook for due diligence follow-up. Plus a one-page executive summary designed as the leave-behind document investors keep after the meeting.\n\nFour files. One purchase. You walk into the room prepared.",
    features: [
      "Everything in The Export",
      "Premium cinematic PDF design",
      "Static Excel reference workbook",
      "PowerPoint investor pitch deck (10 slides)",
      "One-page executive summary leave-behind",
    ],
    whatsIncluded: [
      {
        title: "Premium-Designed PDF",
        body: "Full cinematic visual treatment — black backgrounds, gold accents, professional charts, infographic-style waterfall cascade, scenario comparison spreads. This is the document that looks like a $10,000 finance boutique produced it.",
      },
      {
        title: "Static Excel Reference Workbook",
        body: "All your numbers laid out in clean rows and columns with professional formatting. When an investor's business manager asks \"can you send me the underlying numbers?\" — this is what you send. Values are hard-coded for reference; this is a data document, not a modeling tool.",
      },
      {
        title: "PowerPoint Investor Pitch Deck",
        body: "10 slides built from your actual project data. Title slide, budget overview, capital structure, deal terms, waterfall flow, scenario analysis, investor returns, and executive summary. Speaker notes included on every slide telling you exactly what to say and why.",
      },
      {
        title: "One-Page Executive Summary",
        body: "The leave-behind. A single-page document with your project's key financials — budget, acquisition target, capital structure, investor return projections — designed to sit on an investor's desk after the meeting ends. This is the document that keeps your project in the conversation.",
      },
      {
        title: "White-Labeled Across All Files",
        body: "Your production company name and project title on every document. No filmmaker.og branding. These are your materials.",
      },
    ],
    whoItsFor:
      "Producers preparing to sit in front of investors, equity partners, or co-financiers. You have a meeting coming up — or you want to be ready when one lands. This package gives you the complete set of materials that institutional capital expects to see.",
    whatYoullBuild:
      "A professional capital-raise package showing your project's complete financial architecture — how the money comes in, how it flows through the waterfall, and what investors can expect in return — presented across four coordinated documents that cover every moment from the pitch to the follow-up.",
    upgradePrompt: {
      title: "WANT THE REUSABLE MODEL?",
      body: "The Working Model adds a live formula-driven Excel workbook where changing any input recalculates everything downstream. Use it on this project, your next project, and every project after that.",
      cta: "Upgrade for $150 more →",
      link: "/store/the-working-model",
    },
  },
  {
    id: "the-working-model",
    slug: "the-working-model",
    name: "The Working Model",
    price: 397,
    originalPrice: null,
    badge: null,
    featured: false,
    shortDescription: "The financial engine. Not just this project — every project.",
    fullDescription:
      "Everything in The Pitch Package, plus the engine behind it.\n\nThe Working Model includes a live formula-driven Excel workbook where every output is connected to every input. Change your budget — the waterfall recalculates. Adjust the sales agent commission from 15% to 20% — every downstream tier updates. Swap your equity split — investor returns recompute instantly.\n\nThis isn't a snapshot of one deal. It's a financial modeling tool you'll use for years.\n\nThe Pitch Package gives you the documents for this deal. The Working Model gives you the machine for every deal going forward.",
    features: [
      "Everything in The Pitch Package",
      "Live formula-driven Excel model",
      "Change any input — everything recalculates",
      "Full formula documentation",
      "Reusable across unlimited projects",
    ],
    whatsIncluded: [
      {
        title: "Everything in The Pitch Package",
        body: "Premium PDF, static Excel reference, PowerPoint pitch deck, and executive summary — all white-labeled with your project details.",
      },
      {
        title: "Live Formula-Driven Excel Workbook",
        body: "Every output cell is driven by formulas. Change any input — budget, revenue projections, fee percentages, capital structure, profit splits — and watch every downstream number recalculate in real time. Model unlimited scenarios without rebuilding anything.",
      },
      {
        title: "Full Formula Documentation",
        body: "Every formula is documented. A companion reference explaining what each calculation does, why it's structured that way, and what assumptions it relies on. You'll understand the model, not just use it.",
      },
      {
        title: "Reusable Across Unlimited Projects",
        body: "Clear the inputs and start fresh with a new project. The model structure, formulas, and documentation work for any production in the $1M–$10M budget range. Buy it once, use it forever.",
      },
    ],
    whoItsFor:
      "Producers and production companies who model multiple projects, want to stress-test deal structures before committing, or need a reusable financial tool they can bring to every negotiation. If you're building a slate — not just a single film — this is the tool that scales with you.",
    whatYoullBuild:
      "A complete, living financial model that lets you test any combination of budget, capital structure, deal terms, and revenue scenarios — and instantly see how every change affects investor returns, producer profits, and recoupment timelines. The same tool institutional finance teams use, formatted for independent production.",
    upgradePrompt: null,
  },
];

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
    theExport: FeatureValue;
    thePitchPackage: FeatureValue;
    theWorkingModel: FeatureValue;
  }[];
}

export const comparisonSections: ComparisonSection[] = [
  {
    title: "Documents",
    features: [
      { label: "Professional PDF (clean format)", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Premium Cinematic PDF (dark design, charts, infographics)", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Static Excel Reference Workbook", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "PowerPoint Investor Pitch Deck (10 slides + speaker notes)", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "One-Page Executive Summary Leave-Behind", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Live Formula-Driven Excel Model", theExport: false, thePitchPackage: false, theWorkingModel: true },
    ],
  },
  {
    title: "Features",
    features: [
      { label: "White-labeled with your company/project", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Budget breakdown", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Capital stack structure", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Deal terms summary", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Waterfall cascade (full tier-by-tier)", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Scenario comparison (Low/Base/High)", theExport: true, thePitchPackage: true, theWorkingModel: true },
      { label: "Data visualizations and charts", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Infographic-style waterfall visual", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Investor return calculations", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Speaker notes for pitch presentation", theExport: false, thePitchPackage: true, theWorkingModel: true },
      { label: "Live recalculation (change inputs → outputs update)", theExport: false, thePitchPackage: false, theWorkingModel: true },
      { label: "Formula documentation", theExport: false, thePitchPackage: false, theWorkingModel: true },
      { label: "Reusable across unlimited projects", theExport: false, thePitchPackage: false, theWorkingModel: true },
    ],
  },
  {
    title: "Use Case",
    features: [
      { label: "Best for", theExport: "Reference & planning", thePitchPackage: "Investor meetings", theWorkingModel: "Ongoing deal modeling" },
      { label: "You need this when", theExport: "You want a clean record of your financial model", thePitchPackage: "You're preparing to pitch investors or co-financiers", theWorkingModel: "You model multiple projects or need to stress-test scenarios" },
      { label: "Files delivered", theExport: "1 (PDF)", thePitchPackage: "4 (PDF + Excel + PPTX + Summary)", theWorkingModel: "5 (PDF + Excel + PPTX + Summary + Live Model)" },
    ],
  },
];
