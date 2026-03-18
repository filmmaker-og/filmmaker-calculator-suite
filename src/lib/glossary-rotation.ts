/**
 * glossary-rotation.ts
 *
 * Deterministic daily glossary rotation for the Resource Vault.
 * Uses the current date as a seed to select N terms from Supabase.
 * Everyone sees the same terms on the same day. No cron, no edge function.
 *
 * Freshness weighting: terms added in the last 7 days get priority slots.
 */
import { supabase } from "@/integrations/supabase/client";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  created_at: string;
}

/**
 * Simple deterministic hash from a string -> number.
 * Same input always produces same output. Not crypto -- just consistent.
 */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic shuffle using a seeded PRNG.
 * Fisher-Yates shuffle with a simple linear congruential generator.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get today's date string in YYYY-MM-DD format (UTC).
 * This is the rotation seed -- same day = same selection everywhere.
 */
function todaySeed(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if a term was added within the last N days.
 */
function isRecent(createdAt: string, days: number = 7): boolean {
  const created = new Date(createdAt).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return created > cutoff;
}

/**
 * Fetch today's glossary rotation from Supabase.
 *
 * @param count - Number of terms to show (default 4)
 * @param freshnessDays - How many days a term is considered "new" (default 7)
 * @param freshSlots - Max slots reserved for new terms (default 1)
 * @returns Array of GlossaryTerm for today's rotation
 */
export async function getDailyGlossary(
  count: number = 4,
  freshnessDays: number = 7,
  freshSlots: number = 1
): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("id, term, definition, category, created_at")
    .order("term", { ascending: true });

  if (error || !data || data.length === 0) {
    console.error("Glossary fetch failed:", error);
    return [];
  }

  const seed = hashSeed(todaySeed());

  const fresh = data.filter((t) => isRecent(t.created_at, freshnessDays));
  const standard = data.filter((t) => !isRecent(t.created_at, freshnessDays));

  const shuffledFresh = seededShuffle(fresh, seed);
  const shuffledStandard = seededShuffle(standard, seed + 1);

  const actualFreshCount = Math.min(freshSlots, shuffledFresh.length);
  const result: GlossaryTerm[] = [
    ...shuffledFresh.slice(0, actualFreshCount),
    ...shuffledStandard.slice(0, count - actualFreshCount),
  ];

  if (result.length < count && shuffledFresh.length > actualFreshCount) {
    result.push(
      ...shuffledFresh.slice(
        actualFreshCount,
        count - result.length + actualFreshCount
      )
    );
  }

  return seededShuffle(result.slice(0, count), seed + 2);
}

/**
 * Fetch ALL glossary terms (for "See All" filter mode).
 * Alphabetical by term.
 */
export async function getAllGlossary(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("id, term, definition, category, created_at")
    .order("term", { ascending: true });

  if (error || !data) {
    console.error("Glossary fetch failed:", error);
    return [];
  }

  return data;
}
