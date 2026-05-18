import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product, Reservation } from "@/db/schema";
import Link from "next/link";
import { formatCLP } from "@/lib/utils";
import { AdminProductRow } from "@/components/admin/product-row";
import { AdminReservationRow } from "@/components/admin/reservation-row";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function DashboardPage() {
  await requireAdmin();

  const [{ data: productsData }, { data: reservationsData }] = await Promise.all([
    supabaseAdmin.from("products").select("*").order("created_at", { ascending: true }),
    supabaseAdmin.from("reservations").select("*").eq("status", "activa"),
  ]);

  const allProducts = (productsData ?? []) as Product[];
  const activeReservations = (reservationsData ?? []) as Reservation[];

  const disponibles = allProducts.filter((p) => p.status === "disponible").length;
  const reservados = allProducts.filter((p) => p.status === "reservado").length;
  const vendidos = allProducts.filter((p) => p.status === "vendido").length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-black text-3xl uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/producto/nuevo"
            className="brutal-btn px-4 py-2 bg-[#FFD60A] text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            + Nuevo producto
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: "Disponibles", value: disponibles, color: "bg-[#06A77D] text-white" },
          { label: "Reservados", value: reservados, color: "bg-[#003049] text-white" },
          { label: "Vendidos", value: vendidos, color: "bg-[#E63946] text-white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] p-4 text-center ${stat.color}`}
          >
            <p
              className="font-black text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </p>
            <p className="font-bold text-xs uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {activeReservations.length > 0 && (
        <section className="mb-12">
          <h2
            className="font-black text-xl uppercase mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reservas activas ({activeReservations.length})
          </h2>
          <div className="space-y-3">
            {activeReservations.map((r) => (
              <AdminReservationRow key={r.id} reservation={r} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2
          className="font-black text-xl uppercase mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Productos ({allProducts.length})
        </h2>
        <div className="space-y-2">
          {allProducts.map((p) => (
            <AdminProductRow key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link href="/admin/reservas" className="brutal-btn px-4 py-2 bg-[#F4F1EA] text-sm" style={{ fontFamily: "var(--font-display)" }}>
          Ver historial completo de reservas →
        </Link>
      </div>
    </div>
  );
}
