import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatCLP, formatChileanDate } from "@/lib/utils";
import { AdminReservationRow } from "@/components/admin/reservation-row";

const statusColors: Record<string, string> = {
  activa: "bg-[#003049] text-white",
  confirmada: "bg-[#06A77D] text-white",
  expirada: "bg-[#0A0A0A]/20",
  cancelada: "bg-[#E63946] text-white",
};

export default async function ReservasPage() {
  await requireAdmin();
  const allReservations = await db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.created_at));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
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
        Todas las reservas
      </h1>
      <div className="space-y-4">
        {allReservations.map((r) => (
          <div key={r.id}>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold px-2 py-1 border-2 border-[#0A0A0A] ${statusColors[r.status] ?? ""}`}
              >
                {r.status}
              </span>
              <span className="text-xs text-[#0A0A0A]/40">
                {formatChileanDate(r.created_at)}
              </span>
            </div>
            {r.status === "activa" ? (
              <AdminReservationRow reservation={r} />
            ) : (
              <div className="border-2 border-[#0A0A0A] bg-white p-4 opacity-60">
                <p
                  className="font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {r.buyer_name} — {r.buyer_phone}
                </p>
                <p className="text-sm">
                  {formatCLP(r.total_clp)} · {r.product_ids.length}{" "}
                  producto(s)
                </p>
              </div>
            )}
          </div>
        ))}
        {allReservations.length === 0 && (
          <p
            className="italic text-[#0A0A0A]/40"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Aún no hay reservas
          </p>
        )}
      </div>
    </div>
  );
}
