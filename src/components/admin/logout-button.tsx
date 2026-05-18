"use client";
import { logoutAdmin } from "@/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logoutAdmin()}
      className="brutal-btn px-4 py-2 bg-[#0A0A0A] text-white text-sm"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Salir
    </button>
  );
}
