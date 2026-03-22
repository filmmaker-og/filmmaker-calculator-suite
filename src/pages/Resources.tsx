import React, { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useHaptics } from "@/hooks/use-haptics";
import { getDailyGlossary, getAllGlossary, type GlossaryTerm } from "@/lib/glossary-rotation";

// ------------------------------------------------------------------
// DATA
// ------------------------------------------------------------------
type CardState = "gold" | "gold-featured" | "neutral";

type VaultEntry = {
  id: string;
  title: string;
  excerpt: string;
  category: "financing" | "distribution" | "business-affairs" | "development" | "ai" | "glossary" | "news";
  type: "masterclass" | "article" | "guide" | "briefing" | "glossary" | "external";
  date: string;
  readTime: string;
  href: string;
  external?: boolean;
  cardState: CardState;
  badgeLabel: string;
};

const VAULT_ENTRIES: VaultEntry[] = [
  {
    id: "sag-aftra-ai",
    title: "SAG-AFTRA\u2019s AI Provisions And What They Cost",
    excerpt: "The new AI consent and compensation clauses change your budget math. Digital replicas, synthetic performances, and voice licensing all have rates now.",
    category: "ai",
    type: "briefing",
    date: "2026-03-01",
    readTime: "Briefing",
    href: "#",
    cardState: "gold-featured",
    badgeLabel: "Featured",
  },
  {
    id: "artists-equity",
    title: "Why The Artists Equity Model Changes The Math",
    excerpt: "Defer fees. Stack tax credits. Lower the cash basis. Sell for market value. The spread is your profit.",
    category: "distribution",
    type: "external",
    date: "2026-03-04",
    readTime: "External",
    href: "#",
    external: true,
    cardState: "gold-featured",
    badgeLabel: "Featured",
  },
  {
    id: "theatrical-lottery",
    title: "The Theatrical Lottery Is Not A Strategy",
    excerpt: "Spending $10M on P&A to find out if your film works on opening weekend is a casino bet. The streamer acquisition path gives you a known valuation before you shoot.",
    category: "distribution",
    type: "article",
    date: "2026-02-28",
    readTime: "5 min read",
    href: "#",
    cardState: "gold",
    badgeLabel: "Article",
  },
  {
    id: "tax-credits",
    title: "Tax Credits Are Not Free Money",
    excerpt: "State tax incentives reduce your cash basis \u2014 but only if you understand qualified expenditures, minimum spend thresholds, and the gap between transferable and refundable credits.",
    category: "financing",
    type: "article",
    date: "2026-02-20",
    readTime: "8 min read",
    href: "#",
    cardState: "gold",
    badgeLabel: "Article",
  },
  {
    id: "first-spv",
    title: "Structuring Your First SPV",
    excerpt: "A Special Purpose Vehicle isolates your film\u2019s financial risk from everything else. What it is, why investors expect it, and what your lawyer needs to know.",
    category: "business-affairs",
    type: "guide",
    date: "2026-02-10",
    readTime: "15 min read",
    href: "#",
    cardState: "gold",
    badgeLabel: "Guide",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  financing: "Financing",
  distribution: "Distribution",
  "business-affairs": "Business Affairs",
  development: "Development",
  ai: "AI in Film",
  glossary: "Glossary",
};

const CATEGORY_EYEBROW: Record<string, string> = {
  financing: "Financing",
  distribution: "Distribution",
  "business-affairs": "Legal / Structural",
  development: "Development",
  ai: "Industry News",
  glossary: "Glossary",
  news: "Industry News",
};

// ------------------------------------------------------------------
// GLOSSARY -> VAULT ENTRY CONVERTER
// ------------------------------------------------------------------
function glossaryToVaultEntry(term: GlossaryTerm): VaultEntry {
  return {
    id: `glossary-${term.id}`,
    title: term.term,
    excerpt: term.definition,
    category: "glossary",
    type: "glossary",
    date: term.created_at,
    readTime: "Definition",
    href: "#",
    cardState: "neutral",
    badgeLabel: "Definition",
  };
}

// ------------------------------------------------------------------
// CARD STYLE HELPERS
// ------------------------------------------------------------------
function getCardBorderStyle(state: CardState, hovered: boolean): React.CSSProperties {
  switch (state) {
    case "gold-featured":
      return {
        border: hovered ? "1px solid rgba(212,175,55,0.50)" : "1px solid rgba(212,175,55,0.30)",
        boxShadow: hovered
          ? "0 20px 50px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.18)"
          : "0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.14)",
      };
    case "neutral":
      return {
        border: hovered ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(255,255,255,0.10)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.6)" : "none",
      };
    default: // gold
      return {
        border: hovered ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(212,175,55,0.20)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.12)" : "0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.08)",
      };
  }
}

function getToplineStyle(state: CardState, hovered: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    transition: "all 0.3s",
  };
  switch (state) {
    case "gold-featured":
      return {
        ...base,
        height: 2,
        background: hovered
          ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.65), transparent)"
          : "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)",
      };
    case "neutral":
      return {
        ...base,
        height: 1,
        background: hovered
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
      };
    default:
      return {
        ...base,
        height: 1,
        background: hovered
          ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)"
          : "linear-gradient(90deg, transparent, rgba(212,175,55,0.20), transparent)",
      };
  }
}

function getHazeStyle(state: CardState): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    pointerEvents: "none",
  };
  switch (state) {
    case "gold-featured":
      return { ...base, background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)" };
    case "neutral":
      return { ...base, display: "none" };
    default:
      return { ...base, background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 70%)" };
  }
}

function getEyebrowColor(state: CardState): string {
  return state === "neutral" ? "rgba(255,255,255,0.45)" : "#D4AF37";
}

function getBadgeStyle(state: CardState): React.CSSProperties {
  switch (state) {
    case "gold-featured":
      return {
        color: "#D4AF37",
        background: "rgba(212,175,55,0.12)",
        border: "1px solid rgba(212,175,55,0.30)",
      };
    case "neutral":
      return {
        color: "rgba(255,255,255,0.40)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      };
    default:
      return {
        color: "rgba(255,255,255,0.55)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.12)",
      };
  }
}

function getMetaColor(state: CardState): string {
  switch (state) {
    case "gold-featured":
      return "rgba(212,175,55,0.80)";
    case "neutral":
      return "rgba(255,255,255,0.55)";
    default:
      return "rgba(212,175,55,0.75)";
  }
}

function getDotColor(state: CardState): string {
  switch (state) {
    case "gold-featured":
      return "rgba(212,175,55,0.45)";
    case "neutral":
      return "rgba(255,255,255,0.25)";
    default:
      return "rgba(212,175,55,0.40)";
  }
}

// ------------------------------------------------------------------
// CARD COMPONENT
// ------------------------------------------------------------------
const VaultCard: React.FC<{
  entry: VaultEntry;
  index: number;
  prefersReducedMotion: boolean;
}> = ({ entry, index, prefersReducedMotion }) => {
  const { ref, inView } = useInView<HTMLAnchorElement>({ threshold: 0.05 });
  const [hovered, setHovered] = useState(false);
  const isNeutral = entry.cardState === "neutral";

  const formattedDate = new Date(entry.date.includes("T") ? entry.date : entry.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const delay = index % 6;
  const cardReveal: React.CSSProperties = {
    opacity: prefersReducedMotion || inView ? 1 : 0,
    transform: prefersReducedMotion || inView
      ? (hovered ? "translateY(-3px)" : "translateY(0)")
      : "translateY(20px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s",
    transitionDelay: prefersReducedMotion ? "0ms" : `${delay * 50}ms`,
  };

  const metaColor = getMetaColor(entry.cardState);
  const dotColor = getDotColor(entry.cardState);

  return (
    <a
      ref={ref}
      href={entry.href}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
      style={{
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        ...getCardBorderStyle(entry.cardState, hovered),
        ...cardReveal,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={getToplineStyle(entry.cardState, hovered)} />
      <div style={getHazeStyle(entry.cardState)} />
      <div style={{
        padding: isNeutral ? "20px 20px 8px" : "20px 20px 14px",
        borderBottom: isNeutral ? "none" : "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 14,
        position: "relative",
      }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: getEyebrowColor(entry.cardState),
            marginBottom: 6,
            display: "block",
          }}>
            {CATEGORY_EYEBROW[entry.category] || entry.category}
          </span>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isNeutral ? "1.6rem" : "1.8rem",
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "0.03em",
            margin: 0,
          }}>
            {entry.title}
          </h3>
        </div>
        <span style={{
          display: "inline-block",
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          padding: "5px 12px",
          borderRadius: 4,
          fontWeight: 600,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginTop: 2,
          ...getBadgeStyle(entry.cardState),
        }}>
          {entry.badgeLabel}
        </span>
      </div>
      <div style={{
        padding: isNeutral ? "0 20px 20px" : "16px 20px 20px",
        position: "relative",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: isNeutral ? 16 : 17,
          color: isNeutral ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.80)",
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: isNeutral ? 2 : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}>
          {entry.excerpt}
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isNeutral && (
              <>
                <span style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  color: metaColor,
                }}>
                  {formattedDate}
                </span>
                {entry.readTime !== "Definition" && (
                  <>
                    <span style={{ fontSize: 8, color: dotColor }}>&bull;</span>
                    <span style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 14,
                      letterSpacing: "0.08em",
                      color: metaColor,
                    }}>
                      {entry.readTime}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          <span style={{
            color: hovered
              ? (isNeutral ? "rgba(255,255,255,0.75)" : "#D4AF37")
              : "rgba(255,255,255,0.55)",
            fontSize: 22,
            transition: "all 0.3s",
            transform: hovered ? "translateX(6px)" : "translateX(0)",
            display: "inline-block",
          }}>
            {entry.external ? "\u2197" : "\u2192"}
          </span>
        </div>
      </div>
    </a>
  );
};

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
const Resources = () => {
  const haptics = useHaptics();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(20px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 80}ms`,
  });

  const { ref: headerRef, inView: headerVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: pinnedRef, inView: pinnedVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: gridRef, inView: _gridVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });

  // Search & filter state
  const [search, setSearch] = useState("");
  const [activeSort, setActiveSort] = useState<"newest" | "oldest">("newest");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  // Pinned card hover states
  const [pinnedPrimaryHover, setPinnedPrimaryHover] = useState(false);
  const [pinnedSecondaryHover, setPinnedSecondaryHover] = useState(false);

  // Glossary state
  const [dailyGlossary, setDailyGlossary] = useState<GlossaryTerm[]>([]);
  const [allGlossary, setAllGlossary] = useState<GlossaryTerm[]>([]);
  const [glossaryLoaded, setGlossaryLoaded] = useState(false);

  // Fetch daily glossary on mount
  useEffect(() => {
    getDailyGlossary(4).then((terms) => {
      setDailyGlossary(terms);
    });
  }, []);

  // Fetch all glossary when "Glossary" filter is selected
  useEffect(() => {
    if (activeFilter === "glossary" && !glossaryLoaded) {
      getAllGlossary().then((terms) => {
        setAllGlossary(terms);
        setGlossaryLoaded(true);
      });
    }
  }, [activeFilter, glossaryLoaded]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Build entries list
  const glossaryEntries: VaultEntry[] = activeFilter === "glossary"
    ? allGlossary.map(glossaryToVaultEntry)
    : dailyGlossary.map(glossaryToVaultEntry);

  const editorialFiltered = (activeFilter === "glossary" ? [] : VAULT_ENTRIES)
    .filter((entry) => {
      const matchFilter = activeFilter === "all" || entry.category === activeFilter;
      const matchSearch = !search || [entry.title, entry.excerpt, entry.category, entry.badgeLabel, entry.readTime]
        .join(" ").toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return activeSort === "newest" ? db - da : da - db;
    });

  const glossaryFiltered = (activeFilter === "all" || activeFilter === "glossary")
    ? glossaryEntries.filter((entry) => {
        return !search || [entry.title, entry.excerpt, entry.category, entry.badgeLabel]
          .join(" ").toLowerCase().includes(search.toLowerCase());
      })
    : [];

  const filteredEntries = [...editorialFiltered, ...glossaryFiltered];

  const resultsText = search
    ? `${filteredEntries.length} result${filteredEntries.length === 1 ? "" : "s"} for \u201c${search}\u201d`
    : `${filteredEntries.length} entries`;

  const dropdownLabel = `${CATEGORY_LABELS[activeFilter] || "All"} \u2022 ${activeSort === "newest" ? "Newest" : "Oldest"}`;

  const handleClearSearch = useCallback(() => {
    setSearch("");
    searchRef.current?.focus();
  }, []);

  return (
    <div style={{
      background: "#000",
      color: "rgba(255,255,255,0.95)",
      fontFamily: "'Inter', sans-serif",
      WebkitFontSmoothing: "antialiased",
      lineHeight: 1.6,
      minHeight: "100vh",
    }}>
      {/* ---- HERO (glass card) ---- */}
      <div ref={headerRef} style={{ padding: "32px 0 0", position: "relative" }}>
        {/* Glass hero card */}
        <section style={{
          position: "relative", textAlign: "center",
          padding: "24px 24px 16px",
          margin: "0 24px",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(6,6,6,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
          ...reveal(headerVisible),
        }}>
          {/* Triple radial glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(212,175,55,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,60,180,0.16) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 100%, rgba(120,60,180,0.20) 0%, transparent 60%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "4.2rem",
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              lineHeight: 0.86,
              color: "#fff",
              marginBottom: 4,
              textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.5)",
            }}>
              Resource<br />
              <span style={{
                color: "#D4AF37",
                fontStyle: "normal",
                textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.25)",
              }}>Vault</span>
            </h1>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.25rem",
              lineHeight: 1.1,
              color: "#fff",
              textAlign: "center",
              marginTop: 8,
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}>
              The Intelligence Behind Films That Close.
            </p>
          </div>
        </section>
      </div>

      {/* ---- BREATH LINE ---- */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 50%, transparent 95%)",
        boxShadow: "0 0 12px rgba(212,175,55,0.2)",
        margin: "0 24px",
      }} />

      {/* ---- COMMAND CENTER (sticky) ---- */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "linear-gradient(180deg, rgba(120,60,180,0.08) 0%, rgba(0,0,0,0.88) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(212,175,55,0.10)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 24px",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.9)",
      }}>
        <div className="vault-command-inner" style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 1000,
          margin: "0 auto",
        }}>
          {/* Search */}
          <div className="vault-search-wrap" style={{ flex: 1, position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                color: "rgba(212,175,55,0.60)",
                pointerEvents: "none",
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              className="vault-search-input"
              type="text"
              placeholder="Search the vault..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                setSearchInputFocused(true);
                if (window.innerWidth <= 767) {
                  window.dispatchEvent(new Event("vault-search-focus"));
                }
              }}
              onBlur={() => {
                setSearchInputFocused(false);
                window.dispatchEvent(new Event("vault-search-blur"));
              }}
              style={{
                width: "100%",
                background: searchInputFocused ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.06)",
                border: searchInputFocused ? "1px solid rgba(212,175,55,0.40)" : "1px solid rgba(212,175,55,0.25)",
                borderRadius: 12,
                color: "rgba(255,255,255,0.95)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                height: 48,
                padding: "0 44px 0 48px",
                outline: "none",
                transition: "all 0.3s",
                boxSizing: "border-box",
                boxShadow: searchInputFocused ? "0 0 20px rgba(120,60,180,0.15)" : "0 0 12px rgba(120,60,180,0.06)",
              }}
              autoComplete="off"
            />
            {search && (
              <button
                className="vault-clear-search"
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.95)",
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
                aria-label="Clear search"
              >
                {"\u2715"}
              </button>
            )}
          </div>

          {/* Filter dropdown */}
          <div ref={dropdownRef} className="vault-control-dropdown" style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                haptics.light();
                setDropdownOpen((o) => !o);
              }}
              className="vault-dropdown-btn"
              data-has-filter={(activeFilter !== "all" || activeSort !== "newest") ? "true" : "false"}
              style={{
                position: "relative",
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: dropdownOpen ? "#D4AF37" : "rgba(255,255,255,0.75)",
                background: "rgba(255,255,255,0.04)",
                border: dropdownOpen ? "1px solid rgba(212,175,55,0.20)" : "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                height: 48,
                width: 48,
                padding: 0,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="vault-dropdown-text" style={{ display: "none" }}>{dropdownLabel}</span>
              <svg
                className="vault-dropdown-mobile-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="vault-dropdown-panel" style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 240,
                background: "rgba(8,8,8,0.98)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                padding: "8px 0",
              }}>
                <div style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#D4AF37",
                  padding: "12px 20px 8px",
                  fontWeight: 600,
                  opacity: 0.6,
                }}>Sort</div>
                {(["newest", "oldest"] as const).map((val) => (
                  <button
                    key={val}
                    style={{
                      padding: "16px 20px",
                      background: activeSort === val ? "rgba(212,175,55,0.03)" : "transparent",
                      border: "none",
                      borderLeft: activeSort === val ? "2px solid #D4AF37" : "2px solid transparent",
                      color: activeSort === val ? "#D4AF37" : "rgba(255,255,255,0.45)",
                      textAlign: "left",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onClick={() => {
                      haptics.light();
                      setActiveSort(val);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{val === "newest" ? "Newest First" : "Oldest First"}</span>
                    {activeSort === val && <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12 }}>{"\u2713"}</span>}
                  </button>
                ))}
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
                <div style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#D4AF37",
                  padding: "12px 20px 8px",
                  fontWeight: 600,
                  opacity: 0.6,
                }}>Category</div>
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    style={{
                      padding: "16px 20px",
                      background: activeFilter === val ? "rgba(212,175,55,0.03)" : "transparent",
                      border: "none",
                      borderLeft: activeFilter === val ? "2px solid #D4AF37" : "2px solid transparent",
                      color: activeFilter === val ? "#D4AF37" : "rgba(255,255,255,0.45)",
                      textAlign: "left",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onClick={() => {
                      haptics.light();
                      setActiveFilter(val);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{label}</span>
                    {activeFilter === val && <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12 }}>{"\u2713"}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- EDITOR'S CHOICE (PINNED) ---- */}
      <section ref={pinnedRef} className="pinned-section" style={{ padding: "28px 24px 16px", maxWidth: 1000, margin: "0 auto" }}>
        <div className="pinned-label" style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.95)",
          marginBottom: 20,
        }}>
          Editor&apos;s Choice
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          {/* Primary pinned */}
          <a
            href="#"
            style={{
              borderRadius: 12,
              position: "relative",
              overflow: "hidden",
              padding: "22px 20px",
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0A0A0A 70%)",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
              display: "block",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: pinnedPrimaryHover ? "translateY(-3px)" : "translateY(0)",
              boxShadow: pinnedPrimaryHover
                ? "0 20px 50px rgba(0,0,0,0.9), 0 0 50px rgba(212,175,55,0.12)"
                : "none",
              ...reveal(pinnedVisible),
            }}
            onMouseEnter={() => setPinnedPrimaryHover(true)}
            onMouseLeave={() => setPinnedPrimaryHover(false)}
          >
            {/* Gold gradient border */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              border: "1px solid rgba(212,175,55,0.40)",
              pointerEvents: "none",
            }} />
            {/* Topline */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
              zIndex: 1,
            }} />
            {/* Purple pin */}
            <div style={{
              position: "absolute", top: 12, right: 14,
              display: "flex", alignItems: "center", gap: 6, zIndex: 2,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,60,180,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
              </svg>
              <span style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: 10,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(120,60,180,0.75)", fontWeight: 600,
              }}>Pinned</span>
            </div>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: 8,
              display: "block",
            }}>
              Start Here
            </span>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.9rem",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "0.03em",
              marginBottom: 14,
              marginTop: 0,
              paddingRight: 80,
            }}>
              What Is a Recoupment Waterfall
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#000",
                background: "#D4AF37",
                padding: "6px 14px",
                borderRadius: 4,
                fontWeight: 600,
                boxShadow: "0 0 12px rgba(212,175,55,0.4)",
              }}>
                Editor&apos;s Choice
              </span>
              <span style={{
                color: pinnedPrimaryHover ? "#D4AF37" : "rgba(255,255,255,0.35)",
                fontSize: 18,
                transition: "all 0.3s",
                transform: pinnedPrimaryHover ? "translateX(6px)" : "translateX(0)",
                display: "inline-block",
              }}>
                {"\u2192"}
              </span>
            </div>
          </a>

          {/* Secondary pinned */}
          <a
            href="#"
            style={{
              borderRadius: 12,
              position: "relative",
              overflow: "hidden",
              padding: "22px 18px",
              background: "#0A0A0A",
              border: "1px solid rgba(212,175,55,0.20)",
              boxShadow: pinnedSecondaryHover
                ? "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.05)"
                : "0 16px 40px rgba(0,0,0,0.6)",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: pinnedSecondaryHover ? "translateY(-3px)" : "translateY(0)",
              borderColor: pinnedSecondaryHover ? "rgba(212,175,55,0.35)" : "rgba(212,175,55,0.20)",
              ...reveal(pinnedVisible, 1),
            }}
            onMouseEnter={() => setPinnedSecondaryHover(true)}
            onMouseLeave={() => setPinnedSecondaryHover(false)}
          >
            {/* Topline */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            }} />
            {/* Purple pin */}
            <div style={{
              position: "absolute", top: 12, right: 14,
              display: "flex", alignItems: "center", gap: 6, zIndex: 2,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,60,180,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
              </svg>
              <span style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: 10,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(120,60,180,0.75)", fontWeight: 600,
              }}>Pinned</span>
            </div>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: 8,
              display: "block",
            }}>
              Reference
            </span>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "0.03em",
              marginBottom: 10,
              marginTop: 0,
              paddingRight: 80,
            }}>
              15 Terms Your Investors Expect You to Know
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.55)",
              }}>
                Glossary
              </span>
              <span style={{
                color: pinnedSecondaryHover ? "#D4AF37" : "rgba(255,255,255,0.35)",
                fontSize: 18,
                transition: "all 0.3s",
                transform: pinnedSecondaryHover ? "translateX(6px)" : "translateX(0)",
                display: "inline-block",
              }}>
                {"\u2192"}
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Purple separator — pinned → grid */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent 10%, rgba(120,60,180,0.20) 50%, transparent 90%)",
        margin: "12px 24px 0",
      }} />

      {/* ---- RESULTS BAR ---- */}
      <div style={{ padding: "20px 24px 0", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 20,
        }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 14,
            color: "rgba(255,255,255,0.95)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {resultsText}
          </span>
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 12,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
            onClick={() => {
              haptics.light();
              setActiveSort((prev) => prev === "newest" ? "oldest" : "newest");
            }}
          >
            {activeSort === "newest" ? "Newest \u2193" : "Oldest \u2191"}
          </span>
        </div>
      </div>

      {/* ---- CONTENT GRID ---- */}
      <div ref={gridRef} style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "0 24px 120px",
        maxWidth: 1000,
        margin: "0 auto",
      }}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, i) => (
            <VaultCard
              key={entry.id}
              entry={entry}
              index={i}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))
        ) : (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: "1px dashed rgba(255,255,255,0.08)",
          }}>
            No assets found matching those parameters.
          </div>
        )}
      </div>

      {/* ---- FOOTER (synced with Index.tsx / Store.tsx) ---- */}
      <footer ref={footerRef} style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(212,175,55,0.12)",
        padding: "32px 24px 40px",
        maxWidth: 1000,
        margin: "0 auto",
        ...reveal(footerVisible),
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="https://www.tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/></svg>
          </a>
          <a href="https://www.facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" }} aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span onClick={() => window.location.href = "/"} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" }}>Home</span>
          <span style={{ color: "rgba(212,175,55,0.20)", fontSize: 12 }}>&middot;</span>
          <span onClick={() => window.location.href = "/store"} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" }}>Shop</span>
          <span style={{ color: "rgba(212,175,55,0.20)", fontSize: 12 }}>&middot;</span>
          <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" }}>Resources</span>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.48)",
          textAlign: "center",
          lineHeight: 1.55,
          margin: 0,
        }}>
          Filmmaker.og provides financial modeling tools for educational purposes. This is not legal or financial advice. Consult qualified counsel before executing any investment structure.
        </p>
      </footer>
    </div>
  );
};

// ── Responsive media query injection ──
const RESPONSIVE_STYLE_ID = "vault-responsive";
if (typeof document !== "undefined" && !document.getElementById(RESPONSIVE_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = RESPONSIVE_STYLE_ID;
  style.textContent = `
    a, button { -webkit-tap-highlight-color: transparent; }
    .vault-search-input::placeholder { color: rgba(255,255,255,0.35) !important; }
    @media (max-width: 767px) {
      .vault-command-inner { gap: 8px !important; }
      .vault-search-wrap { flex: 1 !important; min-width: 0 !important; }
      .vault-search-input { font-size: 16px !important; height: 48px !important; padding: 0 40px 0 48px !important; }
      .vault-clear-search { width: 36px !important; height: 36px !important; right: 6px !important; }
      .vault-control-dropdown { flex-shrink: 0 !important; }
      .vault-dropdown-btn {
        justify-content: center !important;
        width: 48px !important;
        height: 48px !important;
        padding: 0 !important;
      }
      .vault-dropdown-btn[data-has-filter="true"]::after {
        content: '';
        position: absolute; top: 10px; right: 10px;
        width: 8px; height: 8px;
        background: #D4AF37; border-radius: 50%;
        box-shadow: 0 0 8px rgba(212,175,55,0.6);
      }
      .vault-dropdown-text { display: none !important; }
      .vault-dropdown-mobile-icon { display: block !important; }
      .vault-dropdown-chevron { display: none !important; }
      .vault-dropdown-panel { width: calc(100vw - 48px) !important; right: 0 !important; }
      .vault-header { padding-top: 36px !important; }
      .pinned-section { padding-bottom: 8px !important; }
      .card-excerpt { -webkit-line-clamp: 2 !important; }
    }
    @media (min-width: 768px) {
      .vault-dropdown-btn {
        width: auto !important;
        height: 48px !important;
        padding: 0 16px !important;
        gap: 8px !important;
      }
      .vault-dropdown-text { display: inline !important; }
      .vault-dropdown-mobile-icon { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export default Resources;
