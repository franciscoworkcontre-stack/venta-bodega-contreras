import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/db/schema";
import { formatCLP } from "@/lib/utils";
import Link from "next/link";
import { PagadoToggle } from "@/components/admin/pagado-toggle";

function calcSplit(products: Product[]) {
  let anastasia = 0;
  let francisco = 0;
  for (const p of products) {
    const total = p.price_clp * p.cantidad;
    if (p.division === "solo_anastasia") anastasia += total;
    else if (p.division === "solo_francisco") francisco += total;
    else { anastasia += total / 2; francisco += total / 2; }
  }
  return { anastasia, francisco };
}

const divisionLabel: Record<string, string> = {
  familiar: "50/50",
  solo_anastasia: "A",
  solo_francisco: "F",
};
const divisionColor: Record<string, string> = {
  familiar: "bg-gray-100 text-gray-500",
  solo_anastasia: "bg-purple-100 text-purple-700",
  solo_francisco: "bg-blue-100 text-blue-700",
};

export default async function ResumenPage() {
  await requireAdmin();

  const [{ data }, { data: compradoresData }] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*")
      .not("comprador", "is", null)
      .neq("comprador", "")
      .order("comprador"),
    supabaseAdmin.from("compradores").select("nombre, pagado"),
  ]);

  const products = (data ?? []) as Product[];
  const pagadoMap = new Map<string, boolean>(
    (compradoresData ?? []).map((c) => [c.nombre, c.pagado])
  );

  const byComprador = new Map<string, Product[]>();
  for (const p of products) {
    const name = p.comprador!;
    if (!byComprador.has(name)) byComprador.set(name, []);
    byComprador.get(name)!.push(p);
  }

  const globalSplit = calcSplit(products);
  const totalGeneral = globalSplit.anastasia + globalSplit.francisco;

  // Paid / pending totals
  let totalPagado = 0;
  let totalPendiente = 0;
  for (const [nombre, items] of byComprador.entries()) {
    const subtotal = items.reduce((s, p) => s + p.price_clp * p.cantidad, 0);
    if (pagadoMap.get(nombre)) totalPagado += subtotal;
    else totalPendiente += subtotal;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-xs text-gray-400 hover:text-gray-700 transition-colors tracking-widest uppercase">
              ← Volver
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-semibold tracking-widest uppercase text-gray-500">Resumen de cobros</h1>
          </div>
          {byComprador.size > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total general</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCLP(totalGeneral)}</p>
              <div className="flex gap-3 justify-end mt-1">
                <span className="text-xs text-purple-600 font-medium">A {formatCLP(globalSplit.anastasia)}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-blue-600 font-medium">F {formatCLP(globalSplit.francisco)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Paid / pending summary bar */}
        {byComprador.size > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-sm px-4 py-3">
              <p className="text-xs text-emerald-500 uppercase tracking-wider mb-0.5">Pagado</p>
              <p className="text-xl font-bold text-emerald-700 tabular-nums">{formatCLP(totalPagado)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-sm px-4 py-3">
              <p className="text-xs text-amber-500 uppercase tracking-wider mb-0.5">Pendiente</p>
              <p className="text-xl font-bold text-amber-700 tabular-nums">{formatCLP(totalPendiente)}</p>
            </div>
          </div>
        )}

        {byComprador.size === 0 ? (
          <p className="text-sm text-gray-400 italic">Ningún producto tiene comprador asignado aún.</p>
        ) : (
          <div className="space-y-3">
            {[...byComprador.entries()].map(([nombre, items]) => {
              const total = items.reduce((sum, p) => sum + p.price_clp * p.cantidad, 0);
              const split = calcSplit(items);
              const pagado = pagadoMap.get(nombre) ?? false;
              return (
                <div key={nombre} className={`bg-white rounded-sm overflow-hidden shadow-sm border ${pagado ? "border-emerald-200" : "border-gray-100"}`}>
                  {/* Buyer header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${pagado ? "bg-emerald-500" : "bg-gray-900"}`}>
                        <span className="text-white text-xs font-bold">{(nombre[0] ?? "?").toUpperCase()}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{nombre}</span>
                      <span className="text-xs text-gray-400">{items.length} ítem{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <PagadoToggle nombre={nombre} pagado={pagado} />
                      <div className="text-right">
                        <p className="font-bold text-gray-900 tabular-nums">{formatCLP(total)}</p>
                        <div className="flex gap-2 justify-end mt-0.5">
                          <span className="text-xs text-purple-600">A {formatCLP(split.anastasia)}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-blue-600">F {formatCLP(split.francisco)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product rows */}
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                          <td className="pl-5 pr-3 py-2 text-gray-700">{p.title}</td>
                          <td className="px-3 py-2 text-gray-400 text-xs">{p.category}</td>
                          <td className="px-2 py-2 text-center">
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${divisionColor[p.division] ?? divisionColor.familiar}`}>
                              {divisionLabel[p.division] ?? "50/50"}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center text-gray-400 text-xs tabular-nums">
                            {p.cantidad > 1 ? `×${p.cantidad}` : ""}
                          </td>
                          <td className="pl-2 pr-5 py-2 text-right font-medium text-gray-900 tabular-nums whitespace-nowrap">
                            {formatCLP(p.price_clp * p.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td colSpan={4} className="pl-5 py-2 text-xs text-gray-400 uppercase tracking-wider">Total</td>
                        <td className="pr-5 py-2 text-right font-bold text-gray-900 tabular-nums">{formatCLP(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}

            {/* Global split summary */}
            <div className="bg-gray-900 rounded-sm px-5 py-4 flex items-center justify-between">
              <p className="text-xs text-gray-400 uppercase tracking-widest">División total</p>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-xs text-purple-400 uppercase tracking-wider mb-0.5">Anastasia</p>
                  <p className="text-lg font-bold text-white tabular-nums">{formatCLP(globalSplit.anastasia)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-400 uppercase tracking-wider mb-0.5">Francisco</p>
                  <p className="text-lg font-bold text-white tabular-nums">{formatCLP(globalSplit.francisco)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
