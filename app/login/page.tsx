"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/wp/Logo";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error ?? "Unable to sign in. Please try again.";
        setError(message);
        toast.error(message);
        return;
      }
      const dest = next && next.startsWith("/admin") ? next : "/admin/dashboard";
      toast.success("Welcome back, admin.");
      router.replace(dest);
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin access only
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Sign in to WellPass Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Restricted console. Authorized administrators only.</p>
      </div>

      <label className="block text-sm">
        <span className="text-foreground font-medium">Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@wellpass.sa"
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      <label className="block text-sm">
        <span className="text-foreground font-medium">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Signing in…" : "Log in"}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Trouble signing in? Contact the platform operations team.
      </p>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between brand-gradient text-white p-12">
        <span className="flex items-center">
          <Logo variant="full" onDark priority />
        </span>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">Run the platform with confidence.</h2>
          <p className="mt-4 text-white/80 max-w-md">
            Partners, customers, bookings, revenue and loyalty — one console for the whole WellPass network.
          </p>
        </div>
        <div className="text-xs text-white/60">© 2025 WellPass · Admin Console</div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
