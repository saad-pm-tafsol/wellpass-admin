"use client";

import { useEffect, useRef, useState } from "react";
import { PLANS } from "@/data/mock";
import { Kpi } from "@/components/wp/Kpi";
import { Modal } from "@/components/wp/Modal";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { planValidityMap } from "@/lib/membership-plans";
import { fetchPlanValidity, savePlanValidity } from "@/lib/content-client";

type Plan = { id: string; name: string; credits: number; price: number; validityMonths: number; popular?: boolean; features?: string[] };

export default function AdminMembershipPlans() {
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const nextId = useRef(PLANS.length);

  // Reflect any validity previously configured (and mirrored to the customer
  // site) so this screen stays in sync with what customers currently see.
  useEffect(() => {
    fetchPlanValidity().then((stored) => {
      setPlans((prev) => prev.map((p) => (stored[p.id] ? { ...p, validityMonths: stored[p.id] } : p)));
    });
  }, []);

  // Persist the { planId: months } map whenever plans change so the customer
  // plan cards pick up the new validity.
  const persist = (next: Plan[]) => {
    setPlans(next);
    void savePlanValidity(planValidityMap(next));
  };

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [validityMonths, setValidityMonths] = useState<number>(1);
  const [popular, setPopular] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setCredits(0);
    setPrice(0);
    setValidityMonths(1);
    setPopular(false);
    setFeaturesText("");
    setOpen(true);
  };

  const openEdit = (p: Plan) => {
    setEditingId(p.id);
    setName(p.name);
    setCredits(p.credits);
    setPrice(p.price);
    setValidityMonths(p.validityMonths);
    setPopular(Boolean(p.popular));
    setFeaturesText((p.features ?? []).join("\n"));
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Plan name is required");
    if (credits <= 0 || price <= 0 || validityMonths <= 0) return toast.error("Credits, price, and validity must be greater than zero");

    // One bullet per line, trimmed and blank lines dropped — same convention as FAQ steps.
    const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
    const cleared = popular ? plans.map((p) => ({ ...p, popular: false })) : plans;
    // Always set `features` explicitly (undefined when empty) so clearing them on edit overwrites the old list.
    const draft = { name: trimmed, credits, price, validityMonths, popular, features: features.length ? features : undefined };
    const next = editingId
      ? cleared.map((p) => (p.id === editingId ? { ...p, ...draft } : p))
      : [...cleared, { id: `p${nextId.current++}`, ...draft }];
    persist(next);
    toast.success(editingId ? `"${trimmed}" updated` : `"${trimmed}" created`);
    setOpen(false);
  };

  const remove = (p: Plan) => {
    persist(plans.filter((x) => x.id !== p.id));
    toast.success(`"${p.name}" deleted`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Membership plans</h2>
          <p className="text-sm text-muted-foreground">Credit packs available to customers</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
          <Plus className="h-4 w-4" /> New plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Kpi label="Active plans" value={plans.length} />
        <Kpi label="Avg. credits / pack" value={plans.length ? Math.round(plans.reduce((s, p) => s + p.credits, 0) / plans.length) : 0} />
      </div>

      {plans.length === 0 ? (
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">No plans yet. Create one to get started.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className={cn("relative bg-card border rounded-xl p-6", p.popular ? "border-secondary ring-1 ring-secondary/40" : "border-border")}>
              {p.popular && (
                <span className="absolute -top-2.5 left-6 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">Most popular</span>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono">SAR {p.price}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{p.credits} credits</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success-foreground" /> {p.credits} booking credits</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success-foreground" /> Valid for {p.validityMonths} {p.validityMonths === 1 ? "month" : "months"}</li>
                {p.features?.map((feature) => (
                  <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-foreground" /> {feature}</li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent">Edit</button>
                <button onClick={() => remove(p)} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit plan" : "Create a plan"}
        description={editingId ? "Update this credit pack." : "Add a new credit pack for customers."}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" form="plan-form" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">{editingId ? "Save changes" : "Create plan"}</button>
          </>
        }
      >
        <form id="plan-form" onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Plan name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Active Pack"
              autoFocus
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium">Credits</span>
              <input
                type="number"
                min={1}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Price (SAR)</span>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm col-span-2">
              <span className="font-medium">Validity (months)</span>
              <input
                type="number"
                min={1}
                value={validityMonths}
                onChange={(e) => setValidityMonths(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-medium">Features <span className="text-muted-foreground font-normal">(optional — one per line)</span></span>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              placeholder={"Access to all partner studios\nPriority booking window"}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <span className="mt-1 block text-xs text-muted-foreground">Each line becomes a bullet point on the plan card, below credits and validity.</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="h-4 w-4 rounded border-input accent-primary" />
            <span className="font-medium">Mark as Most popular</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
