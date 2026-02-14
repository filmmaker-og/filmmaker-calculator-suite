import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { IntakeFormData } from "@/lib/intake-types";

export function useIntakeAutoSave(submissionId: string | null) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef<Partial<IntakeFormData> | null>(null);

  const saveToSupabase = useCallback(
    async (data: Record<string, unknown>) => {
      if (!submissionId) return;
      const { error } = await supabase
        .from("intake_submissions")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", submissionId);
      if (error) console.error("Auto-save error:", error);
    },
    [submissionId]
  );

  const debouncedSave = useCallback(
    (data: Record<string, unknown>) => {
      latestDataRef.current = data as Partial<IntakeFormData>;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveToSupabase(data);
      }, 2000);
    },
    [saveToSupabase]
  );

  const saveNow = useCallback(
    async (data: Record<string, unknown>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await saveToSupabase(data);
    },
    [saveToSupabase]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { debouncedSave, saveNow };
}
