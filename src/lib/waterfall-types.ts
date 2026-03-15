export interface TierPayment {
  phase: number;
  label: string;
  amount: number;
  paid: number;
  status: "funded" | "partial" | "unfunded";
}

export type WaterfallState =
  | "fully_recouped"
  | "partially_recouped"
  | "equity_exposed"
  | "underwater";
