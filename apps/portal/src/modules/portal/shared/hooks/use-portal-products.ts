'use client';

import { useQuery } from '@tanstack/react-query';
import type { PortalProduct, PortalPromotion } from '../types';
import { getProductsForAccount, getActivePromotions, PORTAL_PRODUCTS } from '../mock-data';

export function usePortalProducts(accountId?: string) {
  return useQuery<PortalProduct[]>({
    queryKey: ['portal', 'products', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return accountId ? getProductsForAccount(accountId) : PORTAL_PRODUCTS;
    },
  });
}

export function usePortalProduct(productId: string) {
  return useQuery<PortalProduct | undefined>({
    queryKey: ['portal', 'product', productId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return PORTAL_PRODUCTS.find((p) => p.id === productId);
    },
  });
}

export function usePortalPromotions() {
  return useQuery<PortalPromotion[]>({
    queryKey: ['portal', 'promotions'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getActivePromotions();
    },
  });
}
