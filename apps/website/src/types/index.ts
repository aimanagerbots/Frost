export type {
  ProductCategory,
  ProductDisplay,
  StrainType,
  StrainDifficulty,
  StrainProfile,
  DispensaryLocation,
  PaginationParams,
  SortDirection,
  PaginatedResponse,
} from "@frost/types";

/* Extended types for consumer website */

export interface WebsiteProduct {
  id: string;
  name: string;
  slug: string;
  category: import("@frost/types").ProductCategory;
  subCategory?: string;
  strainName?: string;
  strainType?: import("@frost/types").StrainType;
  description: string;
  thcRange: string;
  cbdRange: string;
  terpeneProfile: string[];
  packageSizes: string[];
  imageUrl: string;
  brand: string;
  price: number;
  isNew: boolean;
  isBestSeller: boolean;
  effects: string[];
  flavorNotes: string[];
}

export interface WebsiteStrain {
  id: string;
  name: string;
  slug: string;
  type: import("@frost/types").StrainType;
  lineage: string;
  thcRange: string;
  cbdRange: string;
  terpeneProfile: string[];
  difficulty: import("@frost/types").StrainDifficulty;
  description: string;
  imageUrl: string;
  effects: string[];
  flavorNotes: string[];
  aromas: string[];
  productCount: number;
}

export type BlogCategory =
  | "Strain Spotlights"
  | "Education"
  | "Company"
  | "Culture";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  category: BlogCategory;
  imageUrl: string;
  readTime: number;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/*  Order / Cart types                                                 */
/* ------------------------------------------------------------------ */

export interface CartItem {
  readonly productSlug: string;
  readonly productName: string;
  readonly category: string;
  readonly brand: string;
  readonly price: number;
  readonly quantity: number;
  readonly storeId: string;
  readonly storeName: string;
  readonly storeSlug: string;
  readonly strainName?: string;
  readonly strainType?: string;
  readonly thcRange?: string;
  readonly stockStatus: "in-stock" | "low-stock" | "out-of-stock";
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked-up";

export interface StoreOrderGroup {
  readonly storeId: string;
  readonly storeName: string;
  readonly storeSlug: string;
  readonly storeAddress: string;
  readonly storePhone: string;
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly confirmationNumber: string;
  readonly pickupTime: string;
  readonly status: OrderStatus;
}

export interface MockOrder {
  readonly id: string;
  readonly storeGroups: readonly StoreOrderGroup[];
  readonly customerName: string;
  readonly customerPhone: string;
  readonly customerEmail?: string;
  readonly placedAt: Date;
}

export interface CustomerInfo {
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
}

export interface UserLocation {
  readonly lat: number;
  readonly lng: number;
  readonly label: string;
}

export interface ProductAvailability {
  readonly dispensaryId: string;
  readonly storeName: string;
  readonly storeSlug: string;
  readonly distance?: number;
  readonly price: number;
  readonly stockStatus: "in-stock" | "low-stock" | "out-of-stock";
}
