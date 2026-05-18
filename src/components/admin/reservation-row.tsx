"use client";
import type { Reservation } from "@/db/schema";
import { formatCLP, formatChileanDate } from "@/lib/utils";
import { confirmarVenta, liberarReserva } from "@/actions/admin";
import { toast } from "@/hooks/use-toast";

export function AdminReservationRow({ reservation }: { reservation: Reservation }) {
  const handleConfirm = async () => {
    await confirmarVenta(reservation.id);
    toast({ title: "Venta confirmada ✓" });
  };

  const handleRelease = async () => {
    if (!confirm("¿Liberar esta reserva?")) return;
    await liberarReserva(reservation.id);
    toast({ title: "Reserva liberada" });
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-display font-bold">
            {reservation.buyer_name} — {reservation.buyer_phone}
          </p>
          {reservation.buyer_email && (
            <p className="font-body text-sm text-[#0A0A0A]/60">
              {reservation.buyer_email}
            </p>
          )}
          <p className="font-body text-sm mt-1">
            {formatCLP(reservation.total_clp)} total ·{" "}
            {reservation.product_ids.length} producto(s)
          </p>
          <p className="font-body text-xs text-[#E63946] mt-1">
            Expira: {formatChileanDate(reservation.expires_at)}
          </p>
          {reservation.buyer_message && (
            <p className="font-body text-sm italic mt-1 text-[#0A0A0A]/60">
              &ldquo;{reservation.buyer_message}&rdquo;
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="brutal-btn px-3 py-2 text-xs bg-[#06A77D] text-white"
          >
            Confirmar venta ✓
          </button>
          <button
            onClick={handleRelease}
            className="brutal-btn px-3 py-2 text-xs bg-[#E63946] text-white"
          >
            Liberar
          </button>
        </div>
      </div>
    </div>
  );
}
