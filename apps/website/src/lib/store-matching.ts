import { getProductAvailability } from '@/mocks/store-inventory';
import type { ProductAvailability, UserLocation } from '@/types';

/**
 * Find the nearest store carrying a product based on user location.
 * Returns the best match (nearest in-stock store), or null if unavailable.
 */
export function findNearestStore(
  productSlug: string,
  location: UserLocation | null,
): ProductAvailability | null {
  const stores = getProductAvailability(
    productSlug,
    location?.lat,
    location?.lng,
  );
  // Prefer in-stock, then low-stock, skip out-of-stock
  const available = stores.filter((s) => s.stockStatus !== 'out-of-stock');
  return available[0] ?? null;
}

/**
 * Get store count for a product (how many stores carry it).
 */
export function getStoreCount(productSlug: string): number {
  const stores = getProductAvailability(productSlug);
  return stores.filter((s) => s.stockStatus !== 'out-of-stock').length;
}

/**
 * Check if a product is available near a given location.
 * Returns availability info or null.
 */
export function checkAvailability(
  productSlug: string,
  location: UserLocation | null,
): { available: boolean; storeCount: number; nearest: ProductAvailability | null } {
  if (!location) {
    const count = getStoreCount(productSlug);
    return { available: count > 0, storeCount: count, nearest: null };
  }
  const stores = getProductAvailability(productSlug, location.lat, location.lng);
  const available = stores.filter((s) => s.stockStatus !== 'out-of-stock');
  return {
    available: available.length > 0,
    storeCount: available.length,
    nearest: available[0] ?? null,
  };
}
