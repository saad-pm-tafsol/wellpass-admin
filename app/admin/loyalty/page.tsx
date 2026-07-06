"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CUSTOMERS } from "@/data/mock";
import { ArrowRight, Search } from "lucide-react";
import { Switch } from "@/components/wp/Switch";
import { useAccounts } from "@/store/accounts";
import { toast } from "sonner";

export default function AdminLoyalty() {
  const [query, setQuery] = useState("");

  const ranked = useMemo(() => [...CUSTOMERS].sort((a, b) => b.points - a.points), []);
  const { customerEarning, toggleCustomerEarning } = useAccounts();
  const topEarners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((c) => !q || c.name.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q)).slice(0, 5);
  }, [ranked, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Loyalty history</h2>
          <p className="text-sm text-muted-foreground">View loyalty points history for each customer</p>
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
            <tr><th className="text-left py-2">Customer</th><th className="text-left">Plan</th><th className="text-right">Points</th><th className="text-right">Earning</th><th className="text-right">History</th></tr>
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
              <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No customers match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
