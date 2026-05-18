import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/product-form";

export default async function NuevoProductoPage() {
  await requireAdmin();
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
        Nuevo Producto
      </h1>
      <ProductForm />
    </div>
  );
}
