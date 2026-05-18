"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AdminLoginForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
    await supabase.auth.signInWithOtp({
      email: adminEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] bg-[#FFD60A] p-6">
        <p className="font-display font-bold">
          Revisa tu email. Te llegó el magic link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-body text-sm text-[#0A0A0A]/60">
        Manda magic link a{" "}
        <strong>{process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "tu email"}</strong>
      </p>
      <button
        type="submit"
        disabled={loading}
        className="brutal-btn w-full py-3 bg-[#FFD60A] font-display font-black"
      >
        {loading ? "Enviando..." : "Entrar al admin"}
      </button>
    </form>
  );
}
