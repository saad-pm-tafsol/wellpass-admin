"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, ShieldCheck, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const DEFAULTS = {
  terms: `WellPass — Terms of Service

1. Acceptance of Terms
By creating an account or booking a class through WellPass, you agree to these Terms of Service.

2. Memberships & Credits
Credits are valid for the duration stated on your plan and are non-transferable. Unused credits expire at the end of the billing period unless otherwise stated.

3. Bookings & Cancellations
Bookings may be cancelled up to the studio's stated cancellation window. Late cancellations or no-shows may forfeit the credits used.

4. Studio Partners
Partner studios are responsible for the classes they list, including schedules, instructors and on-site safety.

5. Changes to These Terms
WellPass may update these Terms from time to time. Continued use of the platform constitutes acceptance of the updated Terms.`,
  privacy: `WellPass — Privacy Policy

1. Information We Collect
We collect account details (name, email, phone), booking activity and payment information needed to operate the service.

2. How We Use Your Data
Your data is used to manage memberships, process bookings and payouts, and improve the WellPass experience.

3. Sharing
We share only the information studios need to deliver a booked class. We do not sell personal data.

4. Data Retention
We retain your data for as long as your account is active and as required by applicable law.

5. Your Rights
You may request access to, correction of, or deletion of your personal data by contacting support.`,
};

type DocKey = "terms" | "privacy";

const TABS: { key: DocKey; label: string; icon: typeof FileText }[] = [
  { key: "terms", label: "Terms of Service", icon: FileText },
  { key: "privacy", label: "Privacy Policy", icon: ShieldCheck },
];

export default function AdminTerms() {
  const [active, setActive] = useState<DocKey>("terms");
  const [docs, setDocs] = useState<Record<DocKey, string>>(DEFAULTS);

  const activeLabel = TABS.find((t) => t.key === active)!.label;

  const save = () => toast.success(`${activeLabel} saved`);
  const reset = () => {
    setDocs((prev) => ({ ...prev, [active]: DEFAULTS[active] }));
    toast.message(`${activeLabel} reset to last published version`);
  };

  const value = docs[active];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Terms &amp; Policies</h2>
        <p className="text-sm text-muted-foreground">Edit the legal documents shown on the public website.</p>
      </div>

      <div className="inline-flex rounded-lg border border-border p-0.5">
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
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
            <Save className="h-4 w-4" /> Save {activeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
