import { pgTable, uuid, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const conditionEnum = pgEnum("condition", ["nuevo", "usado", "muy_usado"]);
export const productStatusEnum = pgEnum("product_status", ["disponible", "reservado", "vendido"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["activa", "confirmada", "expirada", "cancelada"]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price_clp: integer("price_clp").notNull(),
  condition: conditionEnum("condition").notNull(),
  status: productStatusEnum("status").notNull().default("disponible"),
  category: text("category"),
  reference_url: text("reference_url"),
  image_urls: text("image_urls").array().notNull().default(sql`'{}'`),
  cantidad: integer("cantidad").notNull().default(1),
  comprador: text("comprador"),
  reserved_at: timestamp("reserved_at", { withTimezone: true }),
  reserved_until: timestamp("reserved_until", { withTimezone: true }),
  sold_at: timestamp("sold_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyer_name: text("buyer_name").notNull(),
  buyer_phone: text("buyer_phone").notNull(),
  buyer_email: text("buyer_email"),
  buyer_message: text("buyer_message"),
  product_ids: uuid("product_ids").array().notNull(),
  total_clp: integer("total_clp").notNull(),
  status: reservationStatusEnum("status").notNull().default("activa"),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  confirmed_at: timestamp("confirmed_at", { withTimezone: true }),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
