import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Mail } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — APJ Furniture, Villivakkam, Chennai" },
      { name: "description", content: "Visit our atelier in Villivakkam, Chennai. Phone, address and enquiry form for APJ Furniture & Interior." },
      { property: "og:title", content: "Contact — APJ Furniture" },
      { property: "og:description", content: "Visit our atelier in Villivakkam, Chennai." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "A few more words, please").max(2000),
});

function ContactPage() {
  const [state, setState] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapsQuery)}&output=embed`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Please review the form");
      setState("error");
      return;
    }
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    if (error) {
      setErrorMsg(error.message);
      setState("error");
      return;
    }
    setState("sent");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Visit · Call · Write</div>
          <h1 className="font-display text-5xl italic md:text-6xl">Talk to us.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-20 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="mb-8 font-display text-3xl italic">Atelier & Showroom</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <MapPin className="size-5 shrink-0 text-primary" />
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Address</div>
                <div className="text-base">{BUSINESS.address}</div>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="size-5 shrink-0 text-primary" />
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Phone</div>
                <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="text-base hover:text-primary">{BUSINESS.phone}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="size-5 shrink-0 text-primary" />
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
                <a href={`mailto:${BUSINESS.email}`} className="text-base hover:text-primary">{BUSINESS.email}</a>
              </div>
            </li>
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block bg-[#25D366] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:brightness-110"
          >
            WhatsApp us instead
          </a>

          <div className="mt-10 aspect-[4/3] overflow-hidden border border-border bg-stone-surface">
            <iframe
              title="Map to APJ Furniture"
              src={mapsSrc}
              className="size-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="bg-stone-surface/60 p-8 md:p-12">
          <h2 className="mb-2 font-display text-3xl italic">Send a message</h2>
          <p className="mb-8 text-sm text-muted-foreground">We reply within one working day.</p>

          {state === "sent" ? (
            <div className="border border-primary/40 bg-background p-8 text-center">
              <h3 className="mb-2 font-display text-2xl italic">Thank you.</h3>
              <p className="text-sm text-muted-foreground">Your message has reached us — we'll be in touch shortly.</p>
              <button onClick={() => setState("idle")} className="mt-6 font-mono text-[11px] uppercase tracking-widest text-primary">
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <Field label="Full name" name="name" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
              </div>
              <Field label="Subject" name="subject" placeholder="Residential / Wholesale / Custom piece" />
              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  placeholder="Describe your project, room, or piece..."
                />
              </div>
              {state === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full bg-foreground py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition hover:bg-primary disabled:opacity-60"
              >
                {state === "submitting" ? "Sending..." : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
