"use server";

import { db } from "@/db";
import { products, reservations } from "@/db/schema";
import { reservationSchema } from "@/lib/schemas";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatCLP, formatChileanDate } from "@/lib/utils";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function crearReserva(formData: unknown) {
  const parsed = reservationSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { buyer_name, buyer_phone, buyer_email, buyer_message, product_ids } =
    parsed.data;

  return await db.transaction(async (tx) => {
    const availableProducts = await tx
      .select()
      .from(products)
      .where(
        and(
          inArray(products.id, product_ids),
          eq(products.status, "disponible")
        )
      );

    if (availableProducts.length !== product_ids.length) {
      return {
        error: { _form: ["Algunos productos ya no están disponibles"] },
      };
    }

    const total = availableProducts.reduce((s, p) => s + p.price_clp, 0);
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    const now = new Date();

    const [reservation] = await tx
      .insert(reservations)
      .values({
        buyer_name,
        buyer_phone,
        buyer_email: buyer_email || null,
        buyer_message: buyer_message || null,
        product_ids,
        total_clp: total,
        expires_at: expiresAt,
      })
      .returning();

    await tx
      .update(products)
      .set({ status: "reservado", reserved_at: now, reserved_until: expiresAt })
      .where(inArray(products.id, product_ids));

    const productLines = availableProducts
      .map((p) => `• ${p.title} — ${formatCLP(p.price_clp)}`)
      .join("\n");

    const msg = `🚨 <b>NUEVA RESERVA — Venta Bodega</b>

👤 Comprador: ${buyer_name}
📱 Teléfono: ${buyer_phone}
📧 Email: ${buyer_email || "no dejó"}

📦 Productos (${availableProducts.length}):
${productLines}

💰 Total: ${formatCLP(total)}

💬 Mensaje:
${buyer_message || "sin mensaje"}

⏰ Expira en 12h: ${formatChileanDate(expiresAt)}
🔗 Ver en admin: ${process.env.NEXT_PUBLIC_APP_URL}/admin/reservas`;

    await sendTelegramMessage(msg);

    revalidatePath("/");
    revalidatePath("/canasta");

    return { success: true as const, reservationId: reservation!.id };
  });
}
