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

type Row = { id: string; name: string; city: string; custom: number; override: boolean };

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
  const [rows, setRows] = useState<Row[]>(() =>
    STUDIOS.map((s) => ({
      id: s.id,
      name: s.name,
      city: cityOf(s.location),
      custom: OVERRIDE_SEED[s.id] ?? DEFAULT_RATE,
      override: s.id in OVERRIDE_SEED,
    })),
  );

  const [editOpen, setEditOpen] = useState(false);
  const [rateDraft, setRateDraft] = useState(defaultRate);

  const effective = (r: Row) => (r.override ? r.custom : defaultRate);
  const onCustom = rows.filter((r) => r.override).length;
  const avgRate = useMemo(
    () => (rows.length ? Math.round((rows.reduce((s, r) => s + effective(r), 0) / rows.length) * 10) / 10 : defaultRate),
    [rows, defaultRate],
  );

  const setCustom = (id: string, custom: number) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, custom } : r)));
  const toggleOverride = (id: string) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, override: !r.override } : r)));

  const saveRow = (r: Row) => {
    toast.success(r.override ? `${r.name} — custom rate ${r.custom}% saved` : `${r.name} — using default ${defaultRate}%`);
  };

  const openEdit = () => {
    setRateDraft(defaultRate);
    setEditOpen(true);
  };
  const saveDefault = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateDraft <= 0 || rateDraft > 100) return toast.error("Rate must be between 0 and 100");
    setDefaultRate(rateDraft);
    setEditOpen(false);
    toast.success(`Default commission set to ${rateDraft}%`);
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
          <div className="mt-2 text-4xl font-bold">{FIRST_BOOKING_RATE}%</div>
          <p className="mt-2 text-sm text-muted-foreground">Fixed one-time charge on every studio&apos;s first booking. Not configurable.</p>
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
                <th className="text-left px-4 py-3">Default</th>
                <th className="text-left px-4 py-3">Custom rate</th>
                <th className="text-left px-4 py-3">Override</th>
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
                  <td className="px-4 py-3 text-muted-foreground">{defaultRate}%</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={r.custom}
                        onChange={(e) => setCustom(r.id, Number(e.target.value))}
                        disabled={!r.override}
                        className="w-16 bg-transparent px-2 py-1.5 text-sm font-mono focus:outline-none disabled:opacity-50"
                      />
                      <span className="pr-2 text-xs text-muted-foreground">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Switch checked={r.override} onChange={() => toggleOverride(r.id)} ariaLabel={`Override for ${r.name}`} />
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
    </div>
  );
}
