"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PAYOUTS, type Payout } from "@/data/payouts";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { Search } from "lucide-react";
import { toast } from "sonner";

const sar = (n: number) => `SAR ${n.toLocaleString()}`;

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>(PAYOUTS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const pendingTotal = payouts.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const completedTotal = payouts.filter((p) => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const pendingCount = payouts.filter((p) => p.status === "Pending").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payouts.filter((p) => {
      const matchesQuery = !q || p.studio.toLowerCase().includes(q);
      const matchesStatus = status === "all" || p.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [payouts, query, status]);

  const payNow = (id: string, studio: string) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p)));
    toast.success(`Paid ${studio}`);
  };

  const releasePending = () => {
    if (pendingCount === 0) {
      toast.message("No pending payouts to release");
      return;
    }
    toast.success(`Released ${sar(pendingTotal)} across ${pendingCount} ${pendingCount === 1 ? "partner" : "partners"}`);
    setPayouts((prev) => prev.map((p) => (p.status === "Pending" ? { ...p, status: "Completed" } : p)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Partner payouts</h2>
          <p className="text-sm text-muted-foreground">Settlements owed to partners</p>
        </div>
        <button onClick={releasePending} className="rounded-lg bg-success px-3 py-2 text-sm font-medium text-white hover:bg-success/80">
          Release pending
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Pending payouts" value={sar(pendingTotal)} accent="warning" hint={`${pendingCount} ${pendingCount === 1 ? "partner" : "partners"}`} />
        <Kpi label="Completed" value={sar(completedTotal)} accent="success" />
        <Kpi label="Partners" value={payouts.length} />
        <Kpi label="Total owed" value={sar(pendingTotal + completedTotal)} accent="primary" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap p-5 pb-0">
          <h3 className="font-semibold">Payout records</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search partner..."
                className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm mt-4">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Partner</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{p.studio}</td>
                <td className="px-4 py-3 font-mono">{sar(p.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {p.status === "Pending" && (
                      <button onClick={() => payNow(p.id, p.studio)} className="text-xs text-primary hover:text-secondary font-medium">Pay now</button>
                    )}
                    <Link href={`/admin/payouts/${encodeURIComponent(p.id)}`} className="text-xs text-primary hover:text-secondary font-medium">View</Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">No payouts match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
