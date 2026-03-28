import { useState, useRef, useCallback, useEffect } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { SendHorizonal, RotateCcw, X, Sparkles, Share2 } from "lucide-react";
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* ── Page-aware initial chips ── */
const getInitialChips = (): string[] => {
  const path = window.location.pathname;
  if (path.includes("/store")) {
    return [
      "Which package is right for me?",
      "What's the difference between the tiers?",
      "Can I upgrade later?",
    ];
  }
  if (path.includes("/calculator") || path.includes("/waterfall")) {
    return [
      "Explain my results",
      "Is my deal healthy?",
      "What should I change?",
    ];
  }
  if (path.includes("/resources")) {
    return [
      "What is a recoupment waterfall?",
      "How do tax credits work?",
      "Explain deal structures",
    ];
  }
  // Default (landing page)
  return [
    "How do I model my deal?",
    "What package is right for me?",
    "What is a recoupment waterfall?",
  ];
};

/* ── Extract follow-up chips from bot answer (tail lines starting with "- ") ── */
const extractSuggestedChips = (answer: string): { chips: string[]; cleanedAnswer: string } => {
  const lines = answer.split("\n");
  // Walk backward from the end, collecting lines that start with "- "
  const chipLines: string[] = [];
  let i = lines.length - 1;
  // Skip trailing empty lines
  while (i >= 0 && lines[i].trim() === "") i--;
  // Collect suggestion lines from the tail
  while (i >= 0 && lines[i].trim().startsWith("- ")) {
    chipLines.unshift(lines[i].trim().replace(/^- /, "").trim());
    i--;
  }
  if (chipLines.length === 0) {
    return { chips: [], cleanedAnswer: answer };
  }
  // Remove collected lines (and any blank lines between content and suggestions) from answer
  const cleanedLines = lines.slice(0, i + 1);
  // Trim trailing empty lines from cleaned answer
  while (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1].trim() === "") {
    cleanedLines.pop();
  }
  return { chips: chipLines.slice(0, 3), cleanedAnswer: cleanedLines.join("\n") };
};

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToLatestAnswer = () => {
    setTimeout(() => {
      if (messagesContainerRef.current && latestAnswerRef.current) {
        const container = messagesContainerRef.current;
        const answerTop = latestAnswerRef.current.offsetTop - container.offsetTop;
        container.scrollTo({ top: answerTop - 10, behavior: "smooth" });
      }
    }, 150);
  };

  // ── Auto-greeting on open ──
  useEffect(() => {
    if (isOpen && ogMessages.length === 0) {
      const hasProjectData = (() => {
        try {
          return !!localStorage.getItem("og_project_context");
        } catch { return false; }
      })();

      const greeting = hasProjectData
        ? "Hey \u{1F44B}, I\u2019m your film-finance OG!\n\nI can see you\u2019ve been running numbers \u2014 want me to help interpret your model?\n\nOr ask me anything about deals, waterfalls, packaging, or how to get your film financed."
        : "Hey \u{1F44B}, I\u2019m your film-finance OG!\n\nAsk me anything about waterfalls, deal structures, packaging, or how to get your film financed.\n\nNeed help picking the right package? Just tell me what\u2019s on your mind below \u{1F447}";

      setOgMessages([{
        id: "greeting",
        question: "",
        answer: greeting,
        streaming: false,
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll to latest when sheet opens with existing messages
  useEffect(() => {
    if (isOpen && ogMessages.length > 1) {
      setTimeout(scrollToLatestAnswer, 350);
    }
  }, [isOpen, ogMessages.length]);

  // ── Share / Copy handler ──
  const handleShareCopy = async (msg: AiMessage) => {
    try {
      if (navigator.share) {
        await navigator.share({ text: msg.answer });
        return;
      }
    } catch {
      // share cancelled or unavailable, fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(msg.answer);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  // ── Streaming ask ──
  const handleAsk = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || ogLoading) return;

    const id = Date.now().toString();
    const newMsg: AiMessage = { id, question: q, answer: "", streaming: true };
    setOgMessages(prev => [...prev, newMsg]);
    setOgLoading(true);
    setOgInput("");

    setTimeout(scrollToLatestAnswer, 100);

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ask-the-og`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            ...ogMessages.filter(m => m.id !== "greeting").map(m => [
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
      setTimeout(scrollToLatestAnswer, 100);
    }
  }, [ogLoading, ogMessages]);

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
    setOgInput("");
    const hasProjectData = (() => {
      try {
        return !!localStorage.getItem("og_project_context");
      } catch { return false; }
    })();
    const greeting = hasProjectData
      ? "Hey \u{1F44B}, I\u2019m your film-finance OG!\n\nI can see you\u2019ve been running numbers \u2014 want me to help interpret your model?\n\nOr ask me anything about deals, waterfalls, packaging, or how to get your film financed."
      : "Hey \u{1F44B}, I\u2019m your film-finance OG!\n\nAsk me anything about waterfalls, deal structures, packaging, or how to get your film financed.\n\nNeed help picking the right package? Just tell me what\u2019s on your mind below \u{1F447}";
    setOgMessages([{
      id: "greeting",
      question: "",
      answer: greeting,
      streaming: false,
    }]);
  };

  // ── Chip rendering helper ──
  const renderChips = (chips: string[]) => (
    <div className="flex flex-wrap gap-3 justify-start">
      {chips.map(chip => (
        <button
          key={chip}
          onClick={() => { haptics.medium(); handleAsk(chip); }}
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
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
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
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );

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
          height: "100dvh",
          paddingBottom: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
          background: "rgba(26,26,26,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "0",
          boxShadow: "0 -20px 60px rgba(120,60,180,0.20), 0 -40px 80px rgba(0,0,0,0.95)",
        }}
      >
        {/* 3px purple-gold gradient top-edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-10"
          style={{
            background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)",
            borderRadius: "0",
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
                  className="flex items-center gap-1.5 font-bebas text-[13px] uppercase tracking-[0.15em] transition-colors tabular-nums"
                  style={{ color: "rgba(180,140,255,0.65)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,140,255,0.90)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(180,140,255,0.65)")}
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
                style={{ color: "rgba(255,255,255,0.60)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.90)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div ref={messagesContainerRef} className="flex-1 px-6 py-5 space-y-6" style={{ overflowY: "auto" }}>
          {/* Message thread */}
          {ogMessages.map((msg, msgIndex) => (
            <div key={msg.id} className="space-y-3">
              {/* Question bubble (skip for greeting) */}
              {msg.question && (
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
              )}

              {/* Answer card */}
              <div className="flex justify-start" ref={msg.id === ogMessages[ogMessages.length - 1]?.id ? latestAnswerRef : undefined}>
                <div
                  className="max-w-[95%] border overflow-hidden relative"
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
                      <p className="text-[18px] text-white leading-[1.6] whitespace-pre-wrap">
                        {(() => {
                          const displayText = !msg.streaming ? extractSuggestedChips(msg.answer).cleanedAnswer : msg.answer;
                          return displayText.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                            part.match(/^https?:\/\//) ? (
                              <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                                 style={{ color: "#D4AF37", textDecoration: "underline" }}>{part}</a>
                            ) : part
                          );
                        })()}
                        {msg.streaming && !msg.answer && (
                          <span style={{ color: "rgba(255,255,255,0.55)" }}>Thinking…</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Share / Copy button (not on greeting) */}
                  {msg.id !== "greeting" && !msg.streaming && msg.answer && (
                    <div className="flex justify-end px-4 pb-3">
                      <button
                        onClick={() => handleShareCopy(msg)}
                        aria-label="Share or copy answer"
                        className="flex items-center gap-1.5 transition-opacity"
                        style={{ opacity: 0.6 }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
                      >
                        {copiedId === msg.id ? (
                          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.70)" }}>Copied ✅</span>
                        ) : (
                          <Share2 style={{ width: "15px", height: "15px", color: "rgba(255,255,255,0.45)" }} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Initial chips after greeting */}
              {ogMessages.length === 1 && msg.id === "greeting" && (
                <div style={{ paddingTop: "8px" }}>
                  {renderChips(getInitialChips())}
                </div>
              )}

              {/* Follow-up chips after bot answer (last message, done streaming, not greeting) */}
              {msg.id !== "greeting" && !msg.streaming && msg.answer && msgIndex === ogMessages.length - 1 && (() => {
                const { chips } = extractSuggestedChips(msg.answer);
                return chips.length > 0 ? (
                  <div style={{ paddingTop: "4px" }}>
                    {renderChips(chips)}
                  </div>
                ) : null;
              })()}
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
                  style={{ background: "linear-gradient(180deg, rgb(110,50,170) 0%, rgb(75,30,130) 100%)", color: "#fff", borderRadius: "0 7px 7px 0", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.20), inset 0 -2px 4px rgba(0,0,0,0.3)" }}
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
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            paddingBottom: "8px",
            paddingTop: "4px",
          }}>
            <a href="https://instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
               style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", textDecoration: "none" }}>
              IG
            </a>
            <a href="https://tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer"
               style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", textDecoration: "none" }}>
              TikTok
            </a>
            <a href="https://facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
               style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", textDecoration: "none" }}>
              FB
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default OgBotSheet;
