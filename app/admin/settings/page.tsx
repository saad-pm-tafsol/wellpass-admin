"use client";

import { useState } from "react";
import { CREDIT_VALUE_SAR, PLATFORM_COMMISSION_PCT } from "@/data/settings";
import { Switch } from "@/components/wp/Switch";
import { toast } from "sonner";

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      </span>
      <Switch checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

export default function AdminSettings() {
  const [commission, setCommission] = useState(PLATFORM_COMMISSION_PCT);
  const [creditValue, setCreditValue] = useState(CREDIT_VALUE_SAR);
  const [bookingWindow, setBookingWindow] = useState(14);
  const [autoApprove, setAutoApprove] = useState(false);
  const [waitlist, setWaitlist] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved");
  };

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Platform settings</h2>
        <p className="text-sm text-muted-foreground">Global configuration for the WellPass platform</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold">Commercials</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="font-medium">Commission rate (%)</span>
            <input type="number" min={0} max={100} value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Credit value (SAR)</span>
            <input type="number" min={0} step={0.1} value={creditValue} onChange={(e) => setCreditValue(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Booking window (days)</span>
            <input type="number" min={1} max={90} value={bookingWindow} onChange={(e) => setBookingWindow(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold">Operations</h3>
        <div className="divide-y divide-border">
          <Toggle label="Auto-approve new studios" hint="Skip manual review when studios register" checked={autoApprove} onChange={setAutoApprove} />
          <Toggle label="Enable class waitlists" hint="Let customers join waitlists for full classes" checked={waitlist} onChange={setWaitlist} />
          <Toggle label="Maintenance mode" hint="Temporarily take the customer app offline" checked={maintenance} onChange={setMaintenance} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => toast.message("Changes discarded")} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">Save changes</button>
      </div>
    </form>
  );
}
