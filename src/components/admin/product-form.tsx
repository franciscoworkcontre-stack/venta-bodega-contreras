"use client";
import type { Product } from "@/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/schemas";
import { crearProducto, actualizarProducto } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useState, useRef } from "react";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls ?? []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          comprador: product.comprador ?? "",
        }
      : {
          status: "disponible" as const,
          condition: "usado" as const,
        },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `productos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type });
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }

    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const onSubmit = async (data: ProductInput) => {
    const result = product
      ? await actualizarProducto(product.id, data, imageUrls)
      : await crearProducto(data, imageUrls);

    if ("error" in result) {
      toast({ title: "Error al guardar", variant: "destructive" });
      return;
    }

    toast({ title: product ? "Producto actualizado" : "Producto creado" });
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
        <label className="font-bold text-sm uppercase block mb-1">Descripción</label>
        <textarea
          {...register("description")}
          className="brutal-input w-full px-3 py-2 text-sm h-28 resize-none"
        />
        {errors.description && (
          <p className="text-[#E63946] text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">Categoría</label>
        <input
          {...register("category")}
          className="brutal-input w-full px-3 py-2 text-sm"
          placeholder="living, cocina, ropa..."
        />
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">Link de referencia</label>
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
        <label className="font-bold text-sm uppercase block mb-1">Precio CLP</label>
        <input
          type="number"
          {...register("price_clp", { valueAsNumber: true })}
          className="brutal-input w-full px-3 py-2 text-sm"
        />
        {errors.price_clp && (
          <p className="text-[#E63946] text-xs mt-1">{errors.price_clp.message}</p>
        )}
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-1">Condición</label>
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

      <div>
        <label className="font-bold text-sm uppercase block mb-1">Comprador</label>
        <input
          {...register("comprador")}
          className="brutal-input w-full px-3 py-2 text-sm"
          placeholder="Nombre del comprador..."
        />
      </div>

      <div>
        <label className="font-bold text-sm uppercase block mb-2">Fotos</label>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {imageUrls.map((url) => (
              <div key={url} className="relative border-2 border-[#0A0A0A] aspect-square overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-[#E63946] text-white text-xs font-black w-5 h-5 flex items-center justify-center border border-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="brutal-btn px-4 py-2 bg-[#F4F1EA] text-sm cursor-pointer inline-block font-black uppercase" style={{ fontFamily: "var(--font-display)" }}>
          {uploading ? "Subiendo..." : "+ Agregar fotos"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
        <p className="text-xs text-[#0A0A0A]/50 mt-1">JPG, PNG, HEIC. Múltiples archivos.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="brutal-btn w-full py-3 bg-[#FFD60A] font-black uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {isSubmitting ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
      </button>
    </form>
  );
}
