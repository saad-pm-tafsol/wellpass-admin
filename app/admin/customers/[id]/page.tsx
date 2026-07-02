"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CUSTOMERS, BOOKINGS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { ArrowLeft, Mail, Snowflake, Play } from "lucide-react";
import { toast } from "sonner";

export default function CustomerDetail() {
  const params = useParams<{ id: string }>();
  const email = decodeURIComponent(params.id);
  const customer = CUSTOMERS.find((c) => c.email === email);
  const { customerStatus, toggleCustomer } = useAccounts();

  if (!customer) {
    return (
      <div className="space-y-4">
        <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </Link>
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">Customer not found.</div>
      </div>
    );
  }

  const status = customerStatus[customer.email] ?? customer.status;
  const bookings = BOOKINGS.filter((b) => b.customer === customer.name);

  const onToggle = () => {
    const next = toggleCustomer(customer.email);
    toast.success(`${customer.name} ${next === "Frozen" ? "frozen" : "reactivated"}`);
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> {customer.email}</p>
        </div>
        <button
          onClick={onToggle}
          className={
            status === "Frozen"
              ? "inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/80"
              : "inline-flex items-center gap-2 rounded-lg bg-destructive/15 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/25"
          }
        >
          {status === "Frozen" ? <><Play className="h-4 w-4" /> Reactivate account</> : <><Snowflake className="h-4 w-4" /> Freeze account</>}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Plan" value={customer.plan} />
        <Kpi label="Credits" value={customer.credits} accent="primary" />
        <Kpi label="Bookings" value={customer.bookings} />
        <Kpi label="Loyalty points" value={customer.points} accent="success" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Account details</h3>
        <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Name</dt><dd className="mt-0.5 font-medium">{customer.name}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-0.5 break-all">{customer.email}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status={status} /></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Membership plan</dt><dd className="mt-0.5 font-medium">{customer.plan}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Credits</dt><dd className="mt-0.5 font-mono">{customer.credits}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Total bookings</dt><dd className="mt-0.5 font-mono">{customer.bookings}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Loyalty points</dt><dd className="mt-0.5 font-mono">{customer.points}</dd></div>
        </dl>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <h3 className="font-semibold p-5 pb-3">Booking history ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">No bookings on record.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Ref</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.ref} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs">{b.ref}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
