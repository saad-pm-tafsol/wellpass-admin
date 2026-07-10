"use client";

import { useMemo, useState } from "react";
import { BOOKINGS, classById, studioById, CLASSES } from "@/data/mock";
import { useCreditConversion } from "@/store/credit-conversion";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { Kpi } from "@/components/wp/Kpi";
import { Modal } from "@/components/wp/Modal";
import { Search } from "lucide-react";

const STATS = {
  total: BOOKINGS.length,
  pending: BOOKINGS.filter((b) => b.status === "Pending").length,
  confirmed: BOOKINGS.filter((b) => b.status === "Confirmed").length,
  cancelled: BOOKINGS.filter((b) => b.status === "Cancelled").length,
};

export default function AdminBookings() {
  const { convertCreditsToSar } = useCreditConversion();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);

  const statuses = useMemo(() => Array.from(new Set(BOOKINGS.map((b) => b.status))), []);
  const rows = useMemo(
    () =>
      BOOKINGS.map((b, i) => {
        const c = classById(b.classId) ?? CLASSES[0];
        const s = studioById(c.studioId);
        const sar = b.type === "Credit" ? convertCreditsToSar(b.credits ?? 0) : (b.amount ?? 0);
        const commission = i === 0 || i === 3 || i === 5 ? sar * 0.5 : 0;
        return { booking: b, cls: c, className: c.name, studioName: s?.name ?? "", sar, commission };
      }),
    [convertCreditsToSar],
  );

  const selected = rows.find((r) => r.booking.ref === selectedRef) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.booking.ref.toLowerCase().includes(q) ||
        r.booking.customer.toLowerCase().includes(q) ||
        r.studioName.toLowerCase().includes(q) ||
        r.className.toLowerCase().includes(q);
      const matchesStatus = status === "all" || r.booking.status === status;
      const matchesType = type === "all" || r.booking.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [query, rows, status, type]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">All bookings</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length === BOOKINGS.length
              ? "Platform-wide booking activity"
              : `${filtered.length} of ${BOOKINGS.length} bookings`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ref, customer, partner..."
              className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All types</option>
            <option value="Credit">Credit</option>
            <option value="Independent">Independent</option>
          </select>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total bookings" value={STATS.total} />
        <Kpi label="Pending approval" value={STATS.pending} accent="warning" />
        <Kpi label="Confirmed" value={STATS.confirmed} accent="success" />
        <Kpi label="Cancelled" value={STATS.cancelled} accent="destructive" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Ref</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Partner</th>
              <th className="text-left px-4 py-3">Class</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Commission</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(({ booking: b, className, studioName, sar, commission }) => (
              <tr key={b.ref} className="hover:bg-accent/30">
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedRef(b.ref)} className="font-mono text-xs text-primary hover:text-secondary hover:underline">{b.ref}</button>
                </td>
                <td className="px-4 py-3 font-medium">{b.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{studioName}</td>
                <td className="px-4 py-3 text-muted-foreground">{className}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.type}</td>
                <td className="px-4 py-3 font-mono">SAR {sar.toFixed(0)}</td>
                <td className="px-4 py-3 font-mono text-success-foreground">{commission > 0 ? `+${commission.toFixed(0)}` : "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.createdAt}</td>
                <td className="px-4 py-3"><button onClick={() => setSelectedRef(b.ref)} className="text-xs text-primary hover:text-secondary font-medium">View</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">No bookings match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelectedRef(null)}
        title={selected ? `Booking ${selected.booking.ref}` : "Booking"}
        description={selected ? selected.booking.createdAt : undefined}
        size="lg"
        footer={<button onClick={() => setSelectedRef(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2"><StatusBadge status={selected.booking.status} /></div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Customer</dt><dd className="mt-0.5 font-medium">{selected.booking.customer}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Partner</dt><dd className="mt-0.5">{selected.studioName}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Class</dt><dd className="mt-0.5">{selected.className}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Instructor</dt><dd className="mt-0.5">{selected.cls.instructor}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">When</dt><dd className="mt-0.5">{selected.cls.day} · {selected.cls.time} · {selected.cls.duration} min</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Payment type</dt><dd className="mt-0.5">{selected.booking.type}</dd></div>
              {selected.booking.cancelledBy && (
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Cancelled by</dt><dd className="mt-0.5">{selected.booking.cancelledBy}</dd></div>
              )}
              {selected.booking.cancellationReason && (
                <div className="col-span-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Cancellation reason</dt>
                  <dd className="mt-1 text-sm">{selected.booking.cancellationReason}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Cost</dt>
                <dd className="mt-0.5 font-mono">{selected.booking.type === "Credit" ? `${selected.booking.credits ?? 0} credits` : `SAR ${(selected.booking.amount ?? 0).toFixed(0)}`}</dd>
              </div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Value (SAR)</dt><dd className="mt-0.5 font-mono">SAR {selected.sar.toFixed(2)}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Platform commission</dt><dd className="mt-0.5 font-mono text-success-foreground">{selected.commission > 0 ? `+SAR ${selected.commission.toFixed(2)}` : "—"}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
