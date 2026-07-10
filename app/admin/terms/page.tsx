"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";

const DEFAULTS = {
  customer: `WellPass — Customer Terms & Privacy

== Terms of Service ==

1. Acceptance of Terms
By creating an account or booking a class through WellPass, you agree to these Customer Terms of Service.

2. Memberships & Credits
Credits are valid for the duration stated on your plan and are non-transferable. Unused credits expire at the end of the billing period unless otherwise stated.

3. Bookings & Cancellations
Bookings may be cancelled up to the partner's stated cancellation window. Late cancellations or no-shows may forfeit the credits used.

4. Customer Responsibilities
Customers are responsible for providing accurate account details and for attending or cancelling bookings in a timely manner.

5. Changes to These Terms
WellPass may update these Terms from time to time. Continued use of the platform constitutes acceptance of the updated Terms.

== Privacy Policy ==

1. Information We Collect
We collect account details (name, email, phone), booking activity and payment information needed to operate the service.

2. How We Use Your Data
Your data is used to manage memberships, process bookings and payouts, and improve the WellPass experience.

3. Sharing
We share only the information partners need to deliver a booked class. We do not sell personal data.

4. Data Retention
We retain your data for as long as your account is active and as required by applicable law.

5. Your Rights
You may request access to, correction of, or deletion of your personal data by contacting support.`,
  partner: `WellPass — Partner Terms & Privacy

== Terms of Service ==

1. Partnership Agreement
Partners agree to provide accurate class listings, schedules, instructor details and available capacity through WellPass.

2. Booking & Payment Responsibilities
Partners must honour confirmed bookings, maintain service quality and cooperate with payment reconciliation and payout processing.

3. Cancellation & Service Standards
Partners must manage no-shows, cancellations and customer disputes according to the agreed operating standards.

4. Compliance
Partners are responsible for maintaining required licenses, safety standards, and legal compliance on their premises.

5. Termination
WellPass may suspend or terminate a partner relationship if the partner repeatedly breaches platform rules or service expectations.

== Privacy Policy ==

1. Information We Collect
We collect partner owner details, business information, booking and payout data, and operational information needed to manage the partnership.

2. How We Use Your Data
Your data is used to verify the partner, process bookings, manage payouts, and support platform operations.

3. Sharing
We share partner information with customers only where necessary to facilitate services, such as partner contact details and class information.

4. Data Retention
We retain partner data for as long as the partnership is active and as required by law or for dispute resolution.

5. Your Rights
You may request access to, correction of, or deletion of your business information by contacting support.`,
};

type DocKey = keyof typeof DEFAULTS;

const TABS: { key: DocKey; label: string; icon: typeof FileText }[] = [
  { key: "customer", label: "Customer Terms & Privacy", icon: FileText },
  { key: "partner", label: "Partner Terms & Privacy", icon: ShieldCheck },
];

export default function AdminTerms() {
  const [active, setActive] = useState<DocKey>("customer");
  const [docs, setDocs] = useState<Record<DocKey, string>>(DEFAULTS);

  const activeLabel = TABS.find((t) => t.key === active)!.label;

  const save = () => toast.success(`${activeLabel} saved`);

  const value = docs[active];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Terms &amp; Policies</h2>
        <p className="text-sm text-muted-foreground">Edit the customer and partner legal documents shown on the public website.</p>
      </div>

      <div className="inline-flex flex-wrap rounded-lg border border-border p-0.5 gap-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-semibold">{activeLabel}</h3>
          <span className="text-xs text-muted-foreground">{value.length.toLocaleString()} characters</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => setDocs((prev) => ({ ...prev, [active]: e.target.value }))}
          rows={20}
          spellCheck={false}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />

        <div className="flex justify-end gap-2">
          {/* TODO: Restore reset-to-published action here if policy reset support is needed again. */}
          <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
            <Save className="h-4 w-4" /> Save {activeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
