"use client";
import type { Product } from "@/db/schema";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.id === product.id);

  return (
    <button
      onClick={() => {
        addItem({
          id: product.id,
          title: product.title,
          price_clp: product.price_clp,
          slug: product.slug,
          image_urls: product.image_urls,
          condition: product.condition,
        });
        toast({
          title: "¡Listo!",
          description: `${product.title} echado a la canasta`,
        });
      }}
      disabled={inCart}
      className={`brutal-btn px-6 py-3 text-lg w-full font-display font-black ${
        inCart ? "bg-[#06A77D] text-white" : "bg-[#FFD60A]"
      }`}
    >
      {inCart ? "Ya está en la canasta ✓" : "Echar a la canasta 🛒"}
    </button>
  );
}
