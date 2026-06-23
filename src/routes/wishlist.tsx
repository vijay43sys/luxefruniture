import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { useWishlist, useCart } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — APJ Furniture" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-6 md:py-24">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Saved</div>
        <h1 className="mb-12 font-display text-5xl italic md:text-6xl">Wishlist.</h1>

        {wishlist.items.length === 0 ? (
          <div className="border-t border-foreground py-16 text-center">
            <Heart className="mx-auto mb-6 size-8 text-muted-foreground" />
            <p className="mb-6 text-muted-foreground">Nothing saved yet.</p>
            <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-primary">Browse the collections →</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {wishlist.items.map((it) => (
              <li key={it.id}>
                <Link to="/products/$slug" params={{ slug: it.slug }} className="block">
                  <div className="mb-4 aspect-[4/5] overflow-hidden bg-stone-surface">
                    <img src={it.image} alt={it.name} className="size-full object-cover" />
                  </div>
                  <div className="mb-1 truncate text-base">{it.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{it.price ? `₹ ${it.price.toLocaleString("en-IN")}` : "Quote on request"}</div>
                </Link>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => cart.add({ id: it.id, name: it.name, price: it.price, image: it.image, slug: it.slug })}
                    className="font-mono text-[11px] uppercase tracking-widest text-primary"
                  >
                    Add to cart
                  </button>
                  <button onClick={() => wishlist.toggle(it)} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-destructive">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
