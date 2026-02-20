import { useState, useRef, useCallback, useEffect } from "react";
import { SendHorizonal, RotateCcw, X } from "lucide-react";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   OG BOT SHEET — Global FAB + bottom sheet AI chat
   Accessible on every page from the gold floating button
   ═══════════════════════════════════════════════════════════════════ */

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

interface OgBotSheetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const OgBotSheet = ({ isOpen: controlledOpen, onOpenChange }: OgBotSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };
  const [ogInput, setOgInput] = useState("");
  const [ogMessages, setOgMessages] = useState<AiMessage[]>([]);
  const [ogLoading, setOgLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Swipe-to-dismiss
  const touchStartY = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 60) setIsOpen(false);
    touchStartY.current = null;
  };

  // Scroll to bottom when sheet opens with existing messages
  useEffect(() => {
    if (isOpen && ogMessages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 350);
    }
  }, [isOpen, ogMessages.length]);

  // ── Streaming ask ──
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
      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[170] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Bottom Sheet ── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[180] transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          height: "min(72vh, 580px)",
          paddingBottom: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
          background: "#000000",
          // Ambient glow only — no chunky border-shadow
          boxShadow: "0 -20px 60px rgba(212,175,55,0.18), 0 -40px 80px rgba(0,0,0,0.95)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 1px gold gradient top-edge line — SectionFrame DNA (replaces chunky shadow-border) */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-10"
          style={{
            background: "linear-gradient(to right, transparent 0%, rgba(212,175,55,0.60) 30%, rgba(212,175,55,0.80) 50%, rgba(212,175,55,0.60) 70%, transparent 100%)",
          }}
        />

        {/* Gold left accent bar — SectionFrame DNA */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35) 40%, rgba(212,175,55,0.10) 80%, transparent)",
          }}
        />

        {/* Drag handle — neutral white, standard iOS affordance */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* ── Sheet header — eyebrow pattern ── */}
        <div
          className="px-5 pt-3 pb-4 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(212,175,55,0.18)" }}
        >
          {/* Eyebrow flanking line row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.40))" }} />
            <div className="flex items-center gap-2">
              <img
                src={filmmakerFIcon}
                alt="OG"
                className="w-4 h-4 object-contain"
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.7))", opacity: 0.9 }}
              />
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.60)" }}>
                Film Industry Q&amp;A
              </span>
            </div>
            <div className="h-[1px] flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.40))" }} />
          </div>

          {/* Big title row */}
          <div className="flex items-end justify-between">
            <h2 className="font-bebas text-[28px] tracking-[0.15em] leading-none" style={{ color: "rgba(212,175,55,1)" }}>
              ASK THE OG
            </h2>
            <div className="flex items-center gap-3 pb-0.5">
              {ogMessages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors"
                  style={{ color: "rgba(255,255,255,0.30)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(212,175,55,0.70)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.30)")}
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="transition-colors p-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Empty state — example chips with eyebrow */}
          {ogMessages.length === 0 && (
            <div className="flex flex-col items-center gap-5 pt-3">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 w-full">
                <div className="h-[1px] flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase whitespace-nowrap" style={{ color: "rgba(255,255,255,0.22)" }}>
                  What do you want to know
                </span>
                <div className="h-[1px] flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2.5 justify-center">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAsk(chip)}
                    disabled={ogLoading}
                    className="font-mono text-[12px] uppercase tracking-[0.18em] px-4 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed border"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.60)";
                      e.currentTarget.style.background = "rgba(212,175,55,0.14)";
                      e.currentTarget.style.color = "rgba(212,175,55,1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.30)";
                      e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                      e.currentTarget.style.color = "rgba(212,175,55,0.75)";
                    }}
                    onTouchStart={e => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.60)";
                      e.currentTarget.style.background = "rgba(212,175,55,0.14)";
                    }}
                    onTouchEnd={e => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.30)";
                      e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                    }}
                    style={{
                      borderRadius: 0,
                      borderColor: "rgba(212,175,55,0.30)",
                      background: "rgba(212,175,55,0.08)",
                      color: "rgba(212,175,55,0.75)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message thread */}
          {ogMessages.map(msg => (
            <div key={msg.id} className="space-y-3">
              {/* Question bubble — manifesto card style */}
              <div className="flex justify-end">
                <div
                  className="relative max-w-[85%] px-4 py-3 pl-5 border overflow-hidden"
                  style={{
                    borderRadius: 0,
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  {/* Gold left accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{
                      background: "linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.30))",
                    }}
                  />
                  <p className="text-base text-white leading-relaxed">{msg.question}</p>
                </div>
              </div>

              {/* Answer card — SectionFrame match */}
              <div className="flex justify-start">
                <div
                  className="max-w-[95%] border overflow-hidden"
                  style={{
                    borderRadius: 0,
                    background: "#000000",
                    borderColor: "rgba(212,175,55,0.25)",
                    boxShadow: "0 0 30px rgba(212,175,55,0.10)",
                  }}
                >
                  {/* Gold header band */}
                  <div
                    className="flex items-center gap-2.5 px-4 py-2"
                    style={{ background: "rgba(212,175,55,1)" }}
                  >
                    <img src={filmmakerFIcon} alt="OG" className="w-3 h-3 object-contain" />
                    <span className="font-bebas text-xs tracking-[0.22em] text-black leading-none">THE OG</span>
                    {msg.streaming && (
                      <div className="flex gap-1 ml-auto">
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "0ms", borderRadius: 0 }} />
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "150ms", borderRadius: 0 }} />
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "300ms", borderRadius: 0 }} />
                      </div>
                    )}
                  </div>
                  {/* Answer body */}
                  <div className="px-4 py-4">
                    {msg.error ? (
                      <p className="text-[15px] leading-relaxed" style={{ color: "rgba(212,175,55,0.60)" }}>{msg.error}</p>
                    ) : (
                      <p className="text-base text-white leading-[1.8] whitespace-pre-wrap">
                        {msg.answer}
                        {msg.streaming && !msg.answer && (
                          <span style={{ color: "rgba(255,255,255,0.40)" }}>Thinking…</span>
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

        {/* Input area */}
        <div
          className="px-4 pb-3 pt-3 flex-shrink-0 border-t"
          style={{ borderColor: "rgba(212,175,55,0.20)", background: "#000000" }}
        >
          <form onSubmit={handleOgSubmit}>
            <div
              className="flex gap-0 border transition-colors"
              style={{
                borderLeft: "3px solid rgba(212,175,55,0.80)",
                borderColor: "rgba(212,175,55,0.45)",
                borderLeftColor: "rgba(212,175,55,0.80)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.85)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)")}
            >
              <textarea
                ref={inputRef}
                value={ogInput}
                onChange={(e) => {
                  if (e.target.value.length <= 1500) setOgInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a film industry question…"
                rows={2}
                disabled={ogLoading}
                className="flex-1 px-4 py-3 focus:outline-none text-base text-white resize-none disabled:opacity-50 min-h-[52px]"
                style={{
                  borderRadius: 0,
                  background: "transparent",
                  color: "#FFFFFF",
                }}
                // inline placeholder style override via CSS
              />
                <button
                  type="submit"
                  disabled={!ogInput.trim() || ogLoading}
                  className="px-5 font-bebas tracking-wider transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "rgba(212,175,55,0.80)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(212,175,55,1)")}
                  onTouchStart={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "rgba(212,175,55,0.80)")}
                  onTouchEnd={e => (e.currentTarget.style.background = "rgba(212,175,55,1)")}
                  style={{ background: "rgba(212,175,55,1)", color: "#000", borderRadius: 0 }}
                >
                <SendHorizonal className="w-4 h-4" />
                <span className="text-base hidden sm:block">ASK</span>
              </button>
            </div>
            <div className="flex items-center justify-end mt-1.5 px-1">
              <span className={cn(
                "text-[10px] font-mono tabular-nums",
                ogInput.length > 1350 ? "text-gold/60" : "text-white/25"
              )}>
                {ogInput.length}/1500
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OgBotSheet;
