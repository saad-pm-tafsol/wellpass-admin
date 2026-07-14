// Server-side store for the content that admins edit and the customer site
// consumes (FAQs, loyalty earning rules, membership plan validity).
//
// For local development there is no backend yet, so this persists to a single
// JSON file in the OS temp dir. Both the admin app and the customer site read
// and write the SAME file (same machine + user => same os.tmpdir()), which is
// what lets edits in one app show up in the other across different dev-server
// origins — something localStorage can never do (it is per-origin).
//
// When the real backend arrives (Nest/Next), only this module and the route
// handler change: swap the file read/write for a DB or upstream API call. The
// HTTP contract exposed by /api/content and consumed by content-client.ts stays
// identical, so no page or component needs to change.

import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

import { DEFAULT_FAQS, normalizeFaqs, type Faq } from "@/lib/faqs";
import {
  DEFAULT_LOYALTY_EARNING_RULES,
  normalizeLoyaltyEarningRules,
  type LoyaltyEarningRule,
} from "@/lib/loyalty-rules";
import { normalizePlanValidity, type PlanValidityMap } from "@/lib/membership-plans";
import { normalizeRefundRequests, type RefundRequest } from "@/lib/refunds";

export type ContentState = {
  faqs: Faq[];
  loyaltyRules: LoyaltyEarningRule[];
  planValidity: PlanValidityMap;
  refundRequests: RefundRequest[];
};

// Shared with the customer site. Override with WELLPASS_CONTENT_FILE in both
// apps if the default temp location is not writable/shared.
const CONTENT_FILE =
  process.env.WELLPASS_CONTENT_FILE || path.join(os.tmpdir(), "wellpass-content.json");

function withDefaults(value: unknown): ContentState {
  const v = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return {
    faqs: normalizeFaqs(v.faqs) ?? DEFAULT_FAQS,
    loyaltyRules: normalizeLoyaltyEarningRules(v.loyaltyRules) ?? DEFAULT_LOYALTY_EARNING_RULES,
    planValidity: normalizePlanValidity(v.planValidity),
    refundRequests: normalizeRefundRequests(v.refundRequests),
  };
}

export async function readContent(): Promise<ContentState> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return withDefaults(JSON.parse(raw));
  } catch {
    // Missing/corrupt file => defaults (nothing has been edited yet).
    return withDefaults(undefined);
  }
}

export async function writeContent(patch: Partial<ContentState>): Promise<ContentState> {
  const current = await readContent();
  const next = withDefaults({ ...current, ...patch });
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE); // atomic replace
  return next;
}
