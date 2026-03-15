/**
 * Industry context constants for the Waterfall Brief.
 * Sourced from filmmaker.og project research (Budget Builder Research, System Map, Deal Spec Sheet).
 * Last verified: March 2026.
 */
export const INDUSTRY_CONTEXT = {
  camRate: "1%",
  camDescription: "Standard across virtually all independent film deals.",
  salesAgentRange: "10–25%",
  salesAgentDescription: "Negotiable. Standard range: 10–25% depending on territory and representation scope.",
  marketingCapDescription: "Capped expenses protect investor returns from runaway marketing spend.",
  equityPremiumRange: "15–25%",
  guildRates: {
    sag: { label: "SAG-AFTRA", rate: "4.5%" },
    wga: { label: "WGA", rate: "1.2%" },
    dga: { label: "DGA", rate: "1.2%" },
  },
} as const;
