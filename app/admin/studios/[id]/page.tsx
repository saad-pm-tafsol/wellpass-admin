"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { STUDIOS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { ApplicationDetailsCard } from "@/components/wp/ApplicationDetailsCard";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { ArrowLeft, CalendarClock, Mail, MapPin, Phone, Play, Snowflake, User } from "lucide-react";
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
          <ArrowLeft className="h-4 w-4" /> Back to partners
        </Link>
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">Partner not found.</div>
      </div>
    );
  }

  const status = studioStatus[studio.id] ?? "Active";

  const onToggle = () => {
    const next = toggleStudio(studio.id);
    toast.success(`${studio.name} ${next === "Frozen" ? "frozen" : "reactivated"}`);
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/studios" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
        <ArrowLeft className="h-4 w-4" /> Back to partners
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{studio.name}</h2>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{studio.category} - {studio.location}</p>
        </div>
        <button
          onClick={onToggle}
          className={
            status === "Frozen"
              ? "inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/80"
              : "inline-flex items-center gap-2 rounded-lg bg-destructive/15 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/25"
          }
        >
          {status === "Frozen" ? (
            <>
              <Play className="h-4 w-4" /> Reactivate account
            </>
          ) : (
            <>
              <Snowflake className="h-4 w-4" /> Freeze account
            </>
          )}
        </button>
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3 text-sm">
        <CalendarClock className="h-5 w-5 text-warning-foreground shrink-0" />
        <span>
          This partner applied on <span className="font-medium">{studio.submittedAt}</span> and is currently{" "}
          <span className="font-medium lowercase">{status}</span>.
        </span>
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
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Applicant contact</div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>{studio.owner}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${studio.email}`} className="text-primary hover:text-secondary break-all">{studio.email}</a></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-mono">{studio.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{studio.location}</span></div>
          </dl>
        </div>
      </div>

      <ApplicationDetailsCard partner={studio} status={status} />
    </div>
  );
}
