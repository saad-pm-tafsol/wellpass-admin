"use client";

import { useMemo, useState } from "react";
import { NOTIFICATIONS } from "@/data/mock";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, Bell } from "lucide-react";
import { toast } from "sonner";

const ICONS = {
  success: { Icon: CheckCircle2, cls: "text-success-foreground bg-success/15" },
  warning: { Icon: AlertTriangle, cls: "text-warning-foreground bg-warning/15" },
  error: { Icon: XCircle, cls: "text-destructive bg-destructive/15" },
  info: { Icon: Info, cls: "text-primary bg-primary/15" },
  default: { Icon: Bell, cls: "text-muted-foreground bg-muted" },
} as const;

export default function AdminNotifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [view, setView] = useState<"all" | "unread">("all");
  const [type, setType] = useState("all");

  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const matchesView = view === "all" || n.unread;
      const matchesType = type === "all" || n.type === type;
      return matchesView && matchesType;
    });
  }, [items, view, type]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground">{unread} unread · platform activity feed</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent">Mark all read</button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["all", "unread"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn("rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {v}{v === "unread" && unread > 0 ? ` (${unread})` : ""}
              </button>
            ))}
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All types</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="info">Info</option>
            <option value="default">General</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.map((n) => {
            const { Icon, cls } = ICONS[n.type as keyof typeof ICONS] ?? ICONS.default;
            return (
              <div key={n.id} className={cn("flex gap-3 p-4", n.unread && "bg-accent/30")}>
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", cls)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{n.title}</span>
                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-destructive" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No notifications match this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
