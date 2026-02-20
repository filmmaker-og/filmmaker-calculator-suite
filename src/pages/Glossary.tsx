import { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import { SendHorizonal, Sparkles, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ------------------------------------------------------------------
// SCROLL REVEAL HOOK
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
// TOP 10 MUST-KNOW TERMS
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
    term: "Cross-Collateral.",
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
    term: "CAM",
    category: "Roles",
    def: "Collection Account Manager. A neutral third party that receives all revenue and distributes it according to the agreed waterfall. Takes approximately 1% off the top. Essential for transparency and investor confidence. Without a CAM, you're trusting a distributor to pay everyone correctly.",
  },
];

// ------------------------------------------------------------------
// ASK THE OG — streaming AI types
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
  // Ask the OG state
  const [ogInput, setOgInput] = useState("");
  const [ogMessages, setOgMessages] = useState<AiMessage[]>([]);
  const [ogLoading, setOgLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pill modal state
  const [selectedTerm, setSelectedTerm] = useState<Top10Term | null>(null);

  // Scroll reveals
  const revTop10 = useReveal();
  const revAsk = useReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
    } catch {
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

  const handleReset = () => {
    setOgMessages([]);
    setOgInput("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pb-8 font-sans">

        {/* ═══════════════════════════════════════════════════════════
            PAGE TITLE BLOCK
            ═══════════════════════════════════════════════════════════ */}
        <div className="px-6 md:px-10 pt-2 pb-1">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60 mb-3">
              Film Finance
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl tracking-wide text-white leading-none">
              The <span className="text-gold">Resource</span>
            </h1>
            <p className="text-sm text-white/40 leading-relaxed mt-3 max-w-xl">
              The film industry uses jargon to keep outsiders out. This is your definitive resource.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            ASK THE OG — Redesigned AI Bot
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

            {/* Bot identity header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {/* Gold accent strip + label */}
                <div className="flex items-center gap-2.5 bg-gold px-3 py-1.5" style={{ borderRadius: 0 }}>
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span className="font-bebas text-sm tracking-[0.22em] text-black leading-none">ASK THE OG</span>
                </div>
                <span className="text-[11px] text-white/30 font-mono uppercase tracking-widest hidden sm:block">
                  Film industry Q&A
                </span>
              </div>
              {/* Reset button — only when there's a conversation */}
              {ogMessages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/20 hover:text-gold/60 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start Over
                </button>
              )}
            </div>

            {/* Example chips — only before first message */}
            {ogMessages.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-5 justify-center">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAsk(chip)}
                    disabled={ogLoading}
                    style={{ borderRadius: 0 }}
                    className="text-[12px] font-mono uppercase tracking-wider px-4 py-2.5 border border-gold/25 bg-gold/[0.06] text-gold/60 hover:border-gold/60 hover:text-gold hover:bg-gold/[0.12] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Message history */}
            {ogMessages.length > 0 && (
              <div className="space-y-5 mb-5">
                {ogMessages.map(msg => (
                  <div key={msg.id} className="space-y-3">
                    {/* Question bubble */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] px-4 py-3 border border-gold/30 bg-gold/[0.10] text-[15px] text-white/90"
                        style={{ borderRadius: 0 }}
                      >
                        {msg.question}
                      </div>
                    </div>

                    {/* Answer card */}
                    <div className="flex justify-start">
                      <div
                        className="max-w-[95%] border border-gold/20 overflow-hidden"
                        style={{ borderRadius: 0, background: "#0D0900", boxShadow: "0 0 32px rgba(212,175,55,0.06)" }}
                      >
                        {/* Answer header — solid gold bar */}
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-gold">
                          <Sparkles className="w-3 h-3 text-black" />
                          <span className="font-bebas text-xs tracking-[0.2em] text-black leading-none">THE OG</span>
                          {msg.streaming && (
                            <div className="flex gap-1 ml-auto">
                              <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "0ms", borderRadius: 0 }} />
                              <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "150ms", borderRadius: 0 }} />
                              <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "300ms", borderRadius: 0 }} />
                            </div>
                          )}
                        </div>
                        {/* Answer content */}
                        <div className="px-4 py-4">
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
              <div
                className="flex gap-0 border border-gold/40 focus-within:border-gold transition-colors"
                style={{ borderLeft: "3px solid hsl(var(--gold))" }}
              >
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
                  className="px-5 bg-gold text-black font-bebas tracking-wider hover:bg-gold/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <SendHorizonal className="w-4 h-4" />
                  <span className="text-base hidden sm:block">ASK</span>
                </button>
              </div>
              {/* Character counter only */}
              <div className="flex items-center justify-end mt-1.5 px-1">
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

        {/* ═══════════════════════════════════════════════════════════
            TOP 10 — 2×5 PILL GRID (only when no OG conversation)
            ═══════════════════════════════════════════════════════════ */}
        {ogMessages.length === 0 && (
          <>
            <div className="py-2" />
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
                  plainSubtitle
                />

                {/* 2×5 pill grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {TOP_10.map((item, i) => (
                    <button
                      key={item.num}
                      onClick={() => setSelectedTerm(item)}
                      style={{
                        borderRadius: 0,
                        opacity: revTop10.visible ? 1 : 0,
                        transform: revTop10.visible ? "translateY(0)" : "translateY(12px)",
                        transition: `opacity 0.45s ease ${i * 0.04}s, transform 0.45s ease ${i * 0.04}s`,
                      }}
                      className="group flex items-center gap-3 px-3 py-3 border border-white/[0.08] bg-white/[0.02] hover:border-gold/40 hover:bg-gold/[0.06] transition-all text-left"
                    >
                      {/* Number badge */}
                      <span className="font-mono text-[11px] font-bold text-gold/50 group-hover:text-gold/80 transition-colors flex-shrink-0 tabular-nums leading-none">
                        {item.num}
                      </span>
                      {/* Term name */}
                      <span className="font-bebas text-[17px] tracking-wide text-white/80 group-hover:text-white transition-colors leading-none truncate">
                        {item.term}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-center text-[10px] text-white/15 font-mono uppercase tracking-widest mt-4">
                  Tap any term to read the definition
                </p>
              </SectionFrame>
            </div>
          </>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════
          TERM DEFINITION MODAL
          ═══════════════════════════════════════════════════════════ */}
      <Dialog open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
        <DialogContent
          className="p-0 overflow-hidden border-gold/30 max-w-[calc(100vw-2rem)] w-full sm:max-w-lg [&>button:last-child]:hidden"
          style={{ borderRadius: 0, background: "#0D0900", boxShadow: "0 0 60px rgba(212,175,55,0.10)" }}
        >
          {selectedTerm && (
            <>
              {/* Modal gold header bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-gold">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-bold text-black/60 tabular-nums">
                    {selectedTerm.num}
                  </span>
                  <span className="font-bebas text-xl tracking-[0.15em] text-black leading-none">
                    {selectedTerm.term}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.15em] font-mono text-black/50 hidden sm:block">
                    {selectedTerm.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-black/50 hover:text-black transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Definition */}
              <div className="px-5 py-5">
                <p className="text-[16px] text-white/85 leading-[1.8]">
                  {selectedTerm.def}
                </p>
              </div>

              {/* Footer nav — prev / next */}
              <div className="flex border-t border-white/[0.06]">
                {(() => {
                  const idx = TOP_10.findIndex(t => t.num === selectedTerm.num);
                  const prev = idx > 0 ? TOP_10[idx - 1] : null;
                  const next = idx < TOP_10.length - 1 ? TOP_10[idx + 1] : null;
                  return (
                    <>
                      <button
                        onClick={() => prev && setSelectedTerm(prev)}
                        disabled={!prev}
                        className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider text-white/20 hover:text-gold/60 hover:bg-gold/[0.04] disabled:opacity-0 transition-all text-left pl-5"
                      >
                        ← {prev?.term}
                      </button>
                      <div className="w-[1px] bg-white/[0.06]" />
                      <button
                        onClick={() => next && setSelectedTerm(next)}
                        disabled={!next}
                        className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider text-white/20 hover:text-gold/60 hover:bg-gold/[0.04] disabled:opacity-0 transition-all text-right pr-5"
                      >
                        {next?.term} →
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Glossary;
