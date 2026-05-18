"use client";
import { useState } from "react";
import { loginAdmin } from "@/actions/auth";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.EventHandler<React.SyntheticEvent<HTMLFormElement>> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const result = await loginAdmin(password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
          name="password"
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
