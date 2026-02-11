import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ArrowLeft, Search, Book, Mail, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// THE GLOSSARY DATA (FINAL MASTER LIST - 100+ TERMS)
// ------------------------------------------------------------------
type Term = {
  term: string;
  def: string;
  category: "Roles" | "Finance" | "Distribution" | "Legal" | "The Math" | "Production";
};

// Raw data - we will sort it alphabetically on render
const RAW_TERMS: Term[] = [
  // A
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
  
  // B
  { term: "Back End", def: "Net profits payable to participants *after* all recoupment. Also called 'Net Profit Participation.'", category: "The Math" },
  { term: "Bankable", def: "Talent (Actor/Director) whose name alone can secure financing or pre-sales.", category: "Roles" },
  { term: "Below the Line (BTL)", def: "Physical production costs: Crew, Equipment, Locations, Insurance, Food. The 'hard' costs.", category: "Finance" },
  { term: "Box Office", def: "The total money spent by the public on tickets. The studio only keeps ~50% of this (the rest goes to the theater).", category: "Finance" },
  { term: "Breakage", def: "Extra costs incurred by a distributor to format a film for a specific broadcaster or territory.", category: "Distribution" },
  { term: "Breakeven", def: "The exact revenue number needed to pay back all debts, equity, and fees. The 'Zero' point.", category: "The Math" },
  { term: "Budget", def: "The total projected cost to produce the film.", category: "Finance" },
  { term: "Burn Rate", def: "The rate at which a production spends money during shooting.", category: "Finance" },

  // C
  { term: "Call Sheet", def: "The daily schedule listing call times, locations, and scenes for cast and crew.", category: "Production" },
  { term: "CAM (Collection Account Manager)", def: "A neutral third party that receives revenue and distributes it. Takes ~1% off the top. Essential for transparency.", category: "Roles" },
  { term: "Capped Expenses", def: "A negotiated limit on how much a distributor can deduct for marketing/expenses. **Critical.**", category: "Legal" },
  { term: "Cash Flow", def: "The schedule of when money is needed vs. when it is available.", category: "Finance" },
  { term: "Chain of Title", def: "The stack of legal documents proving you own the rights to the script, music, and film. You cannot sell a film without this.", category: "Legal" },
  { term: "Completion Bond", def: "Insurance that guarantees the film will be finished. Banks require this for Senior Debt.", category: "Finance" },
  { term: "Completion Guarantor", def: "The company issuing the bond. They can seize control of the film if you go over budget.", category: "Roles" },
  { term: "Contingency", def: "An emergency buffer (usually 10% of budget). You should plan to spend it.", category: "Finance" },
  { term: "Co-Production", def: "A joint venture between two production companies (often from different countries) to access tax incentives and funding.", category: "Production" },
  { term: "Corridor (Producer's Corridor)", def: "A % of first-dollar gross reserved for the producer, paid *before* expenses. Rare and powerful.", category: "The Math" },
  { term: "Cross-Collateralization", def: "**TRAP.** When a distributor uses profits from Film A to pay for losses on Film B. Always require 'Single Picture Accounting.'", category: "Legal" },

  // D
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

  // E
  { term: "E&O Insurance (Errors & Omissions)", def: "Liability insurance against copyright/libel claims. Distributors require this to release.", category: "Production" },
  { term: "Equity", def: "Investment for ownership. High risk, paid last, but keeps owning a piece forever.", category: "Finance" },
  { term: "Escrow", def: "A holding account where funds are kept until specific conditions are met (e.g., Cast is signed).", category: "Finance" },
  { term: "Executive Producer (EP)", def: "Usually the person who secured the funding or the IP. Rarely handles physical production.", category: "Roles" },
  { term: "Exclusivity", def: "A window of time where a film can *only* be shown on one specific platform.", category: "Legal" },

  // F
  { term: "Favored Nations (MFN)", def: "A clause ensuring fairness: 'If you give anyone else a better deal, I get it too.'", category: "Legal" },
  { term: "Final Cut", def: "The right to decide the final version of the film released. Usually held by the Financier or Distributor, rarely the Director (unless A-list).", category: "Legal" },
  { term: "Finance Plan", def: "The document showing exactly where every dollar of the budget is coming from (Tax Credits, Presales, Equity, Gap).", category: "Finance" },
  { term: "First Dollar Gross", def: "The most advantageous participation. You get paid from the very first dollar of revenue, before *any* deductions.", category: "The Math" },
  { term: "First Look Deal", def: "A contract giving a studio the first right to finance/distribute a producer's next project.", category: "Legal" },
  { term: "Force Majeure", def: " 'Act of God.' A clause allowing cancellation of a contract due to unforeseen events (War, Pandemic).", category: "Legal" },
  { term: "Foreign Sales Agent", def: "Represents the film to distributors outside the domestic territory.", category: "Roles" },
  { term: "Four-Wall", def: "Renting a theater yourself to show your film. You keep 100% of the box office (minus rental).", category: "Distribution" },
  { term: "Fringes", def: "The payroll taxes and union benefits added on top of a crew member's salary (usually +20-30%).", category: "Finance" },

  // G
  { term: "Gap Financing", def: "High-interest loans covering the 'gap' between confirmed funding (Tax credits/Presales) and the Budget.", category: "Finance" },
  { term: "Greenlight", def: "The official 'Go' signal that financing is closed and production can begin.", category: "Production" },
  { term: "Gross Receipts", def: "Total revenue collected by the distributor from all sources.", category: "Distribution" },
  { term: "Guilds", def: "The unions (SAG, DGA, WGA, IATSE) that set minimum rates and rules.", category: "Roles" },

  // H
  { term: "Hard Costs", def: "Actual cash spent on production (equipment, film stock), as opposed to Soft Costs (fees, legal).", category: "Finance" },
  { term: "Holdback", def: "A period where you are *prevented* from releasing the film on a certain platform (e.g., 'No VOD for 90 days after Theatrical').", category: "Legal" },

  // I
  { term: "Interest", def: "The cost of borrowing money. Accrues daily.", category: "Finance" },
  { term: "Independent Film", def: "A film produced outside the major studio system.", category: "Production" },
  { term: "IP (Intellectual Property)", def: "The underlying work (Book, Script, Life Rights) the film is based on.", category: "Legal" },

  // K
  { term: "Key Art", def: "The main promotional image/poster.", category: "Production" },

  // L
  { term: "Letter of Intent (LOI)", def: "A formal (but often non-binding) letter from an actor or distributor expressing interest in the project.", category: "Legal" },
  { term: "License Fee", def: "A flat fee paid by a broadcaster/streamer to show the film for a set time (e.g., Netflix pays $100k for 2 years).", category: "Distribution" },
  { term: "Lien", def: "A legal claim on the film's assets used by lenders to secure their loan.", category: "Legal" },
  { term: "Line Producer", def: "The 'CEO' of the physical production. Manages the budget and schedule day-to-day.", category: "Roles" },
  { term: "LLC (Limited Liability Company)", def: "The standard corporate structure for a single film (Single Purpose Vehicle) to protect the producers personally.", category: "Legal" },

  // M
  { term: "Marketing Cap", def: "The maximum amount a distributor is allowed to spend (and deduct) on P&A. Also known as Sales Agent Marketing expenses.", category: "Legal" },
  { term: "Master", def: "The highest quality final version of the film.", category: "Production" },
  { term: "Minimum Guarantee (MG)", def: "Cash advance from a distributor.", category: "Finance" },
  { term: "Mezzanine Financing", def: "See *Gap Financing*.", category: "Finance" },
  { term: "Moral Rights", def: "The right of an author to protect the integrity of their work (harder to waive in Europe than the US).", category: "Legal" },

  // N
  { term: "Negative Cost", def: "The actual cost to produce the finished film (master), excluding marketing/distribution. $2M negative cost (all-in budget).", category: "Finance" },
  { term: "Net Profit", def: "Money remaining after *everyone* (Distributor, Lenders, Investors) has been paid.", category: "The Math" },
  { term: "Net Receipts", def: "Gross Receipts minus Distributor Fees and Expenses. This flows to the Producer.", category: "The Math" },
  { term: "Non-Recourse Loan", def: "A loan secured *only* by the film's potential revenue, not the producer's personal assets.", category: "Finance" },

  // O
  { term: "Option", def: "Paying a small fee for the *exclusive right* to buy a script/book later.", category: "Legal" },
  { term: "Output Deal", def: "A contract where a distributor agrees to buy a producer's entire slate of films.", category: "Distribution" },
  { term: "Overage", def: "Costs that exceed the budget.", category: "Finance" },
  { term: "Overhead", def: "A flat fee distributors charge for 'office expenses.' **Trap.**", category: "Finance" },

  // P
  { term: "P&A (Prints & Advertising)", def: "Marketing and distribution costs.", category: "Finance" },
  { term: "Package", def: "The combination of Script, Director, and Cast presented to financiers.", category: "Production" },
  { term: "Pari Passu", def: " 'On Equal Footing.' Investors in the same tier get paid back simultaneously.", category: "The Math" },
  { term: "Pay or Play", def: "A guarantee that talent gets paid even if the film is cancelled.", category: "Legal" },
  { term: "Pay-1 / Pay-2", def: "The first and second windows for Premium Cable/Streaming release.", category: "Distribution" },
  { term: "Points", def: "Percentage ownership of the backend.", category: "Legal" },
  { term: "Pre-Sales", def: "Selling distribution rights to territories *before* the film is made to raise money.", category: "Finance" },
  { term: "Premium", def: "A bonus % paid to investors on top of their principal (e.g., 120% recoupment).", category: "Finance" },
  { term: "Producer", def: "The person ultimately responsible for the business and creative outcome of the film.", category: "Roles" },
  { term: "Producer's Rep", def: "An advisor who helps sell the film (distinct from a Sales Agent, usually fee-based).", category: "Roles" },
  { term: "Proof of Funds", def: "Bank document proving an investor actually has the money.", category: "Finance" },

  // Q
  { term: "Qualifying Expense", def: "Expenses that count toward a Tax Credit calculation (usually in-state spend).", category: "Finance" },

  // R
  { term: "Recoupment", def: "Earning back the initial investment.", category: "The Math" },
  { term: "Recoupment Schedule", def: "The list showing the order of who gets paid back first.", category: "The Math" },
  { term: "Release Window", def: "The exclusivity period for a specific medium (Theatrical, VOD, etc.).", category: "Distribution" },
  { term: "Residuals", def: "Royalties paid to Guild members (SAG/WGA/DGA) for reruns and secondary markets.", category: "Legal" },
  { term: "Revenue Share", def: "A deal splitting revenue (e.g., 50/50) rather than a flat license fee.", category: "Distribution" },
  { term: "Right of First Refusal", def: "A contractual right to match any offer made by a third party.", category: "Legal" },
  { term: "ROI (Return on Investment)", def: "Profit percentage.", category: "The Math" },

  // S
  { term: "SAG-AFTRA", def: "Screen Actors Guild.", category: "Roles" },
  { term: "Sales Agent", def: "Broker who sells rights internationally.", category: "Roles" },
  { term: "Sales Agent Marketing", def: "Expenses incurred by the sales agent (travel, markets, posters) to sell the film, usually capped (e.g., $75k). Deducted from gross receipts.", category: "Finance" },
  { term: "Sales Estimates", def: "Projected revenue numbers (High/Low/Take) provided by a Sales Agent to help value the film.", category: "Finance" },
  { term: "Senior Debt", def: "First-position bank loans.", category: "Finance" },
  { term: "Single Picture Accounting", def: "Accounting for one film only, preventing cross-collateralization.", category: "Legal" },
  { term: "Soft Money", def: "Tax credits, grants, subsidies.", category: "Finance" },
  { term: "Source Material", def: "The original work the film is based on.", category: "Legal" },
  { term: "Sub-Distributor", def: "A local distributor in a specific country hired by the global Sales Agent.", category: "Distribution" },
  { term: "Sunset Clause", def: "A clause that ends a contract or right after a specific time.", category: "Legal" },
  { term: "SVOD (Subscription VOD)", def: "Netflix, Hulu, Prime.", category: "Distribution" },

  // T
  { term: "Tax Credit", def: "A government rebate on production spend.", category: "Finance" },
  { term: "Territory", def: "A specific geographic region for distribution rights.", category: "Legal" },
  { term: "Theatrical", def: "Cinema release.", category: "Distribution" },
  { term: "Trades", def: "Industry publications (Deadline, Variety, Hollywood Reporter).", category: "Production" },
  { term: "Turnaround", def: "When a studio drops a project and allows the producer to take it elsewhere.", category: "Legal" },
  { term: "TVOD (Transactional VOD)", def: "iTunes, Amazon rental.", category: "Distribution" },

  // U
  { term: "Union", def: "Organization representing crew (IATSE, Teamsters). See also *Guilds*.", category: "Roles" },

  // V
  { term: "VOD (Video on Demand)", def: "General term for digital streaming/rental.", category: "Distribution" },

  // W
  { term: "Waterfall", def: "The priority order of payments.", category: "The Math" },
  { term: "WGA", def: "Writers Guild of America.", category: "Roles" },
  { term: "Windowing", def: "Staggering the release across different platforms to maximize revenue.", category: "Distribution" },
  { term: "Wrap", def: "The end of filming.", category: "Production" },

  // Y
  { term: "Yield", def: "The actual return on an investment.", category: "The Math" }
];

// ------------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------------

// Sort alphabetically by term
const SORTED_TERMS = RAW_TERMS.sort((a, b) => a.term.localeCompare(b.term));

const Glossary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTerms = SORTED_TERMS.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.def.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-12 px-4 md:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col gap-6 border-b border-border-default pb-8">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Book className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">The Black Book</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
              Protocol <span className="text-gold">Glossary</span>
            </h1>
            
            <p className="text-xl text-text-mid leading-relaxed max-w-2xl">
              The film industry uses jargon to keep outsiders out. This is your decoder ring.
              Knowing these terms is the difference between looking like a novice and looking like a closer.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-dim" />
              </div>
              <input
                type="text"
                placeholder="Search 100+ terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-border-subtle rounded-md leading-5 bg-bg-elevated text-text-primary placeholder-text-dim focus:outline-none focus:border-border-active focus:shadow-focus sm:text-sm transition-all"
              />
            </div>
          </div>

          {/* Terms List */}
          <div className="grid gap-4">
            {filteredTerms.length === 0 ? (
              <div className="py-12 text-center text-text-dim">
                No terms found for "{searchTerm}"
              </div>
            ) : (
              filteredTerms.map((item, idx) => (
                <div 
                  key={idx}
                  className="group bg-bg-surface border border-border-default hover:border-border-active rounded-lg p-6 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-text-primary transition-colors">
                      {item.term}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-text-dim bg-bg-elevated px-2 py-1 rounded w-fit">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-text-mid leading-relaxed text-sm md:text-base">
                    {item.def}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-12 border-t border-border-default space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-2 text-gold">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Questions or Corrections?</span>
              </div>
              <p className="text-sm text-text-mid max-w-md">
                This glossary is a living document. If you spot an error or want to suggest a term, email us:
              </p>
              <a 
                href="mailto:thefilmmaker.og@gmail.com" 
                className="text-text-dim hover:text-text-mid transition-colors text-sm font-mono"
              >
                thefilmmaker.og@gmail.com
              </a>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-text-dim hover:text-text-mid transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Glossary;
