"use client";

import { useEffect, useMemo, useState } from "react";
import { type RefundRequest } from "@/lib/refunds";
import { fetchRefundRequests } from "@/lib/content-client";
import { useCreditConversion } from "@/store/credit-conversion";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { Kpi } from "@/components/wp/Kpi";
import { Modal } from "@/components/wp/Modal";
import { Search, Zap } from "lucide-react";

const amountLabel = (r: RefundRequest) => (r.type === "Credit" ? `${r.amount} credits` : `SAR ${r.amount.toFixed(0)}`);

export default function AdminRefunds() {
  const { convertCreditsToSar } = useCreditConversion();
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Read-only log — refunds are issued automatically by the cancellation policy.
  // Poll so new customer cancellations appear here without a manual refresh.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const list = await fetchRefundRequests();
        if (!cancelled) setRequests(list);
      } catch {
        // keep whatever is on screen if the API is unreachable
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // SAR value of a refund (credits converted at the admin credit rate).
  const valueSar = (r: RefundRequest) => (r.type === "Credit" ? convertCreditsToSar(r.amount) : r.amount);

  const stats = useMemo(() => {
    const refunded = requests.filter((r) => r.status === "Refunded");
    const none = requests.filter((r) => r.status === "No refund");
    const full = refunded.filter((r) => r.policyPercent >= 100).length;
    const partial = refunded.filter((r) => r.policyPercent > 0 && r.policyPercent < 100).length;
    const refundedSar = refunded.reduce((s, r) => s + valueSar(r), 0);
    return { total: requests.length, full, partial, none: none.length, refundedSar };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.bookingRef.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.partner.toLowerCase().includes(q) ||
        r.className.toLowerCase().includes(q),
    );
  }, [query, requests]);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Refunds</h2>
        <p className="text-sm text-muted-foreground">
          Automatic refund log. Refunds are issued instantly by the cancellation policy — no manual approval.
          {loading ? " · Syncing…" : ""}
        </p>
      </div>

      {/* Policy reference — the fixed tiers that drive every automatic refund. */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Automatic refund policy</h3>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <PolicyTile window="More than 8 hours before" outcome="100% refund" tone="success" />
          <PolicyTile window="Between 4 and 8 hours before" outcome="50% refund" tone="warning" />
          <PolicyTile window="Less than 4 hours before" outcome="No refund" tone="destructive" />
          <PolicyTile window="No-show (missed, not cancelled)" outcome="No refund" tone="destructive" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Refunds return to the customer in the medium they paid — credits to the credit wallet, money to the
          original payment. A no-show (customer didn&apos;t attend and didn&apos;t cancel) is never refunded.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total refunds processed" value={stats.total} />
        <Kpi label="Full / partial refunds" value={`${stats.full} / ${stats.partial}`} accent="success" />
        <Kpi label="No refund (policy)" value={stats.none} accent="destructive" />
        <Kpi label="Total refunded" value={`SAR ${Math.round(stats.refundedSar).toLocaleString()}`} hint="value of processed refunds" />
      </div>

      {/* Refund log — read-only breakdown of every automatic refund. */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Refund log <span className="text-sm font-normal text-muted-foreground">· {requests.length}</span></h3>
            <p className="text-sm text-muted-foreground mt-1">Every refund automatically issued from a customer cancellation.</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ref, customer, partner..."
              className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Refund</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Partner / Class</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Outcome</th>
                <th className="text-left px-4 py-3">Processed</th>
                <th className="text-right px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedId(r.id)} className="font-mono text-xs text-primary hover:text-secondary hover:underline">{r.id}</button>
                    <div className="text-xs text-muted-foreground font-mono">{r.bookingRef}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{r.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{r.partner}</div>
                    <div className="text-xs">{r.className}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {r.status === "No refund" ? <span className="text-muted-foreground">—</span> : amountLabel(r)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                    {r.status === "Refunded" && (
                      <span className="ml-2 text-xs text-muted-foreground">{r.policyPercent}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.processedAt ?? r.requestedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedId(r.id)} className="text-xs text-primary hover:text-secondary font-medium">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No refunds match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected ? `Refund ${selected.id}` : "Refund"}
        description={selected ? `Booking ${selected.bookingRef}` : undefined}
        size="lg"
        footer={<button onClick={() => setSelectedId(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-sm text-muted-foreground">{selected.type} booking · issued automatically</span>
            </div>

            <div className="rounded-xl bg-accent/60 border border-border p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Refunded</div>
              <div className="mt-1 text-2xl font-bold font-mono">
                {selected.status === "No refund" ? "No refund" : amountLabel(selected)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {selected.status === "No refund" ? "Policy allows 0%" : `≈ SAR ${valueSar(selected).toFixed(2)} · policy ${selected.policyPercent}%`} · via {selected.method}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Customer</dt><dd className="mt-0.5 font-medium">{selected.customer}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Partner</dt><dd className="mt-0.5">{selected.partner}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Class</dt><dd className="mt-0.5">{selected.className}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Booking ref</dt><dd className="mt-0.5 font-mono text-xs">{selected.bookingRef}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Cancelled</dt><dd className="mt-0.5">{selected.cancelledWindow}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Processed</dt><dd className="mt-0.5">{selected.processedAt ?? selected.requestedAt}</dd></div>
            </dl>

            {selected.refundBreakdown && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <dt className="text-xs uppercase tracking-wider text-primary font-semibold">How this refund was calculated</dt>
                <dd className="mt-1 text-sm">{selected.refundBreakdown}</dd>
              </div>
            )}

            <div className="rounded-xl border border-border bg-background/60 p-3">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Customer reason</dt>
              <dd className="mt-1 text-sm">{selected.reason || "—"}</dd>
            </div>

            {selected.note && (
              <div className={`rounded-xl border p-3 ${selected.status === "Refunded" ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Outcome</dt>
                <dd className="mt-1 text-sm">{selected.note}</dd>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function PolicyTile({ window, outcome, tone }: { window: string; outcome: string; tone: "success" | "warning" | "destructive" }) {
  const toneClass = {
    success: "text-success-foreground",
    warning: "text-warning-foreground",
    destructive: "text-destructive",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="text-xs text-muted-foreground">{window}</div>
      <div className={`mt-1 font-semibold ${toneClass}`}>{outcome}</div>
    </div>
  );
}
