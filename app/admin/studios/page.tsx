"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CLASS_DELETION_RECORDS, STUDIOS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminStudios() {
  const { studioStatus, toggleStudio, pendingStudios, approveStudio, rejectStudio } = useAccounts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [highlightPending, setHighlightPending] = useState(false);

  // Honor the dashboard "Review now" deep link (/admin/studios?filter=pending).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHighlightPending(params.get("filter") === "pending");
  }, []);

  const categories = useMemo(() => Array.from(new Set(STUDIOS.map((s) => s.category))).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDIOS.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
      const matchesCategory = category === "all" || s.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const onToggle = (id: string, name: string) => {
    const next = toggleStudio(id);
    toast.success(`${name} ${next === "Blocked" ? "blocked" : "unblocked"}`);
  };

  const onApprove = (id: string) => {
    const s = approveStudio(id);
    if (s) toast.success(`${s.name} approved!`);
  };
  const onReject = (id: string) => {
    const s = rejectStudio(id);
    if (s) toast.error(`${s.name} rejected`);
  };

  // Newest application shows prominently; the rest go into the table below.
  const sortedPending = useMemo(
    () => [...pendingStudios].sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1)),
    [pendingStudios],
  );
  const latestPending = sortedPending[0];
  const otherPending = sortedPending.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Partner management</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length === STUDIOS.length ? `${STUDIOS.length} partners on the platform` : `${filtered.length} of ${STUDIOS.length} partners`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search partners..."
              className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {latestPending && (
        <div className={`bg-warning/10 border rounded-xl p-5 transition-shadow ${highlightPending ? "border-warning ring-2 ring-warning/50" : "border-warning/30"}`}>
          <div className="font-semibold mb-3">
            {pendingStudios.length} partner{pendingStudios.length > 1 ? "s" : ""} pending approval
            <span className="ml-2 text-xs font-normal text-muted-foreground">· latest application</span>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap rounded-lg border border-warning/20 bg-card/60 p-3">
            <div>
              <div className="font-medium">{latestPending.name}</div>
              <div className="text-sm text-muted-foreground">Submitted {latestPending.submittedAt} · {latestPending.category} · {latestPending.location}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/studios/pending/${latestPending.id}`} className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-accent">View</Link>
              <button onClick={() => onReject(latestPending.id)} className="px-3 py-2 text-sm font-medium rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25">Reject</button>
              <button onClick={() => onApprove(latestPending.id)} className="px-3 py-2 text-sm font-medium rounded-lg bg-success text-white hover:bg-success/80">Approve</button>
            </div>
          </div>
        </div>
      )}

      {otherPending.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <h3 className="font-semibold p-5 pb-3">Other pending applications ({otherPending.length})</h3>
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Partner</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Submitted</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {otherPending.map((p) => (
                <tr key={p.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/studios/pending/${p.id}`} className="font-medium text-primary hover:text-secondary hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.submittedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/studios/pending/${p.id}`} className="text-xs text-primary hover:text-secondary font-medium">View</Link>
                      <button onClick={() => onApprove(p.id)} className="text-xs text-success-foreground hover:opacity-80 font-medium">Approve</button>
                      <button onClick={() => onReject(p.id)} className="text-xs text-destructive hover:opacity-80 font-medium">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <div className="p-5 pb-3">
          <h3 className="font-semibold">Class deletion records</h3>
          <p className="mt-1 text-sm text-muted-foreground">Partner-submitted class deletions and optional reasons.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Class</th>
              <th className="text-left px-4 py-3">Partner</th>
              <th className="text-left px-4 py-3">Instructor</th>
              <th className="text-left px-4 py-3">Deleted</th>
              <th className="text-left px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CLASS_DELETION_RECORDS.map((record) => (
              <tr key={record.id} className="hover:bg-accent/30 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{record.className}</div>
                  <div className="text-xs text-muted-foreground">{record.category}</div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/studios/${record.studioId}`} className="font-medium text-primary hover:text-secondary hover:underline">
                    {record.partner}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{record.instructor}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{record.deletedAt}</td>
                <td className="px-4 py-3 max-w-md text-muted-foreground">{record.reason || "No reason provided"}</td>
              </tr>
            ))}
            {CLASS_DELETION_RECORDS.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No class deletions recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Partner</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Rating</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => {
              const status = studioStatus[s.id] ?? "Active";
              return (
                <tr key={s.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/studios/${s.id}`} className="font-medium text-primary hover:text-secondary hover:underline">{s.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.location}</td>
                  <td className="px-4 py-3 font-mono">{s.rating}</td>
                  <td className="px-4 py-3"><StatusBadge status={status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/studios/${s.id}`} className="text-xs text-primary hover:text-secondary font-medium">View</Link>
                      <button onClick={() => onToggle(s.id, s.name)} className="text-xs text-muted-foreground hover:text-foreground font-medium">
                        {status === "Blocked" ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No partners match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
