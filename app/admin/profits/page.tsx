"use client";

import { useCallback, useMemo, useState } from "react";
import { REVENUE_MONTHLY, REVENUE_YEARLY, LOYALTY_HISTORY } from "@/data/mock";
import { PAYOUTS } from "@/data/payouts";
import { useCreditConversion } from "@/store/credit-conversion";
import { Kpi } from "@/components/wp/Kpi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const money = (n: number) => `SAR ${Math.round(n).toLocaleString()}`;

// The revenue streams that make up platform income (plus refunds, an expense),
// each distributed across periods the same way.
type RevSplit = {
  membership: number;
  independent: number;
  subscription: number;
  firstBookingCommission: number;
  ongoingCommission: number;
  refunds: number;
};
const SOURCE_KEYS = ["membership", "independent", "subscription", "firstBookingCommission", "ongoingCommission", "refunds"] as const;
const zeroSplit = (): RevSplit => ({ membership: 0, independent: 0, subscription: 0, firstBookingCommission: 0, ongoingCommission: 0, refunds: 0 });
const addSplit = (a: RevSplit, b: RevSplit): RevSplit =>
  SOURCE_KEYS.reduce((acc, k) => ({ ...acc, [k]: a[k] + b[k] }), {} as RevSplit);

const YEARS = REVENUE_YEARLY.map((y) => y.year);
const MONTHS = REVENUE_MONTHLY.map((m) => m.month);
const LATEST_YEAR = YEARS[YEARS.length - 1];

// All-time revenue is the sum of every year on record. Commissions are NOT part
// of revenue here: that money is already collected in what customers pay
// (membership + independent bookings), so counting commissions again would
// double-count. They are shown for reference only.
const ALL_TIME = REVENUE_YEARLY.reduce((a, y) => addSplit(a, y), zeroSplit());
const ALL_TIME_CUSTOMER = ALL_TIME.membership + ALL_TIME.independent;
const ALL_TIME_REVENUE = ALL_TIME.membership + ALL_TIME.independent + ALL_TIME.subscription;

const POINTS_AWARDED = LOYALTY_HISTORY.reduce((s, e) => s + e.points, 0);
const PAYOUTS_TOTAL = PAYOUTS.reduce((s, p) => s + p.amount, 0);

// Normalized monthly weights (per source), used to distribute a year's totals
// across its 12 months while preserving the seasonal shape.
const MONTH_SHAPE = (() => {
  const t = REVENUE_MONTHLY.reduce((a, m) => addSplit(a, m), zeroSplit());
  return REVENUE_MONTHLY.map((m) => ({
    month: m.month,
    ...(SOURCE_KEYS.reduce((acc, k) => ({ ...acc, [k]: t[k] ? m[k] / t[k] : 0 }), {} as RevSplit)),
  }));
})();

function monthlyForYear(year: string): (RevSplit & { month: string })[] {
  const yd = REVENUE_YEARLY.find((y) => y.year === year);
  if (!yd) return [];
  return MONTH_SHAPE.map((s) => ({
    month: s.month,
    ...(SOURCE_KEYS.reduce((acc, k) => ({ ...acc, [k]: yd[k] * s[k] }), {} as RevSplit)),
  }));
}

// Revenue split for the selected period: all-time, a whole year, or one month of a year.
function selectPeriod(year: string, month: string): RevSplit & { label: string } {
  if (year === "all") return { ...ALL_TIME, label: "All time" };
  const yd = REVENUE_YEARLY.find((y) => y.year === year);
  if (!yd) return { ...ALL_TIME, label: "All time" };
  const base: RevSplit = SOURCE_KEYS.reduce((acc, k) => ({ ...acc, [k]: yd[k] }), {} as RevSplit);
  if (month === "all") return { ...base, label: year };
  const md = monthlyForYear(year).find((m) => m.month === month);
  if (!md) return { ...base, label: year };
  const split: RevSplit = SOURCE_KEYS.reduce((acc, k) => ({ ...acc, [k]: md[k] }), {} as RevSplit);
  return { ...split, label: `${month} ${year}` };
}

const selectClass = "rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed";

export default function AdminProfits() {
  const { convertCreditsToSar } = useCreditConversion();
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [tableYear, setTableYear] = useState(LATEST_YEAR);

  // Loyalty points are worth 1 credit each, valued in SAR at the admin-defined
  // credit rate (see /admin/credit-rate). Loyalty is a customer-side cost;
  // partner payouts (net remitted to partners after commission) are the
  // partner-side cost. Both scale with their side's share of revenue.
  const loyaltyExpenseAll = convertCreditsToSar(POINTS_AWARDED);
  const payoutRate = ALL_TIME_REVENUE > 0 ? PAYOUTS_TOTAL / ALL_TIME_REVENUE : 0;
  const loyaltyRate = ALL_TIME_CUSTOMER > 0 ? loyaltyExpenseAll / ALL_TIME_CUSTOMER : 0;

  const pnl = useCallback(
    (r: RevSplit) => {
      // Revenue = membership + independent + subscription. Commissions are the
      // platform's cut of what customers already pay, so they are NOT re-added
      // to revenue (that would double-count the same money).
      const revenue = r.membership + r.independent + r.subscription;
      const commissions = r.firstBookingCommission + r.ongoingCommission;

      // Expenses: loyalty rewards + partner payouts + refunds returned to customers.
      const loyalty = (r.membership + r.independent) * loyaltyRate;
      const payouts = revenue * payoutRate;
      const refunds = r.refunds;
      const totalExpenses = loyalty + payouts + refunds;

      return {
        ...r,
        revenue,
        commissions,
        loyalty,
        payouts,
        refunds,
        totalExpenses,
        profit: revenue - totalExpenses,
      };
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
        return { month: m.month, revenue: q.revenue, expenses: q.totalExpenses, profit: q.profit };
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
          <p className="text-sm text-muted-foreground">Revenue by source, commissions, expenses, and actual profit — {sel.label}</p>
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

      {/* Top KPI blocks — revenue by source, grouped customer then partner. */}
      <div className="space-y-3">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer revenue</div>
          <div className="grid grid-cols-2 gap-4">
            <Kpi label="Membership revenue" value={money(p.membership)} />
            <Kpi label="Independent bookings revenue" value={money(p.independent)} />
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Partner revenue</div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Kpi label="Subscription revenue" value={money(p.subscription)} accent="primary" />
            <Kpi label="First-booking commission" value={money(p.firstBookingCommission)} accent="primary" hint="On a customer's first booking" />
            <Kpi label="Ongoing commission" value={money(p.ongoingCommission)} accent="primary" hint="On default ongoing bookings" />
          </div>
        </div>
      </div>

      {/* Profit history — revenue, commissions (reference only), expenses, profit. */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold">Profit history <span className="text-sm font-normal text-muted-foreground">· {sel.label}</span></h3>

        <div className="mt-4 text-sm">
          <div className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Membership revenue</dt>
              <dd className="font-mono text-success-foreground">+{money(p.membership)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Independent bookings revenue</dt>
              <dd className="font-mono text-success-foreground">+{money(p.independent)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Subscription</dt>
              <dd className="font-mono text-success-foreground">+{money(p.subscription)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="font-medium">Total revenue</dt>
              <dd className="font-mono font-medium text-success-foreground">+{money(p.revenue)}</dd>
            </div>
          </dl>

          <div className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commissions</div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">First-booking commission</dt>
              <dd className="font-mono">{money(p.firstBookingCommission)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Default ongoing commission</dt>
              <dd className="font-mono">{money(p.ongoingCommission)}</dd>
            </div>
          </dl>
          <p className="pt-2 text-xs text-muted-foreground">
            Commissions are the platform&apos;s cut of what customers already pay, so they are shown for reference and not added to revenue.
          </p>

          <div className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expenses</div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Loyalty points expense</dt>
              <dd className="font-mono text-destructive">−{money(p.loyalty)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Partner payouts</dt>
              <dd className="font-mono text-destructive">−{money(p.payouts)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-muted-foreground">Refunds</dt>
              <dd className="font-mono text-destructive">−{money(p.refunds)}</dd>
            </div>
          </dl>

          <div className="mt-1 flex items-center justify-between border-t border-border py-3">
            <dt className="font-medium">Total expenses</dt>
            <dd className="font-mono font-medium text-destructive">−{money(p.totalExpenses)}</dd>
          </div>
          <div className="flex items-center justify-between border-t-2 border-border py-3">
            <dt className="font-semibold">Total profit</dt>
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
