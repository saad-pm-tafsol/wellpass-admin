// Client for the shared content API (FAQs, loyalty rules, plan validity).
//
// This is the single seam between the UI and wherever the content lives. Today
// it talks to this app's own /api/content route (backed by a shared temp file —
// see src/lib/server/content-store.ts). When the real backend exists, point
// NEXT_PUBLIC_CONTENT_API_URL at it (or change API_BASE) and nothing else has
// to change: same request/response shape.

import { DEFAULT_FAQS, normalizeFaqs, type Faq } from "@/lib/faqs";
import {
  DEFAULT_LOYALTY_EARNING_RULES,
  normalizeLoyaltyEarningRules,
  type LoyaltyEarningRule,
} from "@/lib/loyalty-rules";
import {
  normalizePlanValidity,
  type PlanValidityMap,
} from "@/lib/membership-plans";

export type ContentState = {
  faqs: Faq[];
  loyaltyRules: LoyaltyEarningRule[];
  planValidity: PlanValidityMap;
};

export const DEFAULT_CONTENT: ContentState = {
  faqs: DEFAULT_FAQS,
  loyaltyRules: DEFAULT_LOYALTY_EARNING_RULES,
  planValidity: {},
};

// Empty string => same-origin relative request. Swap for the backend origin
// once it exists.
const API_BASE = process.env.NEXT_PUBLIC_CONTENT_API_URL ?? "";
const ENDPOINT = `${API_BASE}/api/content`;

function normalizeContent(value: unknown): ContentState {
  const v = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return {
    faqs: normalizeFaqs(v.faqs),
    loyaltyRules: normalizeLoyaltyEarningRules(v.loyaltyRules),
    planValidity: normalizePlanValidity(v.planValidity),
  };
}

export async function getContent(): Promise<ContentState> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(`content GET ${res.status}`);
    return normalizeContent(await res.json());
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(patch: Partial<ContentState>): Promise<ContentState> {
  const res = await fetch(ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`content PUT ${res.status}`);
  return normalizeContent(await res.json());
}

// Per-resource convenience wrappers used by the pages.
export const fetchFaqs = async (): Promise<Faq[]> => (await getContent()).faqs;
export const saveFaqs = (faqs: Faq[]) => saveContent({ faqs });

export const fetchLoyaltyRules = async (): Promise<LoyaltyEarningRule[]> =>
  (await getContent()).loyaltyRules;
export const saveLoyaltyRules = (loyaltyRules: LoyaltyEarningRule[]) =>
  saveContent({ loyaltyRules });

export const fetchPlanValidity = async (): Promise<PlanValidityMap> =>
  (await getContent()).planValidity;
export const savePlanValidity = (planValidity: PlanValidityMap) =>
  saveContent({ planValidity });
