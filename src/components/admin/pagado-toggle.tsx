"use client";
import { togglePagado } from "@/actions/admin";
import { useState, useTransition } from "react";

export function PagadoToggle({ nombre, pagado }: { nombre: string; pagado: boolean }) {
  const [checked, setChecked] = useState(pagado);
  const [pending, startTransition] = useTransition();

  const handleChange = () => {
    const next = !checked;
    setChecked(next);
    startTransition(() => { void togglePagado(nombre, next); });
  };

  return (
    <label className={`flex items-center gap-2 cursor-pointer select-none ${pending ? "opacity-60" : ""}`}>
      <div
        onClick={handleChange}
        className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${checked ? "bg-emerald-500" : "bg-gray-200"}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </div>
      <span className={`text-xs font-medium ${checked ? "text-emerald-600" : "text-gray-400"}`}>
        {checked ? "Pagó" : "Pendiente"}
      </span>
    </label>
  );
}
