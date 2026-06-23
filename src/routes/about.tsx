import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/site-shell";
import hero from "@/assets/hero-showroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — APJ Furniture & Interior" },
      { name: "description", content: "APJ Furniture & Interior — three decades of furniture manufacturing and interior design in Chennai." },
      { property: "og:title", content: "About — APJ Furniture" },
      { property: "og:description", content: "Three decades of craft. Manufactured in Chennai." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-6 md:py-36">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Chennai · Est. 1994</div>
            <h1 className="font-display text-5xl italic leading-tight md:text-7xl">
              Furniture, made the long way.
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <div className="space-y-8 text-lg leading-relaxed text-foreground/85">
          <p>
            APJ Furniture & Interior began in 1994 as a small workshop in Villivakkam — three craftsmen, one band saw, and an unfashionable conviction that
            furniture should be built to outlast its owner.
          </p>
          <p>
            Three decades later, the workshop has grown but the conviction hasn't moved. Every piece that leaves our floor is built on a kiln-dried solid-wood
            frame, joined with hand-cut dovetails or mortise-and-tenon — never staples — and finished with hand-rubbed oils or sprayed-and-polished lacquers
            that catch Chennai's afternoon light the way they should.
          </p>
          <p>
            We make individual pieces for clients who walk into the showroom, modular wardrobes and kitchens for residential projects, complete interiors for
            apartments and villas across the city, and wholesale volumes for the architects and developers who have been buying from us for twenty years.
          </p>
        </div>
      </section>

      <section className="bg-stone-surface/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:grid-cols-4">
          {[
            ["30+", "Years in Chennai"],
            ["150+", "Interior projects"],
            ["2,400", "Pieces manufactured"],
            ["40", "Master craftsmen"],
          ].map(([n, l]) => (
            <div key={l} className="border-t border-foreground pt-8">
              <div className="mb-3 font-display text-5xl italic">{n}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-6">
        <h2 className="mb-6 font-display text-4xl italic md:text-5xl">Come see the workshop.</h2>
        <Link to="/contact" className="inline-block bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-primary">
          Book a visit
        </Link>
      </section>
    </SiteShell>
  );
}
