import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { ProductCard } from "@/components/site/product-card";
import { fetchProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/whatsapp";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Collections — APJ Furniture" },
      { name: "description", content: "Browse APJ's full collection: sofas, dining tables, beds, office furniture, and modular wardrobes." },
      { property: "og:title", content: "Collections — APJ Furniture" },
      { property: "og:description", content: "Bespoke furniture manufactured in Chennai." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !`${p.name} ${p.material ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [products, cat, q]);

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">The Catalogue</div>
          <h1 className="font-display text-5xl italic md:text-6xl">All collections.</h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            {products.length} pieces across {CATEGORIES.length} categories. Every item is made to order in our Villivakkam workshop.
          </p>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
          <div className="no-scrollbar flex flex-1 items-center gap-8 overflow-x-auto">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  cat === c ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the catalogue"
              className="w-full border border-border bg-transparent py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-stone-surface" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            No pieces match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
