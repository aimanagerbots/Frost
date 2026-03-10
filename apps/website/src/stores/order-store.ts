'use client';

import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CartItem,
  CustomerInfo,
  MockOrder,
  UserLocation,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BrowseMode = 'all-products' | 'by-store';
export type ConciergeMode = 'browse' | 'cart' | 'checkout' | 'tracking';

interface OrderState {
  /* ── Cart ── */
  items: readonly CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productSlug: string, storeId: string) => void;
  updateQuantity: (productSlug: string, storeId: string, qty: number) => void;
  clearCart: () => void;

  /* ── Location ── */
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;

  /* ── Browse mode ── */
  browseMode: BrowseMode;
  setBrowseMode: (mode: BrowseMode) => void;

  /* ── Cart drawer ── */
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  /* ── Concierge ── */
  isConciergeOpen: boolean;
  setConciergeOpen: (open: boolean) => void;
  conciergeMode: ConciergeMode;
  setConciergeMode: (mode: ConciergeMode) => void;

  /* ── Customer / Checkout ── */
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;

  /* ── Active order (post-checkout) ── */
  activeOrder: MockOrder | null;
  setActiveOrder: (order: MockOrder | null) => void;

  /* ── Map viewport bounds (ephemeral, not persisted) ── */
  mapBounds: { north: number; south: number; east: number; west: number } | null;
  setMapBounds: (bounds: { north: number; south: number; east: number; west: number } | null) => void;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      /* ── Cart ── */
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productSlug === newItem.productSlug &&
              i.storeId === newItem.storeId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productSlug === newItem.productSlug &&
                i.storeId === newItem.storeId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (productSlug, storeId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productSlug === productSlug && i.storeId === storeId),
          ),
        })),

      updateQuantity: (productSlug, storeId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter(
                (i) =>
                  !(i.productSlug === productSlug && i.storeId === storeId),
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productSlug === productSlug && i.storeId === storeId
                ? { ...i, quantity: qty }
                : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      /* ── Location ── */
      userLocation: null,
      setUserLocation: (loc) => set({ userLocation: loc }),

      /* ── Browse mode ── */
      browseMode: 'by-store',
      setBrowseMode: (mode) => set({ browseMode: mode }),

      /* ── Cart drawer ── */
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      /* ── Concierge ── */
      isConciergeOpen: false,
      setConciergeOpen: (open) => set({ isConciergeOpen: open }),
      conciergeMode: 'browse',
      setConciergeMode: (mode) => set({ conciergeMode: mode }),

      /* ── Customer / Checkout ── */
      customerInfo: null,
      setCustomerInfo: (info) => set({ customerInfo: info }),

      /* ── Active order ── */
      activeOrder: null,
      setActiveOrder: (order) => set({ activeOrder: order }),

      /* ── Map viewport bounds ── */
      mapBounds: null,
      setMapBounds: (bounds) => set({ mapBounds: bounds }),
    }),
    {
      name: 'frost-order-store',
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

/* ------------------------------------------------------------------ */
/*  Computed selectors                                                  */
/* ------------------------------------------------------------------ */

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
      const existing = groups.get(item.storeId) ?? [];
      groups.set(item.storeId, [...existing, item]);
    }
    return groups;
  }, [items]);
}

export function useIsMultiStore() {
  return useOrderStore((s) => {
    const storeIds = new Set(s.items.map((i) => i.storeId));
    return storeIds.size > 1;
  });
}
