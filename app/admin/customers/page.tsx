"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { CUSTOMERS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminCustomers() {
  const { customerStatus, toggleCustomer } = useAccounts();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const statusOf = useCallback((email: string, fallback: string) => customerStatus[email] ?? fallback, [customerStatus]);

  const total = CUSTOMERS.length;
  const active = CUSTOMERS.filter((c) => statusOf(c.email, c.status) === "Active").length;
  const frozen = CUSTOMERS.filter((c) => statusOf(c.email, c.status) === "Frozen").length;

  const statuses = useMemo(() => Array.from(new Set(CUSTOMERS.map((c) => c.status))).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q);
      const matchesStatus = status === "all" || statusOf(c.email, c.status) === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, statusOf]);

  const onToggle = (email: string, name: string) => {
    const next = toggleCustomer(email);
    toast.success(`${name} ${next === "Frozen" ? "frozen" : "reactivated"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Customer management</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length === total ? `${total} customers on the platform` : `${filtered.length} of ${total} customers`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Total customers" value={total.toLocaleString()} />
        <Kpi label="Active" value={active} accent="success" />
        <Kpi label="Frozen" value={frozen} accent="warning" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Credits</th>
              <th className="text-left px-4 py-3">Bookings</th>
              <th className="text-left px-4 py-3">Points</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => {
              const st = statusOf(c.email, c.status);
              const href = `/admin/customers/${encodeURIComponent(c.email)}`;
              return (
                <tr key={c.email} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link href={href} className="font-medium text-primary hover:text-secondary hover:underline">{c.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.plan}</td>
                  <td className="px-4 py-3 font-mono">{c.credits}</td>
                  <td className="px-4 py-3 font-mono">{c.bookings}</td>
                  <td className="px-4 py-3 font-mono">{c.points}</td>
                  <td className="px-4 py-3"><StatusBadge status={st} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={href} className="text-xs text-primary hover:text-secondary font-medium">View</Link>
                      <button onClick={() => onToggle(c.email, c.name)} className="text-xs text-muted-foreground hover:text-foreground font-medium">
                        {st === "Frozen" ? "Reactivate" : "Freeze"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">No customers match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
