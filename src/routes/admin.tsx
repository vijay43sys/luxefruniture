import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Mail, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — APJ Furniture" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: ud } = await supabase.auth.getUser();
      if (!ud.user) { nav({ to: "/auth" }); return; }
      setEmail(ud.user.email ?? "");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", ud.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  if (isAdmin === null) {
    return <div className="grid min-h-screen place-items-center bg-background font-mono text-xs uppercase tracking-widest text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="mb-4 font-display text-4xl italic">Admin access required.</h1>
        <p className="mb-8 text-muted-foreground">
          You're signed in as <span className="font-mono text-xs">{email}</span> but don't have admin permissions.
          An existing admin can grant access from the database.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={signOut} className="bg-foreground px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary">
            Sign out
          </button>
          <Link to="/" className="border border-foreground px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary">
            Home
          </Link>
        </div>
      </div>
    );
  }

  const nav_items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/enquiries", label: "Enquiries", icon: Mail },
  ] as const;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-stone-surface/40 p-6 md:flex md:flex-col">
        <Link to="/" className="mb-10 block leading-none">
          <span className="font-display text-xl italic">APJ Admin</span>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{email}</p>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav_items.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                  active ? "bg-foreground text-background" : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="mt-6 flex items-center gap-3 rounded px-3 py-2 text-sm text-muted-foreground hover:text-destructive">
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      <div className="flex-1">
        <div className="border-b border-border bg-background/90 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Link to="/" className="font-display text-lg italic">APJ Admin</Link>
            <button onClick={signOut} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Sign out</button>
          </div>
          <div className="no-scrollbar flex gap-6 overflow-x-auto border-t border-border px-5 py-3">
            {nav_items.map((n) => (
              <Link key={n.to} to={n.to} className="whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-muted-foreground" activeProps={{ className: "text-primary" }}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
