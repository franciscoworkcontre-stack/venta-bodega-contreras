"use client";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] px-4 py-3 max-w-sm font-body text-sm font-medium ${
              toast.variant === "destructive"
                ? "bg-[#E63946] text-white"
                : "bg-[#FFD60A]"
            }`}
          >
            {toast.title && <p className="font-bold">{toast.title}</p>}
            {toast.description && <p>{toast.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
