"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, Gift, Sparkles } from "lucide-react";
import { CUSTOMERS, LOYALTY_HISTORY, getLoyaltyExpiryDate, getLoyaltyStatus } from "@/data/mock";

function formatDate(value: Date) {
  return value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function LoyaltyHistoryPage() {
  const params = useParams<{ id: string }>();
  const email = decodeURIComponent(params.id);
  const customer = CUSTOMERS.find((entry) => entry.email === email);

  if (!customer) {
    return (
      <div className="space-y-4">
        <Link href="/admin/loyalty" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
          <ArrowLeft className="h-4 w-4" /> Back to loyalty
        </Link>
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">Customer not found.</div>
      </div>
    );
  }

  const entries = LOYALTY_HISTORY.filter((entry) => entry.customerEmail === customer.email).sort((a, b) => (a.earnedAt < b.earnedAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <Link href="/admin/loyalty" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
        <ArrowLeft className="h-4 w-4" /> Back to loyalty
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Loyalty history, earned points, and expiry dates</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Current points</div>
          <div className="mt-1 font-mono text-xl font-semibold">{customer.points}</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Gift className="h-4 w-4 text-primary" /> Points earned
          </div>
          <div className="mt-3 text-2xl font-bold font-mono">{entries.reduce((sum, entry) => sum + entry.points, 0)}</div>
          <p className="mt-1 text-sm text-muted-foreground">Total points recorded for this customer.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="h-4 w-4 text-success" /> Expiry policy
          </div>
          <div className="mt-3 text-lg font-semibold">3 months from earning date</div>
          <p className="mt-1 text-sm text-muted-foreground">If points are unused for more than 3 months, they expire.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-warning" /> Example rule
          </div>
          <div className="mt-3 text-lg font-semibold">10 points on 10 Jan → 10 Mar</div>
          <p className="mt-1 text-sm text-muted-foreground">Points earned on 20 Jan expire on 20 Mar.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Point history</h3>
        </div>
        {entries.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No loyalty history available for this customer.</p>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => {
              const expiry = getLoyaltyExpiryDate(entry.earnedAt);
              const status = getLoyaltyStatus(entry.earnedAt);
              return (
                <div key={entry.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">+{entry.points} points</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "Expired" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                        {status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.reason}</p>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Source: {entry.source}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Earned on {formatDate(new Date(`${entry.earnedAt}T00:00:00`))}</div>
                    <div className="mt-1">Expires on {formatDate(expiry)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
