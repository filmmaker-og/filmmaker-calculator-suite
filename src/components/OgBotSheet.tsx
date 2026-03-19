import { useState, useRef, useCallback, useEffect } from "react";
import { useHaptics } from "@/hooks/use-haptics";
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
  "How do I model my deal?",
  "What package is right for me?",
  "What is a recoupment waterfall?",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  const haptics = useHaptics();
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
          height: "min(75vh, 620px)",
          paddingBottom: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
          background: "rgba(6,6,6,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "12px 12px 0 0",
          boxShadow: "0 -20px 60px rgba(120,60,180,0.20), 0 -40px 80px rgba(0,0,0,0.95)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 1px gold gradient top-edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-10"
          style={{
            background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)",
            borderRadius: "12px 12px 0 0",
          }}
        />

        {/* Purple atmospheric glow */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-0"
          style={{
            height: "200px",
            background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.25) 0%, transparent 70%)",
          }}
        />

        <style>{`
          .og-input::placeholder {
            color: rgba(180,140,255,0.45) !important;
          }
        `}</style>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.20)" }} />
        </div>

        {/* ── Sheet header ── */}
        <div
          className="px-6 pt-3 pb-5 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(212,175,55,0.15)" }}
        >
          <div className="flex items-end justify-between">
            <h2 className="font-bebas text-[32px] tracking-[0.12em] leading-none" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.25)" }}>
              ASK THE OG
            </h2>
            <div className="flex items-center gap-3 pb-0.5">
              {ogMessages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 font-bebas text-[12px] uppercase tracking-[0.15em] transition-colors tabular-nums"
                  style={{ color: "rgba(180,140,255,0.50)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,140,255,0.80)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(180,140,255,0.50)")}
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              <button
                onClick={() => { haptics.light(); setIsOpen(false); }}
                className="transition-colors p-1"
                style={{ color: "rgba(255,255,255,0.40)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Empty state — example chips with eyebrow */}
          {ogMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5" style={{ minHeight: "100%" }}>
              <img src={filmmakerFIcon} alt="" className="w-8 h-8 object-contain" style={{ opacity: 0.70 }} />
              <span className="font-bebas text-[22px] tracking-[0.14em] uppercase" style={{ color: "rgb(180,140,255)" }}>
                What do you want to know
              </span>

              {/* Chips */}
              <div className="flex flex-wrap gap-3 justify-center">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAsk(chip)}
                    disabled={ogLoading}
                    className="font-bebas text-[16px] tracking-[0.10em] px-5 py-3.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed border"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.40)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.12)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.25)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.06)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    }}
                    onTouchStart={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.40)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.12)";
                    }}
                    onTouchEnd={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.25)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.06)";
                    }}
                    style={{
                      borderRadius: "6px",
                      borderColor: "rgba(120,60,180,0.25)",
                      background: "rgba(120,60,180,0.06)",
                      color: "rgba(255,255,255,0.75)",
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
              {/* Question bubble */}
              <div className="flex justify-end">
                <div
                  className="relative max-w-[85%] px-4 py-3 border overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    background: "rgba(120,60,180,0.12)",
                    borderColor: "rgba(120,60,180,0.20)",
                  }}
                >
                  <p className="text-[18px] text-white leading-relaxed">{msg.question}</p>
                </div>
              </div>

              {/* Answer card */}
              <div className="flex justify-start">
                <div
                  className="max-w-[95%] border overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    background: "rgba(10,10,10,0.80)",
                    borderColor: "rgba(120,60,180,0.25)",
                    boxShadow: "0 0 30px rgba(120,60,180,0.18)",
                  }}
                >
                  {/* Answer body */}
                  <div className="px-5 py-5">
                    {/* Inline attribution header */}
                    <div className="flex items-center gap-2 mb-3">
                      <img src={filmmakerFIcon} alt="OG" className="w-4 h-4 object-contain" />
                      <span className="font-bebas text-[15px] tracking-[0.15em] leading-none" style={{ color: "#D4AF37" }}>OG</span>
                      {msg.streaming && (
                        <div className="flex gap-1 ml-1">
                          <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(212,175,55,0.50)", animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(212,175,55,0.50)", animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(212,175,55,0.50)", animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>
                    {msg.error ? (
                      <p className="text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>{msg.error}</p>
                    ) : (
                      <p className="text-[18px] text-white leading-[1.75] whitespace-pre-wrap">
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
          className="px-5 pb-4 pt-3 flex-shrink-0 border-t"
          style={{ borderColor: "rgba(212,175,55,0.15)", background: "transparent" }}
        >
          <form onSubmit={handleOgSubmit}>
            <div
              className="flex gap-0 transition-colors"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(120,60,180,0.25)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(120,60,180,0.50)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(120,60,180,0.25)")}
            >
              <textarea
                ref={inputRef}
                value={ogInput}
                onChange={(e) => {
                  if (e.target.value.length <= 1500) setOgInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about deals, packages, or your model…"
                rows={2}
                disabled={ogLoading}
                className="og-input flex-1 px-4 py-3 focus:outline-none text-[18px] text-white resize-none disabled:opacity-50 min-h-[56px]"
                style={{
                  borderRadius: "8px 0 0 8px",
                  background: "transparent",
                  color: "#FFFFFF",
                }}
              />
                <button
                  type="submit"
                  disabled={!ogInput.trim() || ogLoading}
                  className="px-5 font-bebas tracking-wider transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  style={{ background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", color: "#fff", borderRadius: "0 7px 7px 0" }}
                >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-end mt-1.5 px-1">
              <span className={cn(
                "text-[11px] tabular-nums",
                ogInput.length > 1350 ? "text-gold" : ""
              )}
              style={ogInput.length <= 1350 ? { color: "rgba(120,60,180,0.50)" } : undefined}
            >
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
