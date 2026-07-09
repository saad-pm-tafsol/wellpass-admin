"use client";

import { useState } from "react";
import { Kpi } from "@/components/wp/Kpi";
import { useCreditConversion } from "@/store/credit-conversion";
import { ArrowLeftRight, Save } from "lucide-react";
import { toast } from "sonner";

const sar = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const parseWholeNumber = (value: string) => {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return 0;
  return Number(normalized);
};

export default function AdminCreditRate() {
  const { creditAmount, sarAmount, sarPerCredit, setConversion, convertCreditsToSar } = useCreditConversion();
  const [creditDraft, setCreditDraft] = useState<number>(creditAmount);
  const [sarDraft, setSarDraft] = useState<number>(sarAmount);

  const previewGross = creditDraft > 0 && sarDraft > 0 ? (10 / creditDraft) * sarDraft : 0;
  const draftSarPerCredit = creditDraft > 0 && sarDraft > 0 ? sarDraft / creditDraft : 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditDraft || creditDraft <= 0 || !sarDraft || sarDraft <= 0) {
      toast.error("Credit and SAR values must be greater than zero");
      return;
    }
    if (!Number.isInteger(creditDraft)) {
      toast.error("Credit value must be a whole number");
      return;
    }

    setConversion(creditDraft, sarDraft);
    toast.success(`Saved - ${creditDraft} ${creditDraft === 1 ? "credit" : "credits"} = ${sar(sarDraft)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Credit conversion</h2>
        <p className="text-sm text-muted-foreground">
          Set how booking credits convert into partner earnings. Applied platform-wide to every credit-based class.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Conversion rate" value={sar(sarPerCredit)} hint="per credit" accent="primary" />
        <Kpi label="Current rule" value={`${creditAmount} = ${sar(sarAmount)}`} hint={creditAmount === 1 ? "credit" : "credits"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <form onSubmit={save} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><ArrowLeftRight className="h-4 w-4 text-primary" /> Conversion rate</h3>

          <div className="rounded-lg border border-border bg-accent/30 p-4">
            <label className="flex items-center gap-3 flex-wrap text-sm">
              <span className="inline-flex items-center rounded-lg border border-input bg-background">
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={creditDraft}
                  onChange={(e) => setCreditDraft(parseWholeNumber(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "," || e.key.toLowerCase() === "e" || e.key === "+" || e.key === "-") e.preventDefault();
                  }}
                  className="w-24 rounded-l-lg bg-transparent px-2 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Credit amount"
                />
                <span className="pr-2 text-sm text-muted-foreground">{creditDraft === 1 ? "credit" : "credits"}</span>
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="inline-flex items-center rounded-lg border border-input bg-background">
                <span className="px-2.5 text-sm text-muted-foreground">SAR</span>
                <input
                  type="number"
                  min={0.01}
                  step={0.25}
                  value={sarDraft}
                  onChange={(e) => setSarDraft(Number(e.target.value))}
                  className="w-24 rounded-r-lg bg-transparent px-2 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="SAR amount"
                />
              </span>
            </label>
            <p className="mt-3 text-xs text-muted-foreground">
              This equals <span className="font-medium text-foreground">{sar(draftSarPerCredit)}</span> per credit.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A partner that prices a class at <span className="font-mono">10</span> credits earns{" "}
              <span className="font-medium text-foreground">{sar(previewGross)}</span> gross.
            </p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
              <Save className="h-4 w-4" /> Save rate
            </button>
          </div>
        </form>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Live calculation</div>
          <p className="mt-3 text-sm text-muted-foreground">
            Current saved conversion makes a 10-credit class worth{" "}
            <span className="font-mono font-medium text-foreground">{sar(convertCreditsToSar(10))}</span> gross.
          </p>
        </div>
      </div>
    </div>
  );
}
