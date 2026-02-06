import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ArrowLeft, Search, Book } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// THE GLOSSARY DATA
// ------------------------------------------------------------------
type Term = {
  term: string;
  def: string;
  category: "Roles" | "Finance" | "Distribution" | "Legal" | "The Math";
};

const TERMS: Term[] = [
  // --- ROLES ---
  {
    term: "Executive Producer (EP)",
    def: "Usually the person who found the money or the script. They rarely handle physical production. In indie film, 'EP' is often the title given to a major investor.",
    category: "Roles"
  },
  {
    term: "Line Producer",
    def: "The CEO of the physical production. They manage the budget, the schedule, and the crew. They protect the 'Below the Line' costs.",
    category: "Roles"
  },
  {
    term: "Sales Agent",
    def: "The broker who represents your film to distributors globally. They take a commission (10-25%) and charge expenses. A good one is worth their weight in gold; a bad one will bury your film.",
    category: "Roles"
  },
  
  // --- FINANCE ---
  {
    term: "Above the Line (ATL)",
    def: "The costs for the 'Creative' elements: Writer, Director, Producer, and Principal Cast. These are usually fixed fees.",
    category: "Finance"
  },
  {
    term: "Below the Line (BTL)",
    def: "The costs for the 'Physical' production: Crew, Equipment, Locations, Insurance, Food. This is the hard cost of making the movie.",
    category: "Finance"
  },
  {
    term: "Completion Bond",
    def: "An insurance policy that guarantees the film will be finished and delivered. Banks require this before lending Senior Debt. The bonder can take over the film if you go over budget.",
    category: "Finance"
  },
  {
    term: "Contingency",
    def: "An emergency buffer (usually 10% of the budget) required by bond companies and lenders. You should plan to spend it, but hope you don't.",
    category: "Finance"
  },
  {
    term: "P&A (Prints & Advertising)",
    def: "The money spent to market and distribute the film. In a traditional deal, the distributor spends this and recoups it *before* paying the producer.",
    category: "Finance"
  },
  {
    term: "Soft Money",
    def: "Funding that doesn't need to be paid back directly or is easily recouped. Examples: Tax Credits, Grants, Crowdfunding.",
    category: "Finance"
  },

  // --- THE MATH (From Calculator) ---
  {
    term: "Waterfall",
    def: "The strict order of priority in which revenue is distributed. Money fills the top buckets (Debt, Expenses) before trickling down to the bottom (Net Profit).",
    category: "The Math"
  },
  {
    term: "Pari Passu",
    def: "Latin for 'On Equal Footing.' When two investors in the same tier get paid back at the same time, proportional to their investment amount.",
    category: "The Math"
  },
  {
    term: "Cross-Collateralization",
    def: "A trap where a distributor uses the profits from your movie to pay for the losses of *another* movie in their library. Always require 'Single Picture Accounting'.",
    category: "The Math"
  },
  {
    term: "Recoupment",
    def: "The point at which an investor gets their initial principal back. 'ROI' happens only *after* recoupment.",
    category: "The Math"
  },

  // --- LEGAL / DEALS ---
  {
    term: "Favored Nations (MFN)",
    def: "A clause ensuring fairness. It says: 'If you give anyone else a better deal (more money, better credit), you have to give it to me too.'",
    category: "Legal"
  },
  {
    term: "Pay or Play",
    def: "A guarantee that talent gets paid their fee even if the movie gets cancelled or they are replaced. A sign of A-list leverage.",
    category: "Legal"
  },
  {
    term: "Minimum Guarantee (MG)",
    def: "An upfront cash advance paid by a distributor for the rights to your film. This is the 'bird in the hand' money.",
    category: "Legal"
  },
  {
    term: "Points",
    def: "Percentage ownership of the backend (Net Profit). '5 Points' = 5% of the Producer's Pool.",
    category: "Legal"
  },

  // --- DISTRIBUTION ---
  {
    term: "Day and Date",
    def: "Releasing a film in theaters and on VOD (Video on Demand) on the exact same day. Good for marketing efficiency, bad for theater chains.",
    category: "Distribution"
  },
  {
    term: "Windowing",
    def: "The strategy of releasing in stages (Theatrical -> Airline -> VOD -> Subscription Streaming) to maximize price discrimination.",
    category: "Distribution"
  },
  {
    term: "SVOD / AVOD / TVOD",
    def: "Streaming Video on Demand. SVOD = Subscription (Netflix). AVOD = Ad-based (Tubi). TVOD = Transactional (iTunes rental).",
    category: "Distribution"
  }
];

const Glossary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTerms = TERMS.filter(t => 
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
              <span className="text-xs font-bold uppercase tracking-widest">The Black Book</span>
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
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-border-subtle rounded-md leading-5 bg-bg-elevated text-text-primary placeholder-text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 sm:text-sm transition-all"
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
                  className="group bg-bg-surface border border-border-default hover:border-gold/30 rounded-lg p-6 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                      {item.term}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-text-dim bg-bg-elevated px-2 py-1 rounded">
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

          {/* Footer Action */}
          <div className="pt-8 flex justify-center">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-text-dim hover:text-gold transition-colors uppercase tracking-widest text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Return
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Glossary;
