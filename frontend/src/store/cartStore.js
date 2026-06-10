import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book, qty = 1) => {
        const items = get().items;
        const existing = items.find(i => i.id === book.id);
        if (existing) {
          set({ items: items.map(i => i.id === book.id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...items, { ...book, qty }] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty < 1) { get().removeItem(id); return; }
        set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) });
      },

      clearCart: () => set({ items: [] }),

      get total() { return get().items.reduce((s, i) => s + i.price * i.qty, 0); },
      get count() { return get().items.reduce((s, i) => s + i.qty, 0); },
    }),
    { name: 'ilc-cart' }
  )
);
