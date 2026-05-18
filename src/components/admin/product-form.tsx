"use client";
import type { Product } from "@/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/schemas";
import { crearProducto, actualizarProducto } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price_clp: product.price_clp,
          condition: product.condition,
          category: product.category ?? "",
          reference_url: product.reference_url ?? "",
          status: product.status,
        }
      : {
          status: "disponible" as const,
          condition: "usado" as const,
        },
  });

  const onSubmit = async (data: ProductInput) => {
    const result = product
      ? await actualizarProducto(product.id, data)
      : await crearProducto(data);

    if ("error" in result) {
      toast({ title: "Error al guardar", variant: "destructive" });
      return;
    }

    toast({
      title: product ? "Producto actualizado" : "Producto creado",
    });
    router.push("/admin/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="font-bold text-sm uppercase block mb-1">Título</label>
        <input
          {...register("title")}
          className="brutal-input w-full px-3 py-2 text-sm"
        />
        {errors.title && (
          <p className="text-[#E63946] text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">
          Descripción
        </label>
        <textarea
          {...register("description")}
          className="brutal-input w-full px-3 py-2 text-sm h-28 resize-none"
        />
        {errors.description && (
          <p className="text-[#E63946] text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">
          Categoría
        </label>
        <input
          {...register("category")}
          className="brutal-input w-full px-3 py-2 text-sm"
          placeholder="living, cocina, ropa..."
        />
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">
          Link de referencia
        </label>
        <input
          {...register("reference_url")}
          className="brutal-input w-full px-3 py-2 text-sm"
          placeholder="https://articulo.mercadolibre.cl/..."
        />
        {errors.reference_url && (
          <p className="text-[#E63946] text-xs mt-1">{errors.reference_url.message}</p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">
          Precio CLP
        </label>
        <input
          type="number"
          {...register("price_clp", { valueAsNumber: true })}
          className="brutal-input w-full px-3 py-2 text-sm"
        />
        {errors.price_clp && (
          <p className="text-[#E63946] text-xs mt-1">
            {errors.price_clp.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">
          Condición
        </label>
        <select
          {...register("condition")}
          className="brutal-input w-full px-3 py-2 text-sm"
        >
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
          <option value="muy_usado">Muy Usado</option>
        </select>
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">Estado</label>
        <select
          {...register("status")}
          className="brutal-input w-full px-3 py-2 text-sm"
        >
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="brutal-btn w-full py-3 bg-[#FFD60A] font-display font-black"
      >
        {isSubmitting
          ? "Guardando..."
          : product
          ? "Actualizar producto"
          : "Crear producto"}
      </button>
    </form>
  );
}
