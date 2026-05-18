import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/db/schema";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const product = data as Product;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <a
        href="/admin/dashboard"
        className="font-bold text-sm uppercase underline mb-8 block opacity-60"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ← Dashboard
      </a>
      <h1
        className="font-black text-3xl uppercase mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Editar: {product.title}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
