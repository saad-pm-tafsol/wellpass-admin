"use client";

import { useMemo, useState } from "react";
import { CUSTOMERS } from "@/data/mock";
import { Kpi } from "@/components/wp/Kpi";
import { Gift, Plus, Search } from "lucide-react";
import { toast } from "sonner";

const REWARDS = [
  { id: "r1", name: "Free class credit", cost: 100, claimed: 142 },
  { id: "r2", name: "SAR 50 voucher", cost: 250, claimed: 86 },
  { id: "r3", name: "Premium guest pass", cost: 400, claimed: 31 },
  { id: "r4", name: "Branded gym towel", cost: 150, claimed: 64 },
];

export default function AdminLoyalty() {
  const [query, setQuery] = useState("");

  const totalPoints = CUSTOMERS.reduce((s, c) => s + c.points, 0);
  const redeemed = REWARDS.reduce((s, r) => s + r.cost * r.claimed, 0);

  const ranked = useMemo(() => [...CUSTOMERS].sort((a, b) => b.points - a.points), []);
  const topEarners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((c) => !q || c.name.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q)).slice(0, 5);
  }, [ranked, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Loyalty &amp; rewards</h2>
          <p className="text-sm text-muted-foreground">Points programme across the platform</p>
        </div>
        <button onClick={() => toast.success("New reward created")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
          <Plus className="h-4 w-4" /> New reward
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Points outstanding" value={totalPoints.toLocaleString()} accent="primary" />
        <Kpi label="Points redeemed" value={redeemed.toLocaleString()} accent="success" />
        <Kpi label="Active rewards" value={REWARDS.length} />
        <Kpi label="Redemptions" value={REWARDS.reduce((s, r) => s + r.claimed, 0)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h3 className="font-semibold">Top earners</h3>
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
              <tr><th className="text-left py-2">Customer</th><th className="text-left">Plan</th><th className="text-right">Points</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topEarners.map((c) => (
                <tr key={c.email}>
                  <td className="py-3 font-medium">{c.name}</td>
                  <td className="text-muted-foreground">{c.plan}</td>
                  <td className="text-right font-mono">{c.points}</td>
                </tr>
              ))}
              {topEarners.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">No customers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Rewards catalogue</h3>
          <div className="space-y-3">
            {REWARDS.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground"><Gift className="h-4 w-4" /></span>
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.claimed} redeemed</div>
                  </div>
                </div>
                <div className="font-mono text-sm">{r.cost} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
