"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="brutal-btn px-4 py-2 bg-[#0A0A0A] text-white text-sm"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Salir
    </button>
  );
}
