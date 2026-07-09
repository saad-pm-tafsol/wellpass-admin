"use client";

import { Kpi } from "@/components/wp/Kpi";
import { STUDIOS, REGISTRATION_TRENDS, REVENUE_WEEKLY, REVENUE_MONTHLY, REVENUE_YEARLY } from "@/data/mock";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccounts } from "@/store/accounts";

const partnerRevenueById: Record<string, number> = {
  ironcore: 186500,
  padel: 174200,
  flex: 151800,
  zenith: 139400,
  serene: 122750,
  squash: 98400,
  aquafit: 86350,
  mindbody: 64100,
};

const money = (amount: number) => `SAR ${amount.toLocaleString()}`;

const topPartners = STUDIOS.map((partner) => ({
  ...partner,
  revenue: partnerRevenueById[partner.id] ?? 0,
}))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export default function Dashboard() {
  const router = useRouter();
  const { pendingStudios } = useAccounts();
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const pendingCount = pendingStudios.length;
  const rangeOptions = [
    { key: "weekly" as const, label: "Weekly", description: "4 weeks" },
    { key: "monthly" as const, label: "Monthly", description: "12 months" },
    { key: "yearly" as const, label: "Yearly", description: "5 years" },
  ];
  const activeRange = rangeOptions.find((option) => option.key === range) ?? rangeOptions[1];
  const registrationData = REGISTRATION_TRENDS[range];
  const revenueData = range === "weekly" ? REVENUE_WEEKLY : range === "monthly" ? REVENUE_MONTHLY : REVENUE_YEARLY;
  const totalRevenue = revenueData.reduce((s, item) => s + ("membership" in item ? item.membership : 0) + ("independent" in item ? item.independent : 0), 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi label="Partners" value="8" hint="7 active · 1 pending" />
        <Kpi label="Customers" value="1,247" hint="892 members" />
        <Kpi label="Bookings (month)" value="347" hint="of 8,420 lifetime" />
        <Kpi label="Revenue" value={`SAR ${(totalRevenue / 1000).toFixed(1)}k`} accent="success" hint={`${activeRange.description} view`} />
        <Kpi label="Pending payouts" value="SAR 28.6k" accent="warning" />
        <Kpi label="Members" value="892" hint="of 1,247" accent="primary" />
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-warning-foreground shrink-0" />
        <div className="flex-1 text-sm">
          <span className="font-medium">{pendingCount} partner{pendingCount === 1 ? "" : "s"} awaiting approval</span>
          <span className="text-muted-foreground"> · 7 quarterly payouts due</span>
        </div>
        <button onClick={() => router.push("/admin/studios?filter=pending")} className="text-xs font-medium px-3 py-1.5 rounded-md bg-warning text-warning-foreground hover:bg-warning/80">Review now</button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Performance overview</h3>
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

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">New registrations</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="var(--color-secondary)" strokeWidth={2} />
                <Line type="monotone" dataKey="studios" name="Partners" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Revenue by source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey={range === "yearly" ? "year" : range === "monthly" ? "month" : "week"} stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="membership" name="Membership" stackId="a" fill="var(--color-chart-3)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="independent" name="Independent bookings" stackId="a" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top partners by revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 text-left">Partner</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-right">Revenue</th>
                <th className="py-2 pl-4 text-left">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topPartners.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.location}</td>
                  <td className="px-4 py-3 text-right font-mono whitespace-nowrap">{money(s.revenue)}</td>
                  <td className="py-3 pl-4 font-mono whitespace-nowrap">{s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
