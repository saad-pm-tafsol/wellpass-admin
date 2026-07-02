import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kpi({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: string; accent?: "success" | "warning" | "primary" | "destructive" }) {
  const accentClass = accent
    ? { success: "text-success-foreground", warning: "text-warning-foreground", primary: "text-primary", destructive: "text-destructive" }[accent]
    : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className={cn("mt-2 text-2xl font-bold font-mono", accentClass)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}