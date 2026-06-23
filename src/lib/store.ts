import { useEffect, useState, useSyncExternalStore } from "react";

type Item = { id: string; name: string; price: number | null; image: string; slug: string; qty: number };

function createLocalStore<T>(key: string, initial: T) {
  const listeners = new Set<() => void>();
  let state: T = initial;
  let hydrated = false;
  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {}
    listeners.forEach((l) => l());
  };
  return {
    get: () => state,
    set: (next: T | ((prev: T) => T)) => {
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(state));
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      hydrate();
      return () => listeners.delete(l);
    },
  };
}

export const cartStore = createLocalStore<Item[]>("apj-cart", []);
export const wishlistStore = createLocalStore<Item[]>("apj-wishlist", []);

function useStore<T>(store: { get: () => T; subscribe: (l: () => void) => () => void }) {
  return useSyncExternalStore(
    store.subscribe,
    () => store.get(),
    () => store.get(),
  );
}

export function useCart() {
  const items = useStore(cartStore);
  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0),
    add: (item: Omit<Item, "qty">, qty = 1) =>
      cartStore.set((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
        return [...prev, { ...item, qty }];
      }),
    remove: (id: string) => cartStore.set((prev) => prev.filter((p) => p.id !== id)),
    setQty: (id: string, qty: number) =>
      cartStore.set((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
    clear: () => cartStore.set([]),
  };
}

export function useWishlist() {
  const items = useStore(wishlistStore);
  return {
    items,
    has: (id: string) => items.some((i) => i.id === id),
    toggle: (item: Omit<Item, "qty">) =>
      wishlistStore.set((prev) => {
        if (prev.some((p) => p.id === item.id)) return prev.filter((p) => p.id !== item.id);
        return [...prev, { ...item, qty: 1 }];
      }),
  };
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const stored = (localStorage.getItem("apj-theme") as "light" | "dark" | null) ?? "light";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("apj-theme", next);
  };
  return { theme, toggle };
}
