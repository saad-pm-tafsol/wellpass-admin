"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Loader2 } from "lucide-react";
import { Logo } from "@/components/wp/Logo";
import { NotificationsBell } from "@/components/wp/NotificationsBell";

export type SidebarNav = { to: string; label: string; icon: ComponentType<{ className?: string }> };

export function SidebarLayout({
  nav, title, subtitle, variant = "admin", children,
}: { nav: SidebarNav[]; title: string; subtitle: string; variant?: "studio" | "admin"; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dark = variant === "admin";
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={cn(
        "hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r",
        dark ? "bg-sidebar text-sidebar-foreground border-sidebar-border" : "bg-card border-border",
      )}>
        <div className="px-5 py-5 border-b border-inherit">
          <Link href="/admin/dashboard" className="block">
            <Logo variant="logo" onDark={dark} imgClassName="h-9" />
            <div className={cn("mt-2 text-xs", dark ? "text-sidebar-foreground/60" : "text-muted-foreground")}>{subtitle}</div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all border-l-2",
                  active
                    ? dark ? "bg-sidebar-accent text-white border-secondary" : "bg-accent text-primary border-secondary"
                    : dark
                      ? "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/40 border-transparent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border-transparent",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-inherit">
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className={cn("flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-60",
              dark ? "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/40" : "text-muted-foreground hover:text-foreground hover:bg-accent/50")}
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-4 lg:px-8">
          <h1 className="font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <div className="h-9 w-9 rounded-full brand-gradient grid place-items-center text-white text-sm font-semibold">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
