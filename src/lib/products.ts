import { supabase } from "@/integrations/supabase/client";
import productSofa from "@/assets/product-sofa.jpg";
import productLounge from "@/assets/product-lounge.jpg";
import productDining from "@/assets/product-dining.jpg";
import productWardrobe from "@/assets/product-wardrobe.jpg";
import productBed from "@/assets/product-bed.jpg";
import productDesk from "@/assets/product-desk.jpg";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  material: string | null;
  dimensions: string | null;
  images: string[];
  featured: boolean;
  is_new: boolean;
  created_at: string;
};

const fallbackImages: Record<string, string> = {
  "pallava-lounge-chair": productLounge,
  "madras-refectory-table": productDining,
  "atelier-modular-wardrobe": productWardrobe,
  "coromandel-platform-bed": productBed,
  "cholamandal-executive-desk": productDesk,
  "adyar-linen-sofa": productSofa,
};

const categoryFallback: Record<string, string> = {
  Sofa: productSofa,
  "Dining Table": productDining,
  Bed: productBed,
  "Office Furniture": productDesk,
  Wardrobe: productWardrobe,
};

export function productImage(p: Pick<Product, "slug" | "category" | "images">) {
  if (p.images && p.images.length > 0) return p.images[0];
  return fallbackImages[p.slug] ?? categoryFallback[p.category] ?? productSofa;
}

export function productGallery(p: Pick<Product, "slug" | "category" | "images">): string[] {
  if (p.images && p.images.length > 0) return p.images;
  return [productImage(p)];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Product) ?? null;
}
