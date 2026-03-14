import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CartItem,
  CustomerInfo,
  MockOrder,
  UserLocation,
} from '@/types';

export type BrowseMode = 'all-products' | 'by-store';
export type ConciergeMode = 'browse' | 'cart' | 'checkout' | 'tracking';

interface OrderState {
  items: readonly CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productSlug: string, storeId?: string) => void;
  updateQuantity: (productSlug: string, storeId: string | undefined, qty: number) => void;
  clearCart: () => void;

  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;

  browseMode: BrowseMode;
  setBrowseMode: (mode: BrowseMode) => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  isConciergeOpen: boolean;
  setConciergeOpen: (open: boolean) => void;
  conciergeMode: ConciergeMode;
  setConciergeMode: (mode: ConciergeMode) => void;

  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;

  activeOrder: MockOrder | null;
  setActiveOrder: (order: MockOrder | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const matchKey = (i: CartItem) =>
            i.productSlug === newItem.productSlug &&
            (i.storeId ?? '') === (newItem.storeId ?? '');
          const existing = state.items.find(matchKey);
          if (existing) {
            return {
              items: state.items.map((i) =>
                matchKey(i) ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (productSlug, storeId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productSlug === productSlug && (i.storeId ?? '') === (storeId ?? '')),
          ),
        })),

      updateQuantity: (productSlug, storeId, qty) =>
        set((state) => {
          const match = (i: CartItem) =>
            i.productSlug === productSlug && (i.storeId ?? '') === (storeId ?? '');
          if (qty <= 0) {
            return { items: state.items.filter((i) => !match(i)) };
          }
          return {
            items: state.items.map((i) =>
              match(i) ? { ...i, quantity: qty } : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      userLocation: null,
      setUserLocation: (loc) => set({ userLocation: loc }),

      browseMode: 'by-store',
      setBrowseMode: (mode) => set({ browseMode: mode }),

      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      isConciergeOpen: false,
      setConciergeOpen: (open) => set({ isConciergeOpen: open }),
      conciergeMode: 'browse',
      setConciergeMode: (mode) => set({ conciergeMode: mode }),

      customerInfo: null,
      setCustomerInfo: (info) => set({ customerInfo: info }),

      activeOrder: null,
      setActiveOrder: (order) => set({ activeOrder: order }),
    }),
    {
      name: 'frost-order-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        userLocation: state.userLocation,
        browseMode: state.browseMode,
        customerInfo: state.customerInfo,
        activeOrder: state.activeOrder,
      }),
    },
  ),
);

export function useCartItemCount() {
  return useOrderStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
}

export function useCartTotal() {
  return useOrderStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  );
}

export function useStoreGroups() {
  const items = useOrderStore((s) => s.items);
  return useMemo(() => {
    const groups = new Map<string, CartItem[]>();
    for (const item of items) {
      const key = item.storeId ?? '_unassigned';
      const existing = groups.get(key) ?? [];
      groups.set(key, [...existing, item]);
    }
    return groups;
  }, [items]);
}
