import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Enquiry = {
  id: string; name: string; email: string; phone: string | null; subject: string | null;
  message: string; status: string; created_at: string;
};

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const qc = useQueryClient();
  const { data: enquiries = [] } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Enquiry[];
    },
  });
  const [open, setOpen] = useState<Enquiry | null>(null);

  async function setStatus(id: string, status: string) {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["enquiries"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("enquiries").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["enquiries"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    setOpen(null);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Inbox</div>
        <h1 className="font-display text-4xl italic">Customer enquiries.</h1>
      </div>

      {enquiries.length === 0 ? (
        <p className="rounded border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-secondary text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Received</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} onClick={() => setOpen(e)} className="cursor-pointer border-t border-border hover:bg-secondary/50">
                  <td className="p-4">{e.name}</td>
                  <td className="p-4 font-mono text-xs">{e.email}</td>
                  <td className="p-4">{e.subject ?? "—"}</td>
                  <td className="p-4">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${e.status === "new" ? "text-primary" : "text-muted-foreground"}`}>{e.status}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={(ev) => { ev.stopPropagation(); remove(e.id); }} className="p-2 hover:text-destructive"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto bg-background p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-3xl italic">{open.name}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{new Date(open.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setOpen(null)} className="rounded-full p-2 hover:bg-secondary"><X className="size-5" /></button>
            </div>

            <dl className="mb-6 space-y-3 border-y border-border py-4 text-sm">
              <Row label="Email"><a href={`mailto:${open.email}`} className="hover:text-primary">{open.email}</a></Row>
              {open.phone && <Row label="Phone"><a href={`tel:${open.phone}`} className="hover:text-primary">{open.phone}</a></Row>}
              {open.subject && <Row label="Subject">{open.subject}</Row>}
            </dl>

            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Message</h3>
            <p className="mb-8 whitespace-pre-line leading-relaxed">{open.message}</p>

            <div className="flex flex-wrap gap-2">
              {["new", "in_progress", "responded", "archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(open.id, s)}
                  className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-widest ${
                    open.status === s ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
