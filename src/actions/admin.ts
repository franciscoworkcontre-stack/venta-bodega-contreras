"use server";

import { db } from "@/db";
import { products, reservations } from "@/db/schema";
import { productSchema } from "@/lib/schemas";
import { requireAdmin } from "@/lib/auth";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function confirmarVenta(reservationId: string) {
  await requireAdmin();
  return await db.transaction(async (tx) => {
    const [reservation] = await tx
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId));
    if (!reservation) return { error: "Reserva no encontrada" };

    await tx
      .update(reservations)
      .set({ status: "confirmada", confirmed_at: new Date() })
      .where(eq(reservations.id, reservationId));

    await tx
      .update(products)
      .set({ status: "vendido", sold_at: new Date() })
      .where(inArray(products.id, reservation.product_ids));

    revalidatePath("/admin/reservas");
    revalidatePath("/admin/dashboard");
    return { success: true as const };
  });
}

export async function liberarReserva(reservationId: string) {
  await requireAdmin();
  return await db.transaction(async (tx) => {
    const [reservation] = await tx
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId));
    if (!reservation) return { error: "Reserva no encontrada" };

    await tx
      .update(reservations)
      .set({ status: "cancelada" })
      .where(eq(reservations.id, reservationId));

    await tx
      .update(products)
      .set({ status: "disponible", reserved_at: null, reserved_until: null })
      .where(inArray(products.id, reservation.product_ids));

    revalidatePath("/admin/reservas");
    revalidatePath("/admin/dashboard");
    return { success: true as const };
  });
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

  await db.insert(products).values({ ...data, slug, status: data.status ?? "disponible", image_urls: imageUrls });
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
    updated_at: new Date(),
  };
  if (imageUrls) updateData["image_urls"] = imageUrls;

  await db.update(products).set(updateData).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function eliminarProducto(id: string) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}
