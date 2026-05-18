import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/db/schema";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCLP } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();
  const product = data as Product;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <a
        href="/"
        className="font-bold text-sm uppercase underline mb-8 block opacity-60 hover:opacity-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ← Volver al catálogo
      </a>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square bg-[#F4F1EA] border-2 border-[#0A0A0A] relative overflow-hidden">
          {product.image_urls[0] ? (
            <Image
              src={product.image_urls[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
              📦
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <h1
              className="font-black text-3xl md:text-4xl uppercase leading-tight flex-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.title}
            </h1>
            <span
              className={`text-xs font-bold px-2 py-1 border-2 border-[#0A0A0A] whitespace-nowrap shrink-0 ${conditionColors[product.condition] ?? ""}`}
            >
              {conditionLabels[product.condition]}
            </span>
          </div>

          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]/40">
              {product.category}
            </span>
          )}

          <p
            className="font-black text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatCLP(product.price_clp)}
          </p>

          <p className="text-base leading-relaxed text-[#0A0A0A]/70">
            {product.description}
          </p>

          {product.reference_url && (
            <a
              href={product.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold underline text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors"
            >
              Ver referencia del producto ↗
            </a>
          )}

          <div className="mt-4">
            {product.status === "disponible" ? (
              <AddToCartButton product={product} />
            ) : (
              <div
                className={`brutal-btn px-6 py-3 text-center font-black text-lg w-full ${
                  product.status === "vendido"
                    ? "bg-[#E63946] text-white"
                    : "bg-[#003049] text-white"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.status === "vendido"
                  ? "Ya fue — VENDIDO"
                  : "RESERVADO"}
              </div>
            )}
          </div>

          <div className="border-2 border-[#0A0A0A] p-4 bg-[#FFD60A]/30 mt-2">
            <p className="text-sm">
              <strong>¿Cómo funciona?</strong> Echalo a la canasta, llena el
              formulario y Francisco te contacta por WhatsApp para coordinar.
              Tenés 12 horas de reserva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
