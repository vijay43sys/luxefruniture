import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, User } from "lucide-react";
import { useCart, useWishlist, useTheme } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/products", label: "Collections" },
  { to: "/services", label: "Interior Design" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const cart = useCart();
  const wishlist = useWishlist();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setAuthed(!!session);
      router.invalidate();
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-2xl italic tracking-tight">APJ Furniture</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            Chennai · Est. 1994
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[12px] font-medium uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/products" className="hidden rounded-full p-2 transition-colors hover:bg-secondary sm:inline-flex" aria-label="Search">
            <Search className="size-4" />
          </Link>
          <button onClick={toggle} className="rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
          <Link to="/wishlist" className="relative rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Wishlist">
            <Heart className="size-4" />
            {wishlist.items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary font-mono text-[9px] font-bold text-primary-foreground">
                {wishlist.items.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Cart">
            <ShoppingBag className="size-4" />
            {cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary font-mono text-[9px] font-bold text-primary-foreground">
                {cart.count}
              </span>
            )}
          </Link>
          <Link
            to={authed ? "/admin" : "/auth"}
            className="ml-1 hidden items-center gap-1.5 rounded-full p-2 transition-colors hover:bg-secondary sm:inline-flex"
            aria-label="Account"
          >
            <User className="size-4" />
          </Link>
          <button
            className="ml-1 rounded-full p-2 transition-colors hover:bg-secondary md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/85"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
