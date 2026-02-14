import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  GENRE_OPTIONS,
  type IntakeFormData,
} from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
}

const IntakeStep1 = ({ formData, updateFormData, onNext }: Props) => {
  const [showCustomGenre, setShowCustomGenre] = useState(
    formData.genre !== "" && !GENRE_OPTIONS.slice(0, -1).includes(formData.genre)
  );

  const canProceed =
    formData.project_title.trim().length >= 2 &&
    formData.production_company.trim().length >= 2 &&
    formData.genre.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          TELL US ABOUT YOUR PROJECT
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          This information appears on the cover page of your finance plan. Use
          your working title — you can always update it later.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {/* Project Title */}
        <div>
          <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
            Project Title <span className="text-gold">*</span>
          </label>
          <Input
            value={formData.project_title}
            onChange={(e) => updateFormData({ project_title: e.target.value })}
            placeholder="Enter your project's working title"
            className="bg-bg-elevated border-border-subtle text-text-primary h-12"
          />
        </div>

        {/* Production Company */}
        <div>
          <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
            Production Company <span className="text-gold">*</span>
          </label>
          <Input
            value={formData.production_company}
            onChange={(e) =>
              updateFormData({ production_company: e.target.value })
            }
            placeholder="Your production company name"
            className="bg-bg-elevated border-border-subtle text-text-primary h-12"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
            Genre <span className="text-gold">*</span>
          </label>
          <select
            value={
              showCustomGenre
                ? "Other"
                : GENRE_OPTIONS.includes(formData.genre)
                  ? formData.genre
                  : ""
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Other") {
                setShowCustomGenre(true);
                updateFormData({ genre: "" });
              } else {
                setShowCustomGenre(false);
                updateFormData({ genre: val });
              }
            }}
            className="w-full h-12 px-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/50"
          >
            <option value="" disabled>
              Select genre
            </option>
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {showCustomGenre && (
            <Input
              value={formData.genre}
              onChange={(e) => updateFormData({ genre: e.target.value })}
              placeholder="Enter your genre"
              className="bg-bg-elevated border-border-subtle text-text-primary h-12 mt-3"
            />
          )}
          <p className="text-text-dim text-[11px] mt-2 leading-relaxed">
            Genre determines which comparable films we reference in your finance
            plan. Pick the closest match — hybrid genres are common, choose the
            primary market category.
          </p>
        </div>

        {/* Logline */}
        <div>
          <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
            Logline{" "}
            <span className="text-text-dim/60 normal-case">(optional)</span>
          </label>
          <textarea
            value={formData.logline}
            onChange={(e) => {
              if (e.target.value.length <= 300) {
                updateFormData({ logline: e.target.value });
              }
            }}
            placeholder="One or two sentences describing your project"
            rows={3}
            className="w-full px-3 py-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-sm resize-none focus:outline-none focus:border-gold/50"
          />
          <p className="text-text-dim text-[11px] text-right">
            {formData.logline.length}/300
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-2 h-14 px-8 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
            "bg-gold/[0.22] border-2 border-gold/60 text-gold text-sm",
            "hover:border-gold/80 hover:bg-gold/[0.28]",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IntakeStep1;
