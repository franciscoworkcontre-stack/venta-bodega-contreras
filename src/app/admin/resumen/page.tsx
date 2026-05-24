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

  const byComprador = new Map<string, Product[]>();
  for (const p of products) {
    const name = p.comprador!;
    if (!byComprador.has(name)) byComprador.set(name, []);
    byComprador.get(name)!.push(p);
  }

  const totalGeneral = products.reduce((sum, p) => sum + p.price_clp * p.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors tracking-widest uppercase"
            >
              ← Volver
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-semibold tracking-widest uppercase text-gray-500">
              Resumen de cobros
            </h1>
          </div>
          {byComprador.size > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Total general</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCLP(totalGeneral)}</p>
            </div>
          )}
        </div>

        {byComprador.size === 0 ? (
          <p className="text-sm text-gray-400 italic">Ningún producto tiene comprador asignado aún.</p>
        ) : (
          <div className="space-y-3">
            {[...byComprador.entries()].map(([nombre, items]) => {
              const total = items.reduce((sum, p) => sum + p.price_clp * p.cantidad, 0);
              return (
                <div key={nombre} className="bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100">
                  {/* Buyer header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{(nombre[0] ?? "?").toUpperCase()}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{nombre}</span>
                      <span className="text-xs text-gray-400">{items.length} ítem{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="font-bold text-gray-900 tabular-nums">{formatCLP(total)}</span>
                  </div>

                  {/* Product rows */}
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                          <td className="pl-5 pr-3 py-2 text-gray-700">{p.title}</td>
                          <td className="px-3 py-2 text-gray-400 text-xs">{p.category}</td>
                          <td className="px-3 py-2 text-gray-400 text-xs text-center tabular-nums">
                            {p.cantidad > 1 ? `×${p.cantidad}` : ""}
                          </td>
                          <td className="pl-3 pr-5 py-2 text-right font-medium text-gray-900 tabular-nums whitespace-nowrap">
                            {formatCLP(p.price_clp * p.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td colSpan={3} className="pl-5 py-2 text-xs text-gray-400 uppercase tracking-wider">Total</td>
                        <td className="pr-5 py-2 text-right font-bold text-gray-900 tabular-nums">{formatCLP(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
