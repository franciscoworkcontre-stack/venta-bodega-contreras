"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

const COOKIE_NAME = "admin_session";

export async function loginAdmin(password: string) {
  const { error } = await supabaseAdmin.auth.signInWithPassword({
    email: "admincontreras@bodega.cl",
    password,
  });

  if (error) return { error: "Contraseña incorrecta." };

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin");
}
