"use client";

import { useCallback, useMemo, useState } from "react";
import { REVENUE_MONTHLY, REVENUE_YEARLY, LOYALTY_HISTORY } from "@/data/mock";
import { PAYOUTS } from "@/data/payouts";
import { PLATFORM_COMMISSION_PCT, FIRST_BOOKING_COMMISSION_PCT } from "@/data/settings";
import { useCreditConversion } from "@/store/credit-conversion";
import { Kpi } from "@/components/wp/Kpi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const money = (n: number) => `SAR ${Math.round(n).toLocaleString()}`;

const YEARS = REVENUE_YEARLY.map((y) => y.year);
const MONTHS = REVENUE_MONTHLY.map((m) => m.month);
const LATEST_YEAR = YEARS[YEARS.length - 1];

// All-time revenue is the sum of every year on record.
const ALL_TIME = REVENUE_YEARLY.reduce(
  (a, y) => ({ membership: a.membership + y.membership, independent: a.independent + y.independent, subscription: a.subscription + y.subscription }),
  { membership: 0, independent: 0, subscription: 0 },
);
const ALL_TIME_REVENUE = ALL_TIME.membership + ALL_TIME.independent + ALL_TIME.subscription;

const POINTS_AWARDED = LOYALTY_HISTORY.reduce((s, e) => s + e.points, 0);
const PAYOUTS_TOTAL = PAYOUTS.reduce((s, p) => s + p.amount, 0);

// Normalized monthly weights (per source), used to distribute a year's totals
// across its 12 months while preserving the seasonal shape.
const MONTH_SHAPE = (() => {
  const t = REVENUE_MONTHLY.reduce(
    (a, m) => ({ membership: a.membership + m.membership, independent: a.independent + m.independent, subscription: a.subscription + m.subscription }),
    { membership: 0, independent: 0, subscription: 0 },
  );
  return REVENUE_MONTHLY.map((m) => ({
    month: m.month,
    membership: t.membership ? m.membership / t.membership : 0,
    independent: t.independent ? m.independent / t.independent : 0,
    subscription: t.subscription ? m.subscription / t.subscription : 0,
  }));
})();

function monthlyForYear(year: string) {
  const yd = REVENUE_YEARLY.find((y) => y.year === year);
  if (!yd) return [];
  return MONTH_SHAPE.map((s) => ({
    month: s.month,
    membership: yd.membership * s.membership,
    independent: yd.independent * s.independent,
    subscription: yd.subscription * s.subscription,
  }));
}

// Revenue split for the selected period: all-time, a whole year, or one month of a year.
function selectPeriod(year: string, month: string) {
  if (year === "all") return { ...ALL_TIME, label: "All time" };
  const yd = REVENUE_YEARLY.find((y) => y.year === year);
  if (!yd) return { ...ALL_TIME, label: "All time" };
  if (month === "all") return { membership: yd.membership, independent: yd.independent, subscription: yd.subscription, label: year };
  const md = monthlyForYear(year).find((m) => m.month === month);
  if (!md) return { membership: yd.membership, independent: yd.independent, subscription: yd.subscription, label: year };
  return { membership: md.membership, independent: md.independent, subscription: md.subscription, label: `${month} ${year}` };
}

const selectClass = "rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed";

export default function AdminProfits() {
  const { convertCreditsToSar } = useCreditConversion();
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [tableYear, setTableYear] = useState(LATEST_YEAR);

  // Loyalty points are worth 1 credit each, valued in SAR at the admin-defined
  // credit rate (see /admin/credit-rate). Payouts and loyalty scale with the
  // period's share of revenue; commission is the platform's cut of those payouts.
  const loyaltyExpenseAll = convertCreditsToSar(POINTS_AWARDED);
  const payoutRate = ALL_TIME_REVENUE > 0 ? PAYOUTS_TOTAL / ALL_TIME_REVENUE : 0;
  const loyaltyRate = ALL_TIME_REVENUE > 0 ? loyaltyExpenseAll / ALL_TIME_REVENUE : 0;

  const pnl = useCallback(
    (r: { membership: number; subscription: number; independent: number }) => {
      const sourceRevenue = r.membership + r.subscription + r.independent;
      const payouts = sourceRevenue * payoutRate;
      const loyalty = sourceRevenue * loyaltyRate;
      const ongoingCommission = payouts * (PLATFORM_COMMISSION_PCT / 100);
      const firstBookingCommission = payouts * (FIRST_BOOKING_COMMISSION_PCT / 100);
      const totalRevenue = sourceRevenue + ongoingCommission + firstBookingCommission;
      const totalExpenses = payouts + loyalty;
      return { ...r, payouts, loyalty, ongoingCommission, firstBookingCommission, totalRevenue, totalExpenses, profit: totalRevenue - totalExpenses };
    },
    [payoutRate, loyaltyRate],
  );

  const sel = useMemo(() => selectPeriod(year, month), [year, month]);
  const p = pnl(sel);

  // Bottom chart + table: the selected year's 12 months (same P&L definition).
  const monthlyRows = useMemo(
    () =>
      monthlyForYear(tableYear).map((m) => {
        const q = pnl(m);
        return { month: m.month, revenue: q.totalRevenue, expenses: q.totalExpenses, profit: q.profit };
      }),
    [tableYear, pnl],
  );
  const tableRevenue = monthlyRows.reduce((s, m) => s + m.revenue, 0);
  const tableExpenses = monthlyRows.reduce((s, m) => s + m.expenses, 0);
  const tableProfit = tableRevenue - tableExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Profits</h2>
          <p className="text-sm text-muted-foreground">Revenue by source, expenses, and actual profit — {sel.label}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={year}
            onChange={(e) => {
              const v = e.target.value;
              setYear(v);
              if (v === "all") setMonth("all");
            }}
            className={selectClass}
            aria-label="Filter by year"
          >
            <option value="all">All years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={year === "all"} className={selectClass} aria-label="Filter by month">
            <option value="all">All months</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Kpi label="Subscription revenue" value={money(p.subscription)} />
        <Kpi label="Independent bookings revenue" value={money(p.independent)} />
        <Kpi label="Membership revenue" value={money(p.membership)} />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold">Profit breakdown <span className="text-sm font-normal text-muted-foreground">· {sel.label}</span></h3>

        <div className="mt-4 text-sm">
          <div className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Membership revenue</dt>
              <dd className="font-mono text-success-foreground">+{money(p.membership)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Subscription revenue</dt>
              <dd className="font-mono text-success-foreground">+{money(p.subscription)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Independent bookings revenue</dt>
              <dd className="font-mono text-success-foreground">+{money(p.independent)}</dd>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <dt className="font-medium">Total revenue</dt>
              <dd className="font-mono font-medium text-success-foreground">+{money(p.totalRevenue)}</dd>
            </div>
          </dl>

          <div className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expenses</div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Partner payouts</dt>
              <dd className="font-mono text-destructive">−{money(p.payouts)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">
                Loyalty points expense{year === "all" ? ` (${POINTS_AWARDED.toLocaleString()} pts awarded)` : ""}
              </dt>
              <dd className="font-mono text-destructive">−{money(p.loyalty)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="font-medium">Total expenses</dt>
              <dd className="font-mono font-medium text-destructive">−{money(p.totalExpenses)}</dd>
            </div>
          </dl>

          <div className="mt-1 flex items-center justify-between border-t-2 border-border py-3">
            <dt className="font-semibold">Actual profit</dt>
            <dd className={`font-mono text-lg font-bold ${p.profit >= 0 ? "text-success-foreground" : "text-destructive"}`}>{money(p.profit)}</dd>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold">Monthly profit &amp; expenses</h3>
            <p className="text-sm text-muted-foreground">Per month across {tableYear}</p>
          </div>
          <select value={tableYear} onChange={(e) => setTableYear(e.target.value)} className={selectClass} aria-label="Table year">
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <h3 className="font-semibold p-5 pb-3">Monthly profit &amp; expenses history · {tableYear}</h3>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Expenses</th>
              <th className="text-right px-4 py-3">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {monthlyRows.map((m) => (
              <tr key={m.month} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{m.month}</td>
                <td className="px-4 py-3 text-right font-mono">{money(m.revenue)}</td>
                <td className="px-4 py-3 text-right font-mono text-destructive">−{money(m.expenses)}</td>
                <td className="px-4 py-3 text-right font-mono text-success-foreground">{money(m.profit)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-accent/30 font-medium">
              <td className="px-4 py-3">Total {tableYear}</td>
              <td className="px-4 py-3 text-right font-mono">{money(tableRevenue)}</td>
              <td className="px-4 py-3 text-right font-mono text-destructive">−{money(tableExpenses)}</td>
              <td className="px-4 py-3 text-right font-mono text-success-foreground">{money(tableProfit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
