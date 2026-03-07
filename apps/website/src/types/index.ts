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
