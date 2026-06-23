import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — APJ Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin" });
  },
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      }
      nav({ to: "/admin" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-5 py-20 sm:px-6 md:py-28">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Admin Access</div>
        <h1 className="mb-10 font-display text-4xl italic">{mode === "signin" ? "Sign in." : "Create account."}</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary disabled:opacity-60"
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Need an account? Create one →" : "Already have an account? Sign in →"}
        </button>

        <p className="mt-10 text-xs text-muted-foreground">
          New accounts get the <span className="font-semibold">user</span> role by default. An existing admin must grant admin access in the database.
        </p>
      </section>
    </SiteShell>
  );
}
