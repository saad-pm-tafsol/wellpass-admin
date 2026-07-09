"use client";

import { useState } from "react";
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
  const [autoApprove, setAutoApprove] = useState(false);
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

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold">Operations</h3>
        <div className="divide-y divide-border">
          <Toggle label="Auto-approve new partners" hint="Skip manual review when partners register" checked={autoApprove} onChange={setAutoApprove} />
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
