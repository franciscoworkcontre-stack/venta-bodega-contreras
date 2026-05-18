import { z } from "zod";

export const reservationSchema = z.object({
  buyer_name: z.string().min(2, "Nombre muy corto"),
  buyer_phone: z.string().min(8, "Teléfono inválido"),
  buyer_email: z.string().email("Email inválido").optional().or(z.literal("")),
  buyer_message: z.string().optional(),
  product_ids: z.array(z.string().uuid()).min(1, "Selecciona al menos un producto"),
});

export const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price_clp: z.number().int().positive(),
  condition: z.enum(["nuevo", "usado", "muy_usado"]),
  category: z.string().optional(),
  status: z.enum(["disponible", "reservado", "vendido"]),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ProductInput = z.infer<typeof productSchema>;
