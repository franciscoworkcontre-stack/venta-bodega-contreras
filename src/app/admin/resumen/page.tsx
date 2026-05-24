import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product, Reservation } from "@/db/schema";
import { formatCLP } from "@/lib/utils";
import Link from "next/link";

export default async function ResumenPage() {
  await requireAdmin();

  const [{ data: reservationsData }, { data: productsData }] = await Promise.all([
    supabaseAdmin.from("reservations").select("*").eq("status", "activa").order("created_at", { ascending: false }),
    supabaseAdmin.from("products").select("*"),
  ]);

  const reservations = (reservationsData ?? []) as Reservation[];
  const allProducts = (productsData ?? []) as Product[];
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  const totalActivo = reservations.reduce((sum, r) => sum + r.total_clp, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/dashboard"
            className="font-bold text-sm uppercase underline mb-2 block opacity-60 hover:opacity-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ← Dashboard
          </Link>
          <h1 className="font-black text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Resumen de cobros
          </h1>
        </div>
        {reservations.length > 0 && (
          <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] p-4 text-center bg-[#FFD60A]">
            <p className="font-black text-2xl" style={{ fontFamily: "var(--font-display)" }}>
              {formatCLP(totalActivo)}
            </p>
            <p className="font-bold text-xs uppercase">Total reservado</p>
          </div>
        )}
      </div>

      {reservations.length === 0 ? (
        <p className="italic text-[#0A0A0A]/40" style={{ fontFamily: "var(--font-serif)" }}>
          No hay reservas activas
        </p>
      ) : (
        <div className="space-y-6">
          {reservations.map((r) => {
            const products = r.product_ids.map((id) => productMap.get(id)).filter(Boolean) as Product[];
            return (
              <div key={r.id} className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] bg-white">
                <div className="bg-[#003049] text-white px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
                      {r.buyer_name}
                    </p>
                    <p className="text-sm opacity-80">{r.buyer_phone}{r.buyer_email ? ` · ${r.buyer_email}` : ""}</p>
                  </div>
                  <p className="font-black text-xl" style={{ fontFamily: "var(--font-display)" }}>
                    {formatCLP(r.total_clp)}
                  </p>
                </div>

                <div className="divide-y-2 divide-[#0A0A0A]/10">
                  {products.map((p) => (
                    <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-[#0A0A0A]/50 uppercase">{p.category}</p>
                      </div>
                      {p.cantidad > 1 && (
                        <span className="text-xs font-bold border-2 border-[#0A0A0A] px-2 py-0.5 bg-[#F4F1EA]">
                          x{p.cantidad}
                        </span>
                      )}
                      <p className="font-black text-sm whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}>
                        {formatCLP(p.price_clp)}
                      </p>
                    </div>
                  ))}
                </div>

                {r.buyer_message && (
                  <div className="border-t-2 border-[#0A0A0A]/10 px-4 py-2 bg-[#F4F1EA]">
                    <p className="text-xs text-[#0A0A0A]/60 italic">"{r.buyer_message}"</p>
                  </div>
                )}

                <div className="border-t-2 border-[#0A0A0A] px-4 py-2 bg-[#FFD60A]/20 flex justify-between items-center">
                  <p className="text-xs font-bold uppercase opacity-60">
                    {products.length} producto{products.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs font-bold uppercase opacity-60">
                    Expira: {new Date(r.expires_at).toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
