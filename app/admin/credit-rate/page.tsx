"use client";

import { useState } from "react";
import { CREDIT_VALUE_SAR } from "@/data/settings";
import { Kpi } from "@/components/wp/Kpi";
import { ArrowLeftRight, Save } from "lucide-react";
import { toast } from "sonner";

const sar = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminCreditRate() {
  const [rate, setRate] = useState<number>(CREDIT_VALUE_SAR);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rate || rate <= 0) {
      toast.error("Credit value must be greater than zero");
      return;
    }
    toast.success(`Saved · 1 credit = ${sar(rate)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Credit conversion</h2>
        <p className="text-sm text-muted-foreground">
          Set how booking credits convert into studio earnings. Applied platform-wide to every credit-based class.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Credit value" value={sar(rate)} hint="per credit" accent="primary" />
      </div>

      {/* Credit rate conversion */}
      <div className="grid lg:grid-cols-2 gap-4">
        <form onSubmit={save} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><ArrowLeftRight className="h-4 w-4 text-primary" /> Conversion rate</h3>

          <div className="rounded-lg border border-border bg-accent/30 p-4">
            <label className="flex items-center gap-3 flex-wrap text-sm">
              <span className="font-medium">1 credit</span>
              <span className="text-muted-foreground">=</span>
              <span className="inline-flex items-center rounded-lg border border-input bg-background">
                <span className="px-2.5 text-sm text-muted-foreground">SAR</span>
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-24 rounded-r-lg bg-transparent px-2 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </span>
            </label>
            <p className="mt-3 text-xs text-muted-foreground">
              A studio that prices a class at <span className="font-mono">10</span> credits earns{" "}
              <span className="font-medium text-foreground">{sar(10 * rate)}</span> gross.
            </p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
              <Save className="h-4 w-4" /> Save rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
