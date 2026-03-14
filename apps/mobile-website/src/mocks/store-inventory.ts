import { getAllProducts } from "./products";
import { getAllDispensaries } from "./dispensaries";
import { haversineDistance } from "@/lib/map-config";
import type { ProductAvailability } from "@/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StoreInventoryItem {
  productSlug: string;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  strainName?: string;
  strainType?: string;
  thcRange?: string;
}

/* ------------------------------------------------------------------ */
/*  Deterministic hash — simple string → number                        */
/* ------------------------------------------------------------------ */

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/* ------------------------------------------------------------------ */
/*  Price variation — deterministic per store + product                 */
/* ------------------------------------------------------------------ */

const PRICE_RANGES: Record<string, [number, number]> = {
  flower: [25, 45],
  preroll: [8, 15],
  vaporizer: [30, 50],
  concentrate: [25, 55],
  edible: [15, 30],
  beverage: [8, 15],
};

function getStorePrice(
  basePrice: number,
  category: string,
  seed: number
): number {
  const range = PRICE_RANGES[category];
  if (!range) return basePrice;
  const [min, max] = range;
  // Use the seed to create a small price variation within the range
  const variation = (seed % 7) - 3; // -3 to +3 dollar variation
  const adjusted = basePrice + variation;
  return Math.max(min, Math.min(max, adjusted));
}

/* ------------------------------------------------------------------ */
/*  Stock status — 80% in-stock, 15% low-stock, 5% out-of-stock       */
/* ------------------------------------------------------------------ */

function getStockStatus(
  seed: number
): "in-stock" | "low-stock" | "out-of-stock" {
  const roll = seed % 100;
  if (roll < 5) return "out-of-stock";
  if (roll < 20) return "low-stock";
  return "in-stock";
}

/* ------------------------------------------------------------------ */
/*  Inventory generation                                               */
/* ------------------------------------------------------------------ */

/** Memoization cache keyed by dispensary ID */
const inventoryCache = new Map<string, StoreInventoryItem[]>();

/**
 * Returns a deterministic mock "menu" for the given dispensary.
 * Each store carries 15–25 products based on a hash of the store ID.
 */
export function getStoreInventory(dispensaryId: string): StoreInventoryItem[] {
  const cached = inventoryCache.get(dispensaryId);
  if (cached) return cached;

  const allProducts = getAllProducts();
  const dispensary = getAllDispensaries().find((d) => d.id === dispensaryId);
  if (!dispensary) return [];

  const carriedCategories = new Set(dispensary.categoriesCarried);
  const storeHash = simpleHash(dispensaryId);

  // Determine how many products this store carries (15–25)
  const targetCount = 15 + (storeHash % 11);

  // Filter to products in categories the store carries
  const eligibleProducts = allProducts.filter((p) =>
    carriedCategories.has(p.category)
  );

  // Deterministically select products using hash
  const selected: StoreInventoryItem[] = [];
  for (let i = 0; i < eligibleProducts.length && selected.length < targetCount; i++) {
    const product = eligibleProducts[i];
    const pairHash = simpleHash(`${dispensaryId}:${product.slug}`);

    // Include this product if hash passes threshold (~60% of eligible)
    if (pairHash % 100 < 60) {
      const priceSeed = simpleHash(`${dispensaryId}:${product.slug}:price`);
      const stockSeed = simpleHash(`${dispensaryId}:${product.slug}:stock`);

      selected.push({
        productSlug: product.slug,
        productName: product.name,
        category: product.category,
        brand: product.brand,
        price: getStorePrice(product.price, product.category, priceSeed),
        stockStatus: getStockStatus(stockSeed),
        strainName: product.strainName,
        strainType: product.strainType,
        thcRange: product.thcRange,
      });
    }
  }

  // If we ended up with fewer than 15, do a second pass with a lower threshold
  if (selected.length < 15) {
    for (
      let i = 0;
      i < eligibleProducts.length && selected.length < 15;
      i++
    ) {
      const product = eligibleProducts[i];
      const alreadySelected = selected.some(
        (s) => s.productSlug === product.slug
      );
      if (alreadySelected) continue;

      const priceSeed = simpleHash(`${dispensaryId}:${product.slug}:price`);
      const stockSeed = simpleHash(`${dispensaryId}:${product.slug}:stock`);

      selected.push({
        productSlug: product.slug,
        productName: product.name,
        category: product.category,
        brand: product.brand,
        price: getStorePrice(product.price, product.category, priceSeed),
        stockStatus: getStockStatus(stockSeed),
        strainName: product.strainName,
        strainType: product.strainType,
        thcRange: product.thcRange,
      });
    }
  }

  inventoryCache.set(dispensaryId, selected);
  return selected;
}

/* ------------------------------------------------------------------ */
/*  Reverse lookup: which stores carry a given product?                */
/* ------------------------------------------------------------------ */

/**
 * Returns a list of dispensary IDs and their stock status for a given product slug.
 */
export function getStoresCarryingProduct(
  productSlug: string
): { dispensaryId: string; stockStatus: string }[] {
  const allDispensaries = getAllDispensaries();
  const results: { dispensaryId: string; stockStatus: string }[] = [];

  for (const dispensary of allDispensaries) {
    const inventory = getStoreInventory(dispensary.id);
    const item = inventory.find((i) => i.productSlug === productSlug);
    if (item) {
      results.push({
        dispensaryId: dispensary.id,
        stockStatus: item.stockStatus,
      });
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Product availability with full store details + distance            */
/* ------------------------------------------------------------------ */

/**
 * Returns all stores carrying a given product with store details,
 * pricing, stock status, and optional distance from user.
 */
export function getProductAvailability(
  productSlug: string,
  userLat?: number,
  userLng?: number,
): ProductAvailability[] {
  const allDispensaries = getAllDispensaries();
  const results: ProductAvailability[] = [];

  for (const dispensary of allDispensaries) {
    const inventory = getStoreInventory(dispensary.id);
    const item = inventory.find((i) => i.productSlug === productSlug);
    if (item) {
      results.push({
        dispensaryId: dispensary.id,
        storeName: dispensary.name,
        storeSlug: dispensary.slug,
        distance:
          userLat !== undefined && userLng !== undefined
            ? haversineDistance(
                userLat,
                userLng,
                dispensary.address.lat,
                dispensary.address.lng,
              )
            : undefined,
        price: item.price,
        stockStatus: item.stockStatus,
      });
    }
  }

  // Sort by distance if available, then by price
  if (userLat !== undefined && userLng !== undefined) {
    results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  } else {
    results.sort((a, b) => a.price - b.price);
  }

  return results;
}
