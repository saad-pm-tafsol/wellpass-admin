export type LoyaltyEarningRuleId = "attend_class" | "first_booking_referral";

export type LoyaltyEarningRuleIcon = "checkCircle" | "userCheck";

export type LoyaltyEarningRule = {
  id: LoyaltyEarningRuleId;
  label: string;
  points: number;
  enabled: boolean;
  icon: LoyaltyEarningRuleIcon;
};

export const LOYALTY_EARNING_RULES_STORAGE_KEY = "wellpass.loyaltyEarningRules";

export const DEFAULT_LOYALTY_EARNING_RULES: LoyaltyEarningRule[] = [
  {
    id: "attend_class",
    label: "Attend a class",
    points: 10,
    enabled: true,
    icon: "checkCircle",
  },
  {
    id: "first_booking_referral",
    label: "Friend signs up and completes their first booking",
    points: 75,
    enabled: true,
    icon: "userCheck",
  },
];

const defaultById = new Map(DEFAULT_LOYALTY_EARNING_RULES.map((rule) => [rule.id, rule]));

export function normalizeLoyaltyEarningRules(value: unknown): LoyaltyEarningRule[] {
  if (!Array.isArray(value)) return DEFAULT_LOYALTY_EARNING_RULES;

  return DEFAULT_LOYALTY_EARNING_RULES.map((fallback) => {
    const candidate = value.find((item) => item && typeof item === "object" && "id" in item && item.id === fallback.id) as Partial<LoyaltyEarningRule> | undefined;
    const points = Number(candidate?.points);
    return {
      ...fallback,
      label: typeof candidate?.label === "string" && candidate.label.trim() ? candidate.label.trim() : fallback.label,
      points: Number.isFinite(points) && points >= 0 ? Math.round(points) : fallback.points,
      enabled: typeof candidate?.enabled === "boolean" ? candidate.enabled : fallback.enabled,
      icon: candidate?.icon && defaultById.get(fallback.id)?.icon === candidate.icon ? candidate.icon : fallback.icon,
    };
  });
}

export function readStoredLoyaltyEarningRules(): LoyaltyEarningRule[] {
  if (typeof window === "undefined") return DEFAULT_LOYALTY_EARNING_RULES;

  try {
    const stored = window.localStorage.getItem(LOYALTY_EARNING_RULES_STORAGE_KEY);
    return stored ? normalizeLoyaltyEarningRules(JSON.parse(stored)) : DEFAULT_LOYALTY_EARNING_RULES;
  } catch {
    return DEFAULT_LOYALTY_EARNING_RULES;
  }
}

export function writeStoredLoyaltyEarningRules(rules: LoyaltyEarningRule[]) {
  window.localStorage.setItem(LOYALTY_EARNING_RULES_STORAGE_KEY, JSON.stringify(normalizeLoyaltyEarningRules(rules)));
}
