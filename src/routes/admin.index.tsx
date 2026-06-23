import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: products }, { count: enquiries }, { count: newEnq }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return { products: products ?? 0, enquiries: enquiries ?? 0, newEnq: newEnq ?? 0 };
    },
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["recent-enquiries"],
    queryFn: async () => {
      const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Products", value: stats?.products ?? "—", to: "/admin/products" },
    { label: "Total Enquiries", value: stats?.enquiries ?? "—", to: "/admin/enquiries" },
    { label: "New Enquiries", value: stats?.newEnq ?? "—", to: "/admin/enquiries" },
  ];

  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Overview</div>
      <h1 className="mb-10 font-display text-4xl italic">Dashboard.</h1>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="border border-border bg-card p-8 transition hover:border-primary">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="font-display text-5xl italic">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="font-display text-xl italic">Recent enquiries</h2>
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 p-6">
                <div className="min-w-0">
                  <div className="truncate font-medium">{e.name}</div>
                  <div className="truncate font-mono text-xs text-muted-foreground">{e.email}</div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
