import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  title: string;
  price_clp: number;
  slug: string;
  image_urls: string[];
  condition: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (!exists) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price_clp, 0),
    }),
    { name: "bodega-cart" }
  )
);
