// FAQs shown on the public FAQ page. Admins manage them here and the list is
// mirrored to the customer site through a shared localStorage key, exactly like
// the loyalty earning rules (see `loyalty-rules.ts`). The defaults below match
// the customer site so nothing is lost before the first admin edit.

export type Faq = { id: string; q: string; a: string; steps?: string[] };

export const FAQS_STORAGE_KEY = "wellpass.faqs";

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "what-is-wellpass-club",
    q: "What is WellPass Club?",
    a: "WellPass Club is a flexible membership that provides access to multiple fitness and wellness partners using one monthly subscription.",
  },
  {
    id: "who-can-use",
    q: "Who can use WellPass Club?",
    a: "Anyone aged 18 years or above can create an account and purchase a membership. Some partner activities may have additional age requirements.",
  },
  {
    id: "memberships-available",
    q: "What memberships are available?",
    a: "We currently offer Starter, Plus, and Premium. Each membership includes a different number of monthly credits.",
  },
  {
    id: "freeze-membership",
    q: "How do I freeze my membership?",
    a: "Every membership includes a number of freeze days. You may freeze your membership at any time through your account before the next billing cycle. Freeze days vary depending on your membership plan.",
  },
  {
    id: "credits-expire",
    q: "When do my credits expire?",
    a: "Unused credits expire 3 months after they are issued. Expired credits cannot be reinstated.",
  },
  {
    id: "cancel-booking",
    q: "Can I cancel a booking?",
    a: "Members may cancel bookings within the cancellation period shown for each activity. Late cancellations or no-shows may result in the loss of credits.",
  },
  {
    id: "partner-cancels",
    q: "What happens if a partner cancels my booking?",
    a: "If a partner cancels your booking for any reason, all credits used for that booking will be automatically refunded to your account.",
  },
  {
    id: "auto-renew",
    q: "Do memberships renew automatically?",
    a: "Yes. All memberships automatically renew every billing cycle unless cancelled before the renewal date.",
  },
  {
    id: "how-bookings-work",
    q: "How do bookings work?",
    a: "",
    steps: [
      "Select your preferred class.",
      "Submit a booking request.",
      "The partner reviews availability.",
      "Once approved, your booking is confirmed.",
      "Your credits are deducted after confirmation.",
    ],
  },
  {
    id: "contact-support",
    q: "How do I contact customer support?",
    a: "You can reach our support team anytime at hello@wellpass.sa or through our Contact page. We're happy to help with bookings, memberships, credits, and more.",
  },
];

export function normalizeFaqs(value: unknown): Faq[] {
  if (!Array.isArray(value)) return DEFAULT_FAQS;

  const out: Faq[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const q = typeof record.q === "string" ? record.q.trim() : "";
    if (!q) continue;
    const id = typeof record.id === "string" && record.id.trim() ? record.id.trim() : q;
    const steps = Array.isArray(record.steps)
      ? record.steps.map((s) => String(s).trim()).filter(Boolean)
      : undefined;
    const a = typeof record.a === "string" ? record.a.trim() : "";
    out.push(steps && steps.length ? { id, q, a: "", steps } : { id, q, a });
  }
  return out.length ? out : DEFAULT_FAQS;
}

export function readStoredFaqs(): Faq[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const stored = window.localStorage.getItem(FAQS_STORAGE_KEY);
    return stored ? normalizeFaqs(JSON.parse(stored)) : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export function writeStoredFaqs(faqs: Faq[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(normalizeFaqs(faqs)));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}
