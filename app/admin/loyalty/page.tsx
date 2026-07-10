"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CUSTOMERS } from "@/data/mock";
import { ArrowRight, CheckCircle2, Save, Search, UserCheck } from "lucide-react";
import { Switch } from "@/components/wp/Switch";
import { useAccounts } from "@/store/accounts";
import {
  DEFAULT_LOYALTY_EARNING_RULES,
  type LoyaltyEarningRule,
  type LoyaltyEarningRuleIcon,
} from "@/lib/loyalty-rules";
import { fetchLoyaltyRules, saveLoyaltyRules } from "@/lib/content-client";
import { toast } from "sonner";

const ruleIcons: Record<LoyaltyEarningRuleIcon, typeof CheckCircle2> = {
  checkCircle: CheckCircle2,
  userCheck: UserCheck,
};

export default function AdminLoyalty() {
  const [query, setQuery] = useState("");
  const [earningRules, setEarningRules] = useState<LoyaltyEarningRule[]>(DEFAULT_LOYALTY_EARNING_RULES);

  const ranked = useMemo(() => [...CUSTOMERS].sort((a, b) => b.points - a.points), []);
  const { customerEarning, toggleCustomerEarning } = useAccounts();
  const topEarners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((c) => !q || c.name.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q)).slice(0, 5);
  }, [ranked, query]);

  useEffect(() => {
    fetchLoyaltyRules().then(setEarningRules);
  }, []);

  const updateRule = (id: LoyaltyEarningRule["id"], patch: Partial<Pick<LoyaltyEarningRule, "points" | "enabled">>) => {
    setEarningRules((rules) => rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  };

  const saveRules = () => {
    void saveLoyaltyRules(earningRules);
    toast.success("Point earning rules updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">History</h2>
          <p className="text-sm text-muted-foreground">View loyalty points history for each customer</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Earn points rules</h3>
            <p className="text-sm text-muted-foreground">Manage the earning methods shown on the customer app.</p>
          </div>
          <button onClick={saveRules} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary">
            <Save className="h-4 w-4" />
            Save rules
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {earningRules.map((rule) => {
            const Icon = ruleIcons[rule.icon];
            return (
              <div key={rule.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{rule.label}</div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3">
                      <label className="block">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Points</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={rule.points}
                          onChange={(event) => updateRule(rule.id, { points: Math.max(0, Math.round(Number(event.target.value) || 0)) })}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Active</span>
                        <Switch checked={rule.enabled} onChange={() => updateRule(rule.id, { enabled: !rule.enabled })} ariaLabel={`Toggle ${rule.label}`} />
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-mono font-semibold text-success-foreground">+{rule.points} pts</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h3 className="font-semibold">Customers</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left py-2">Customer</th><th className="text-left">Plan</th><th className="text-right">Points</th><th className="text-right">Stop Point Earning</th><th className="text-right">History</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
              {topEarners.map((c) => (
              <tr key={c.email}>
                <td className="py-3 font-medium">{c.name}</td>
                <td className="text-muted-foreground">{c.plan}</td>
                <td className="text-right font-mono">{c.points}</td>
                <td className="text-right">
                  <Switch
                    checked={!!customerEarning[c.email]}
                    onChange={() => {
                      const next = toggleCustomerEarning(c.email);
                      toast.success(`${c.name} will ${next ? "earn" : "not earn"} points`);
                    }}
                    ariaLabel={`Toggle earning for ${c.email}`}
                  />
                </td>
                <td className="text-right">
                  <Link href={`/admin/loyalty/${encodeURIComponent(c.email)}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary">
                    View history <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
              ))}
            {topEarners.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No customers match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
