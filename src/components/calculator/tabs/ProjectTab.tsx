import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import type { ProjectDetails } from "@/pages/Calculator";
import ChapterCard, { cardH, cardHSub } from "../ChapterCard";

interface ProjectTabProps {
  project: ProjectDetails;
  onUpdateProject: (project: ProjectDetails) => void;
  onAdvance: () => void;
}

const GENRES = [
  "Action", "Thriller", "Comedy", "Drama", "Horror",
  "Romance", "Sci-Fi / Fantasy", "Documentary", "Animation", "Other",
];

const STATUSES = ["Development", "Pre-Production", "Production", "Post-Production"];

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  fg: {
    marginBottom: "20px",
  },
  fl: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(212,175,55,0.50)",
    marginBottom: "8px",
    display: "block",
  },
  flOpt: {
    fontWeight: 400,
    letterSpacing: "0.06em",
    textTransform: "none" as const,
    color: "rgba(255,255,255,0.40)",
    marginLeft: "6px",
    fontSize: "10px",
  },
  fi: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.20)",
    borderRadius: "8px",
    padding: "14px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    color: "rgba(255,255,255,0.85)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    WebkitAppearance: "none" as const,
    minHeight: "48px",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },
  pill: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    padding: "9px 16px",
    minHeight: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: "1px solid rgba(212,175,55,0.20)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.65)",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  pillOn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    padding: "9px 16px",
    minHeight: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: "1px solid rgba(120,60,180,0.40)",
    background: "rgba(120,60,180,0.08)",
    color: "rgba(120,60,180,0.85)",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
    boxShadow: "0 0 12px rgba(120,60,180,0.15)",
  },
  expTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "14px 0",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: "20px",
  },
  expLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  expTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.65)",
  },
  expHint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    color: "rgba(255,255,255,0.40)",
  },
  expBody: {
    maxHeight: 0,
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.25s ease",
    opacity: 0,
  },
  expBodyOpen: {
    maxHeight: "700px",
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.25s ease",
    opacity: 1,
  },
  expInner: {
    paddingTop: "16px",
  },
  hint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    color: "rgba(255,255,255,0.40)",
    marginTop: "6px",
    lineHeight: 1.4,
  },
  // CTA reveal
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
    padding: "16px",
    marginTop: "24px",
    background: "#F9E076",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "20px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "transform 0.12s ease, opacity 0.15s, box-shadow 0.2s ease",
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.15)",
    minHeight: "56px",
  },
  skip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    minHeight: "48px",
    marginTop: "14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.40)",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
  },
  autosave: {
    textAlign: "center" as const,
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.40)",
    marginTop: "16px",
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
    e.target.style.borderColor = "rgba(212,175,55,0.20)";
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
      <ChapterCard chapter="00" title="Project Details" isActive={true} variant="neutral">
        <div style={cardH}>What Are You Building?</div>
        <div style={cardHSub}>Tell us about the project — or jump straight to the numbers</div>

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

        {/* Genre */}
        <div style={s.fg}>
          <label style={s.fl}>Genre</label>
          <div style={s.pills}>
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
            <div style={{ marginTop: "10px" }}>
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

        {/* Project Status */}
        <div style={s.fg}>
          <label style={s.fl}>Project Status</label>
          <div style={s.pills}>
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

        {/* Team Details — collapsible */}
        <button
          style={s.expTrigger}
          onClick={(e) => { haptics.light(e); setTeamOpen(!teamOpen); }}
        >
          <div style={s.expLeft}>
            <span style={s.expTitle}>Team Details</span>
            <span style={s.expHint}>producer, director, writer, cast</span>
          </div>
          <ChevronDown
            style={{
              width: "16px",
              height: "16px",
              color: "rgba(212,175,55,0.40)",
              transition: "transform 0.25s",
              transform: teamOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        <div style={teamOpen ? s.expBodyOpen : s.expBody}>
          <div style={s.expInner}>
            <div style={s.fg}>
              <label style={s.fl}>Producer(s) <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="Producer name(s)"
                value={project.producers}
                onChange={(e) => update("producers", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.fg}>
              <label style={s.fl}>Director <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="Director name"
                value={project.director}
                onChange={(e) => update("director", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.fg}>
              <label style={s.fl}>Writer(s) <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="Writer name(s)"
                value={project.writers}
                onChange={(e) => update("writers", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={s.fg}>
              <label style={s.fl}>Attached / Wishlist Cast <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="Lead cast names"
                value={project.cast}
                onChange={(e) => update("cast", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="next"
              />
              <p style={s.hint}>
                "Attached" = signed LOI. "Wishlist" = targeting. Be honest — investors will verify.
              </p>
            </div>
            <div style={s.fg}>
              <label style={s.fl}>Production Company / SPV <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="Entity name (LLC, Inc, etc.)"
                value={project.company}
                onChange={(e) => update("company", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="next"
              />
            </div>
            <div style={{ ...s.fg, marginBottom: 0 }}>
              <label style={s.fl}>Primary Shooting Location <span style={s.flOpt}>optional</span></label>
              <input
                style={s.fi}
                type="text"
                placeholder="City, State / Country"
                value={project.location}
                onChange={(e) => update("location", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                enterKeyHint="done"
              />
            </div>
          </div>
        </div>

        {/* CTA — reveals when title has text */}
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
            Continue to Budget
            <ArrowRight style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Skip link */}
        <button style={s.skip} onClick={onAdvance}>
          Jump to Budget
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </ChapterCard>

      {/* Autosave indicator */}
      <p style={s.autosave}>Session data — stays in your browser</p>
    </div>
  );
};

export default ProjectTab;
