"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit: React.EventHandler<React.SyntheticEvent<HTMLFormElement>> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: "admincontreras@bodega.cl",
      password,
    });
    if (signInError) {
      setError("Contraseña incorrecta.");
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Usuario</label>
        <input
          type="text"
          value="admincontreras"
          readOnly
          className="w-full border-2 border-[#0A0A0A] px-3 py-2 bg-[#0A0A0A]/5 font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border-2 border-[#0A0A0A] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-[#E63946] text-sm font-bold">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="brutal-btn w-full py-3 bg-[#FFD60A] font-black uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
