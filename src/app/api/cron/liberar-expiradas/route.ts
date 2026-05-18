import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, reservations } from "@/db/schema";
import { and, eq, inArray, lt } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expiredReservations = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.status, "activa"),
        lt(reservations.expires_at, new Date())
      )
    );

  for (const reservation of expiredReservations) {
    await db.transaction(async (tx) => {
      await tx
        .update(reservations)
        .set({ status: "expirada" })
        .where(eq(reservations.id, reservation.id));

      await tx
        .update(products)
        .set({ status: "disponible", reserved_at: null, reserved_until: null })
        .where(inArray(products.id, reservation.product_ids));
    });
  }

  return NextResponse.json({ released: expiredReservations.length });
}
