import { create } from 'zustand';
import type { Cart } from '@/modules/sales/types';

interface CartStore {
  pendingCart: Cart | null;
  setPendingCart: (cart: Cart) => void;
  clearPendingCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  pendingCart: null,
  setPendingCart: (cart) => set({ pendingCart: cart }),
  clearPendingCart: () => set({ pendingCart: null }),
}));
