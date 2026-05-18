"use client";
import type { Product } from "@/db/schema";
import { formatCLP } from "@/lib/utils";
import { eliminarProducto } from "@/actions/admin";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  disponible: "bg-[#06A77D] text-white",
  reservado: "bg-[#003049] text-white",
  vendido: "bg-[#E63946] text-white",
};

export function AdminProductRow({ product }: { product: Product }) {
  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${product.title}"?`)) return;
    await eliminarProducto(product.id);
    toast({ title: "Producto eliminado" });
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-3 flex items-center gap-4">
      <span
        className={`text-xs font-bold px-2 py-1 border-2 border-[#0A0A0A] whitespace-nowrap ${statusColors[product.status] ?? ""}`}
      >
        {product.status}
      </span>
      <span className="font-display font-bold text-sm flex-1 truncate">
        {product.title}
      </span>
      <span className="font-black text-sm whitespace-nowrap">
        {formatCLP(product.price_clp)}
      </span>
      <div className="flex gap-2">
        <Link
          href={`/admin/producto/${product.id}`}
          className="brutal-btn px-2 py-1 text-xs bg-[#FFD60A]"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          className="brutal-btn px-2 py-1 text-xs bg-[#E63946] text-white"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
