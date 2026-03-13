'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MOCK_CARTS, MOCK_BATCH_ALLOCATIONS } from '@/mocks/sales';
import type { Cart, BatchAllocation } from '@/modules/sales/types';
import { useCartStore } from '../store';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all carts, merging any AI-generated pending cart */
export function useCarts() {
  const pendingCart = useCartStore((s) => s.pendingCart);

  const query = useQuery<Cart[]>({
    queryKey: ['carts'],
    queryFn: async () => {
      await delay(600);
      return MOCK_CARTS;
    },
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

  const query = useQuery<Cart | undefined>({
    queryKey: ['cart', cartId],
    queryFn: async () => {
      await delay(400);
      return MOCK_CARTS.find((c) => c.id === cartId);
    },
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
  return useQuery<BatchAllocation[]>({
    queryKey: ['cart-allocation', lineItemId],
    queryFn: async () => {
      await delay(500);
      return MOCK_BATCH_ALLOCATIONS;
    },
    enabled: !!lineItemId,
  });
}
