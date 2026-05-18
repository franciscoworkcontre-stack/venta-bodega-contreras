import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Reservation } from "@/db/schema";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .eq("status", "activa")
    .lt("expires_at", new Date().toISOString());

  const expiredReservations = (data ?? []) as Reservation[];

  for (const reservation of expiredReservations) {
    await supabaseAdmin
      .from("reservations")
      .update({ status: "expirada" })
      .eq("id", reservation.id);

    await supabaseAdmin
      .from("products")
      .update({ status: "disponible", reserved_at: null, reserved_until: null })
      .in("id", reservation.product_ids);
  }

  return NextResponse.json({ released: expiredReservations.length });
}
