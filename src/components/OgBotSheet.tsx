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
      {/* FAB removed — bot is now triggered by the BottomTabBar ASK tab */}

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[170] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Bottom Sheet ── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[180] bg-[#0D0900] border-t border-gold/20 rounded-t-2xl transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          height: "70vh",
          paddingBottom: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-8 h-1 bg-white/15 rounded-full" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-gold/10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-gold px-3 py-1.5" style={{ borderRadius: 0 }}>
              <img src={filmmakerFIcon} alt="OG" className="w-3.5 h-3.5 object-contain" />
              <span className="font-bebas text-sm tracking-[0.22em] text-black leading-none">ASK THE OG</span>
            </div>
            <span className="text-[10px] text-white/25 font-mono uppercase tracking-widest hidden sm:block">
              Film industry Q&A
            </span>
          </div>
          <div className="flex items-center gap-3">
            {ogMessages.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/20 hover:text-gold/60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/30 hover:text-white/70 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Example chips — before first message */}
          {ogMessages.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2">
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

          {/* Message thread */}
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
                  style={{ borderRadius: 0, background: "#080600", boxShadow: "0 0 24px rgba(212,175,55,0.06)" }}
                >
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-gold">
                    <img src={filmmakerFIcon} alt="OG" className="w-3 h-3 object-contain" />
                    <span className="font-bebas text-xs tracking-[0.2em] text-black leading-none">THE OG</span>
                    {msg.streaming && (
                      <div className="flex gap-1 ml-auto">
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "0ms", borderRadius: 0 }} />
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "150ms", borderRadius: 0 }} />
                        <div className="w-1.5 h-1.5 bg-black/50 animate-bounce" style={{ animationDelay: "300ms", borderRadius: 0 }} />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    {msg.error ? (
                      <p className="text-[15px] text-gold/50 leading-relaxed">{msg.error}</p>
                    ) : (
                      <p className="text-[15px] text-white/90 leading-[1.8] whitespace-pre-wrap">
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

        {/* Input area */}
        <div className="px-4 pb-3 pt-2 border-t border-gold/10 flex-shrink-0">
          <form onSubmit={handleOgSubmit}>
            <div
              className="flex gap-0 border border-gold/40 focus-within:border-gold transition-colors"
              style={{ borderLeft: "3px solid var(--gold)" }}
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
            <div className="flex items-center justify-end mt-1.5 px-1">
              <span className={cn(
                "text-[10px] font-mono tabular-nums",
                ogInput.length > 1350 ? "text-gold/60" : "text-white/15"
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
