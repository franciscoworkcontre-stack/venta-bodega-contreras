import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/db/schema";
import { formatCLP } from "@/lib/utils";
import Link from "next/link";

export default async function ResumenPage() {
  await requireAdmin();

  const { data } = await supabaseAdmin
    .from("products")
    .select("*")
    .not("comprador", "is", null)
    .neq("comprador", "")
    .order("comprador");

  const products = (data ?? []) as Product[];

  // Group by comprador
  const byComprador = new Map<string, Product[]>();
  for (const p of products) {
    const name = p.comprador!;
    if (!byComprador.has(name)) byComprador.set(name, []);
    byComprador.get(name)!.push(p);
  }

  const totalGeneral = products.reduce((sum, p) => sum + p.price_clp * p.cantidad, 0);

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
        {byComprador.size > 0 && (
          <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] p-4 text-center bg-[#FFD60A]">
            <p className="font-black text-2xl" style={{ fontFamily: "var(--font-display)" }}>
              {formatCLP(totalGeneral)}
            </p>
            <p className="font-bold text-xs uppercase">Total general</p>
          </div>
        )}
      </div>

      {byComprador.size === 0 ? (
        <p className="italic text-[#0A0A0A]/40" style={{ fontFamily: "var(--font-serif)" }}>
          Ningún producto tiene comprador asignado aún
        </p>
      ) : (
        <div className="space-y-6">
          {[...byComprador.entries()].map(([nombre, items]) => {
            const total = items.reduce((sum, p) => sum + p.price_clp * p.cantidad, 0);
            return (
              <div key={nombre} className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] bg-white">
                <div className="bg-[#003049] text-white px-4 py-3 flex items-center justify-between">
                  <p className="font-black text-xl" style={{ fontFamily: "var(--font-display)" }}>
                    {nombre}
                  </p>
                  <p className="font-black text-xl" style={{ fontFamily: "var(--font-display)" }}>
                    {formatCLP(total)}
                  </p>
                </div>

                <div className="divide-y divide-[#0A0A0A]/10">
                  {items.map((p) => (
                    <div key={p.id} className="px-4 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        {p.category && (
                          <p className="text-xs text-[#0A0A0A]/50 uppercase">{p.category}</p>
                        )}
                      </div>
                      {p.cantidad > 1 && (
                        <span className="text-xs font-bold border-2 border-[#0A0A0A] px-2 py-0.5 bg-[#F4F1EA]">
                          x{p.cantidad}
                        </span>
                      )}
                      <p className="font-black text-sm whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}>
                        {formatCLP(p.price_clp * p.cantidad)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-[#0A0A0A] px-4 py-2 bg-[#FFD60A]/20 flex justify-between items-center">
                  <p className="text-xs font-bold uppercase opacity-60">
                    {items.length} producto{items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
                    Total: {formatCLP(total)}
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
