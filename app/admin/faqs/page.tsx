"use client";

import { useEffect, useRef, useState } from "react";
import { Kpi } from "@/components/wp/Kpi";
import { Modal } from "@/components/wp/Modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_FAQS, readStoredFaqs, writeStoredFaqs, type Faq } from "@/lib/faqs";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS);
  const nextId = useRef(0);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [stepsText, setStepsText] = useState("");

  // Load the current (possibly admin-edited) FAQs and mirror any change back to
  // the shared key so the public FAQ page stays in sync.
  useEffect(() => setFaqs(readStoredFaqs()), []);

  const persist = (next: Faq[]) => {
    setFaqs(next);
    writeStoredFaqs(next);
  };

  const openCreate = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setStepsText("");
    setOpen(true);
  };

  const openEdit = (f: Faq) => {
    setEditingId(f.id);
    setQuestion(f.q);
    setAnswer(f.a);
    setStepsText((f.steps ?? []).join("\n"));
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q) return toast.error("Question is required");
    const steps = stepsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const a = answer.trim();
    if (!steps.length && !a) return toast.error("Provide an answer or at least one step");

    const entry = steps.length ? { q, a: "", steps } : { q, a };
    const next = editingId
      ? faqs.map((f) => (f.id === editingId ? { ...f, ...entry } : f))
      : [...faqs, { id: `faq_${nextId.current++}_${faqs.length}`, ...entry }];
    persist(next);
    toast.success(editingId ? "FAQ updated" : "FAQ added");
    setOpen(false);
  };

  const remove = (f: Faq) => {
    persist(faqs.filter((x) => x.id !== f.id));
    toast.success("FAQ removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">FAQs</h2>
          <p className="text-sm text-muted-foreground">Questions shown on the public FAQ page</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
          <Plus className="h-4 w-4" /> New FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Kpi label="Total FAQs" value={faqs.length} />
        <Kpi label="Step-by-step answers" value={faqs.filter((f) => f.steps && f.steps.length).length} />
      </div>

      {faqs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">No FAQs yet. Create one to get started.</div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold">{f.q}</h3>
                  {f.steps && f.steps.length ? (
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                      {f.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => openEdit(f)} className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent">Edit</button>
                  <button onClick={() => remove(f)} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit FAQ" : "Add a FAQ"}
        description={editingId ? "Update this question and answer." : "Add a new question to the public FAQ page."}
        size="lg"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" form="faq-form" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">{editingId ? "Save changes" : "Add FAQ"}</button>
          </>
        }
      >
        <form id="faq-form" onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Question</span>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. When do my credits expire?"
              autoFocus
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Answer</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Write the answer shown when the question is expanded."
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Steps <span className="text-muted-foreground font-normal">(optional — one per line)</span></span>
            <textarea
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              rows={4}
              placeholder={"Select your preferred class.\nSubmit a booking request."}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <span className="mt-1 block text-xs text-muted-foreground">If you add steps, they replace the answer and render as a numbered list.</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
