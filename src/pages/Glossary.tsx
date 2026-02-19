import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import { Search, Home, ChevronDown, SendHorizonal, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";

// ------------------------------------------------------------------
// SCROLL REVEAL HOOK (same pattern as Index.tsx)
// ------------------------------------------------------------------
const useReveal = (threshold = 0.05) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ------------------------------------------------------------------
// SPOTLIGHT DIVIDER (same as Index.tsx)
// ------------------------------------------------------------------
const Divider = () => (
  <div className="py-6 px-6">
    <div className="max-w-lg mx-auto">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </div>
  </div>
);

// ------------------------------------------------------------------
// TOP 10 MUST-KNOW TERMS (hand-curated)
// ------------------------------------------------------------------
type Top10Term = {
  num: string;
  term: string;
  category: string;
  def: string;
};

const TOP_10: Top10Term[] = [
  {
    num: "01",
    term: "Waterfall",
    category: "The Math",
    def: "The strict priority order in which revenue flows from the box office to every stakeholder. Money trickles down: Theaters → Distributor → Sales Agent → Lenders → Investors → Producers. Understanding this is understanding independent film finance.",
  },
  {
    num: "02",
    term: "Recoupment",
    category: "The Math",
    def: "Earning back the initial investment before profits are shared. The recoupment schedule defines who gets paid back first — and at what premium — before anyone sees net profit. This is the core negotiation in any investor deal.",
  },
  {
    num: "03",
    term: "Capital Stack",
    category: "Finance",
    def: "The layered combination of funding sources used to finance a budget: tax credits (lowest risk), senior debt, gap/mezzanine loans, and equity (highest risk). Each tier has its own cost, priority, and return profile.",
  },
  {
    num: "04",
    term: "Negative Cost",
    category: "Finance",
    def: "The actual all-in cost to produce the finished film — development, production, and post — excluding marketing and distribution. This is the number you're financing. Not 'the budget estimate.' The final, locked number.",
  },
  {
    num: "05",
    term: "Senior Debt",
    category: "Finance",
    def: "First-position loans secured by reliable collateral — tax credits or pre-sale contracts. Lowest risk, lowest cost (typically SOFR + 5–10%), and paid back first in the waterfall. Banks write these. They don't lose.",
  },
  {
    num: "06",
    term: "Equity",
    category: "Finance",
    def: "Cash investment in exchange for ownership and backend profits. Highest risk, paid last, but holds a percentage of profits forever. Standard structure: principal back + 20% premium, then 50% of net profits going forward.",
  },
  {
    num: "07",
    term: "Cross-Collateralization",
    category: "Legal",
    def: "A trap. When a distributor uses profits from one film to cover losses on another in their portfolio. Your Film A profit funds their Film B write-off. Always require 'Single Picture Accounting' in any distribution contract.",
  },
  {
    num: "08",
    term: "Sales Agent",
    category: "Roles",
    def: "The broker who sells your international distribution rights — territory by territory — at film markets (Cannes, AFM, Berlin). Takes 10–20% commission off gross receipts. Their estimates can also be used to secure pre-sale bank loans.",
  },
  {
    num: "09",
    term: "Producer's Corridor",
    category: "The Math",
    def: "A percentage of first-dollar gross receipts reserved for the producer — paid before expenses are deducted. Rare, powerful, and a sign of real leverage. If you can negotiate it, do. It fundamentally changes your position in the waterfall.",
  },
  {
    num: "10",
    term: "CAM — Collection Account Manager",
    category: "Roles",
    def: "A neutral third party that receives all revenue and distributes it according to the agreed waterfall. Takes approximately 1% off the top. Essential for transparency and investor confidence. Without a CAM, you're trusting a distributor to pay everyone correctly.",
  },
];

// ------------------------------------------------------------------
// GLOSSARY DATA (MASTER LIST)
// ------------------------------------------------------------------
type Term = {
  term: string;
  def: string;
  category: "Roles" | "Finance" | "Distribution" | "Legal" | "The Math" | "Production";
  essential?: boolean;
};

const RAW_TERMS: Term[] = [
  { term: "Above the Line (ATL)", def: "The costs for the 'Creative' elements: Writer, Director, Producer, and Principal Cast. These are usually fixed fees negotiated upfront.", category: "Finance" },
  { term: "Account Statement", def: "The financial report sent by a distributor (usually quarterly) detailing gross receipts, fees, expenses, and net revenue due.", category: "Finance" },
  { term: "Accrual Accounting", def: "An accounting method where expenses are recorded when incurred (not when paid), and interest accumulates from day one.", category: "Finance" },
  { term: "Acquisition", def: "A distributor buying the rights to a finished film, typically at a festival or market.", category: "Distribution" },
  { term: "Acquisition Price", def: "The gross amount a distributor pays for the rights. This happens *before* they take their sales commission.", category: "Finance" },
  { term: "Adjusted Gross", def: "Gross receipts minus *only* specific costs (like co-op advertising). A rare, producer-friendly deal structure.", category: "The Math" },
  { term: "Advance", def: "An upfront cash payment (see *Minimum Guarantee*) given by a distributor. Recouped from future revenue.", category: "Finance" },
  { term: "Affiliate", def: "A company related to the distributor. *Trap:* Distributors often pay their own affiliates inflated fees to reduce your net profit.", category: "Legal" },
  { term: "Aggregator", def: "A company (like Bitmax or Quiver) that encodes and delivers your film to platforms like iTunes/Netflix for a flat fee rather than a commission.", category: "Distribution" },
  { term: "All Rights", def: "A deal granting a distributor rights to *every* platform (Theatrical, TV, VOD) in a territory.", category: "Legal" },
  { term: "Assignment", def: "The legal transfer of rights or property from one party to another.", category: "Legal" },
  { term: "At-Source", def: "A clause requiring the distributor/agent to calculate their commission based on the *original* gross receipts from sub-distributors, not the net amount after the sub-distributor takes their cut. **Critical protection.**", category: "Legal" },
  { term: "Audit Rights", def: "Your contractual right to hire an accountant to inspect the distributor's books to ensure they aren't hiding money.", category: "Legal" },
  { term: "AVOD (Ad-Based VOD)", def: "Free streaming platforms with ads (Tubi, Pluto). Revenue is split based on views or ad impressions.", category: "Distribution" },
  { term: "Back End", def: "Net profits payable to participants *after* all recoupment. Also called 'Net Profit Participation.'", category: "The Math" },
  { term: "Bankable", def: "Talent (Actor/Director) whose name alone can secure financing or pre-sales.", category: "Roles" },
  { term: "Below the Line (BTL)", def: "Physical production costs: Crew, Equipment, Locations, Insurance, Food. The 'hard' costs.", category: "Finance" },
  { term: "Box Office", def: "The total money spent by the public on tickets. The studio only keeps ~50% of this (the rest goes to the theater).", category: "Finance" },
  { term: "Breakage", def: "Extra costs incurred by a distributor to format a film for a specific broadcaster or territory.", category: "Distribution" },
  { term: "Breakeven", def: "The exact revenue number needed to pay back all debts, equity, and fees. The 'Zero' point.", category: "The Math" },
  { term: "Budget", def: "The total projected cost to produce the film.", category: "Finance" },
  { term: "Burn Rate", def: "The rate at which a production spends money during shooting.", category: "Finance" },
  { term: "Call Sheet", def: "The daily schedule listing call times, locations, and scenes for cast and crew.", category: "Production" },
  { term: "CAM (Collection Account Manager)", def: "A neutral third party that receives revenue and distributes it. Takes ~1% off the top. Essential for transparency.", category: "Roles", essential: true },
  { term: "Capped Expenses", def: "A negotiated limit on how much a distributor can deduct for marketing/expenses. **Critical.**", category: "Legal" },
  { term: "Capital Stack", def: "The combination of different funding sources used to finance the budget — tax credits, debt, equity, and deferrals layered by risk and repayment priority.", category: "Finance", essential: true },
  { term: "Cash Flow", def: "The schedule of when money is needed vs. when it is available.", category: "Finance" },
  { term: "Chain of Title", def: "The stack of legal documents proving you own the rights to the script, music, and film. You cannot sell a film without this.", category: "Legal" },
  { term: "Completion Bond", def: "Insurance that guarantees the film will be finished. Banks require this for Senior Debt.", category: "Finance" },
  { term: "Completion Guarantor", def: "The company issuing the bond. They can seize control of the film if you go over budget.", category: "Roles" },
  { term: "Contingency", def: "An emergency buffer (usually 10% of budget). You should plan to spend it.", category: "Finance" },
  { term: "Co-Production", def: "A joint venture between two production companies (often from different countries) to access tax incentives and funding.", category: "Production" },
  { term: "Corridor (Producer's Corridor)", def: "A % of first-dollar gross reserved for the producer, paid *before* expenses. Rare and powerful.", category: "The Math" },
  { term: "Cross-Collateralization", def: "**TRAP.** When a distributor uses profits from Film A to pay for losses on Film B. Always require 'Single Picture Accounting.'", category: "Legal", essential: true },
  { term: "Day and Date", def: "Releasing in theaters and on VOD on the same day. Good for marketing cost, bad for theater relationships.", category: "Distribution" },
  { term: "DCP (Digital Cinema Package)", def: "The encrypted hard drive format used for projection in commercial theaters.", category: "Production" },
  { term: "Deal Memo", def: "A short document outlining the main terms of a contract before the long-form contract is drafted. Binding.", category: "Legal" },
  { term: "Debt", def: "Money borrowed that must be paid back with interest (Senior Debt, Gap).", category: "Finance" },
  { term: "Deferment", def: "Fees (Cast/Crew) delayed until *after* the film makes money.", category: "Finance" },
  { term: "Deliverables", def: "The massive list of items (Master files, Music Cue Sheets, E&O, Chains of Title) required to get paid.", category: "Production" },
  { term: "Development", def: "The early stage: writing scripts, securing rights, attaching talent.", category: "Production" },
  { term: "DGA", def: "Directors Guild of America.", category: "Roles" },
  { term: "Distribution Fee", def: "The commission (10-35%) a distributor takes for selling your film.", category: "Distribution" },
  { term: "Domestic", def: "Usually refers to North America (US + Canada).", category: "Distribution" },
  { term: "Drawdown", def: "The release of loan funds in stages as the production hits milestones.", category: "Finance" },
  { term: "E&O Insurance (Errors & Omissions)", def: "Liability insurance against copyright/libel claims. Distributors require this to release.", category: "Production" },
  { term: "Equity", def: "Investment for ownership. High risk, paid last, but keeps owning a piece forever.", category: "Finance", essential: true },
  { term: "Escrow", def: "A holding account where funds are kept until specific conditions are met (e.g., Cast is signed).", category: "Finance" },
  { term: "Executive Producer (EP)", def: "Usually the person who secured the funding or the IP. Rarely handles physical production.", category: "Roles" },
  { term: "Exclusivity", def: "A window of time where a film can *only* be shown on one specific platform.", category: "Legal" },
  { term: "Favored Nations (MFN)", def: "A clause ensuring fairness: 'If you give anyone else a better deal, I get it too.'", category: "Legal" },
  { term: "Final Cut", def: "The right to decide the final version of the film released. Usually held by the Financier or Distributor, rarely the Director (unless A-list).", category: "Legal" },
  { term: "Finance Plan", def: "The document showing exactly where every dollar of the budget is coming from (Tax Credits, Presales, Equity, Gap).", category: "Finance" },
  { term: "First Dollar Gross", def: "The most advantageous participation. You get paid from the very first dollar of revenue, before *any* deductions.", category: "The Math" },
  { term: "First Look Deal", def: "A contract giving a studio the first right to finance/distribute a producer's next project.", category: "Legal" },
  { term: "Force Majeure", def: "'Act of God.' A clause allowing cancellation of a contract due to unforeseen events (War, Pandemic).", category: "Legal" },
  { term: "Foreign Sales Agent", def: "Represents the film to distributors outside the domestic territory.", category: "Roles" },
  { term: "Four-Wall", def: "Renting a theater yourself to show your film. You keep 100% of the box office (minus rental).", category: "Distribution" },
  { term: "Fringes", def: "The payroll taxes and union benefits added on top of a crew member's salary (usually +20-30%).", category: "Finance" },
  { term: "Gap Financing", def: "High-interest loans covering the 'gap' between confirmed funding (Tax credits/Presales) and the Budget.", category: "Finance" },
  { term: "Greenlight", def: "The official 'Go' signal that financing is closed and production can begin.", category: "Production" },
  { term: "Gross Receipts", def: "Total revenue collected by the distributor from all sources.", category: "Distribution" },
  { term: "Guilds", def: "The unions (SAG, DGA, WGA, IATSE) that set minimum rates and rules.", category: "Roles" },
  { term: "Hard Costs", def: "Actual cash spent on production (equipment, film stock), as opposed to Soft Costs (fees, legal).", category: "Finance" },
  { term: "Holdback", def: "A period where you are *prevented* from releasing the film on a certain platform (e.g., 'No VOD for 90 days after Theatrical').", category: "Legal" },
  { term: "IATSE", def: "International Alliance of Theatrical Stage Employees. The primary union for below-the-line film crew (camera, grip, electric, art, wardrobe, etc.).", category: "Roles" },
  { term: "Interest", def: "The cost of borrowing money. Accrues daily.", category: "Finance" },
  { term: "Independent Film", def: "A film produced outside the major studio system.", category: "Production" },
  { term: "IP (Intellectual Property)", def: "The underlying work (Book, Script, Life Rights) the film is based on.", category: "Legal" },
  { term: "Key Art", def: "The main promotional image/poster.", category: "Production" },
  { term: "Letter of Intent (LOI)", def: "A formal (but often non-binding) letter from an actor or distributor expressing interest in the project.", category: "Legal" },
  { term: "License Fee", def: "A flat fee paid by a broadcaster/streamer to show the film for a set time (e.g., Netflix pays $100k for 2 years).", category: "Distribution" },
  { term: "Lien", def: "A legal claim on the film's assets used by lenders to secure their loan.", category: "Legal" },
  { term: "Line Producer", def: "The 'CEO' of the physical production. Manages the budget and schedule day-to-day.", category: "Roles" },
  { term: "LLC (Limited Liability Company)", def: "The standard corporate structure for a single film (Single Purpose Vehicle) to protect the producers personally.", category: "Legal" },
  { term: "M&E (Music & Effects)", def: "The audio mix of a film minus the dialogue. Required for international dubbing and foreign distribution deals.", category: "Production" },
  { term: "Marketing Cap", def: "The maximum amount a distributor is allowed to spend (and deduct) on P&A. Also known as Sales Agent Marketing expenses.", category: "Legal" },
  { term: "Master", def: "The highest quality final version of the film.", category: "Production" },
  { term: "Minimum Guarantee (MG)", def: "Cash advance from a distributor.", category: "Finance" },
  { term: "Mezzanine Financing", def: "See *Gap Financing*.", category: "Finance" },
  { term: "Micro-Budget", def: "A film produced for under $500k, typically SAG Ultra Low Budget or Modified Low Budget agreements. Most indie first features.", category: "Production" },
  { term: "Moral Rights", def: "The right of an author to protect the integrity of their work (harder to waive in Europe than the US).", category: "Legal" },
  { term: "Negative Cost", def: "The actual cost to produce the finished film (master), excluding marketing/distribution. Your all-in production budget.", category: "Finance", essential: true },
  { term: "Negative Pickup", def: "A studio agrees to buy (pick up) the finished film at a set price, but doesn't fund production. The producer uses that commitment to secure bank loans.", category: "Distribution" },
  { term: "Net Profit", def: "Money remaining after *everyone* (Distributor, Lenders, Investors) has been paid.", category: "The Math" },
  { term: "Net Receipts", def: "Gross Receipts minus Distributor Fees and Expenses. This flows to the Producer.", category: "The Math" },
  { term: "Non-Recourse Loan", def: "A loan secured *only* by the film's potential revenue, not the producer's personal assets.", category: "Finance" },
  { term: "Option", def: "Paying a small fee for the *exclusive right* to buy a script/book later.", category: "Legal" },
  { term: "Output Deal", def: "A contract where a distributor agrees to buy a producer's entire slate of films.", category: "Distribution" },
  { term: "Overage", def: "Costs that exceed the budget.", category: "Finance" },
  { term: "Overhead", def: "A flat fee distributors charge for 'office expenses.' **Trap.**", category: "Finance" },
  { term: "P&A (Prints & Advertising)", def: "Marketing and distribution costs.", category: "Finance" },
  { term: "P&H (Payroll & Health)", def: "Payroll taxes and health/pension contributions required by unions. Added on top of gross wages — typically 20-23% for SAG-AFTRA.", category: "Finance" },
  { term: "Package", def: "The combination of Script, Director, and Cast presented to financiers.", category: "Production" },
  { term: "Pari Passu", def: "'On Equal Footing.' Investors in the same tier get paid back simultaneously.", category: "The Math" },
  { term: "Pay or Play", def: "A guarantee that talent gets paid even if the film is cancelled.", category: "Legal" },
  { term: "Pay-1 / Pay-2", def: "The first and second windows for Premium Cable/Streaming release.", category: "Distribution" },
  { term: "Points", def: "Percentage ownership of the backend.", category: "Legal" },
  { term: "Pre-Sales", def: "Selling distribution rights to territories *before* the film is made to raise money.", category: "Finance" },
  { term: "Premium", def: "A bonus % paid to investors on top of their principal (e.g., 120% recoupment).", category: "Finance" },
  { term: "Producer", def: "The person ultimately responsible for the business and creative outcome of the film.", category: "Roles" },
  { term: "Producer's Rep", def: "An advisor who helps sell the film (distinct from a Sales Agent, usually fee-based).", category: "Roles" },
  { term: "Proof of Funds", def: "Bank document proving an investor actually has the money.", category: "Finance" },
  { term: "Qualifying Expense", def: "Expenses that count toward a Tax Credit calculation (usually in-state spend).", category: "Finance" },
  { term: "Recoupment", def: "Earning back the initial investment. The waterfall determines the order.", category: "The Math", essential: true },
  { term: "Recoupment Schedule", def: "The list showing the order of who gets paid back first.", category: "The Math" },
  { term: "Release Window", def: "The exclusivity period for a specific medium (Theatrical, VOD, etc.).", category: "Distribution" },
  { term: "Residuals", def: "Royalties paid to Guild members (SAG/WGA/DGA) for reruns and secondary markets.", category: "Legal" },
  { term: "Revenue Share", def: "A deal splitting revenue (e.g., 50/50) rather than a flat license fee.", category: "Distribution" },
  { term: "Right of First Refusal", def: "A contractual right to match any offer made by a third party.", category: "Legal" },
  { term: "ROI (Return on Investment)", def: "Profit percentage.", category: "The Math" },
  { term: "SAG-AFTRA", def: "Screen Actors Guild – American Federation of Television and Radio Artists. The primary actors' union.", category: "Roles" },
  { term: "Sales Agent", def: "Broker who sells distribution rights internationally. Takes 10-20% commission off gross.", category: "Roles", essential: true },
  { term: "Sales Agent Marketing", def: "Expenses incurred by the sales agent (travel, markets, posters) to sell the film, usually capped (e.g., $75k). Deducted from gross receipts.", category: "Finance" },
  { term: "Sales Estimates", def: "Projected revenue numbers (High/Low/Take) provided by a Sales Agent to help value the film.", category: "Finance" },
  { term: "Senior Debt", def: "First-position bank loans secured by reliable collateral like tax credits or pre-sale contracts. Lowest risk, paid back first.", category: "Finance", essential: true },
  { term: "Single Picture Accounting", def: "Accounting for one film only, preventing cross-collateralization.", category: "Legal" },
  { term: "Slate", def: "A group of films being produced or financed together by a company or fund.", category: "Production" },
  { term: "SOFR", def: "Secured Overnight Financing Rate. The benchmark interest rate that replaced LIBOR. Senior debt is often priced as SOFR + a margin (e.g., SOFR + 5%).", category: "Finance" },
  { term: "Soft Money", def: "Tax credits, grants, subsidies.", category: "Finance" },
  { term: "Source Material", def: "The original work the film is based on.", category: "Legal" },
  { term: "Sub-Distributor", def: "A local distributor in a specific country hired by the global Sales Agent.", category: "Distribution" },
  { term: "Sunset Clause", def: "A clause that ends a contract or right after a specific time.", category: "Legal" },
  { term: "SVOD (Subscription VOD)", def: "Netflix, Hulu, Prime.", category: "Distribution" },
  { term: "Tax Credit", def: "A government rebate on qualifying production spend in a specific state or country. Ranges from 15-40%.", category: "Finance", essential: true },
  { term: "Territory", def: "A specific geographic region for distribution rights.", category: "Legal" },
  { term: "Theatrical", def: "Cinema release.", category: "Distribution" },
  { term: "Trades", def: "Industry publications (Deadline, Variety, Hollywood Reporter).", category: "Production" },
  { term: "Turnaround", def: "When a studio drops a project and allows the producer to take it elsewhere.", category: "Legal" },
  { term: "TVOD (Transactional VOD)", def: "iTunes, Amazon rental.", category: "Distribution" },
  { term: "Union", def: "Organization representing crew (IATSE, Teamsters). See also *Guilds*.", category: "Roles" },
  { term: "VOD (Video on Demand)", def: "General term for digital streaming/rental.", category: "Distribution" },
  { term: "Waterfall", def: "The priority order in which revenue flows from box office to stakeholders. Money trickles down: Theaters → Distributor → Sales Agent → Lenders → Investors → Producers.", category: "The Math", essential: true },
  { term: "WGA", def: "Writers Guild of America.", category: "Roles" },
  { term: "Windowing", def: "Staggering the release across different platforms to maximize revenue.", category: "Distribution" },
  { term: "Wrap", def: "The end of filming.", category: "Production" },
  { term: "Yield", def: "The actual return on an investment.", category: "The Math" },
];

const SORTED_TERMS = [...RAW_TERMS].sort((a, b) => a.term.localeCompare(b.term));
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ------------------------------------------------------------------
// ASK THE OG — streaming AI question/answer types
// ------------------------------------------------------------------
type AiMessage = {
  id: string;
  question: string;
  answer: string;
  streaming: boolean;
  error?: string;
};

const EXAMPLE_CHIPS = [
  "What is a waterfall?",
  "How does gap financing work?",
  "What is a CAM?",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
const Glossary = () => {
  const navigate = useNavigate();

  // A-Z glossary state
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Ask the OG state
  const [ogInput, setOgInput] = useState("");
  const [ogMessages, setOgMessages] = useState<AiMessage[]>([]);
  const [ogLoading, setOgLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll reveals
  const revTop10 = useReveal();
  const revAz = useReveal();
  const revAsk = useReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── A-Z Derived data ──
  const isSearching = search.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching && !activeLetter) return SORTED_TERMS;
    let results = SORTED_TERMS;
    if (isSearching) {
      const q = search.toLowerCase();
      results = results.filter(t =>
        t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
      );
    }
    if (activeLetter) {
      results = results.filter(t => t.term[0].toUpperCase() === activeLetter);
    }
    return results;
  }, [search, activeLetter, isSearching]);

  const grouped = useMemo(() => {
    const map: Record<string, Term[]> = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    }
    return map;
  }, [filtered]);

  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of SORTED_TERMS) set.add(t.term[0].toUpperCase());
    return set;
  }, []);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(prev => prev === letter ? null : letter);
    if (activeLetter === letter) return;
    setTimeout(() => {
      const el = sectionRefs.current[letter];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // ── Ask the OG streaming ──
  const handleAsk = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || ogLoading) return;

    const id = Date.now().toString();
    const newMsg: AiMessage = { id, question: q, answer: "", streaming: true };
    setOgMessages(prev => [...prev, newMsg]);
    setOgLoading(true);
    setOgInput("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/film-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ question: q }),
      });

      if (!resp.ok) {
        let errorMsg = "Something went wrong. Please try again.";
        try {
          const data = await resp.json();
          if (data.error) errorMsg = data.error;
        } catch {}
        setOgMessages(prev =>
          prev.map(m => m.id === id ? { ...m, streaming: false, error: errorMsg } : m)
        );
        setOgLoading(false);
        return;
      }

      if (!resp.body) {
        setOgMessages(prev =>
          prev.map(m => m.id === id ? { ...m, streaming: false, error: "No response stream." } : m)
        );
        setOgLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              setOgMessages(prev =>
                prev.map(m => m.id === id ? { ...m, answer: m.answer + content } : m)
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              setOgMessages(prev =>
                prev.map(m => m.id === id ? { ...m, answer: m.answer + content } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }

      setOgMessages(prev => prev.map(m => m.id === id ? { ...m, streaming: false } : m));
    } catch (e) {
      setOgMessages(prev =>
        prev.map(m => m.id === id ? { ...m, streaming: false, error: "Network error. Please try again." } : m)
      );
    } finally {
      setOgLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [ogLoading]);

  const handleOgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(ogInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk(ogInput);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-[68px] pb-4 font-sans">

        {/* ═══════════════════════════════════════════════════════════
            PAGE TITLE BLOCK
            ═══════════════════════════════════════════════════════════ */}
        <div className="px-6 md:px-10 pt-4 pb-1">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-3">
              Film Finance
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl tracking-wide text-white leading-none">
              The <span className="text-gold">Glossary</span>
            </h1>
            <p className="text-sm text-white/40 leading-relaxed mt-3 max-w-xl">
              The film industry uses jargon to keep outsiders out. This is your decoder ring — {SORTED_TERMS.length} terms, curated from the front lines.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            ASK THE OG — AI Strip (moved to top)
            ═══════════════════════════════════════════════════════════ */}
        <div
          ref={revAsk.ref}
          style={{
            opacity: revAsk.visible ? 1 : 0,
            transform: revAsk.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <SectionFrame id="ask-the-og">
            <SectionHeader
              eyebrow="AI Search"
              title={
                <span className="flex items-center justify-center gap-3">
                  <Sparkles className="w-7 h-7 text-gold" />
                  ASK THE OG
                </span>
              }
              subtitle="Ask me film industry questions (only.)"
              plainSubtitle
            />

            {/* Example chips */}
            {ogMessages.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAsk(chip)}
                    disabled={ogLoading}
                    style={{ borderRadius: 0 }}
                    className="text-[12px] font-mono uppercase tracking-wider px-4 py-2.5 border border-gold/20 text-gold/50 hover:border-gold/50 hover:text-gold hover:bg-gold/[0.06] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Message history */}
            {ogMessages.length > 0 && (
              <div className="space-y-5 mb-6">
                {ogMessages.map(msg => (
                  <div key={msg.id} className="space-y-3">
                    {/* Question */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] px-4 py-2.5 border border-gold/20 bg-gold/[0.06] text-[15px] text-white/85"
                        style={{ borderRadius: 0 }}
                      >
                        {msg.question}
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="flex justify-start">
                      <div
                        className="max-w-[95%] border border-white/[0.08] bg-white/[0.02] overflow-hidden"
                        style={{ borderRadius: 0 }}
                      >
                        {/* Answer header bar */}
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-gold/[0.03]">
                          <Sparkles className="w-3 h-3 text-gold/60" />
                          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-gold/50">
                            The OG
                          </span>
                          {msg.streaming && (
                            <div className="flex gap-1 ml-auto">
                              <div className="w-1 h-1 bg-gold/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-1 h-1 bg-gold/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-1 h-1 bg-gold/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          )}
                        </div>
                        {/* Answer content */}
                        <div className="px-4 py-3">
                          {msg.error ? (
                            <p className="text-[15px] text-gold/50 leading-relaxed">{msg.error}</p>
                          ) : (
                            <p className="text-[16px] text-white/90 leading-[1.8] whitespace-pre-wrap">
                              {msg.answer}
                              {msg.streaming && !msg.answer && (
                                <span className="text-white/20">Thinking…</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleOgSubmit} className="relative">
              <div className="flex gap-0 border border-gold/20 focus-within:border-gold/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={ogInput}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setOgInput(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a film industry question…"
                  rows={2}
                  disabled={ogLoading}
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/20 focus:outline-none text-base resize-none disabled:opacity-50 min-h-[52px]"
                  style={{ borderRadius: 0 }}
                />
                <button
                  type="submit"
                  disabled={!ogInput.trim() || ogLoading}
                  style={{ borderRadius: 0 }}
                  className="px-5 bg-gold/[0.06] border-l border-gold/20 text-gold hover:bg-gold/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <SendHorizonal className="w-4 h-4" />
                  <span className="font-bebas text-base tracking-wider hidden sm:block">ASK</span>
                </button>
              </div>
              {/* Character counter */}
              <div className="flex items-center justify-between mt-1.5 px-1">
                <p className="text-[10px] text-white/15 font-mono">
                  Press Enter to send · Shift+Enter for new line
                </p>
                <span className={cn(
                  "text-[10px] font-mono tabular-nums",
                  ogInput.length > 450 ? "text-gold/60" : "text-white/15"
                )}>
                  {ogInput.length}/500
                </span>
              </div>
            </form>
          </SectionFrame>
        </div>

        {ogMessages.length === 0 && (
          <>
            <div className="py-2" />

            {/* ═══════════════════════════════════════════════════════════
                TOP 10 MUST-KNOW TERMS
                ═══════════════════════════════════════════════════════════ */}
            <div
              ref={revTop10.ref}
              style={{
                opacity: revTop10.visible ? 1 : 0,
                transform: revTop10.visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <SectionFrame id="top10">
                <SectionHeader
                  eyebrow="The Essential 10"
                  title="KNOW THESE FIRST"
                  subtitle="Master these 10 terms and you'll understand 80% of any deal conversation."
                  plainSubtitle
                />
                <div className="space-y-3 mt-6">
                  {TOP_10.map((item, i) => (
                    <div
                      key={item.num}
                      className="group flex gap-4 border border-white/[0.06] hover:border-gold/20 bg-white/[0.02] hover:bg-gold/[0.03] transition-all duration-300 p-5"
                      style={{
                        opacity: revTop10.visible ? 1 : 0,
                        transform: revTop10.visible ? "translateY(0)" : "translateY(16px)",
                        transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
                      }}
                    >
                      {/* Number badge */}
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gold/20 bg-gold/[0.06]">
                        <span className="font-mono tabular-nums text-sm font-bold text-gold/70">
                          {item.num}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap mb-1">
                          <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-gold transition-colors">
                            {item.term}
                          </h3>
                          <span className="text-[9px] uppercase tracking-[0.15em] text-gold/40 font-mono">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[15px] text-white/65 leading-relaxed">
                          {item.def}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionFrame>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════
            A–Z GLOSSARY
            ═══════════════════════════════════════════════════════════ */}
        <div
          ref={revAz.ref}
          style={{
            opacity: revAz.visible ? 1 : 0,
            transform: revAz.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <SectionFrame id="az-glossary">
            <SectionHeader
              eyebrow={`${SORTED_TERMS.length} Terms`}
              title="A–Z GLOSSARY"
              plainSubtitle
            />

            {/* Gold search bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gold/40" />
              </div>
              <input
                type="text"
                placeholder={`Search ${SORTED_TERMS.length} terms…`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
                className="block w-full pl-11 pr-16 py-3.5 border border-gold/20 bg-gold/[0.04] text-white placeholder-white/25 focus:outline-none focus:border-gold/50 focus:bg-gold/[0.07] text-base transition-all"
                style={{ borderRadius: 0 }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold text-[11px] uppercase tracking-wider font-mono transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Alphabet rail */}
            <div className="sticky top-14 z-20 bg-black/95 backdrop-blur-sm border-b border-gold/10 py-2.5 -mx-7 px-7 mb-4 md:-mx-10 md:px-10">
              <div className="flex flex-wrap gap-0.5 justify-center">
                {ALPHABET.map(letter => {
                  const hasTerms = activeLetters.has(letter);
                  const isActive = activeLetter === letter;
                  return (
                    <button
                      key={letter}
                      disabled={!hasTerms}
                      onClick={() => { scrollToLetter(letter); setSearch(""); }}
                      style={{ borderRadius: 0 }}
                      className={cn(
                        "flex-1 max-w-[36px] h-9 text-[11px] font-semibold transition-all",
                        !hasTerms && "text-white/10 cursor-default",
                        hasTerms && !isActive && "text-white/35 hover:text-gold hover:bg-gold/[0.08]",
                        isActive && "bg-gold/20 text-gold border border-gold/30"
                      )}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms grouped by letter */}
            <div className="pt-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-white/30 text-sm">No terms found for "{search}"</p>
                  <button
                    onClick={() => { setSearch(""); setActiveLetter(null); }}
                    className="text-gold/60 hover:text-gold text-xs mt-2 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                Object.entries(grouped).map(([letter, terms]) => (
                  <div
                    key={letter}
                    ref={(el) => { sectionRefs.current[letter] = el; }}
                    className="scroll-mt-28"
                  >
                    {/* Letter divider */}
                    <div className="flex items-center gap-3 pt-6 pb-3">
                      <span className="font-bebas text-2xl text-gold/50 w-7 text-center leading-none">{letter}</span>
                      <div
                        className="flex-1 h-[1px]"
                        style={{ background: "linear-gradient(to right, rgba(212,175,55,0.2), transparent)" }}
                      />
                      <span className="text-[10px] text-white/20 tabular-nums font-mono">{terms.length}</span>
                    </div>

                    {/* Terms */}
                    {terms.map(t => {
                      const isLong = t.def.length > 120;
                      const isExpanded = expanded === t.term;
                      return (
                        <div
                          key={t.term}
                          className={cn(
                            "group border-l-2 border-transparent hover:border-gold/25 pl-4 py-3 -ml-[2px] transition-all cursor-default",
                            t.essential && "border-gold/10"
                          )}
                          onClick={() => isLong && setExpanded(isExpanded ? null : t.term)}
                        >
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <h3 className="text-[15px] font-semibold text-white/90 leading-tight group-hover:text-white transition-colors">
                              {t.term}
                            </h3>
                            <span className="text-[9px] uppercase tracking-[0.12em] font-mono text-gold/35">
                              {t.category}
                            </span>
                          </div>
                          <p className={cn(
                            "text-[14px] text-white/55 leading-relaxed mt-1",
                            isLong && !isExpanded && "line-clamp-2"
                          )}>
                            {t.def}
                          </p>
                          {isLong && (
                            <button className="flex items-center gap-1 text-[10px] text-white/20 hover:text-gold/40 mt-1 transition-colors">
                              <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                              {isExpanded ? "Less" : "More"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </SectionFrame>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <div className="pt-6 mx-6 border-t border-white/[0.05] text-center space-y-4">
          <p className="text-xs text-white/20 max-w-sm mx-auto leading-relaxed">
            This glossary is a living document. Spot an error or want to suggest a term?
          </p>
          <a
            href="mailto:thefilmmaker.og@gmail.com"
            className="inline-block text-white/20 hover:text-white/40 transition-colors text-xs font-mono"
          >
            thefilmmaker.og@gmail.com
          </a>
          <div className="pt-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mx-auto text-white/20 hover:text-white/40 transition-colors uppercase tracking-[0.16em] text-[10px] font-semibold"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Home
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Glossary;
