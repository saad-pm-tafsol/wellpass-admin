"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CUSTOMERS, BOOKINGS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { ArrowLeft, Mail, Snowflake, Play } from "lucide-react";
import { toast } from "sonner";

const RECENT_BOOKING_LIMIT = 3;

type CustomerSignupProfile = {
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  city: string;
  preferredLanguage: string;
  joinedAt: string;
  referralCode: string;
  marketingOptIn: boolean;
};

const SIGNUP_PROFILES: Record<string, CustomerSignupProfile> = {
  "sara@example.com": {
    phone: "+966 50 884 2190",
    dateOfBirth: "1993-04-18",
    gender: "Female",
    nationality: "Saudi",
    city: "Riyadh",
    preferredLanguage: "English",
    joinedAt: "2025-01-12",
    referralCode: "SARA2025",
    marketingOptIn: true,
  },
  "ahmed@example.com": {
    phone: "+966 55 129 7740",
    dateOfBirth: "1988-11-03",
    gender: "Male",
    nationality: "Saudi",
    city: "Riyadh",
    preferredLanguage: "Arabic",
    joinedAt: "2024-12-04",
    referralCode: "AHMED2025",
    marketingOptIn: true,
  },
  "noura@example.com": {
    phone: "+966 56 440 1182",
    dateOfBirth: "1997-07-26",
    gender: "Female",
    nationality: "Saudi",
    city: "Jeddah",
    preferredLanguage: "Arabic",
    joinedAt: "2025-03-19",
    referralCode: "NOURA2025",
    marketingOptIn: false,
  },
  "khalid@example.com": {
    phone: "+966 54 771 0933",
    dateOfBirth: "1991-02-14",
    gender: "Male",
    nationality: "Saudi",
    city: "Dammam",
    preferredLanguage: "English",
    joinedAt: "2025-04-07",
    referralCode: "KHALID2025",
    marketingOptIn: false,
  },
  "fatima@example.com": {
    phone: "+966 53 226 5801",
    dateOfBirth: "1995-09-09",
    gender: "Female",
    nationality: "Saudi",
    city: "Al Khobar",
    preferredLanguage: "Arabic",
    joinedAt: "2025-02-22",
    referralCode: "FATIMA2025",
    marketingOptIn: true,
  },
};

export default function CustomerDetail() {
  const params = useParams<{ id: string }>();
  const email = decodeURIComponent(params.id);
  const customer = CUSTOMERS.find((c) => c.email === email);
  const { customerStatus, toggleCustomer } = useAccounts();
  const [showAllBookings, setShowAllBookings] = useState(false);

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
  const signupProfile = SIGNUP_PROFILES[customer.email];
  const bookings = BOOKINGS.filter((b) => b.customer === customer.name);
  const visibleBookings = showAllBookings ? bookings : bookings.slice(0, RECENT_BOOKING_LIMIT);
  const canToggleBookings = bookings.length > RECENT_BOOKING_LIMIT;

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
        <Kpi label="Loyalty and Referral Points" value={customer.points} accent="success" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Account details</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Name</dt><dd className="mt-0.5 font-medium">{customer.name}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-0.5 break-all">{customer.email}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Phone</dt><dd className="mt-0.5 font-mono">{signupProfile.phone}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Date of birth</dt><dd className="mt-0.5 font-mono">{signupProfile.dateOfBirth}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Gender</dt><dd className="mt-0.5">{signupProfile.gender}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Nationality</dt><dd className="mt-0.5">{signupProfile.nationality}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">City</dt><dd className="mt-0.5">{signupProfile.city}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Preferred language</dt><dd className="mt-0.5">{signupProfile.preferredLanguage}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Signup date</dt><dd className="mt-0.5 font-mono">{signupProfile.joinedAt}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status={status} /></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Membership plan</dt><dd className="mt-0.5 font-medium">{customer.plan}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Credits</dt><dd className="mt-0.5 font-mono">{customer.credits}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Total bookings</dt><dd className="mt-0.5 font-mono">{customer.bookings}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Loyalty and referral points</dt><dd className="mt-0.5 font-mono">{customer.points}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Referral code</dt><dd className="mt-0.5 font-mono">{signupProfile.referralCode}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Marketing consent</dt><dd className="mt-0.5">{signupProfile.marketingOptIn ? "Yes" : "No"}</dd></div>
        </dl>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between gap-3 p-5 pb-3">
          <h3 className="font-semibold">Booking history ({bookings.length})</h3>
          {canToggleBookings && (
            <button
              type="button"
              onClick={() => setShowAllBookings((value) => !value)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              {showAllBookings ? "Show recent" : "View all"}
            </button>
          )}
        </div>
        {bookings.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">No bookings on record.</p>
        ) : (
          <div className="overflow-x-auto">
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
                {visibleBookings.map((b) => (
                  <tr key={b.ref} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{b.ref}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{b.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
