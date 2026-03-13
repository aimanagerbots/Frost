'use client';

import { useMemo } from 'react';
import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_CARTS, MOCK_BATCH_ALLOCATIONS } from '@/mocks/sales';
import type { Cart, BatchAllocation } from '@/modules/sales/types';
import { useCartStore } from '../store';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all carts, merging any AI-generated pending cart */
export function useCarts() {
  const pendingCart = useCartStore((s) => s.pendingCart);

  const query = useDemoQuery<Cart[]>({
    queryKey: ['carts'],
    demoQueryFn: async () => {
      await delay(600);
      return MOCK_CARTS;
    },
    emptyValue: [] as Cart[],
  });

  const data = useMemo(() => {
    if (!query.data) return query.data;
    if (!pendingCart) return query.data;
    // Avoid duplicates if the pending cart ID already exists
    if (query.data.some((c) => c.id === pendingCart.id)) return query.data;
    return [pendingCart, ...query.data];
  }, [query.data, pendingCart]);

  return { ...query, data };
}

/** Fetch a single cart by ID, including pending AI-generated cart */
export function useCart(cartId: string | null) {
  const pendingCart = useCartStore((s) => s.pendingCart);

  const query = useDemoQuery<Cart | undefined>({
    queryKey: ['cart', cartId],
    demoQueryFn: async () => {
      await delay(400);
      return MOCK_CARTS.find((c) => c.id === cartId);
    },
    emptyValue: undefined,
    enabled: !!cartId,
  });

  // If the queried cart isn't found in mocks but matches the pending cart, return pending
  const data = useMemo(() => {
    if (query.data) return query.data;
    if (pendingCart && cartId === pendingCart.id) return pendingCart;
    return query.data;
  }, [query.data, pendingCart, cartId]);

  return { ...query, data };
}

/** Fetch batch allocations for a cart line item */
export function useCartAllocation(lineItemId: string | null) {
  return useDemoQuery<BatchAllocation[]>({
    queryKey: ['cart-allocation', lineItemId],
    demoQueryFn: async () => {
      await delay(500);
      return MOCK_BATCH_ALLOCATIONS;
    },
    emptyValue: [] as BatchAllocation[],
    enabled: !!lineItemId,
  });
}
