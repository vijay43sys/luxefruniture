import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { useCart } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — APJ Furniture" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const message = cart.items.length
    ? `Hello APJ, I'd like to enquire about: ${cart.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}.`
    : undefined;

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-6 md:py-24">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Your selection</div>
        <h1 className="mb-12 font-display text-5xl italic md:text-6xl">Cart.</h1>

        {cart.items.length === 0 ? (
          <div className="border-t border-foreground py-16 text-center">
            <p className="mb-6 text-muted-foreground">Your cart is empty.</p>
            <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-primary">Browse the collections →</Link>
          </div>
        ) : (
          <>
            <ul className="border-t border-foreground">
              {cart.items.map((it) => (
                <li key={it.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-border py-5 sm:grid-cols-[100px_1fr_auto_auto] sm:gap-6">
                  <Link to="/products/$slug" params={{ slug: it.slug }} className="bg-stone-surface">
                    <img src={it.image} alt={it.name} className="aspect-square w-full object-cover" />
                  </Link>
                  <div className="min-w-0">
                    <Link to="/products/$slug" params={{ slug: it.slug }} className="block truncate text-lg hover:text-primary">{it.name}</Link>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">{it.price ? `₹ ${it.price.toLocaleString("en-IN")}` : "Quote on request"}</div>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                    <button onClick={() => cart.setQty(it.id, it.qty - 1)} className="grid size-8 place-items-center border border-border hover:border-primary">
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-sm">{it.qty}</span>
                    <button onClick={() => cart.setQty(it.id, it.qty + 1)} className="grid size-8 place-items-center border border-border hover:border-primary">
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <button onClick={() => cart.remove(it.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-end gap-6">
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Estimated total</span>
                <span className="font-display text-3xl italic">₹ {cart.total.toLocaleString("en-IN")}</span>
              </div>
              <p className="max-w-md text-right text-sm text-muted-foreground">
                APJ takes orders by enquiry — we confirm price, lead time, and dispatch before any payment.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={cart.clear} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  Clear cart
                </button>
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:brightness-110"
                >
                  Send enquiry via WhatsApp
                </a>
                <Link to="/contact" className="bg-foreground px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary">
                  Request a quote
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}
