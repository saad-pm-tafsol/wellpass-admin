"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PENDING_STUDIOS } from "@/data/mock";
import { useAccounts } from "@/store/accounts";
import { ApplicationDetailsCard } from "@/components/wp/ApplicationDetailsCard";
import { StatusBadge } from "@/components/wp/StatusBadge";
import { ArrowLeft, Mail, Phone, User, MapPin, CalendarClock } from "lucide-react";
import { toast } from "sonner";

export default function PendingStudioDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPendingStudio, approveStudio, rejectStudio } = useAccounts();
  // Static record for display; the store tells us whether it is still pending.
  const studio = PENDING_STUDIOS.find((s) => s.id === params.id);
  const stillPending = !!getPendingStudio(params.id);

  if (!studio) {
    return (
      <div className="space-y-4">
        <Link href="/admin/studios" className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary">
          <ArrowLeft className="h-4 w-4" /> Back to partners
        </Link>
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">Application not found.</div>
      </div>
    );
  }

  const decide = (approved: boolean) => {
    const s = approved ? approveStudio(params.id) : rejectStudio(params.id);
    if (s) toast[approved ? "success" : "error"](`${s.name} ${approved ? "approved" : "rejected"}`);
    router.push("/admin/studios");
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
            <StatusBadge status={stillPending ? "Pending" : "Completed"} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{studio.category} · {studio.location}</p>
        </div>
        {stillPending && (
          <div className="flex gap-2">
            <button onClick={() => decide(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25">Reject</button>
            <button onClick={() => decide(true)} className="px-4 py-2 text-sm font-medium rounded-lg bg-success text-white hover:bg-success/80">Approve</button>
          </div>
        )}
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3 text-sm">
        <CalendarClock className="h-5 w-5 text-warning-foreground shrink-0" />
        {stillPending ? (
          <span>This partner applied on <span className="font-medium">{studio.submittedAt}</span> and is awaiting review.</span>
        ) : (
          <span>This application has already been processed.</span>
        )}
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

      <ApplicationDetailsCard partner={studio} status={stillPending ? "Pending" : "Completed"} />
    </div>
  );
}
