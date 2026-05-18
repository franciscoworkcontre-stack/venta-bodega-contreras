import { db } from "@/db";
import { reservations, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatCLP, formatChileanDate } from "@/lib/utils";

export default async function ReservaExitoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [reservation] = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id));
  if (!reservation) notFound();

  const reservedProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, reservation.product_ids));

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1
        className="font-black text-4xl uppercase mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ¡Listo, weón!
      </h1>
      <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] bg-[#FFD60A] p-6 mb-8 text-left">
        <p className="text-base mb-4">
          <strong>Te llegará un WhatsApp del Francisco para coordinar.</strong>{" "}
          Tenís 12 horas para confirmar.
        </p>
        <p className="text-sm text-[#0A0A0A]/60">
          Expira: {formatChileanDate(reservation.expires_at)}
        </p>
      </div>

      <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] bg-white p-6 text-left mb-8">
        <h2
          className="font-bold uppercase mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lo que reservaste:
        </h2>
        {reservedProducts.map((p) => (
          <div
            key={p.id}
            className="flex justify-between py-2 border-b border-[#0A0A0A]/10 last:border-0"
          >
            <span className="text-sm">{p.title}</span>
            <span className="font-bold text-sm">{formatCLP(p.price_clp)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-1 border-t-2 border-[#0A0A0A]">
          <span
            className="font-bold uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Total
          </span>
          <span
            className="font-black text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatCLP(reservation.total_clp)}
          </span>
        </div>
      </div>

      <a
        href="/"
        className="brutal-btn inline-block px-6 py-3 bg-[#F4F1EA]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Ver más cosas
      </a>
    </div>
  );
}
