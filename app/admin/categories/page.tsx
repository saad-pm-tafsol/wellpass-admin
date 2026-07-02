"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, STUDIOS } from "@/data/mock";
import { Kpi } from "@/components/wp/Kpi";
import { Modal } from "@/components/wp/Modal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Category = { id: string; name: string; icon: string };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(() => CATEGORIES.map((c, i) => ({ id: `c${i}`, name: c.name, icon: c.icon })));
  const [query, setQuery] = useState("");

  const nextId = useRef(CATEGORIES.length);

  // Add / edit modal.
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");

  // Delete confirm modal.
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleting = categories.find((c) => c.id === deletingId) ?? null;

  const studiosIn = (name: string) => STUDIOS.filter((s) => s.category === name).length;
  const used = categories.filter((c) => studiosIn(c.name) > 0).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const openAdd = () => {
    setEditingId(null);
    setFormName("");
    setFormIcon("");
    setFormOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormIcon(c.icon);
    setFormOpen(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    const icon = formIcon.trim() || "🏷️";
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, name, icon } : c)));
      toast.success(`“${name}” updated`);
    } else {
      const id = `c${nextId.current++}`;
      setCategories((prev) => [...prev, { id, name, icon }]);
      toast.success(`“${name}” added`);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
    toast.success(`“${deleting.name}” deleted`);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">Activity types studios can list under</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">
            <Plus className="h-4 w-4" /> Add category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Kpi label="Total categories" value={categories.length} />
        <Kpi label="In use" value={used} accent="success" />
        <Kpi label="Empty" value={categories.length - used} accent="warning" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl px-4 py-12 text-center text-sm text-muted-foreground">No categories match your search.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c) => {
            const count = studiosIn(c.name);
            return (
              <div key={c.id} className="bg-card border border-border rounded-xl p-5 card-hover">
                <div className="flex items-start justify-between">
                  <span className="text-3xl" aria-hidden>{c.icon}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeletingId(c.id)} aria-label={`Delete ${c.name}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 font-semibold leading-tight">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{count} {count === 1 ? "studio" : "studios"}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / edit */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit category" : "Add category"}
        description={editingId ? "Update this activity type." : "Create a new activity type for studios."}
        footer={
          <>
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" form="category-form" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">{editingId ? "Save changes" : "Add category"}</button>
          </>
        }
      >
        <form id="category-form" onSubmit={submitForm} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Name</span>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Yoga"
              autoFocus
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Icon (emoji)</span>
            <input
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              placeholder="🧘"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="mt-1 block text-xs text-muted-foreground">Optional — defaults to 🏷️.</span>
          </label>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeletingId(null)}
        title="Delete category"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeletingId(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button onClick={confirmDelete} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">Delete</button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Delete <span className="font-medium text-foreground">“{deleting?.name}”</span>? This can’t be undone.
        </p>
      </Modal>
    </div>
  );
}
