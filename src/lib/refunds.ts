// Refund log shared between the admin app and the customer/partner site through
// the content API (like FAQs / loyalty rules). Refunds are now issued
// AUTOMATICALLY from the cancellation policy when a customer cancels — there is
// no manual approval. Each record is the immutable outcome of one cancellation.
//
// Cancellation policy (credit or money, by hours before class):
//   • more than 8h  -> 100% refund
//   • 4–8h          ->  50% refund
//   • under 4h      ->   0% refund
//   • no-show / missed class is non-refundable (no record is created)

export type RefundStatus = "Refunded" | "No refund";

export type RefundRequest = {
  id: string;
  bookingRef: string;
  customer: string;
  partner: string;
  className: string;
  type: "Credit" | "Independent";
  /** Amount refunded: credits for Credit bookings, SAR for Independent bookings. */
  amount: number;
  /** Refund % the policy applied (100 / 50 / 0). */
  policyPercent: number;
  /** How far before the class the customer cancelled (drives the policy %). */
  cancelledWindow: string;
  reason: string;
  requestedAt: string;
  /** How the refund amount was computed under the policy (microcopy). */
  refundBreakdown?: string;
  status: RefundStatus;
  /** When the refund was processed (immediately, automatically). */
  processedAt?: string;
  /** Plain-language explanation of the automatic outcome. */
  note?: string;
  /** Where the refund was returned. */
  method: string;
};

// Demo history seeded into the shared store before any real cancellation exists.
export const DEFAULT_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: "RF-2025-0142",
    bookingRef: "WP-2025-04821",
    customer: "Sara Al-Hamdan",
    partner: "Zenith Pilates Partner",
    className: "Power Pilates Core",
    type: "Credit",
    amount: 15,
    policyPercent: 100,
    cancelledWindow: "More than 8 hours before class",
    reason: "Schedule changed and I can no longer attend.",
    refundBreakdown: "Cancelled 11h before class · 100% refunded (15 of 15 cr).",
    status: "Refunded",
    requestedAt: "2026-06-28 10:05",
    processedAt: "2026-06-28 10:05",
    note: "Full refund — cancelled more than 8 hours before class.",
    method: "Credit wallet",
  },
  {
    id: "RF-2025-0141",
    bookingRef: "WP-2025-04818",
    customer: "Khalid Al-Shehri",
    partner: "Squash Republic",
    className: "Squash Open Court",
    type: "Independent",
    amount: 40,
    policyPercent: 50,
    cancelledWindow: "Between 4 and 8 hours before class",
    reason: "Running late from work, won't make it in time.",
    refundBreakdown: "Cancelled 6h before class · 50% refunded (SAR 40 of SAR 80).",
    status: "Refunded",
    requestedAt: "2026-06-28 08:20",
    processedAt: "2026-06-28 08:20",
    note: "50% refund — cancelled between 4 and 8 hours before class.",
    method: "Original payment (card)",
  },
  {
    id: "RF-2025-0140",
    bookingRef: "WP-2025-04810",
    customer: "Noura Al-Otaibi",
    partner: "Mind & Body Wellness",
    className: "Mindful Meditation",
    type: "Credit",
    amount: 6,
    policyPercent: 100,
    cancelledWindow: "More than 8 hours before class",
    reason: "Family emergency.",
    refundBreakdown: "Cancelled 20h before class · 100% refunded (6 of 6 cr).",
    status: "Refunded",
    requestedAt: "2026-06-27 19:40",
    processedAt: "2026-06-27 19:40",
    note: "Full refund — cancelled more than 8 hours before class.",
    method: "Credit wallet",
  },
  {
    id: "RF-2025-0137",
    bookingRef: "WP-2025-04792",
    customer: "Fatima Al-Dosari",
    partner: "Serene Yoga Collective",
    className: "Morning Flow Yoga",
    type: "Credit",
    amount: 3,
    policyPercent: 50,
    cancelledWindow: "Between 4 and 8 hours before class",
    reason: "Feeling unwell.",
    refundBreakdown: "Cancelled 5h before class · 50% refunded (3 of 6 cr).",
    status: "Refunded",
    requestedAt: "2026-06-25 07:35",
    processedAt: "2026-06-25 07:35",
    note: "50% refund — cancelled between 4 and 8 hours before class.",
    method: "Credit wallet",
  },
  {
    id: "RF-2025-0135",
    bookingRef: "WP-2025-04781",
    customer: "Khalid Al-Shehri",
    partner: "Padel Pro Arena",
    className: "Padel Beginner Session",
    type: "Independent",
    amount: 0,
    policyPercent: 0,
    cancelledWindow: "Less than 4 hours before class",
    reason: "Changed my mind.",
    refundBreakdown: "Cancelled 2h before class · 0% refunded (SAR 0 of SAR 100).",
    status: "No refund",
    requestedAt: "2026-06-24 17:50",
    processedAt: "2026-06-24 17:50",
    note: "No refund — cancelled less than 4 hours before class.",
    method: "Original payment (card)",
  },
  {
    id: "RF-2025-0131",
    bookingRef: "WP-2025-04762",
    customer: "Sara Al-Hamdan",
    partner: "AquaFit Center",
    className: "Lap Swimming (Lane)",
    type: "Credit",
    amount: 14,
    policyPercent: 100,
    cancelledWindow: "Partner cancelled the class",
    reason: "Partner cancelled — pool maintenance.",
    refundBreakdown: "Partner-initiated cancellation · 100% refunded (14 of 14 cr).",
    status: "Refunded",
    requestedAt: "2026-06-22 11:00",
    processedAt: "2026-06-22 11:00",
    note: "Full refund — the partner cancelled the class.",
    method: "Credit wallet",
  },
];

const STATUSES: RefundStatus[] = ["Refunded", "No refund"];

/**
 * Coerce arbitrary JSON into a clean RefundRequest[].
 * Returns the seed list when the value was never initialised (not an array),
 * but preserves an intentionally empty array once the store has been written.
 */
export function normalizeRefundRequests(value: unknown): RefundRequest[] {
  if (!Array.isArray(value)) return DEFAULT_REFUND_REQUESTS;

  const out: RefundRequest[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.trim() : "";
    const bookingRef = typeof r.bookingRef === "string" ? r.bookingRef.trim() : "";
    if (!id || !bookingRef) continue;
    const type = r.type === "Independent" ? "Independent" : "Credit";
    const status = STATUSES.includes(r.status as RefundStatus) ? (r.status as RefundStatus) : "No refund";
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    out.push({
      id,
      bookingRef,
      customer: str(r.customer),
      partner: str(r.partner),
      className: str(r.className),
      type,
      amount: num(r.amount),
      policyPercent: num(r.policyPercent),
      cancelledWindow: str(r.cancelledWindow),
      reason: str(r.reason),
      refundBreakdown: typeof r.refundBreakdown === "string" ? r.refundBreakdown : undefined,
      status,
      requestedAt: str(r.requestedAt),
      processedAt: typeof r.processedAt === "string" ? r.processedAt : undefined,
      note: typeof r.note === "string" ? r.note : undefined,
      method: str(r.method) || "Credit wallet",
    });
  }
  return out;
}
