import {
  FileSpreadsheet,
  BarChart3,
  Users,
  Crown,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — Matches strategy document exactly
   ═══════════════════════════════════════════════════════════════════ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number | null;
  accessDays: number;
  accessLabel: string;
  icon: LucideIcon;
  featured?: boolean;
  description: string;
  hook: string;
  features: string[];
  buyerMath: string;
  /** Longer sell copy for the detail page */
  detailSections: {
    title: string;
    body: string;
  }[];
}

export const products: Product[] = [
  {
    id: "snapshot",
    slug: "snapshot",
    name: "The Snapshot",
    tagline: "Quick Export",
    price: 197,
    originalPrice: null,
    accessDays: 30,
    accessLabel: "30 days",
    icon: FileSpreadsheet,
    description: "Your deal at a glance. Professionally packaged.",
    hook: "Beautiful enough to email. Detailed enough to impress.",
    features: [
      "6-Sheet Professional Excel Export",
      "Executive Summary Dashboard",
      "Full Waterfall Distribution Ledger",
      "Capital Stack Breakdown",
      "Investor Return Summary",
      "Plain-English Glossary",
      "Investor-Ready Formatting",
    ],
    buyerMath:
      "Less than Final Draft costs — and this actually helps you raise money.",
    detailSections: [
      {
        title: "What You Get",
        body: "A polished, 6-sheet Excel workbook that turns your calculator inputs into a professional financial package. Every sheet is formatted for investors — not a raw spreadsheet dump. Includes an executive summary dashboard, your complete waterfall distribution ledger, capital stack breakdown, investor return summary, and a plain-English glossary so your investors aren't lost in film finance jargon.",
      },
      {
        title: "Who It's For",
        body: "You've finished running your numbers in the calculator and need a clean, professional document to share. Maybe it's for a potential investor meeting next week, or you want to attach something credible to an email. The Snapshot gives you exactly that — nothing more, nothing less.",
      },
      {
        title: "Why It Works",
        body: "Investors see dozens of pitches. Most come with amateur spreadsheets or no financials at all. The Snapshot immediately signals that you've done the work. It's formatted the way entertainment lawyers format theirs — because we studied their output.",
      },
    ],
  },
  {
    id: "blueprint",
    slug: "blueprint",
    name: "The Blueprint",
    tagline: "Present With Confidence",
    price: 997,
    originalPrice: null,
    accessDays: 60,
    accessLabel: "60 days",
    icon: BarChart3,
    description: "Your film's financial story. Ready for any room.",
    hook: "Show range. Show confidence. Show you've done the work.",
    features: [
      "Everything in The Snapshot",
      "3 Scenario Comparison (Conservative / Base / Upside)",
      "Side-by-Side Investor Return Analysis",
      "Visual Scenario Comparison Chart",
      '"How to Read Your Blueprint" Guide',
    ],
    buyerMath:
      "A single lawyer hour costs $350–$750. This is your entire financial story.",
    detailSections: [
      {
        title: "What You Get",
        body: "Everything in The Snapshot, plus three distinct financial scenarios — Conservative, Base, and Upside — presented side by side. Investors don't want to see one number. They want to see range. The Blueprint shows them you've thought through what happens if things go well, if things go okay, and if things go sideways.",
      },
      {
        title: "Who It's For",
        body: "You're preparing for a real investor meeting or pitch. You need to show that you understand risk and aren't just selling the dream. The Blueprint gives you the credibility of a finance-literate producer — even if you've never done this before.",
      },
      {
        title: "The Scenario Advantage",
        body: "Sophisticated investors always ask: 'What's the downside?' If you can't answer that with real numbers, the meeting is over. The Blueprint lets you answer confidently with three data-backed scenarios, a visual comparison chart, and a guide that helps you walk through each one.",
      },
    ],
  },
  {
    id: "investor-kit",
    slug: "investor-kit",
    name: "The Investor Kit",
    tagline: "Most Popular",
    price: 1997,
    originalPrice: 2997,
    accessDays: 180,
    accessLabel: "6 months",
    icon: Users,
    featured: true,
    description:
      "Everything you need to walk into a room and be taken seriously.",
    hook: "Even if it's your first time.",
    features: [
      "Everything in The Blueprint",
      "Comparable Films Report (5 Titles)",
      "Investor One-Pager (PDF)",
      "Investor Memo (3–5 Page PDF)",
      '"What Investors Actually Ask" Guide',
    ],
    buyerMath:
      "A consultant would charge $15K. This gives you 80% of what they'd deliver.",
    detailSections: [
      {
        title: "What You Get",
        body: "Everything in The Blueprint, plus the documents that actually close deals. A comparable films report analyzing 5 similar titles and their market performance. A one-page investor summary designed to be handed out or emailed. A 3-5 page investor memo that tells your film's financial story from beginning to end. And a guide covering what investors actually ask — so you're never caught off guard.",
      },
      {
        title: "Who It's For",
        body: "You're actively fundraising. You have meetings booked or you're about to start booking them. You need more than numbers — you need a complete package that makes you look like you've done this before. The Investor Kit is the bridge between 'aspiring filmmaker' and 'serious producer.'",
      },
      {
        title: "Why Founders Pricing",
        body: "We're building something new. The Investor Kit at $1,997 (down from $2,997) is our way of rewarding early adopters who believe in what we're doing. This price won't last forever. Once we have case studies of films funded using these materials, the price goes up.",
      },
    ],
  },
  {
    id: "greenlight",
    slug: "greenlight",
    name: "The Greenlight Package",
    tagline: "The Full Package",
    price: 4997,
    originalPrice: null,
    accessDays: 365,
    accessLabel: "12 months",
    icon: Crown,
    description: "The closest thing to having a team without having a team.",
    hook: "White-labeled. Multi-project. Complete.",
    features: [
      "Everything in The Investor Kit",
      "Deep Comp Analysis (10 Titles + Trends)",
      "Term Sheet Outline",
      "Distribution Strategy Brief",
      "White-Label Everything (Your Brand)",
      "Multiple Projects",
    ],
    buyerMath:
      "Your lawyer alone will cost more — and you don't even have one yet.",
    detailSections: [
      {
        title: "What You Get",
        body: "Everything in The Investor Kit, scaled up. A deep comparable analysis covering 10 titles plus market trends. A term sheet outline so you know what a real deal looks like. A distribution strategy brief covering your film's path to market. Every single document white-labeled with your production company brand. And you can run multiple projects — not just one film.",
      },
      {
        title: "Who It's For",
        body: "You're a production company or a producer with multiple projects in development. You need professional-grade materials for every project, and you need them to look like yours — not ours. The Greenlight Package is your back office.",
      },
      {
        title: "The White-Label Difference",
        body: "When you hand an investor a document branded with your production company, you're not a filmmaker using a tool — you're a production company with professional infrastructure. That perception shift is worth more than the price difference.",
      },
    ],
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

/* ═══════════════════════════════════════════════════════════════════
   COMPARISON TABLE DATA
   ═══════════════════════════════════════════════════════════════════ */

export type FeatureValue = boolean | string;

export interface ComparisonFeature {
  label: string;
  snapshot: FeatureValue;
  blueprint: FeatureValue;
  investorKit: FeatureValue;
  greenlight: FeatureValue;
}

export const comparisonFeatures: ComparisonFeature[] = [
  { label: "Beautiful Excel Waterfall Report", snapshot: true, blueprint: true, investorKit: true, greenlight: true },
  { label: "Professional Design & Branding", snapshot: true, blueprint: true, investorKit: true, greenlight: true },
  { label: "Plain-English Glossary", snapshot: true, blueprint: true, investorKit: true, greenlight: true },
  { label: "3 Scenario Comparison", snapshot: false, blueprint: true, investorKit: true, greenlight: true },
  { label: '"How to Read This" Guide', snapshot: false, blueprint: true, investorKit: true, greenlight: true },
  { label: "Comparable Films", snapshot: false, blueprint: false, investorKit: "5 titles", greenlight: "10 + trends" },
  { label: "Investor One-Pager (PDF)", snapshot: false, blueprint: false, investorKit: true, greenlight: true },
  { label: "Investor Memo (PDF)", snapshot: false, blueprint: false, investorKit: true, greenlight: true },
  { label: '"What Investors Ask" Guide', snapshot: false, blueprint: false, investorKit: true, greenlight: true },
  { label: "Term Sheet Outline", snapshot: false, blueprint: false, investorKit: false, greenlight: true },
  { label: "Distribution Strategy Brief", snapshot: false, blueprint: false, investorKit: false, greenlight: true },
  { label: "White-Label (Your Brand)", snapshot: false, blueprint: false, investorKit: false, greenlight: true },
  { label: "Multiple Projects", snapshot: false, blueprint: false, investorKit: false, greenlight: true },
  { label: "Access Period", snapshot: "30 days", blueprint: "60 days", investorKit: "6 months", greenlight: "12 months" },
];
