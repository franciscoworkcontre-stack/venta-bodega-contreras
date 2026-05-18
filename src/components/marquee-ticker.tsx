"use client";

const items = [
  "LIQUIDACIÓN TOTAL",
  "✈️ NOS VAMOS A MÉXICO",
  "TODO DEBE SALIR",
  "PRECIOS DE BODEGA",
  "🇲🇽 ADIÓS SANTIAGO",
  "¡QUÉ GANGA!",
  "LIQUIDACIÓN TOTAL",
  "✈️ NOS VAMOS A MÉXICO",
  "TODO DEBE SALIR",
  "PRECIOS DE BODEGA",
  "🇲🇽 ADIÓS SANTIAGO",
  "¡QUÉ GANGA!",
];

export function MarqueeTicker() {
  return (
    <div
      className="bg-[#E63946] border-b-2 border-[#0A0A0A] overflow-hidden py-2 select-none"
      aria-hidden
    >
      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-white font-black text-xs md:text-sm uppercase tracking-widest px-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item}
            <span className="mx-4 opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
