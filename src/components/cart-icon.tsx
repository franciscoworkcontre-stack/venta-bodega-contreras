"use client";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartIcon() {
  const items = useCartStore((s) => s.items);
  return (
    <Link
      href="/canasta"
      className="relative flex items-center gap-2 font-display font-bold uppercase text-sm brutal-btn px-4 py-2 bg-[#FFD60A]"
    >
      🛒 Canasta
      <AnimatePresence>
        {items.length > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-[#E63946] text-white text-xs font-black w-5 h-5 flex items-center justify-center border-2 border-[#0A0A0A]"
          >
            {items.length}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
