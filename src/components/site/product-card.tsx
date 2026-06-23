import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { productImage, type Product } from "@/lib/products";
import { useWishlist } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlist = useWishlist();
  const wished = wishlist.has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
      className="group"
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-stone-surface">
          <img
            src={productImage(product)}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {product.is_new && (
            <div className="absolute left-4 top-4 bg-background px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest">
              New
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              wishlist.toggle({ id: product.id, name: product.name, price: product.price, image: productImage(product), slug: product.slug });
            }}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-background"
            aria-label="Add to wishlist"
          >
            <Heart className={`size-4 ${wished ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <h3 className="mb-1 truncate text-lg font-medium tracking-tight">{product.name}</h3>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.material ?? product.category}
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs">
            {product.price ? `₹ ${product.price.toLocaleString("en-IN")}` : "On request"}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
