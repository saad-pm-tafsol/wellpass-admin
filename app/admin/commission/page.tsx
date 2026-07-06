"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { STUDIOS } from "@/data/mock";
import { Modal } from "@/components/wp/Modal";
import { Switch } from "@/components/wp/Switch";
import { toast } from "sonner";

const DEFAULT_RATE = 12;
const FIRST_BOOKING_RATE = 50;

// Seed a couple of studios with custom override rates (like the reference).
const OVERRIDE_SEED: Record<string, number> = { ironcore: 15, flex: 10 };
const INITIAL_OVERRIDE_SEED: Record<string, number> = { ironcore: 40, flex: 45 };

type Row = {
  id: string;
  name: string;
  city: string;
  ongoingCustom: number;
  ongoingOverride: boolean;
  initialCustom: number;
  initialOverride: boolean;
};

const cityOf = (location: string) => location.split(",").pop()?.trim() ?? location;

function KpiCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border border-l-4 border-l-primary rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs">{hint}</div>}
    </div>
  );
}

export default function AdminCommission() {
  const [defaultRate, setDefaultRate] = useState(DEFAULT_RATE);
  const [defaultInitialRate, setDefaultInitialRate] = useState(FIRST_BOOKING_RATE);
  const [rows, setRows] = useState<Row[]>(() =>
    STUDIOS.map((s) => ({
      id: s.id,
      name: s.name,
      city: cityOf(s.location),
      ongoingCustom: OVERRIDE_SEED[s.id] ?? DEFAULT_RATE,
      ongoingOverride: s.id in OVERRIDE_SEED,
      initialCustom: INITIAL_OVERRIDE_SEED[s.id] ?? FIRST_BOOKING_RATE,
      initialOverride: s.id in INITIAL_OVERRIDE_SEED,
    })),
  );

  const [editOpen, setEditOpen] = useState(false);
  const [initialEditOpen, setInitialEditOpen] = useState(false);
  const [rateDraft, setRateDraft] = useState(defaultRate);
  const [initialRateDraft, setInitialRateDraft] = useState(defaultInitialRate);

  const effective = (r: Row) => (r.ongoingOverride ? r.ongoingCustom : defaultRate);
  const onCustom = rows.filter((r) => r.ongoingOverride || r.initialOverride).length;
  const avgRate = useMemo(
    () => (rows.length ? Math.round((rows.reduce((s, r) => s + effective(r), 0) / rows.length) * 10) / 10 : defaultRate),
    [rows, defaultRate],
  );

  const setOngoingCustom = (id: string, ongoingCustom: number) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ongoingCustom } : r)));
  const toggleOngoingOverride = (id: string) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ongoingOverride: !r.ongoingOverride } : r)));
  const setInitialCustom = (id: string, initialCustom: number) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, initialCustom } : r)));
  const toggleInitialOverride = (id: string) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, initialOverride: !r.initialOverride, initialCustom: !r.initialOverride ? defaultInitialRate : r.initialCustom } : r)));

  const saveRow = (r: Row) => {
    const parts = [
      r.ongoingOverride ? `ongoing ${r.ongoingCustom}%` : `ongoing default ${defaultRate}%`,
      r.initialOverride ? `initial ${r.initialCustom}%` : `initial default ${defaultInitialRate}%`,
    ];
    toast.success(`${r.name} — ${parts.join(" · ")} saved`);
  };

  const openEdit = () => {
    setRateDraft(defaultRate);
    setEditOpen(true);
  };
  const openInitialEdit = () => {
    setInitialRateDraft(defaultInitialRate);
    setInitialEditOpen(true);
  };
  const saveDefault = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateDraft <= 0 || rateDraft > 100) return toast.error("Rate must be between 0 and 100");
    setDefaultRate(rateDraft);
    setEditOpen(false);
    toast.success(`Default commission set to ${rateDraft}%`);
  };
  const saveInitialDefault = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialRateDraft <= 0 || initialRateDraft > 100) return toast.error("Rate must be between 0 and 100");
    setDefaultInitialRate(initialRateDraft);
    setInitialEditOpen(false);
    toast.success(`Default first booking commission set to ${initialRateDraft}%`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Commission</h2>
        <p className="text-sm text-muted-foreground">Platform commission rates and studio-level overrides</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total commission" value={<>42,180 <span className="text-lg font-semibold">SAR</span></>} />
        <KpiCard label="This month" value={<>7,050 <span className="text-lg font-semibold">SAR</span></>} hint={<span className="text-success-foreground font-medium">+9% vs last month</span>} />
        <KpiCard label="Avg rate" value={`${avgRate}%`} />
        <KpiCard label="On custom rates" value={onCustom} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Default ongoing commission</div>
          <div className="mt-2 text-4xl font-bold text-primary">{defaultRate}%</div>
          <p className="mt-2 text-sm text-muted-foreground">Applied to all studios unless overridden.</p>
          <button onClick={openEdit} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Edit Rate</button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">First booking commission</div>
          <div className="mt-2 text-4xl font-bold">{defaultInitialRate}%</div>
          <p className="mt-2 text-sm text-muted-foreground">Default initial commission for every studio. Each studio can override it independently.</p>
          <button onClick={openInitialEdit} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Edit Rate</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold tracking-tight mb-3">Studio-Level Overrides</h3>
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Studio</th>
                <th className="text-left px-4 py-3">City</th>
                <th className="text-left px-4 py-3">Ongoing commission</th>
                <th className="text-left px-4 py-3">Initial commission</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/studios/${r.id}`} className="font-medium text-primary hover:text-secondary hover:underline">{r.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.city}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="inline-flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.ongoingCustom}
                          onChange={(e) => setOngoingCustom(r.id, Number(e.target.value))}
                          disabled={!r.ongoingOverride}
                          className="w-16 bg-transparent px-2 py-1.5 text-sm font-mono focus:outline-none disabled:opacity-50"
                        />
                        <span className="pr-2 text-xs text-muted-foreground">%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch checked={r.ongoingOverride} onChange={() => toggleOngoingOverride(r.id)} ariaLabel={`Ongoing override for ${r.name}`} />
                        <span>{r.ongoingOverride ? "Enabled" : "Default"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="inline-flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.initialOverride ? r.initialCustom : defaultInitialRate}
                          onChange={(e) => setInitialCustom(r.id, Number(e.target.value))}
                          disabled={!r.initialOverride}
                          className="w-16 bg-transparent px-2 py-1.5 text-sm font-mono focus:outline-none disabled:opacity-50"
                        />
                        <span className="pr-2 text-xs text-muted-foreground">%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch checked={r.initialOverride} onChange={() => toggleInitialOverride(r.id)} ariaLabel={`Initial override for ${r.name}`} />
                        <span>{r.initialOverride ? "Enabled" : "Default"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => saveRow(r)} className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium hover:bg-accent">Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit default commission"
        description="Applied to all studios that don't have an override."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setEditOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" form="rate-form" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">Save rate</button>
          </>
        }
      >
        <form id="rate-form" onSubmit={saveDefault}>
          <label className="block text-sm">
            <span className="font-medium">Default commission (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={rateDraft}
              onChange={(e) => setRateDraft(Number(e.target.value))}
              autoFocus
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </form>
      </Modal>

      <Modal
        open={initialEditOpen}
        onClose={() => setInitialEditOpen(false)}
        title="Edit default first booking commission"
        description="Applied to all studios that don't have an initial override."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setInitialEditOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" form="initial-rate-form" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">Save rate</button>
          </>
        }
      >
        <form id="initial-rate-form" onSubmit={saveInitialDefault}>
          <label className="block text-sm">
            <span className="font-medium">Default first booking commission (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={initialRateDraft}
              onChange={(e) => setInitialRateDraft(Number(e.target.value))}
              autoFocus
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}
