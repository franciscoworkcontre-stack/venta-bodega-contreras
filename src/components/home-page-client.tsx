"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/db/schema";
import { ProductCard } from "@/components/product-card";
import { MarqueeTicker } from "@/components/marquee-ticker";
import { motion, AnimatePresence } from "framer-motion";

export function HomePageClient({ allProducts }: { allProducts: Product[] }) {
  const [planeDone, setPlaneDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPlaneDone(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <MarqueeTicker />

      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 border-b-2 border-[#0A0A0A] overflow-hidden relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative">

            {/* Avión despegando */}
            <AnimatePresence>
              {!planeDone && (
                <motion.span
                  className="absolute pointer-events-none select-none z-20 text-5xl md:text-7xl"
                  style={{ bottom: "8px", left: "28%" }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                  animate={{
                    x: [0, 0, 40, 180, 500, 900],
                    y: [0, 0, -10, -55, -130, -220],
                    rotate: [0, 0, -8, -18, -26, -32],
                    opacity: [0, 1, 1, 1, 0.7, 0],
                  }}
                  transition={{
                    times: [0, 0.05, 0.2, 0.45, 0.75, 1],
                    duration: 3.0,
                    delay: 0.5,
                    ease: "easeIn",
                  }}
                >
                  ✈️
                </motion.span>
              )}
            </AnimatePresence>

            {/* Titulo */}
            <div className="overflow-hidden mb-1">
              <motion.h1
                className="font-black text-5xl md:text-8xl uppercase leading-none"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                Nos vamos
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-5xl md:text-8xl uppercase leading-none text-[#E63946]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                a México 🇲🇽
              </motion.div>
            </div>

            {/* Sticker TOP MUST GO */}
            <motion.div
              className="absolute top-0 right-0 bg-[#FFD60A] border-2 border-[#0A0A0A] px-3 py-2 font-black text-sm uppercase shadow-[4px_4px_0_#0A0A0A] hidden md:block sticker-wobble-2"
              initial={{ opacity: 0, scale: 0.3, rotate: 25 }}
              animate={{ opacity: 1, scale: 1, rotate: 12 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 500, damping: 12 }}
            >
              TODO DEBE SALIR
            </motion.div>

            {/* Sticker PRECIOS */}
            <motion.div
              className="absolute bottom-4 right-20 bg-[#E63946] text-white border-2 border-[#0A0A0A] px-3 py-2 font-black text-sm uppercase shadow-[4px_4px_0_#0A0A0A] hidden md:block sticker-wobble-1"
              initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ delay: 1.05, type: "spring", stiffness: 500, damping: 12 }}
            >
              PRECIOS DE BODEGA
            </motion.div>
          </div>

          <motion.p
            className="italic text-xl md:text-2xl text-[#0A0A0A]/70 max-w-2xl mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Toda la casa en venta. Pasa, mira, llévate.
          </motion.p>
          <motion.p
            className="text-sm text-[#0A0A0A]/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Reserva con 12h de expiración. Francisco te contacta por WhatsApp para coordinar.
          </motion.p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="font-black text-2xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {allProducts.length} cositas en venta
          </h2>
        </motion.div>

        {allProducts.length === 0 ? (
          <div
            className="text-center py-24 italic text-xl text-[#0A0A0A]/40"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Todo vendido. Gracias Santiago 🙏
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
