import { useState, useRef, useCallback, useEffect } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { SendHorizonal, RotateCcw, X, Sparkles } from "lucide-react";
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
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ask-the-og`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            ...ogMessages.map(m => [
              { role: "user", content: m.question },
              ...(m.answer ? [{ role: "assistant", content: m.answer }] : []),
            ]).flat(),
            { role: "user", content: q },
          ],
        }),
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[170] animate-fade-in"
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
        {/* 3px purple-gold gradient top-edge line */}
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
            color: rgba(255,255,255,0.55) !important;
          }
        `}</style>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* ── Sheet header ── */}
        <div
          className="px-6 pt-3 pb-5 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(212,175,55,0.25)" }}
        >
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(120,60,180,0.25)",
                flexShrink: 0,
              }}>
                <Sparkles style={{ width: "22px", height: "22px", color: "#D4AF37", filter: "drop-shadow(0 0 3px rgba(212,175,55,0.40))" }} />
              </div>
              <h2 className="font-bebas text-[32px] tracking-[0.12em] leading-none" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.25)", marginTop: "2px" }}>
                ASK THE OG
              </h2>
            </div>
            <div className="flex items-center gap-3 pb-0.5">
              {ogMessages.length > 0 && (
                <button
                  onClick={handleReset}
                  aria-label="Clear chat history"
                  className="flex items-center gap-1.5 font-bebas text-[12px] uppercase tracking-[0.15em] transition-colors tabular-nums"
                  style={{ color: "rgba(180,140,255,0.50)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,140,255,0.80)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(180,140,255,0.50)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.90)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              <button
                onClick={() => { haptics.light(); setIsOpen(false); }}
                aria-label="Close chat"
                className="transition-colors p-1"
                style={{ color: "rgba(255,255,255,0.50)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.90)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 px-6 py-5 space-y-6" style={{ overflowY: ogMessages.length > 0 ? 'auto' : 'hidden' }}>
          {/* Empty state — example chips with eyebrow */}
          {ogMessages.length === 0 && (
            <div className="flex flex-col items-start gap-3" style={{ paddingTop: "16px" }}>
              <span className="font-bebas text-[28px] tracking-[0.14em] uppercase" style={{ color: "rgb(180,140,255)" }}>
                What do you want to know?
              </span>

              {/* Chips */}
              <div className="flex flex-wrap gap-3 justify-start">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAsk(chip)}
                    disabled={ogLoading}
                    className="font-bebas text-[17px] tracking-[0.10em] px-5 py-3.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed border"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.40)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.12)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.35)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.10)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    }}
                    onTouchStart={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.40)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.12)";
                    }}
                    onTouchEnd={e => {
                      e.currentTarget.style.borderColor = "rgba(120,60,180,0.35)";
                      e.currentTarget.style.background = "rgba(120,60,180,0.10)";
                    }}
                    style={{
                      borderRadius: "6px",
                      borderColor: "rgba(120,60,180,0.35)",
                      background: "rgba(120,60,180,0.10)",
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
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Sparkles style={{ width: "12px", height: "12px", color: "#D4AF37" }} />
                      </div>
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
          style={{ borderColor: "rgba(212,175,55,0.25)", background: "transparent" }}
        >
          <form onSubmit={handleOgSubmit}>
            <div
              className="flex gap-0 transition-colors"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(120,60,180,0.40)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(120,60,180,0.60)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(120,60,180,0.40)")}
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
                  aria-label="Send message"
                  className="px-5 font-bebas tracking-wider transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  onMouseDown={e => { e.currentTarget.style.transform = "scale(0.95)"; }}
                  onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  style={{ background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", color: "#fff", borderRadius: "0 7px 7px 0" }}
                >
                <SendHorizonal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-end mt-1.5 px-1">
              <span className={cn(
                "text-[11px] tabular-nums",
                ogInput.length > 1350 ? "text-gold" : ""
              )}
              style={ogInput.length <= 1350 ? { color: "rgba(212,175,55,0.50)" } : undefined}
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
