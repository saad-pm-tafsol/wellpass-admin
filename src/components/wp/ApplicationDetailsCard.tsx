import { StatusBadge } from "@/components/wp/StatusBadge";

type ApplicationPartner = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  submittedAt: string;
};

const commercialNumbers: Record<string, string> = {
  zenith: "CR-1012247783",
  ironcore: "CR-1018834521",
  serene: "CR-1015530984",
  aquafit: "CR-1017402298",
  padel: "CR-1019934065",
  flex: "CR-1016723408",
  mindbody: "CR-1013845529",
  squash: "CR-1015482760",
  powerlift: "CR-1018349072",
  aercycle: "CR-1014096731",
  momentum: "CR-1017304486",
  serenity: "CR-1012859904",
};

function commercialNumberFor(id: string) {
  return commercialNumbers[id] ?? "CR-1010000000";
}

function uploadedDocumentsFor(partner: ApplicationPartner) {
  const commercialNumber = commercialNumberFor(partner.id);

  return [
    {
      id: `${partner.id}-commercial-registration`,
      title: "Commercial Registration",
      fileName: `${partner.id}-commercial-registration.pdf`,
      uploadedAt: partner.submittedAt,
      content: `Commercial Registration Certificate\n${partner.name}\n${commercialNumber}\nIssued by Ministry of Commerce`,
    },
    {
      id: `${partner.id}-operating-license`,
      title: "Operating License",
      fileName: `${partner.id}-operating-license.pdf`,
      uploadedAt: partner.submittedAt,
      content: `Operating License\n${partner.category} activities\n${partner.location}\nInspection status: Approved`,
    },
  ];
}

export function ApplicationDetailsCard({ partner, status }: { partner: ApplicationPartner; status: string }) {
  const commercialNumber = commercialNumberFor(partner.id);
  const documents = uploadedDocumentsFor(partner);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-4">Application details</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Partner name</dt><dd className="mt-0.5 font-medium">{partner.name}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Owner</dt><dd className="mt-0.5 font-medium">{partner.owner}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-0.5 break-all">{partner.email}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Phone</dt><dd className="mt-0.5 font-mono">{partner.phone}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Commercial number / Financial license</dt><dd className="mt-0.5 font-mono break-all">{commercialNumber}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Category</dt><dd className="mt-0.5">{partner.category}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Location</dt><dd className="mt-0.5">{partner.location}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Submitted</dt><dd className="mt-0.5">{partner.submittedAt}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status={status} /></dd></div>
      </dl>

      <div className="mt-6 border-t border-border pt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Uploaded documents</div>
        <div className="grid gap-4 lg:grid-cols-2">
          {documents.map((document) => (
            <article key={document.id} className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium">{document.title}</h4>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{document.fileName}</p>
                </div>
                <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">PDF</span>
              </div>
              <div className="h-44 overflow-auto bg-white p-4 text-xs text-slate-900">
                <div className="mx-auto min-h-full max-w-sm rounded border border-slate-200 bg-white p-4 shadow-sm">
                  <pre className="whitespace-pre-wrap font-mono leading-relaxed">{document.content}</pre>
                  <div className="mt-6 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
                    Uploaded {document.uploadedAt}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
