import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Send } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { fetchProduct, productGallery, productImage } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [] };
    return {
      meta: [
        { title: `${p.name} — APJ Furniture` },
        { name: "description", content: p.short_description ?? p.description ?? `${p.name} by APJ Furniture.` },
        { property: "og:title", content: `${p.name} — APJ Furniture` },
        { property: "og:description", content: p.short_description ?? "" },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${p.slug}` },
        { property: "og:image", content: productImage(p) },
      ],
      links: [{ rel: "canonical", href: `/products/${p.slug}` }],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="mb-4 font-display text-4xl italic">Piece not found.</h1>
        <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-primary">
          Back to collections →
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="mb-4 font-display text-4xl italic">Couldn't load this piece.</h1>
        <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-primary">
          Back to collections →
        </Link>
      </div>
    </SiteShell>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: initial } = Route.useLoaderData();
  const { data: product = initial } = useQuery({
    queryKey: ["product", initial.slug],
    queryFn: () => fetchProduct(initial.slug).then((p) => p ?? initial),
    initialData: initial,
  });
  const gallery = productGallery(product);
  const [active, setActive] = useState(0);
  const cart = useCart();
  const wishlist = useWishlist();

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-[4/5] overflow-hidden bg-stone-surface"
          >
            <img src={gallery[active]} alt={product.name} className="size-full object-cover" />
          </motion.div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden bg-stone-surface ${active === i ? "ring-2 ring-primary" : ""}`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{product.category}</div>
          <h1 className="mb-3 font-display text-4xl italic md:text-5xl">{product.name}</h1>
          <p className="mb-8 text-base text-muted-foreground">{product.short_description}</p>
          <div className="mb-10 font-mono text-2xl">
            {product.price ? `₹ ${product.price.toLocaleString("en-IN")}` : "Quote on request"}
          </div>
          <p className="mb-10 leading-relaxed text-foreground/85">{product.description}</p>

          <dl className="mb-10 grid grid-cols-1 gap-y-4 border-y border-border py-6 sm:grid-cols-2">
            {product.material && (
              <div>
                <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Material</dt>
                <dd className="text-sm">{product.material}</dd>
              </div>
            )}
            {product.dimensions && (
              <div>
                <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Dimensions</dt>
                <dd className="text-sm">{product.dimensions}</dd>
              </div>
            )}
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Lead time</dt>
              <dd className="text-sm">4 – 6 weeks, made to order</dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Origin</dt>
              <dd className="text-sm">Villivakkam, Chennai</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                cart.add({ id: product.id, name: product.name, price: product.price, image: productImage(product), slug: product.slug })
              }
              className="inline-flex items-center gap-2 bg-foreground px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition hover:bg-primary"
            >
              <ShoppingBag className="size-4" /> Add to cart
            </button>
            <button
              onClick={() =>
                wishlist.toggle({ id: product.id, name: product.name, price: product.price, image: productImage(product), slug: product.slug })
              }
              className="inline-flex items-center gap-2 border border-foreground px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
            >
              <Heart className={`size-4 ${wishlist.has(product.id) ? "fill-primary text-primary" : ""}`} />
              {wishlist.has(product.id) ? "Saved" : "Save"}
            </button>
            <a
              href={whatsappLink(`Hello, I'd like to enquire about the ${product.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-foreground px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
            >
              <Send className="size-4" /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
