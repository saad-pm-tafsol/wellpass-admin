"use client";

import { Kpi } from "@/components/wp/Kpi";
import { STUDIOS, REVENUE_MONTHLY, PLATFORM_DAILY } from "@/data/mock";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/store/accounts";

export default function Dashboard() {
  const router = useRouter();
  const { pendingStudios } = useAccounts();
  const pendingCount = pendingStudios.length;
  // Combined revenue across all sources: class bookings (credit + independent)
  // and membership package sales.
  const totalRevenue = REVENUE_MONTHLY.reduce((s, m) => s + m.credit + m.independent + m.membership, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi label="Studios" value="8" hint="7 active · 1 pending" />
        <Kpi label="Customers" value="1,247" hint="892 members" />
        <Kpi label="Bookings (month)" value="347" hint="of 8,420 lifetime" />
        <Kpi label="Revenue" value={`SAR ${(totalRevenue / 1000).toFixed(1)}k`} accent="success" hint="bookings + memberships" />
        <Kpi label="Pending payouts" value="SAR 28.6k" accent="warning" />
        <Kpi label="Active members" value="892" hint="of 1,247" accent="primary" />
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-warning-foreground shrink-0" />
        <div className="flex-1 text-sm">
          <span className="font-medium">{pendingCount} studio{pendingCount === 1 ? "" : "s"} awaiting approval</span>
          <span className="text-muted-foreground"> · 7 quarterly payouts due</span>
        </div>
        <button onClick={() => router.push("/admin/studios?filter=pending")} className="text-xs font-medium px-3 py-1.5 rounded-md bg-warning text-warning-foreground hover:bg-warning/80">Review now</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">New registrations (last 7 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PLATFORM_DAILY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="var(--color-secondary)" strokeWidth={2} />
                <Line type="monotone" dataKey="studios" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Monthly revenue by source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="membership" name="Membership" stackId="a" fill="var(--color-chart-3)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="credit" name="Credit bookings" stackId="a" fill="var(--color-primary)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="independent" name="Independent bookings" stackId="a" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top studios by revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left py-2">Studio</th><th className="text-left">Category</th><th className="text-left">Location</th><th className="text-left">Rating</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STUDIOS.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="text-muted-foreground">{s.category}</td>
                  <td className="text-muted-foreground">{s.location}</td>
                  <td className="font-mono">{s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
