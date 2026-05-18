import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";

export default async function AdminPage() {
  const user = await getAdminSession();
  if (user) redirect("/admin/dashboard");

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <h1
        className="font-black text-3xl uppercase mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Admin
      </h1>
      <AdminLoginForm />
    </div>
  );
}
