/** The 6 cannabis product categories */
export type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';

/** Consumer-facing product display data */
export interface ProductDisplay {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subCategory?: string;
  strainName?: string;
  strainType?: 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced';
  description: string;
  thcRange: string;
  cbdRange: string;
  terpeneProfile: string[];
  packageSizes: string[];
  imageUrl?: string;
  brand: string;
}
