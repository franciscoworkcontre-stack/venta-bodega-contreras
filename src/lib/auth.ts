import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || token !== ADMIN_SECRET) {
    redirect("/admin");
  }
  return true;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || token !== ADMIN_SECRET) return null;
  return true;
}
