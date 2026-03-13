// Re-export catalog types from the shared sales types
export type { Catalog, CatalogProduct } from '@/modules/sales/types';

/** Item added to cart from a catalog */
export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}
