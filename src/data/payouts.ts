import { STUDIOS } from "@/data/mock";

export type PayoutStatus = "Pending" | "Completed";

export type Payout = {
  id: string;
  studio: string;
  amount: number;
  status: PayoutStatus;
};

export type PayoutHistoryEntry = {
  id: string;
  studioId: string;
  period: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: string;
  paidAt?: string;
  method: string;
  reference: string;
};

// Deterministic payout figures derived from each studio's member count.
export const PAYOUTS: Payout[] = STUDIOS.slice(0, 6).map((s, i) => ({
  id: s.id,
  studio: s.name,
  amount: Math.round(s.members * 8.5),
  status: i === 0 || i === 1 ? "Pending" : "Completed",
}));

const periods = [
  { key: "2025-06", label: "June 2025", requestedAt: "2025-07-01", paidAt: "2025-07-03" },
  { key: "2025-05", label: "May 2025", requestedAt: "2025-06-01", paidAt: "2025-06-03" },
  { key: "2025-04", label: "April 2025", requestedAt: "2025-05-01", paidAt: "2025-05-03" },
  { key: "2025-03", label: "March 2025", requestedAt: "2025-04-01", paidAt: "2025-04-03" },
];

export const PAYOUT_HISTORY: PayoutHistoryEntry[] = PAYOUTS.flatMap((payout, payoutIndex) =>
  periods.map((period, periodIndex) => {
    const isCurrent = periodIndex === 0;
    const amount = Math.max(0, payout.amount - periodIndex * (180 + payoutIndex * 35));
    const status = isCurrent ? payout.status : "Completed";

    return {
      id: `${payout.id}-${period.key}`,
      studioId: payout.id,
      period: period.label,
      amount,
      status,
      requestedAt: period.requestedAt,
      paidAt: status === "Completed" ? period.paidAt : undefined,
      method: "Bank transfer",
      reference: status === "Completed" ? `PO-${period.key}-${payout.id.toUpperCase()}` : "Awaiting release",
    };
  }),
);

export function payoutById(id: string) {
  return PAYOUTS.find((payout) => payout.id === id);
}

export function payoutHistoryByStudioId(studioId: string) {
  return PAYOUT_HISTORY.filter((entry) => entry.studioId === studioId);
}
