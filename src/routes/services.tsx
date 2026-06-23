import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/site-shell";
import moodboard from "@/assets/design-moodboard.jpg";
import projectImg from "@/assets/design-project.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Interior Design Services — APJ Furniture" },
      { name: "description", content: "Residential, office and wholesale interior design services in Chennai by APJ Furniture & Interior." },
      { property: "og:title", content: "Interior Design Services — APJ Furniture" },
      { property: "og:description", content: "End-to-end interior design and bespoke manufacturing in Chennai." },
      { property: "og:url", content: "/services" },
      { property: "og:image", content: projectImg },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    n: "01",
    title: "Residential Interior Design",
    body: "Apartments, villas, and heritage homes. From concept boards to handover — single point of accountability.",
  },
  { n: "02", title: "Office & Workspace", body: "Custom workstations, cabins, and millwork. Built around how your team actually works." },
  { n: "03", title: "Modular Wardrobes", body: "Tall units, walk-ins, and dressers in walnut, teak, and laminate. Soft-close and integrated lighting." },
  { n: "04", title: "Bespoke Manufacturing", body: "A drawing, a sample, an inspiration image — we manufacture to your specifications." },
  { n: "05", title: "Wholesale Supply", body: "For architects and developers shipping volume residential. Trade terms available." },
  { n: "06", title: "Modular Kitchens", body: "Engineered carcasses, German hardware, finishes that survive Chennai humidity." },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img src={projectImg} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-6 md:py-40">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Interior Design</div>
            <h1 className="max-w-3xl text-balance font-display text-5xl italic leading-[0.95] md:text-7xl">
              The room is the brief.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              For three decades, we've turned empty shells into the kind of rooms people come home to.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              className="border-t border-foreground pt-8"
            >
              <div className="mb-6 font-mono text-xs text-primary">{s.n}</div>
              <h3 className="mb-4 font-display text-2xl italic">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 md:grid-cols-2">
          <img src={moodboard} alt="Material moodboard" className="aspect-[4/5] w-full object-cover" loading="lazy" />
          <div>
            <h2 className="mb-6 font-display text-4xl italic md:text-5xl">How we work.</h2>
            <ol className="space-y-6">
              {[
                ["Listen", "We visit the site, understand how you live, and read the brief between the lines."],
                ["Draw", "3D visuals and material palettes. We iterate until the room is right on screen."],
                ["Build", "Manufactured in our Villivakkam workshop. Site-installed by our own team."],
                ["Hand over", "We don't leave until the final mitre lines up."],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-5 border-b border-background/10 pb-5">
                  <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="mb-1 font-display text-xl italic">{t}</div>
                    <div className="text-sm leading-relaxed text-background/65">{b}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/contact" className="mt-10 inline-block bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:brightness-110">
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
