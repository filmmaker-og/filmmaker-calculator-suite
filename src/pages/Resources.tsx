import React, { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useHaptics } from "@/hooks/use-haptics";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";

// ------------------------------------------------------------------
// DATA
// ------------------------------------------------------------------
type VaultEntry = {
  id: string;
  title: string;
  excerpt: string;
  category: "financing" | "distribution" | "business-affairs" | "development" | "ai" | "foundational" | "news";
  type: "masterclass" | "article" | "guide" | "briefing" | "glossary" | "external";
  date: string;
  readTime: string;
  href: string;
  priority?: boolean;
  external?: boolean;
  badge: "gold" | "white" | "outline" | "dim";
  badgeLabel: string;
};

const VAULT_ENTRIES: VaultEntry[] = [
  {
    id: "artists-equity",
    title: "Why The Artists Equity Model Changes The Math",
    excerpt: "Defer fees. Stack tax credits. Lower the cash basis. Sell for market value. The spread is your profit. Here's the waterfall behind the model.",
    category: "news",
    type: "external",
    date: "2026-03-04",
    readTime: "External",
    href: "#",
    external: true,
    badge: "white",
    badgeLabel: "Trending",
  },
  {
    id: "tax-credits",
    title: "Tax Credits Are Not Free Money",
    excerpt: "State tax incentives reduce your cash basis — but only if you understand qualified expenditures, minimum spend thresholds, and the gap between transferable and refundable credits.",
    category: "financing",
    type: "article",
    date: "2026-02-20",
    readTime: "8 min read",
    href: "#",
    badge: "outline",
    badgeLabel: "Article",
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
    badge: "outline",
    badgeLabel: "Article",
  },
  {
    id: "first-spv",
    title: "Structuring Your First SPV",
    excerpt: "A Special Purpose Vehicle isolates your film's financial risk from everything else. What it is, why investors expect it, and what your lawyer needs to know.",
    category: "business-affairs",
    type: "guide",
    date: "2026-02-10",
    readTime: "15 min read",
    href: "#",
    badge: "dim",
    badgeLabel: "Guide",
  },
  {
    id: "sag-aftra-ai",
    title: "SAG-AFTRA's AI Provisions And What They Cost",
    excerpt: "The new AI consent and compensation clauses change your budget math. Digital replicas, synthetic performances, and voice licensing all have rates now.",
    category: "ai",
    type: "briefing",
    date: "2026-03-01",
    readTime: "6 min read",
    href: "#",
    badge: "dim",
    badgeLabel: "Briefing",
  },
  {
    id: "mezzanine-financing",
    title: "Mezzanine Financing",
    excerpt: "Debt that sits between senior lenders and equity investors in the capital stack. Higher risk than senior debt, lower priority than equity for upside.",
    category: "foundational",
    type: "glossary",
    date: "2026-02-01",
    readTime: "Definition",
    href: "#",
    badge: "dim",
    badgeLabel: "Glossary",
  },
  {
    id: "pari-passu",
    title: "Pari Passu",
    excerpt: 'Latin for "on equal footing." When investors share pari passu, they split returns proportionally based on investment size — no one has priority over another.',
    category: "foundational",
    type: "glossary",
    date: "2026-01-20",
    readTime: "Definition",
    href: "#",
    badge: "dim",
    badgeLabel: "Glossary",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  financing: "Financing",
  distribution: "Distribution",
  "business-affairs": "Business Affairs",
  development: "Development",
  ai: "AI in Film",
  foundational: "Foundational",
  news: "News",
};

const CATEGORY_EYEBROW: Record<string, string> = {
  financing: "Financing",
  distribution: "Distribution",
  "business-affairs": "Business Affairs",
  development: "Development",
  ai: "AI in Film",
  foundational: "Foundational",
  news: "Link \u2022 News",
};

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
  const isGlossary = entry.type === "glossary";

  const formattedDate = new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const delay = index % 6;
  const cardReveal: React.CSSProperties = {
    opacity: prefersReducedMotion || inView ? 1 : 0,
    transform: prefersReducedMotion || inView ? "translateY(0)" : "translateY(20px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: prefersReducedMotion ? "0ms" : `${delay * 50}ms`,
  };

  const badgeStyle = (): React.CSSProperties => {
    switch (entry.badge) {
      case "gold":
        return s.badgeGold;
      case "white":
        return s.badgeWhite;
      case "outline":
        return s.badgeOutline;
      default:
        return s.badgeDim;
    }
  };

  const cardStyle: React.CSSProperties = {
    ...s.card,
    ...(entry.priority ? s.cardPriority : {}),
    ...(hovered
      ? entry.priority
        ? s.cardPriorityHover
        : s.cardHover
      : {}),
  };

  const topLineStyle: React.CSSProperties = {
    ...s.cardTopLine,
    ...(entry.priority ? s.cardTopLinePriority : {}),
    ...(hovered && !entry.priority ? s.cardTopLineHover : {}),
  };

  return (
    <a
      ref={ref}
      href={entry.href}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
      style={{ ...cardStyle, ...cardReveal, textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={topLineStyle} />
      <div className="vault-card-header" style={{
        ...s.cardHeader,
        ...(isGlossary ? s.cardHeaderGlossary : {}),
        ...(entry.priority ? { borderBottomColor: "rgba(212,175,55,0.15)" } : {}),
      }}>
        <div style={s.cardHeaderText}>
          <span style={s.cardEyebrow}>{CATEGORY_EYEBROW[entry.category] || entry.category}</span>
          <h3 style={{ ...s.cardTitle, ...(isGlossary ? s.cardTitleGlossary : {}) }}>{entry.title}</h3>
        </div>
        <span style={{ ...s.cardBadge, ...badgeStyle() }}>{entry.badgeLabel}</span>
      </div>
      <div style={{ ...s.cardContent, ...(isGlossary ? { paddingTop: 0 } : {}) }}>
        <p className="card-excerpt" style={s.cardExcerpt}>{entry.excerpt}</p>
        <div style={s.cardBottom}>
          <div style={s.cardMeta}>
            <span style={s.cardDate}>{formattedDate}</span>
            <span style={s.metaDot}>&bull;</span>
            <span style={s.cardRead}>{entry.readTime}</span>
          </div>
          <span style={{
            ...s.cardArrow,
            ...(hovered ? s.cardArrowHover : {}),
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

  // Track whether AppHeader has scrolled away
  const [headerGone, setHeaderGone] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      if (currentY > 80 && currentY > lastScrollYRef.current) {
        setHeaderGone(true);
      } else {
        setHeaderGone(false);
      }
      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

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

  // Scroll refs
  const { ref: headerRef, inView: headerVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: pinnedRef, inView: pinnedVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: gridRef, inView: gridVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.05 });

  // Search & filter state
  const [search, setSearch] = useState("");
  const [activeSort, setActiveSort] = useState<"newest" | "oldest">("newest");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Search focus state
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  // Pinned card hover states
  const [pinnedPrimaryHover, setPinnedPrimaryHover] = useState(false);
  const [pinnedSecondaryHover, setPinnedSecondaryHover] = useState(false);

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

  // Filter & sort logic
  const filteredEntries = VAULT_ENTRIES
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

  const resultsText = search
    ? `${filteredEntries.length} result${filteredEntries.length === 1 ? "" : "s"} for \u201c${search}\u201d`
    : `${filteredEntries.length} Vault Asset${filteredEntries.length === 1 ? "" : "s"}`;

  const dropdownLabel = `${CATEGORY_LABELS[activeFilter]} \u2022 ${activeSort === "newest" ? "Newest" : "Oldest"}`;

  const handleClearSearch = useCallback(() => {
    setSearch("");
    searchRef.current?.focus();
  }, []);

  return (
    <div style={s.page}>
      {/* ═══ VAULT HEADER ═══ */}
      <header ref={headerRef} className="vault-header" style={s.vaultHeader}>
        <div style={s.vaultHeaderGlow} />
        <div style={s.wrap}>
          <h1 style={{ ...s.pageTitle, ...reveal(headerVisible) }}>
            Resource <span style={{ color: "#D4AF37" }}>Vault</span>
          </h1>
          <p style={{ ...s.vaultSub, ...reveal(headerVisible, 1) }}>
            Institutional-grade film finance intelligence. Search it. Study it. Use it.
          </p>
        </div>
      </header>

      {/* ═══ CORNERSTONE PINNED CARDS ═══ */}
      <section ref={pinnedRef} className="pinned-section" style={s.pinnedSection}>
        <div style={s.wrap}>
          <div className="vault-pinned-grid" style={s.pinnedGrid}>
            {/* Primary Cornerstone */}
            <a
              href="#"
              style={{
                ...s.pinnedCard,
                ...s.pinnedPrimary,
                ...reveal(pinnedVisible),
                ...(pinnedPrimaryHover ? s.pinnedPrimaryHover : {}),
              }}
              onMouseEnter={() => setPinnedPrimaryHover(true)}
              onMouseLeave={() => setPinnedPrimaryHover(false)}
            >
              <div style={s.pinnedPrimaryTopLine} />
              <span style={s.pinnedEyebrow}>Cornerstone</span>
              <h2 style={s.pinnedPrimaryTitle}>What Is a Recoupment Waterfall</h2>
              <div style={s.pinnedPrimaryFooter}>
                <span style={s.pinnedBadge}>Start Here</span>
                <span style={{
                  ...s.pinnedArrow,
                  ...(pinnedPrimaryHover ? s.pinnedArrowHover : {}),
                }}>{"\u2192"}</span>
              </div>
            </a>

            {/* Secondary Cornerstone */}
            <a
              href="#"
              style={{
                ...s.pinnedCard,
                ...s.pinnedSecondary,
                ...reveal(pinnedVisible, 1),
                ...(pinnedSecondaryHover ? s.pinnedSecondaryHover : {}),
              }}
              onMouseEnter={() => setPinnedSecondaryHover(true)}
              onMouseLeave={() => setPinnedSecondaryHover(false)}
            >
              <div style={s.pinnedSecondaryTopLine} />
              <span style={s.pinnedEyebrow}>Reference</span>
              <h2 style={s.pinnedSecondaryTitle}>15 Terms Your Investors Expect You to Know</h2>
              <div style={s.pinnedSecondaryFooter}>
                <span style={s.pinnedRead}>Glossary</span>
                <span style={{
                  ...s.pinnedArrow,
                  ...(pinnedSecondaryHover ? s.pinnedArrowHover : {}),
                }}>{"\u2192"}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ RULED DIVIDER ═══ */}
      <div style={s.wrap}>
        <div className="vault-ruled-divider" style={s.ruledDivider}>
          <div style={s.ruledLine} />
        </div>
      </div>

      {/* ═══ COMMAND CENTER (Sticky) ═══ */}
      <section style={s.commandCenter}>
        <div className="vault-command-inner" style={s.commandInner}>
          {/* Nav escape — visible when header is hidden */}
          <button
            onClick={() => {
              haptics.light();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              ...s.commandNavTrigger,
              opacity: headerGone ? 1 : 0,
              width: headerGone ? "36px" : "0px",
              height: "36px",
              padding: 0,
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            aria-label="Back to top"
          >
            <img
              src={filmmakerFIcon}
              alt="F"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
              }}
            />
          </button>

          {/* Search */}
          <div className="vault-search-wrap" style={s.searchWrap}>
            <svg
              style={s.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                  window.dispatchEvent(new Event('vault-search-focus'));
                }
              }}
              onBlur={() => {
                setSearchInputFocused(false);
                window.dispatchEvent(new Event('vault-search-blur'));
              }}
              style={{
                ...s.searchInput,
                ...(searchInputFocused ? {
                  borderColor: "rgba(212,175,55,0.38)",
                  background: "rgba(212,175,55,0.05)",
                  boxShadow: "0 0 16px rgba(212,175,55,0.06)",
                } : {}),
              }}
              autoComplete="off"
            />
            {search && (
              <button
                className="vault-clear-search"
                onClick={handleClearSearch}
                style={s.clearSearch}
                aria-label="Clear search"
              >
                {"\u2715"}
              </button>
            )}
          </div>

          {/* Dropdown */}
          <div ref={dropdownRef} className="vault-control-dropdown" style={s.controlDropdown}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                haptics.light();
                setDropdownOpen((o) => !o);
              }}
              className="vault-dropdown-btn"
              data-has-filter={(activeFilter !== "all" || activeSort !== "newest") ? "true" : "false"}
              style={{
                ...s.dropdownBtn,
                ...(dropdownOpen ? s.dropdownBtnOpen : {}),
              }}
            >
              <span className="vault-dropdown-text">{dropdownLabel}</span>
              <svg
                className="vault-dropdown-mobile-icon"
                style={{ display: "none" }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <svg
                className="vault-dropdown-chevron"
                style={{
                  width: 12,
                  height: 12,
                  transition: "transform 0.2s",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="vault-dropdown-panel" style={s.dropdownPanel}>
                <div style={s.panelSectionTitle}>Sort</div>
                {(["newest", "oldest"] as const).map((val) => (
                  <button
                    key={val}
                    style={{
                      ...s.panelItem,
                      ...(activeSort === val ? s.panelItemActive : {}),
                    }}
                    onClick={() => {
                      haptics.light();
                      setActiveSort(val);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{val === "newest" ? "Newest First" : "Oldest First"}</span>
                    {activeSort === val && <span style={s.panelCheck}>{"\u2713"}</span>}
                  </button>
                ))}
                <div style={s.panelDivider} />
                <div style={s.panelSectionTitle}>Category</div>
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    style={{
                      ...s.panelItem,
                      ...(activeFilter === val ? s.panelItemActive : {}),
                    }}
                    onClick={() => {
                      haptics.light();
                      setActiveFilter(val);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{label}</span>
                    {activeFilter === val && <span style={s.panelCheck}>{"\u2713"}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CONTENT GRID ═══ */}
      <section style={s.contentSection}>
        <div style={s.wrap}>
          {/* Results Bar */}
          {search && (
            <div style={s.resultsBar}>
              <span style={s.resultsCount}>{resultsText}</span>
            </div>
          )}

          {/* Grid */}
          {filteredEntries.length > 0 ? (
            <div ref={gridRef} className="vault-grid" style={s.grid}>
              {filteredEntries.map((entry, i) => (
                <VaultCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          ) : (
            <div style={s.noResults}>
              No assets found matching those parameters.
            </div>
          )}
        </div>
      </section>

      {/* ═══ TERMINAL FOOTER ═══ */}
      <footer ref={footerRef} style={{ ...s.terminalFooter, ...reveal(footerVisible) }}>
        <a href="#" style={s.indexLink}>[ MASTER INDEX ]</a>
      </footer>
    </div>
  );
};

// ------------------------------------------------------------------
// STYLES
// ------------------------------------------------------------------
const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#000",
    color: "rgba(255,255,255,0.95)",
    fontFamily: "'Inter', sans-serif",
    WebkitFontSmoothing: "antialiased",
    lineHeight: 1.6,
    minHeight: "100vh",
  },
  wrap: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "0 24px",
  },

  // ── Command Nav Trigger ──
  commandNavTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "50%",
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.20)",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // ── Vault Header ──
  vaultHeader: {
    padding: "48px 0 24px",
    textAlign: "center",
    position: "relative",
  },
  vaultHeaderGlow: {
    position: "absolute",
    top: "-10%",
    left: 0,
    right: 0,
    height: "70%",
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  pageTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3.5rem, 7vw, 5rem)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    lineHeight: 1,
    color: "rgba(255,255,255,0.95)",
    position: "relative",
    zIndex: 1,
    margin: 0,
  },
  vaultSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    marginTop: 12,
    position: "relative",
    zIndex: 1,
  },

  // ── Pinned Section ──
  pinnedSection: {
    padding: "0 0 16px",
  },
  pinnedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,
  },
  pinnedCard: {
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    textAlign: "left",
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    color: "inherit",
  },
  pinnedPrimary: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.25)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.03)",
    padding: "18px 20px",
  },
  pinnedPrimaryHover: {
    transform: "translateY(-3px)",
    borderColor: "#D4AF37",
    boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 50px rgba(212,175,55,0.12)",
  },
  pinnedPrimaryTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
  },
  pinnedEyebrow: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#D4AF37",
    marginBottom: 6,
    display: "block",
  },
  pinnedPrimaryTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.7rem",
    color: "#fff",
    lineHeight: 1,
    letterSpacing: "0.03em",
    marginBottom: 12,
    margin: 0,
    marginTop: 0,
  },
  pinnedPrimaryFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  pinnedBadge: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#000",
    background: "#D4AF37",
    padding: "6px 12px",
    borderRadius: 4,
    fontWeight: 600,
    boxShadow: "0 0 12px rgba(212,175,55,0.4)",
  },
  pinnedArrow: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 16,
    transition: "all 0.3s",
  },
  pinnedArrowHover: {
    color: "#D4AF37",
    transform: "translateX(6px)",
  },

  pinnedSecondary: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.15)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
    padding: "18px 18px",
    display: "flex",
    flexDirection: "column",
  },
  pinnedSecondaryHover: {
    transform: "translateY(-3px)",
    borderColor: "rgba(212,175,55,0.25)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.05)",
  },
  pinnedSecondaryTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
  },
  pinnedSecondaryTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.45rem",
    color: "#fff",
    lineHeight: 1,
    letterSpacing: "0.03em",
    marginBottom: 8,
    margin: 0,
  },
  pinnedSecondaryFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  pinnedRead: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
  },

  // ── Ruled Divider ──
  ruledDivider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  ruledLine: {
    flex: 1,
    height: 1,
    background: "rgba(212,175,55,0.25)",
  },

  // ── Command Center ──
  commandCenter: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(0,0,0,0.88)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderTop: "1px solid rgba(212,175,55,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "14px 0",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.9)",
  },
  commandInner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    maxWidth: 1000,
    margin: "0 auto",
    padding: "0 24px",
  },
  searchWrap: {
    flex: 1,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: "translateY(-50%)",
    width: 18,
    height: 18,
    color: "rgba(212,175,55,0.60)",
    pointerEvents: "none",
    transition: "color 0.3s",
  },
  searchInput: {
    width: "100%",
    background: "rgba(212,175,55,0.03)",
    border: "1px solid rgba(212,175,55,0.25)",
    boxShadow: "0 0 12px rgba(212,175,55,0.06)",
    borderRadius: 12,
    color: "rgba(255,255,255,0.95)",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    height: 50,
    padding: "0 44px 0 52px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  clearSearch: {
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
  },
  controlDropdown: {
    position: "relative",
    flexShrink: 0,
  },
  dropdownBtn: {
    position: "relative",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.95)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    height: 50,
    padding: "0 16px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },
  dropdownBtnOpen: {
    borderColor: "rgba(212,175,55,0.15)",
    color: "#D4AF37",
  },
  dropdownPanel: {
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
  },
  panelSectionTitle: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#D4AF37",
    padding: "12px 20px 8px",
    fontWeight: 600,
    opacity: 0.6,
  },
  panelDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "8px 0",
  },
  panelItem: {
    padding: "16px 20px",
    background: "transparent",
    border: "none",
    borderLeft: "2px solid transparent",
    color: "rgba(255,255,255,0.45)",
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
  },
  panelItemActive: {
    color: "#D4AF37",
    background: "rgba(212,175,55,0.03)",
    borderLeftColor: "#D4AF37",
  },
  panelCheck: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 12,
  },

  // ── Content Section ──
  contentSection: {
    padding: "20px 0 100px",
  },
  resultsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 24,
    marginBottom: 28,
    borderBottom: "none",
  },
  resultsCount: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  // ── Content Cards ──
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,
  },
  card: {
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    textAlign: "left",
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.15)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  cardHover: {
    borderColor: "rgba(212,175,55,0.25)",
    transform: "translateY(-3px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.03)",
  },
  cardPriority: {
    borderColor: "rgba(212,175,55,0.25)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.03)",
  },
  cardPriorityHover: {
    borderColor: "#D4AF37",
    transform: "translateY(-3px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.1)",
  },
  cardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
    transition: "all 0.3s",
  },
  cardTopLineHover: {
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
  },
  cardTopLinePriority: {
    height: 2,
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
  },
  cardHeader: {
    padding: "20px 20px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  cardHeaderGlossary: {
    paddingBottom: 14,
    borderBottom: "none",
  },
  cardHeaderText: {
    flex: 1,
  },
  cardEyebrow: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#D4AF37",
    marginBottom: 6,
    display: "block",
  },
  cardTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.6rem",
    color: "#fff",
    lineHeight: 1,
    letterSpacing: "0.03em",
    margin: 0,
  },
  cardTitleGlossary: {
    fontSize: "1.5rem",
  },
  cardBadge: {
    display: "inline-block",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    padding: "6px 12px",
    borderRadius: 4,
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  badgeGold: {
    color: "#000",
    background: "#D4AF37",
    boxShadow: "0 0 12px rgba(212,175,55,0.4)",
  },
  badgeWhite: {
    color: "#000",
    background: "#fff",
    boxShadow: "0 0 12px rgba(255,255,255,0.2)",
  },
  badgeOutline: {
    color: "#D4AF37",
    background: "rgba(212,175,55,0.03)",
    border: "1px solid rgba(212,175,55,0.25)",
  },
  badgeDim: {
    color: "rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  cardContent: {
    padding: "16px 20px 20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardExcerpt: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.70)",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    margin: 0,
  },
  cardBottom: {
    marginTop: "auto",
    paddingTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  cardDate: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.45)",
    opacity: 0.7,
  },
  cardRead: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
  },
  metaDot: {
    color: "rgba(255,255,255,0.08)",
    fontSize: 8,
  },
  cardArrow: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 16,
    transition: "all 0.3s",
  },
  cardArrowHover: {
    color: "#D4AF37",
    transform: "translateX(6px)",
  },

  // ── No Results ──
  noResults: {
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
  },

  // ── Terminal Footer ──
  terminalFooter: {
    padding: "48px 0 80px",
    textAlign: "center",
  },
  indexLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    textDecoration: "none",
    paddingBottom: 4,
    borderBottom: "1px solid transparent",
    transition: "all 0.3s",
  },
};

// ── Responsive media query injection ──
const RESPONSIVE_STYLE_ID = "vault-responsive";
if (typeof document !== "undefined" && !document.getElementById(RESPONSIVE_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = RESPONSIVE_STYLE_ID;
  style.textContent = `
    a, button { -webkit-tap-highlight-color: transparent; }
    .vault-search-input::placeholder { color: rgba(255,255,255,0.55) !important; }
    @media (max-width: 767px) {
      .vault-pinned-grid {
        display: flex !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        gap: 12px !important;
        margin: 0 -24px 0 -24px !important;
        padding: 0 20px 8px 24px !important;
        scrollbar-width: none !important;
      }
      .vault-pinned-grid::-webkit-scrollbar { display: none !important; }
      .vault-pinned-grid > a {
        flex: 0 0 78% !important;
        scroll-snap-align: start !important;
        min-width: 0 !important;
      }
      .pinned-section .wrap { position: relative !important; }
      .pinned-section .wrap::after {
        content: '';
        position: absolute;
        top: 0; right: 0; bottom: 0; width: 40px;
        background: linear-gradient(to left, #000 0%, transparent 100%);
        pointer-events: none;
        z-index: 10;
      }
      .vault-command-inner { gap: 8px !important; }
      .vault-search-wrap { flex: 1 !important; min-width: 0 !important; }
      .vault-search-input { font-size: 16px !important; height: 46px !important; padding: 0 40px 0 44px !important; }
      .vault-clear-search { width: 44px !important; height: 44px !important; right: 4px !important; }
      .vault-control-dropdown { flex-shrink: 0 !important; }
      .vault-dropdown-btn {
        justify-content: center !important;
        width: 50px !important;
        height: 50px !important;
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
      .vault-grid { grid-template-columns: 1fr !important; }
      .vault-header { padding-top: 36px !important; }
      .pinned-section { padding-bottom: 8px !important; }
      .vault-ruled-divider { display: none !important; }
      .card-excerpt { -webkit-line-clamp: 2 !important; }
    }
  `;
  document.head.appendChild(style);
}

export default Resources;
