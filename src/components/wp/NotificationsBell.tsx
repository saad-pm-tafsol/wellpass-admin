"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, Check } from "lucide-react";
import { ADMIN_ALERTS } from "@/data/alerts";

const ICONS = {
  success: { Icon: CheckCircle2, cls: "text-success-foreground bg-success/15" },
  warning: { Icon: AlertTriangle, cls: "text-warning-foreground bg-warning/15" },
  error: { Icon: XCircle, cls: "text-destructive bg-destructive/15" },
  info: { Icon: Info, cls: "text-primary bg-primary/15" },
} as const;

export function NotificationsBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  const isRead = (id: string) => readIds.includes(id);
  const unread = ADMIN_ALERTS.filter((a) => !isRead(a.id)).length;

  const markAll = () => setReadIds(ADMIN_ALERTS.map((a) => a.id));

  const openAlert = (id: string, href: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="relative p-2 rounded-md hover:bg-accent"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Click-outside backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="text-sm font-semibold">Alerts {unread > 0 && <span className="text-muted-foreground font-normal">· {unread} new</span>}</div>
              {unread > 0 && (
                <button onClick={markAll} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-secondary">
                  <Check className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {ADMIN_ALERTS.map((a) => {
                const { Icon, cls } = ICONS[a.type];
                const read = isRead(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => openAlert(a.id, a.href)}
                    className={cn("flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50", !read && "bg-accent/30")}
                  >
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", cls)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{a.title}</span>
                        {!read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.body}</span>
                      <span className="block text-[11px] text-muted-foreground mt-1">{a.time}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => { setOpen(false); router.push("/admin/notifications"); }}
              className="block w-full border-t border-border px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-accent/50"
            >
              View all notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
}
