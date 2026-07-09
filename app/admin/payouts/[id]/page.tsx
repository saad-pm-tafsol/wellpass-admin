"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { payoutById, payoutHistoryByStudioId } from "@/data/payouts";

const sar = (n: number) => `SAR ${n.toLocaleString()}`;
const RECENT_PAYOUT_LIMIT = 3;

export default function PayoutHistoryPage() {
  const params = useParams<{ id: string }>();
  const partnerId = decodeURIComponent(params.id);
  const payout = payoutById(partnerId);
  const history = payoutHistoryByStudioId(partnerId);
  const [showAllHistory, setShowAllHistory] = useState(false);

  if (!payout) {
    return (
      <div className="space-y-4">
        <Link href="/admin/payouts" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to payouts
        </Link>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Payout record not found.</div>
      </div>
    );
  }

  const completed = history.filter((entry) => entry.status === "Completed");
  const pending = history.filter((entry) => entry.status === "Pending");
  const totalPaid = completed.reduce((sum, entry) => sum + entry.amount, 0);
  const pendingTotal = pending.reduce((sum, entry) => sum + entry.amount, 0);
  const latest = history[0];
  const visibleHistory = showAllHistory ? history : history.slice(0, RECENT_PAYOUT_LIMIT);
  const canToggleHistory = history.length > RECENT_PAYOUT_LIMIT;

  return (
    <div className="space-y-6">
      <Link href="/admin/payouts" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary">
        <ArrowLeft className="h-4 w-4" />
        Back to payouts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">{payout.studio}</h2>
            <StatusBadge status={payout.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Payout history and settlement records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Current payout" value={sar(payout.amount)} accent={payout.status === "Pending" ? "warning" : "success"} hint={payout.status} />
        <Kpi label="Total paid" value={sar(totalPaid)} accent="success" hint={`${completed.length} completed`} />
        <Kpi label="Pending" value={sar(pendingTotal)} accent="warning" hint={`${pending.length} open`} />
      </div>

      {latest && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest period</div>
            <div className="mt-2 font-semibold">{latest.period}</div>
            <div className="mt-1 text-sm text-muted-foreground">Requested {latest.requestedAt}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Payment method</div>
            <div className="mt-2 font-semibold">{latest.method}</div>
            <div className="mt-1 text-sm text-muted-foreground">{latest.reference}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Last paid</div>
            <div className="mt-2 font-semibold">{completed[0]?.paidAt ?? "Not paid yet"}</div>
            <div className="mt-1 text-sm text-muted-foreground">{completed[0] ? completed[0].period : "No completed payouts"}</div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div>
            <h3 className="font-semibold">Payout history ({history.length})</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {showAllHistory ? "All settlement periods for this partner." : "Recent settlement periods for this partner."}
            </p>
          </div>
          {canToggleHistory && (
            <button
              type="button"
              onClick={() => setShowAllHistory((value) => !value)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              {showAllHistory ? "Show recent" : "View all"}
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Period</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Requested</th>
              <th className="text-left px-4 py-3">Paid</th>
              <th className="text-left px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleHistory.map((entry) => (
              <tr key={entry.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{entry.period}</td>
                <td className="px-4 py-3 text-right font-mono">{sar(entry.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{entry.requestedAt}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.paidAt ?? "Pending"}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{entry.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
