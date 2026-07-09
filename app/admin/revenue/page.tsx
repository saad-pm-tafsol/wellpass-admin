"use client";

import { useMemo, useState } from "react";
import { REVENUE_WEEKLY, REVENUE_MONTHLY, REVENUE_YEARLY, MEMBERSHIP_PURCHASES, BOOKINGS, classById, studioById } from "@/data/mock";
import { PAYOUTS } from "@/data/payouts";
import { PLATFORM_COMMISSION_PCT } from "@/data/settings";
import { useCreditConversion } from "@/store/credit-conversion";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const money = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const compact = (n: number) => `SAR ${(n / 1000).toFixed(1)}k`;

type RevenueRecord = { source: "Membership" | "Class Booking"; ref: string; customer: string; detail: string; amount: number; status: string; date: string };

export default function AdminRevenue() {
  const { convertCreditsToSar } = useCreditConversion();
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const rangeOptions = [
    { key: "weekly" as const, label: "Weekly", description: "4 weeks" },
    { key: "monthly" as const, label: "Monthly", description: "12 months" },
    { key: "yearly" as const, label: "Yearly", description: "5 years" },
  ];
  const activeRange = rangeOptions.find((option) => option.key === range) ?? rangeOptions[1];
  const revenueData = range === "weekly" ? REVENUE_WEEKLY : range === "monthly" ? REVENUE_MONTHLY : REVENUE_YEARLY;
  const xAxisKey = range === "yearly" ? "year" : range === "monthly" ? "month" : "week";
  const bookingRevenue = useMemo(
    () =>
      BOOKINGS.map((b) => {
        const c = classById(b.classId);
        const studio = c ? studioById(c.studioId)?.name ?? "-" : "-";
        const gross = b.type === "Credit" ? convertCreditsToSar(b.credits ?? 0) : (b.amount ?? 0);
        const fee = gross * (PLATFORM_COMMISSION_PCT / 100);
        return { b, studio, className: c?.name ?? "-", gross, fee, net: gross - fee };
      }),
    [convertCreditsToSar],
  );
  const records: RevenueRecord[] = useMemo(
    () =>
      [
        ...MEMBERSHIP_PURCHASES.map((m) => ({ source: "Membership" as const, ref: m.id, customer: m.customer, detail: m.plan, amount: m.amount, status: m.status, date: m.purchasedAt })),
        ...bookingRevenue.map((r) => ({ source: "Class Booking" as const, ref: r.b.ref, customer: r.b.customer, detail: `${r.className} - ${r.studio}`, amount: r.gross, status: r.b.status, date: r.b.createdAt })),
      ].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [bookingRevenue],
  );

  const bookingIndependent = revenueData.reduce((s, m) => s + m.independent, 0);
  const bookingTotal = bookingIndependent;
  const membershipTotal = revenueData.reduce((s, m) => s + m.membership, 0);
  const totalRevenue = bookingTotal + membershipTotal;
  const pendingTotal = PAYOUTS.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  const membershipShown = MEMBERSHIP_PURCHASES.reduce((s, m) => s + m.amount, 0);
  const recordsTotal = records.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Revenue</h2>
        <p className="text-sm text-muted-foreground">Combined platform revenue from membership sales and class bookings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total revenue" value={compact(totalRevenue)} accent="success" hint="memberships + bookings + partner subscription" />
        <Kpi label="Membership revenue" value={compact(membershipTotal)} accent="primary" hint={`${((membershipTotal / totalRevenue) * 100).toFixed(0)}% of total`} />
        <Kpi label="Booking revenue" value={compact(bookingTotal)} hint={`${((bookingTotal / totalRevenue) * 100).toFixed(0)}% of total`} />
        <Kpi label="Pending payouts" value={compact(pendingTotal)} accent="warning" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">{activeRange.label} revenue by source</h3>
            <p className="text-sm text-muted-foreground">Showing {activeRange.description}</p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setRange(option.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${range === option.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey={xAxisKey} stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="membership" name="Membership" stackId="a" fill="var(--color-chart-3)" />
              <Bar dataKey="independent" name="Independent bookings" stackId="a" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <h3 className="font-semibold p-5 pb-3">Membership package revenue</h3>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Reference</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Package</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Purchase date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MEMBERSHIP_PURCHASES.map((m) => (
              <tr key={m.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-mono text-xs">{m.id}</td>
                <td className="px-4 py-3 font-medium">{m.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.plan}</td>
                <td className="px-4 py-3 text-right font-mono">{money(m.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{m.purchasedAt}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-accent/30 font-medium">
              <td className="px-4 py-3" colSpan={3}>{MEMBERSHIP_PURCHASES.length} purchases shown</td>
              <td className="px-4 py-3 text-right font-mono">{money(membershipShown)}</td>
              <td className="px-4 py-3" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <h3 className="font-semibold p-5 pb-3">Revenue records</h3>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-left px-4 py-3">Reference</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Detail</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((r) => (
              <tr key={`${r.source}-${r.ref}`} className="hover:bg-accent/30">
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                    r.source === "Membership" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/10 text-secondary border-secondary/30")}>
                    {r.source}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.ref}</td>
                <td className="px-4 py-3 font-medium">{r.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.detail}</td>
                <td className="px-4 py-3 text-right font-mono">{money(r.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.date}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-accent/30 font-medium">
              <td className="px-4 py-3" colSpan={4}>{records.length} records ({MEMBERSHIP_PURCHASES.length} membership / {bookingRevenue.length} booking)</td>
              <td className="px-4 py-3 text-right font-mono">{money(recordsTotal)}</td>
              <td className="px-4 py-3" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
