import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import {
  INITIAL_FORM_DATA,
  STEP_LABELS,
  type IntakeFormData,
} from "@/lib/intake-types";
import { useIntakeAutoSave } from "@/hooks/useIntakeAutoSave";
import IntakeStep1 from "@/components/intake/IntakeStep1";
import IntakeStep2 from "@/components/intake/IntakeStep2";
import IntakeStep3 from "@/components/intake/IntakeStep3";
import IntakeStep4 from "@/components/intake/IntakeStep4";
import IntakeStep5 from "@/components/intake/IntakeStep5";
import IntakeStep6 from "@/components/intake/IntakeStep6";

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════ */
const ProgressBar = ({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEP_LABELS.map((label, i) => {
      const stepNum = i + 1;
      const isCompleted = stepNum < currentStep;
      const isCurrent = stepNum === currentStep;
      const isFuture = stepNum > currentStep;
      return (
        <div key={label} className="flex items-center">
          {/* Connector line (before each step except first) */}
          {i > 0 && (
            <div
              className={cn(
                "w-6 sm:w-10 h-[2px] transition-colors",
                isCompleted ? "bg-gold" : "bg-white/10"
              )}
            />
          )}
          {/* Step circle + label */}
          <button
            onClick={() => stepNum <= currentStep && onStepClick(stepNum)}
            disabled={isFuture}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all",
                isCompleted &&
                  "bg-gold text-black",
                isCurrent &&
                  "border-2 border-gold text-gold bg-transparent",
                isFuture &&
                  "border border-white/15 text-white/25 bg-transparent cursor-not-allowed"
              )}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                stepNum
              )}
            </div>
            <span
              className={cn(
                "text-[9px] tracking-[0.12em] uppercase font-semibold hidden sm:block",
                isCompleted && "text-gold",
                isCurrent && "text-gold",
                isFuture && "text-white/25"
              )}
            >
              {label}
            </span>
          </button>
        </div>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   CONFIRMATION SCREEN
   ═══════════════════════════════════════════════════════════════════ */
const ConfirmationScreen = ({ email }: { email: string }) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 animate-fade-in">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 border-2 border-gold mx-auto mb-6 rounded-lg flex items-center justify-center">
        <Check className="w-10 h-10 text-gold" />
      </div>
      <h1 className="font-bebas text-[40px] text-white mb-4">
        YOUR FINANCE PLAN HAS BEEN SUBMITTED
      </h1>
      <p className="text-ink-body text-[14px] leading-relaxed mb-2">
        We're building your deliverables now.
      </p>
      <p className="text-ink-body text-[14px] leading-relaxed mb-6">
        You'll receive an email at{" "}
        <span className="text-white font-semibold">{email}</span> within 24
        hours.
      </p>
      <p className="text-ink-secondary text-[12px] leading-relaxed">
        Questions? Email{" "}
        <a
          href="mailto:thefilmmaker.og@gmail.com"
          className="text-gold hover:text-gold/80 transition-colors"
        >
          thefilmmaker.og@gmail.com
        </a>
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN BUILD YOUR PLAN PAGE
   ═══════════════════════════════════════════════════════════════════ */
const BuildYourPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const sessionId = searchParams.get("session_id");

  // State
  const [loading, setLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [tier, setTier] = useState<string>("the-blueprint");
  const [includesWorkingModel, setIncludesWorkingModel] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const { debouncedSave, saveNow } = useIntakeAutoSave(submissionId);

  // Validate purchase on mount
  useEffect(() => {
    const validatePurchase = async () => {
      try {
        // Check auth
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setUserId(user.id);

        let purchase: any = null;

        // Method 1: session_id from URL
        if (sessionId) {
          const { data } = await supabase
            .from("purchases")
            .select("*")
            .eq("stripe_session_id", sessionId)
            .eq("status", "completed")
            .maybeSingle();
          purchase = data;
        }

        // Method 2: authenticated user's most recent purchase (if no session_id)
        if (!purchase && user) {
          const { data } = await supabase
            .from("purchases")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "completed")
            .in("product_id", [
              "the-blueprint",
              "the-pitch-package",
              "the-blueprint,the-working-model-discount",
              "the-pitch-package,the-working-model-discount",
              "the-blueprint,the-working-model",
              "the-pitch-package,the-working-model",
            ])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          purchase = data;
        }

        if (!purchase) {
          toast.error("No valid purchase found. Please complete checkout first.");
          navigate("/store");
          return;
        }

        setPurchaseId(purchase.id);
        setEmail(purchase.email);

        // Determine tier from product_id
        const productIds = (purchase.product_id as string).split(",");
        const baseTier = productIds.find(
          (id: string) => id === "the-blueprint" || id === "the-pitch-package"
        ) || "the-blueprint";
        setTier(baseTier);
        setIncludesWorkingModel(
          productIds.some(
            (id: string) =>
              id === "the-working-model" ||
              id === "the-working-model-discount"
          )
        );

        // Check for existing submission
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingSub } = await (supabase as any)
          .from("intake_submissions")
          .select("*")
          .eq("purchase_id", purchase.id)
          .maybeSingle();

        if (existingSub) {
          // Resume existing submission
          setSubmissionId(existingSub.id);
          setCurrentStep(existingSub.current_step || 1);
          if (existingSub.status === "submitted") {
            setSubmitted(true);
            setLoading(false);
            return;
          }
          // Populate form data from existing submission
          setFormData((prev) => ({
            ...prev,
            project_title: existingSub.project_title || "",
            production_company: existingSub.production_company || "",
            genre: existingSub.genre || "",
            logline: existingSub.logline || "",
            total_budget: existingSub.total_budget,
            equity_investors:
              Array.isArray(existingSub.equity_investors) && existingSub.equity_investors.length > 0
                ? existingSub.equity_investors as any
                : prev.equity_investors,
            has_debt:
              Array.isArray(existingSub.debt_tranches) && existingSub.debt_tranches.length > 0 && (existingSub.debt_tranches as any[])[0]?.principal != null,
            debt_tranches:
              Array.isArray(existingSub.debt_tranches) && existingSub.debt_tranches.length > 0
                ? existingSub.debt_tranches as any
                : prev.debt_tranches,
            soft_money:
              Array.isArray(existingSub.soft_money) && existingSub.soft_money.length > 0
                ? existingSub.soft_money as any
                : prev.soft_money,
            has_deferments:
              Array.isArray(existingSub.deferments) && existingSub.deferments.length > 0 && (existingSub.deferments as any[])[0]?.role !== "",
            deferments:
              Array.isArray(existingSub.deferments) && existingSub.deferments.length > 0
                ? existingSub.deferments as any
                : prev.deferments,
            distribution_model: existingSub.distribution_model || "",
            sa_domestic_commission_pct: existingSub.sa_domestic_commission_pct ?? 12.5,
            sa_international_commission_pct: existingSub.sa_international_commission_pct ?? 22.5,
            sa_expense_cap: existingSub.sa_expense_cap ?? 75000,
            sa_domestic_commission_is_default: existingSub.sa_domestic_commission_is_default ?? true,
            sa_international_commission_is_default: existingSub.sa_international_commission_is_default ?? true,
            sa_expense_cap_is_default: existingSub.sa_expense_cap_is_default ?? true,
            dp_target_platform: existingSub.dp_target_platform || "",
            dp_deal_type: existingSub.dp_deal_type || "",
            cam_fee_pct: existingSub.cam_fee_pct ?? 0.75,
            cam_fee_is_default: existingSub.cam_fee_is_default ?? true,
            distribution_fee_domestic_pct: existingSub.distribution_fee_domestic_pct ?? 25,
            distribution_fee_international_pct: existingSub.distribution_fee_international_pct ?? 35,
            distribution_fee_domestic_is_default: existingSub.distribution_fee_domestic_is_default ?? true,
            distribution_fee_international_is_default: existingSub.distribution_fee_international_is_default ?? true,
            scenario_conservative: existingSub.scenario_conservative,
            scenario_target: existingSub.scenario_target,
            scenario_optimistic: existingSub.scenario_optimistic,
          }));
        } else {
          // Create new submission
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newSub, error } = await (supabase as any)
            .from("intake_submissions")
            .insert({
              purchase_id: purchase.id,
              user_id: user?.id || null,
              email: purchase.email,
              tier: baseTier,
              includes_working_model: productIds.some(
                (id: string) =>
                  id === "the-working-model" ||
                  id === "the-working-model-discount"
              ),
            })
            .select("id")
            .single();

          if (error) {
            console.error("Failed to create submission:", error);
            toast.error("Failed to initialize your plan. Please try again.");
            navigate("/store");
            return;
          }
          setSubmissionId(newSub.id);
        }
      } catch (err) {
        console.error("Purchase validation error:", err);
        toast.error("Something went wrong. Please try again.");
        navigate("/store");
      } finally {
        setLoading(false);
      }
    };

    validatePurchase();
  }, [sessionId, navigate]);

  // Update form data and auto-save
  const updateFormData = useCallback(
    (updates: Partial<IntakeFormData>) => {
      setFormData((prev) => {
        const next = { ...prev, ...updates };
        // Build the DB-compatible save payload
        const savePayload: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
          if (key === "has_debt" || key === "has_deferments") continue; // UI-only fields
          savePayload[key] = value;
        }
        if (Object.keys(savePayload).length > 0) {
          debouncedSave(savePayload);
        }
        return next;
      });
    },
    [debouncedSave]
  );

  // Step navigation
  const goToStep = useCallback(
    async (step: number) => {
      haptics.step();
      setCurrentStep(step);
      await saveNow({ current_step: step });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [saveNow, haptics]
  );

  const handleNext = useCallback(() => {
    if (currentStep < 6) goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // Submit
  const handleSubmit = useCallback(async () => {
    if (!submissionId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("intake_submissions")
        .update({
          status: "submitted",
          completed_at: new Date().toISOString(),
          current_step: 6,
        })
        .eq("id", submissionId);

      if (error) throw error;
      haptics.success();
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      haptics.error();
      toast.error("Failed to submit. Please try again.");
    }
  }, [submissionId, haptics]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-secondary text-[14px]">Loading your plan...</p>
        </div>
      </div>
    );
  }

  // Submitted confirmation
  if (submitted) {
    return <ConfirmationScreen email={email} />;
  }

  const tierLabel =
    tier === "the-pitch-package" ? "The Pitch Package" : "The Blueprint";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-header/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-[640px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-bebas text-[16px] tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-white">.OG</span>
            </span>
            <span className="text-ink-secondary text-[10px] tracking-[0.12em] uppercase">
              Auto-saved
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 animate-fade-in">
        <div className="max-w-[640px] mx-auto px-6 pt-8 pb-16">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-bebas text-[28px] md:text-[40px] tracking-[0.08em] text-gold mb-1">
              BUILD YOUR FINANCE PLAN
            </h1>
            <p className="text-ink-secondary text-[12px] tracking-[0.15em] uppercase">
              {tierLabel}
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} onStepClick={goToStep} />

          {/* Step Content */}
          {currentStep === 1 && (
            <IntakeStep1
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <IntakeStep2
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <IntakeStep3
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <IntakeStep4
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <IntakeStep5
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 6 && (
            <IntakeStep6
              formData={formData}
              tier={tier}
              includesWorkingModel={includesWorkingModel}
              email={email}
              onEdit={goToStep}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BuildYourPlan;
