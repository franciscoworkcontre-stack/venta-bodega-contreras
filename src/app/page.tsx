import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await db.select().from(products).orderBy(products.created_at);

  return (
    <div>
      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 border-b-2 border-[#0A0A0A] overflow-hidden relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <h1
              className="font-black text-5xl md:text-8xl uppercase leading-none mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="block">Nos vamos</span>
              <span className="block text-[#E63946]">a México 🇲🇽</span>
            </h1>
            <div className="absolute top-0 right-0 rotate-12 bg-[#FFD60A] border-2 border-[#0A0A0A] px-3 py-2 font-black text-sm uppercase shadow-[4px_4px_0_#0A0A0A] hidden md:block">
              TODO DEBE SALIR
            </div>
            <div className="absolute bottom-4 right-20 -rotate-6 bg-[#E63946] text-white border-2 border-[#0A0A0A] px-3 py-2 font-black text-sm uppercase shadow-[4px_4px_0_#0A0A0A] hidden md:block">
              PRECIOS DE BODEGA
            </div>
          </div>
          <p
            className="italic text-xl md:text-2xl text-[#0A0A0A]/70 max-w-2xl mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Toda la casa en venta. Pasa, mira, llévate.
          </p>
          <p className="text-sm text-[#0A0A0A]/50">
            Reserva con 12h de expiración. Francisco te contacta por WhatsApp para coordinar.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-black text-2xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {allProducts.length} cositas en venta
          </h2>
        </div>

        {allProducts.length === 0 ? (
          <div
            className="text-center py-24 italic text-xl text-[#0A0A0A]/40"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Todo vendido. Gracias Santiago 🙏
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
