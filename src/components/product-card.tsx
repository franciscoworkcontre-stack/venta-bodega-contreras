"use client";
import type { Product } from "@/db/schema";
import { formatCLP } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const conditionColors: Record<string, string> = {
  nuevo: "bg-[#FFD60A]",
  usado: "bg-[#06A77D] text-white",
  muy_usado: "bg-[#F77F00] text-white",
};

const conditionLabels: Record<string, string> = {
  nuevo: "Nuevo",
  usado: "Usado",
  muy_usado: "Muy Usado",
};

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.id === product.id);

  const isVendido = product.status === "vendido";
  const isReservado = product.status === "reservado";
  const isDisponible = product.status === "disponible";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="brutal-card bg-white relative overflow-hidden flex flex-col"
    >
      {isVendido && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#E63946]/20" />
          <div
            className="bg-[#E63946] text-white font-black text-2xl py-2 rotate-[-15deg] border-2 border-white shadow-lg text-center"
            style={{ width: "150%" }}
          >
            VENDIDO
          </div>
        </div>
      )}
      {isReservado && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#003049]/20" />
          <div
            className="bg-[#003049] text-white font-black text-xl py-2 rotate-[-15deg] border-2 border-white shadow-lg text-center"
            style={{ width: "150%" }}
          >
            RESERVADO
          </div>
        </div>
      )}

      <Link href={`/producto/${product.slug}`} className="block">
        <div className="aspect-square bg-[#F4F1EA] border-b-2 border-[#0A0A0A] relative overflow-hidden">
          {product.image_urls[0] ? (
            <Image
              src={product.image_urls[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
              📦
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/producto/${product.slug}`}>
            <h3 className="font-display font-bold text-base leading-tight hover:underline">
              {product.title}
            </h3>
          </Link>
          <span
            className={`text-xs font-bold px-2 py-1 border-2 border-[#0A0A0A] whitespace-nowrap shrink-0 ${conditionColors[product.condition] ?? ""}`}
          >
            {conditionLabels[product.condition]}
          </span>
        </div>

        <p className="text-sm text-[#0A0A0A]/60 line-clamp-2 font-body flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-display font-black text-xl">
            {formatCLP(product.price_clp)}
          </span>
          {isDisponible && (
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
                if (!inCart)
                  toast({ title: "¡En la canasta!", description: product.title });
              }}
              disabled={inCart}
              className={`brutal-btn px-3 py-2 text-xs ${
                inCart ? "bg-[#06A77D] text-white" : "bg-[#FFD60A]"
              }`}
            >
              {inCart ? "En canasta ✓" : "Echar a la canasta"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
