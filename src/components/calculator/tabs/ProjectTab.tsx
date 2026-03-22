import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import type { ProjectDetails } from "@/pages/Calculator";

interface ProjectTabProps {
  project: ProjectDetails;
  onUpdateProject: (project: ProjectDetails) => void;
  onAdvance: () => void;
}

const GENRES = [
  "Action", "Thriller", "Comedy", "Drama", "Horror",
  "Romance", "Sci-Fi", "Doc", "Animation", "Other",
];

const STATUSES = ["Development", "Pre-Prod", "Production", "Post"];

/* ═══ Style constants ═══ */

const warmCard: React.CSSProperties = {
  position: "relative",
  background: "#0A0A0A",
  border: "1px solid rgba(212,175,55,0.35)",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 24px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.10)",
  marginBottom: 16,
};

const warmGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 220,
  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)",
  pointerEvents: "none",
};

const warmTopline: React.CSSProperties = {
  height: 2,
  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.60), transparent)",
  position: "relative",
  overflow: "hidden",
};

const warmToplineShimmer: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "-100%",
  width: "60%",
  height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
  animation: "toplineShimmer 8s ease-in-out infinite",
};

const dataCard: React.CSSProperties = {
  position: "relative",
  background: "#0A0A0A",
  border: "1px solid rgba(212,175,55,0.20)",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 16,
};

const dataGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 140,
  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 70%)",
  pointerEvents: "none",
};

const dataTopline: React.CSSProperties = {
  height: 1,
  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)",
};

const separator: React.CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,0.06)",
  margin: "20px -24px",
};

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  pad: {
    position: "relative",
    padding: "24px 24px",
  },
  fg: {
    marginBottom: 20,
  },
  fl: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "rgba(212,175,55,0.75)",
    marginBottom: 8,
    display: "block",
  },
  flOpt: {
    fontWeight: 400,
    letterSpacing: "0.06em",
    textTransform: "none",
    color: "rgba(255,255,255,0.40)",
    marginLeft: 6,
    fontSize: 10,
  },
  fi: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: 8,
    padding: "14px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    WebkitAppearance: "none" as const,
    minHeight: 48,
  },
  genreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  pill: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: "9px 8px",
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.60)",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  pillOn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 8px",
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid rgba(120,60,180,0.50)",
    background: "rgba(120,60,180,0.14)",
    color: "rgba(190,160,240,1.0)",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    boxShadow: "0 0 14px rgba(120,60,180,0.20)",
  },
  statusPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  hint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: "rgba(255,255,255,0.40)",
    marginTop: 6,
    lineHeight: 1.4,
  },
  // Team card
  teamTrigger: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  teamHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  teamTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(212,175,55,0.70)",
  },
  teamOptional: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    color: "rgba(255,255,255,0.40)",
  },
  teamRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  teamFieldCount: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
  teamBody: {
    maxHeight: 0,
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.25s ease",
    opacity: 0,
  },
  teamBodyOpen: {
    maxHeight: 700,
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.25s ease",
    opacity: 1,
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    padding: "0 24px 20px",
  },
  teamFg: {
    marginBottom: 0,
  },
  teamFl: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "rgba(212,175,55,0.60)",
    marginBottom: 6,
    display: "block",
  },
  teamFi: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 8,
    padding: "12px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: "rgba(255,255,255,0.95)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    WebkitAppearance: "none" as const,
    minHeight: 44,
  },
  teamFiFullWidth: {
    gridColumn: "1 / -1",
  },
  // CTA
  reveal: {
    opacity: 0,
    transform: "translateY(12px)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "none" as const,
  },
  revealVis: {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
    pointerEvents: "auto" as const,
  },
  cta: {
    width: "100%",
    padding: 16,
    marginTop: 24,
    background: "#F9E076",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 20,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "transform 0.12s ease, opacity 0.15s, box-shadow 0.2s ease",
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.15)",
    minHeight: 56,
  },
  skip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 48,
    marginTop: 14,
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "rgba(255,255,255,0.40)",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
  },
  autosave: {
    textAlign: "right",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.30)",
    marginTop: 16,
  },
};

const ProjectTab = ({ project, onUpdateProject, onAdvance }: ProjectTabProps) => {
  const haptics = useHaptics();
  const [teamOpen, setTeamOpen] = useState(false);
  const [pressedPill, setPressedPill] = useState<string | null>(null);
  const [ctaPressed, setCtaPressed] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  const update = (key: keyof ProjectDetails, value: string) => {
    onUpdateProject({ ...project, [key]: value });
  };

  const handleGenreSelect = (genre: string) => {
    if (genre === "Other") {
      onUpdateProject({ ...project, genre: "Other" });
    } else {
      onUpdateProject({ ...project, genre, customGenre: "" });
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(212,175,55,0.45)";
    e.target.style.boxShadow = "0 0 16px rgba(212,175,55,0.12)";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(212,175,55,0.25)";
    e.target.style.boxShadow = "none";
  };

  const handleTeamInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(212,175,55,0.35)";
    e.target.style.boxShadow = "0 0 12px rgba(212,175,55,0.08)";
  };

  const handleTeamInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.10)";
    e.target.style.boxShadow = "none";
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      setTimeout(() => onAdvance(), 100);
    }
  };

  const canProceed = project.title.trim().length > 0;

  return (
    <div style={s.wrapper}>
      {/* ═══ Warm Card — Title + Logline + Genre + Status ═══ */}
      <div style={warmCard}>
        <div style={warmGlow} />
        <div style={warmTopline}>
          <div style={warmToplineShimmer} />
        </div>
        <div style={s.pad}>
          {/* Project Title */}
          <div style={s.fg}>
            <label style={s.fl}>Project Title</label>
            <input
              style={s.fi}
              type="text"
              placeholder="Untitled Feature"
              value={project.title}
              onChange={(e) => update("title", e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleTitleKeyDown}
              enterKeyHint="next"
            />
          </div>

          {/* Logline */}
          <div style={s.fg}>
            <label style={s.fl}>
              Logline <span style={s.flOpt}>optional</span>
            </label>
            <input
              style={s.fi}
              type="text"
              placeholder="One sentence — what's the movie about?"
              value={project.logline}
              onChange={(e) => update("logline", e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              enterKeyHint="next"
            />
          </div>

          <div style={separator} />

          {/* Genre — 3-column grid */}
          <div style={s.fg}>
            <label style={s.fl}>Genre</label>
            <div style={s.genreGrid}>
              {GENRES.map((genre) => {
                const isSelected = project.genre === genre;
                const isPressed = pressedPill === genre;
                return (
                  <button
                    key={genre}
                    style={{
                      ...(isSelected ? s.pillOn : s.pill),
                      ...(isPressed ? { transform: "scale(0.96)" } : {}),
                    }}
                    onClick={(e) => { haptics.light(e); handleGenreSelect(genre); }}
                    onPointerDown={() => setPressedPill(genre)}
                    onPointerUp={() => setPressedPill(null)}
                    onPointerLeave={() => setPressedPill(null)}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
            {project.genre === "Other" && (
              <div style={{ marginTop: 10 }}>
                <input
                  style={s.fi}
                  type="text"
                  placeholder="e.g. Western, Musical, Mockumentary"
                  value={project.customGenre}
                  onChange={(e) => update("customGenre", e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  autoFocus
                />
              </div>
            )}
          </div>

          <div style={separator} />

          {/* Project Status */}
          <div style={{ ...s.fg, marginBottom: 0 }}>
            <label style={s.fl}>Project Status</label>
            <div style={s.statusPills}>
              {STATUSES.map((status) => {
                const isSelected = project.status === status;
                const isPressed = pressedPill === `status-${status}`;
                return (
                  <button
                    key={status}
                    style={{
                      ...(isSelected ? s.pillOn : s.pill),
                      ...(isPressed ? { transform: "scale(0.96)" } : {}),
                    }}
                    onClick={(e) => { haptics.light(e); update("status", status); }}
                    onPointerDown={() => setPressedPill(`status-${status}`)}
                    onPointerUp={() => setPressedPill(null)}
                    onPointerLeave={() => setPressedPill(null)}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Data Card — Team Details (collapsed) ═══ */}
      <div style={dataCard}>
        <div style={dataGlow} />
        <div style={dataTopline} />
        <div
          style={s.teamTrigger}
          onClick={(e) => { haptics.light(e); setTeamOpen(!teamOpen); }}
        >
          <div style={s.teamHeaderLeft}>
            <span style={s.teamTitle}>Team Details</span>
            <span style={s.teamOptional}>optional</span>
          </div>
          <div style={s.teamRight}>
            <span style={s.teamFieldCount}>6 fields</span>
            <ChevronDown
              style={{
                width: 16,
                height: 16,
                color: "rgba(212,175,55,0.45)",
                transition: "transform 0.25s",
                transform: teamOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        <div style={teamOpen ? s.teamBodyOpen : s.teamBody}>
          <div style={s.teamGrid}>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Producer(s)</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="Producer name(s)"
                value={project.producers}
                onChange={(e) => update("producers", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Director</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="Director name"
                value={project.director}
                onChange={(e) => update("director", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Writer(s)</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="Writer name(s)"
                value={project.writers}
                onChange={(e) => update("writers", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Cast</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="Lead cast names"
                value={project.cast}
                onChange={(e) => update("cast", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Company / SPV</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="Entity name"
                value={project.company}
                onChange={(e) => update("company", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.teamFg}>
              <label style={s.teamFl}>Location</label>
              <input
                style={s.teamFi}
                type="text"
                placeholder="City, State"
                value={project.location}
                onChange={(e) => update("location", e.target.value)}
                onFocus={handleTeamInputFocus}
                onBlur={handleTeamInputBlur}
                enterKeyHint="done"
              />
            </div>
            <div style={{ ...s.teamFg, ...s.teamFiFullWidth }}>
              <p style={s.hint}>
                "Attached" = signed LOI. "Wishlist" = targeting. Be honest — investors will verify.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CTA — reveals when title has text ═══ */}
      <div style={canProceed ? s.revealVis : s.reveal}>
        <button
          style={{
            ...s.cta,
            ...(ctaHovered ? { boxShadow: "0 0 30px rgba(249,224,118,0.35), 0 0 80px rgba(249,224,118,0.20)" } : {}),
            ...(ctaPressed ? { transform: "scale(0.98)" } : {}),
          }}
          onClick={(e) => { haptics.medium(e); onAdvance(); }}
          onPointerDown={() => setCtaPressed(true)}
          onPointerUp={() => setCtaPressed(false)}
          onPointerLeave={() => { setCtaPressed(false); setCtaHovered(false); }}
          onMouseEnter={() => setCtaHovered(true)}
        >
          Set Your Budget
          <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Skip link */}
      <button style={s.skip} onClick={onAdvance}>
        Skip project details
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      {/* Autosave */}
      <p style={s.autosave}>Session data — stays in your browser</p>
    </div>
  );
};

export default ProjectTab;
