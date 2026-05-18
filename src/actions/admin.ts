"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { productSchema } from "@/lib/schemas";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function confirmarVenta(reservationId: string) {
  await requireAdmin();

  const { data: reservation } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .single();

  if (!reservation) return { error: "Reserva no encontrada" };

  await supabaseAdmin
    .from("reservations")
    .update({ status: "confirmada", confirmed_at: new Date().toISOString() })
    .eq("id", reservationId);

  await supabaseAdmin
    .from("products")
    .update({ status: "vendido", sold_at: new Date().toISOString() })
    .in("id", reservation.product_ids);

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function liberarReserva(reservationId: string) {
  await requireAdmin();

  const { data: reservation } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .single();

  if (!reservation) return { error: "Reserva no encontrada" };

  await supabaseAdmin
    .from("reservations")
    .update({ status: "cancelada" })
    .eq("id", reservationId);

  await supabaseAdmin
    .from("products")
    .update({ status: "disponible", reserved_at: null, reserved_until: null })
    .in("id", reservation.product_ids);

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function crearProducto(
  formData: unknown,
  imageUrls: string[] = []
) {
  await requireAdmin();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const slug = slugify(data.title);

  await supabaseAdmin
    .from("products")
    .insert({ ...data, slug, status: data.status ?? "disponible", image_urls: imageUrls });

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function actualizarProducto(
  id: string,
  formData: unknown,
  imageUrls?: string[]
) {
  await requireAdmin();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const updateData: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };
  if (imageUrls) updateData["image_urls"] = imageUrls;

  await supabaseAdmin.from("products").update(updateData).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function eliminarProducto(id: string) {
  await requireAdmin();
  await supabaseAdmin.from("products").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}
