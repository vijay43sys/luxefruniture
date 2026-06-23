import { Link } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-20 grid grid-cols-1 gap-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-7 font-display text-3xl italic md:text-4xl">Visit the Showroom.</h3>
            <div className="space-y-3 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-muted-foreground">
              <p className="max-w-sm normal-case tracking-normal text-foreground/80">{BUSINESS.address}</p>
              <p>{BUSINESS.hours}</p>
              <p className="text-base font-semibold tracking-tight text-foreground">{BUSINESS.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="mb-7 font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-xs uppercase tracking-[0.18em] text-foreground/75">
              <Link to="/products" className="hover:text-primary">Collections</Link>
              <Link to="/services" className="hover:text-primary">Interior Design</Link>
              <Link to="/gallery" className="hover:text-primary">Gallery</Link>
              <Link to="/about" className="hover:text-primary">About</Link>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-7 font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Newsletter</h4>
            <form className="flex border-b border-foreground pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent font-mono text-[11px] tracking-widest outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="font-mono text-[11px] font-bold tracking-widest hover:text-primary">
                JOIN
              </button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">For trade enquiries: {BUSINESS.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-border pt-10 md:flex-row">
          <div className="flex items-center gap-6">
            <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">Instagram</a>
            <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">Pinterest</a>
            <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">LinkedIn</a>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} {BUSINESS.name}. Designed for Permanence.
          </p>
        </div>
      </div>
    </footer>
  );
}
