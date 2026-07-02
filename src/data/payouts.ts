import { STUDIOS } from "@/data/mock";

export type PayoutStatus = "Pending" | "Completed";

export type Payout = {
  id: string;
  studio: string;
  amount: number;
  status: PayoutStatus;
};

// Deterministic payout figures derived from each studio's member count.
export const PAYOUTS: Payout[] = STUDIOS.slice(0, 6).map((s, i) => ({
  id: s.id,
  studio: s.name,
  amount: Math.round(s.members * 8.5),
  status: i === 0 || i === 1 ? "Pending" : "Completed",
}));
