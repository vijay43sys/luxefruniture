import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/site-shell";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/design-project.jpg";
import g5 from "@/assets/product-wardrobe.jpg";
import g6 from "@/assets/product-bed.jpg";
import g7 from "@/assets/product-desk.jpg";
import g8 from "@/assets/product-sofa.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — APJ Furniture Projects" },
      { name: "description", content: "Selected furniture and interior design projects by APJ Furniture in Chennai." },
      { property: "og:title", content: "Gallery — APJ Furniture" },
      { property: "og:description", content: "Selected projects from APJ Furniture & Interior." },
      { property: "og:url", content: "/gallery" },
      { property: "og:image", content: g1 },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const items = [
  { img: g1, caption: "Dining hall, Boat Club Residence" },
  { img: g4, caption: "Living room, Adyar Apartment" },
  { img: g2, caption: "Master bedroom, Anna Nagar" },
  { img: g5, caption: "Modular wardrobe, ECR Villa" },
  { img: g3, caption: "Executive cabin, Guindy" },
  { img: g6, caption: "Coromandel platform bed" },
  { img: g7, caption: "Cholamandal writing desk" },
  { img: g8, caption: "Adyar linen sofa" },
];

function GalleryPage() {
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Selected Projects</div>
          <h1 className="font-display text-5xl italic md:text-6xl">The gallery.</h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">A small selection of pieces and interiors completed in Chennai over the past year.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {items.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.05 }}
              className="group overflow-hidden"
            >
              <div className="overflow-hidden bg-stone-surface">
                <img src={it.img} alt={it.caption} loading="lazy" className="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{it.caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
