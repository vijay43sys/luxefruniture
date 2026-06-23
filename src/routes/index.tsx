import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { ProductCard } from "@/components/site/product-card";
import { fetchProducts } from "@/lib/products";
import { BUSINESS } from "@/lib/whatsapp";
import heroImg from "@/assets/hero-showroom.jpg";
import moodboard from "@/assets/design-moodboard.jpg";
import projectImg from "@/assets/design-project.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APJ Furniture & Interior — Bespoke Furniture in Chennai" },
      {
        name: "description",
        content:
          "Premium quality furniture, modular wardrobes, and luxury interior design — manufactured in Chennai since 1994.",
      },
      { property: "og:title", content: "APJ Furniture & Interior" },
      { property: "og:description", content: "Bespoke furniture and luxury interiors in Chennai." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Home() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const reviews = [
    {
      quote:
        "APJ delivered our entire home — every wardrobe, every joint, finished to a standard I'd only seen in European catalogues.",
      author: "Anitha Rajan",
      role: "Boat Club Road, Chennai",
    },
    {
      quote: "Wholesale partner of choice for our last three residential towers. Quietly excellent.",
      author: "Karthik V.",
      role: "Principal Architect, Studio K",
    },
    {
      quote: "The Pallava chair sits in our reception. Clients ask about it before they ask about the work.",
      author: "Meera S.",
      role: "Partner, Vakil Chambers",
    },
  ];

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[640px] items-center overflow-hidden">
        <motion.img
          src={heroImg}
          alt="APJ Furniture showroom"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
          className="absolute inset-0 size-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-background/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-foreground/80"
            >
              The 2024 Collection · Chennai
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="mb-8 text-balance font-display text-5xl italic leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Quiet luxury for <br /> modern living.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="flex flex-wrap items-center gap-8"
            >
              <Link
                to="/products"
                className="border-b border-foreground pb-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:border-primary hover:text-primary"
              >
                View Catalogue
              </Link>
              <Link
                to="/services"
                className="border-b border-foreground pb-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:border-primary hover:text-primary"
              >
                Interior Design
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why APJ */}
      <section className="border-y border-border bg-stone-surface/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:grid-cols-3">
          {[
            { kicker: "Since 1994", title: "Three decades of craft", body: "A workshop in Villivakkam that has shaped a generation of Chennai homes." },
            { kicker: "Made on site", title: "Manufactured, not assembled", body: "Solid-wood frames, kiln-dried timbers, hand-cut joinery — finished in our own atelier." },
            { kicker: "End to end", title: "Pieces or whole interiors", body: "Buy a single chair, or commission a complete residence — same care, same quiet standard." },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
            >
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{c.kicker}</div>
              <h3 className="mb-3 font-display text-2xl italic">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Selected Pieces</div>
            <h2 className="font-display text-4xl italic md:text-5xl">Featured this season.</h2>
          </div>
          <Link to="/products" className="hidden shrink-0 items-center gap-2 border-b border-foreground pb-1 text-xs font-semibold uppercase tracking-[0.18em] hover:text-primary md:inline-flex">
            All collections <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
          {(featured.length ? featured : products.slice(0, 3)).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Interior services */}
      <section className="overflow-hidden bg-foreground py-28 text-background">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 md:grid-cols-2 md:gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="mb-8 font-display text-4xl italic leading-tight md:text-6xl"
            >
              Crafting entire <br /> atmospheres.
            </motion.h2>
            <p className="mb-12 max-w-md text-base leading-relaxed text-background/65">
              Beyond individual pieces, we design holistic interior environments that resonate with Chennai's heritage and modern sensibilities.
            </p>
            <ul className="mb-12 space-y-5">
              {[
                "Full Home Customisation",
                "Architectural Woodwork",
                "Modular Kitchen Systems",
                "Office & Workspace Interiors",
              ].map((item, i) => (
                <li key={item} className="flex items-center gap-5 border-b border-background/10 pb-4">
                  <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/services"
              className="inline-block bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:brightness-110"
            >
              Consult our design team
            </Link>
          </div>
          <div className="relative">
            <img src={moodboard} alt="Material moodboard" className="aspect-square w-full object-cover" loading="lazy" />
            <img
              src={projectImg}
              alt="Recent project"
              className="absolute -bottom-8 -left-8 hidden aspect-[4/5] w-56 border-4 border-foreground object-cover md:block"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <div className="mb-14 max-w-xl">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Said about us</div>
          <h2 className="font-display text-4xl italic md:text-5xl">Words from our clients.</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="border-t border-foreground pt-8"
            >
              <blockquote className="mb-8 font-display text-xl italic leading-snug">"{r.quote}"</blockquote>
              <figcaption className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="text-foreground">{r.author}</span> · {r.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-stone-surface/40 py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <h2 className="mb-6 font-display text-4xl italic md:text-6xl">Begin a conversation.</h2>
          <p className="mx-auto mb-10 max-w-lg text-base text-muted-foreground">
            Visit our atelier in {BUSINESS.address.split(",").slice(-3, -2)[0]?.trim() ?? "Villivakkam, Chennai"}, or share your space with us — we'll come to you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/contact" className="bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary">
              Book a consultation
            </Link>
            <Link to="/gallery" className="border-b border-foreground pb-2 text-xs font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary">
              See recent work
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
