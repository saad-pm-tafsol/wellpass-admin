import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Confirmed: "bg-success/15 text-success-foreground border border-success/30",
  Active: "bg-success/15 text-success-foreground border border-success/30",
  Approved: "bg-success/15 text-success-foreground border border-success/30",
  Pending: "bg-warning/15 text-warning-foreground border border-warning/30",
  Rejected: "bg-destructive/15 text-destructive border border-destructive/30",
  Cancelled: "bg-destructive/15 text-destructive border border-destructive/30",
  Inactive: "bg-destructive/15 text-destructive border border-destructive/30",
  Completed: "bg-primary/15 text-primary border border-primary/30",
  Attended: "bg-primary/15 text-primary border border-primary/30",
  Frozen: "bg-slate-200 text-slate-700 border border-slate-300",
  "No-Show": "bg-zinc-700 text-white border border-zinc-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      styles[status] ?? "bg-muted text-muted-foreground border border-border")}>
      {status}
    </span>
  );
}
