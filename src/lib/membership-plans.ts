// Plan validity (in months) configured here is mirrored to the customer site
// through a shared localStorage key, exactly like the loyalty earning rules
// (see `loyalty-rules.ts`). We persist a { planId: months } map on every plan
// change so the customer plan cards can reflect the admin-set validity.

export const MEMBERSHIP_PLAN_VALIDITY_STORAGE_KEY = "wellpass.membershipPlanValidity";

/** planId -> validity in months. */
export type PlanValidityMap = Record<string, number>;

export function normalizePlanValidity(value: unknown): PlanValidityMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: PlanValidityMap = {};
  for (const [id, months] of Object.entries(value as Record<string, unknown>)) {
    const n = Number(months);
    if (Number.isFinite(n) && n >= 1) out[id] = Math.round(n);
  }
  return out;
}

export function readStoredPlanValidity(): PlanValidityMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(MEMBERSHIP_PLAN_VALIDITY_STORAGE_KEY);
    return stored ? normalizePlanValidity(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
}

export function writeStoredPlanValidity(map: PlanValidityMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEMBERSHIP_PLAN_VALIDITY_STORAGE_KEY, JSON.stringify(normalizePlanValidity(map)));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

/** Build a { planId: months } map from a list of plans. */
export function planValidityMap(plans: { id: string; validityMonths: number }[]): PlanValidityMap {
  return Object.fromEntries(plans.map((p) => [p.id, p.validityMonths]));
}
