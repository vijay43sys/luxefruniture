import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts, type Product, productImage } from "@/lib/products";
import { CATEGORIES } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Draft = Partial<Product> & { imageUrlInput?: string };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [editing, setEditing] = useState<Draft | null>(null);

  async function save(d: Draft) {
    const payload = {
      name: d.name!,
      slug: d.slug || slugify(d.name!),
      category: d.category!,
      short_description: d.short_description ?? null,
      description: d.description ?? null,
      price: d.price ? Number(d.price) : null,
      material: d.material ?? null,
      dimensions: d.dimensions ?? null,
      images: d.images ?? [],
      featured: !!d.featured,
      is_new: !!d.is_new,
    };
    const { error } = d.id
      ? await supabase.from("products").update(payload).eq("id", d.id)
      : await supabase.from("products").insert(payload);
    if (error) { alert(error.message); return; }
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Catalogue</div>
          <h1 className="font-display text-4xl italic">Products.</h1>
        </div>
        <button onClick={() => setEditing({ category: "Sofa", images: [] })} className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary">
          <Plus className="size-4" /> New product
        </button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-secondary text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Flags</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="flex items-center gap-3 p-4">
                  <img src={productImage(p)} alt="" className="size-12 shrink-0 object-cover" />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">{p.slug}</div>
                  </div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 font-mono text-xs">{p.price ? `₹ ${p.price.toLocaleString("en-IN")}` : "—"}</td>
                <td className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.featured && <span className="mr-2 text-primary">featured</span>}
                  {p.is_new && <span className="text-primary">new</span>}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setEditing(p)} className="mr-2 p-2 hover:text-primary" aria-label="Edit"><Pencil className="size-4" /></button>
                  <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive" aria-label="Delete"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductDrawer draft={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProductDrawer({ draft, onClose, onSave }: { draft: Draft; onClose: () => void; onSave: (d: Draft) => void }) {
  const [d, setD] = useState<Draft>(draft);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi, "-")}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (data?.signedUrl) setD((p) => ({ ...p, images: [...(p.images ?? []), data.signedUrl] }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-xl overflow-y-auto bg-background p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">{d.id ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary"><X className="size-5" /></button>
        </div>

        <div className="space-y-4">
          <Input label="Name" value={d.name ?? ""} onChange={(v) => setD({ ...d, name: v, slug: d.slug || slugify(v) })} />
          <Input label="Slug" value={d.slug ?? ""} onChange={(v) => setD({ ...d, slug: v })} />
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
            <select value={d.category ?? ""} onChange={(e) => setD({ ...d, category: e.target.value })} className="w-full border border-border bg-background p-3 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Short description" value={d.short_description ?? ""} onChange={(v) => setD({ ...d, short_description: v })} />
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea rows={4} value={d.description ?? ""} onChange={(e) => setD({ ...d, description: e.target.value })} className="w-full border border-border bg-background p-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (INR)" value={d.price?.toString() ?? ""} onChange={(v) => setD({ ...d, price: Number(v) || null })} type="number" />
            <Input label="Material" value={d.material ?? ""} onChange={(v) => setD({ ...d, material: v })} />
          </div>
          <Input label="Dimensions" value={d.dimensions ?? ""} onChange={(v) => setD({ ...d, dimensions: v })} />

          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Images</label>
            <div className="mb-3 grid grid-cols-4 gap-2">
              {(d.images ?? []).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-stone-surface">
                  <img src={img} alt="" className="size-full object-cover" />
                  <button onClick={() => setD({ ...d, images: (d.images ?? []).filter((_, j) => j !== i) })} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90"><X className="size-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:border-primary">
                <Upload className="size-4" />
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
              <input
                placeholder="…or paste image URL"
                value={d.imageUrlInput ?? ""}
                onChange={(e) => setD({ ...d, imageUrlInput: e.target.value })}
                className="flex-1 border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => {
                  if (!d.imageUrlInput) return;
                  setD({ ...d, images: [...(d.images ?? []), d.imageUrlInput], imageUrlInput: "" });
                }}
                className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:border-primary"
              >Add</button>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!d.featured} onChange={(e) => setD({ ...d, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!d.is_new} onChange={(e) => setD({ ...d, is_new: e.target.checked })} /> New</label>
          </div>

          <button onClick={() => onSave(d)} disabled={!d.name || !d.category} className="mt-6 w-full bg-foreground py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary disabled:opacity-60">
            Save product
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border bg-background p-3 text-sm" />
    </div>
  );
}
