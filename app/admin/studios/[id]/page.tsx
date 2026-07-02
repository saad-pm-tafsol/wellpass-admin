"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { STUDIOS, BOOKINGS, classById } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { Kpi } from "@/components/wp/Kpi";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { ArrowLeft, MapPin, Snowflake, Play } from "lucide-react";
import { toast } from "sonner";

export default function StudioDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const studio = STUDIOS.find((s) => s.id === id);
  const { studioStatus, toggleStudio } = useAccounts();

  if (!studio) {
    return (
      <div className="space-y-4">
        <Link href="/admin/studios" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
          <ArrowLeft className="h-4 w-4" /> Back to studios
        </Link>
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">Studio not found.</div>
      </div>
    );
  }

  const status = studioStatus[studio.id] ?? "Active";
  const bookings = BOOKINGS.filter((b) => classById(b.classId)?.studioId === studio.id);

  const onToggle = () => {
    const next = toggleStudio(studio.id);
    toast.success(`${studio.name} ${next === "Frozen" ? "frozen" : "reactivated"}`);
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/studios" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
        <ArrowLeft className="h-4 w-4" /> Back to studios
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{studio.name}</h2>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{studio.category} · {studio.location}</p>
        </div>
        <button
          onClick={onToggle}
          className={
            status === "Frozen"
              ? "inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/80"
              : "inline-flex items-center gap-2 rounded-lg bg-destructive/15 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/25"
          }
        >
          {status === "Frozen" ? <><Play className="h-4 w-4" /> Reactivate account</> : <><Snowflake className="h-4 w-4" /> Freeze account</>}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Kpi label="Bookings" value={bookings.length} accent="primary" />
        <Kpi label="Rating" value={studio.rating} hint={`${studio.reviews} reviews`} accent="success" />
        <Kpi label="Status" value={status} accent={status === "Frozen" ? "warning" : "success"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">About</div>
            <p className="text-sm">{studio.description}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {studio.amenities.map((a) => (
                <span key={a} className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">{a}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {studio.location}</div>
        </div>

        <dl className="bg-card border border-border rounded-xl p-5 grid grid-cols-2 gap-4 text-sm h-fit">
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Category</dt><dd className="mt-0.5 font-medium">{studio.category}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Rating</dt><dd className="mt-0.5 font-mono">{studio.rating}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Reviews</dt><dd className="mt-0.5 font-mono">{studio.reviews}</dd></div>
        </dl>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <h3 className="font-semibold p-5 pb-3">Bookings at this studio ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">No bookings on record.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Ref</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Class</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.ref} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs">{b.ref}</td>
                  <td className="px-4 py-3 font-medium">{b.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{classById(b.classId)?.name ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
