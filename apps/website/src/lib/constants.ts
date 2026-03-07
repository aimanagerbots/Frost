import type { ProductCategory } from "@frost/types";

export interface CategoryMeta {
  label: string;
  slug: string;
  tagline: string;
  icon: string;
}

export const CATEGORIES: Record<ProductCategory, CategoryMeta> = {
  flower: {
    label: "Flower",
    slug: "flower",
    tagline: "Hand-trimmed, small-batch craft flower",
    icon: "Leaf",
  },
  preroll: {
    label: "Pre-Rolls",
    slug: "preroll",
    tagline: "Ready to enjoy, perfectly rolled",
    icon: "Cigarette",
  },
  vaporizer: {
    label: "Vaporizers",
    slug: "vaporizer",
    tagline: "Clean, convenient, and potent",
    icon: "Wind",
  },
  concentrate: {
    label: "Concentrates",
    slug: "concentrate",
    tagline: "Pure extraction, maximum flavor",
    icon: "Droplets",
  },
  edible: {
    label: "Edibles",
    slug: "edible",
    tagline: "Crafted treats, precise dosing",
    icon: "Cookie",
  },
  beverage: {
    label: "Beverages",
    slug: "beverage",
    tagline: "Refreshing, social, sessionable",
    icon: "GlassWater",
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORIES) as ProductCategory[];

export const COMPLIANCE_TEXT =
  "This product has intoxicating effects and may be habit forming. Cannabis can impair concentration, coordination, and judgment. Do not operate a vehicle or machinery under the influence of this drug. There may be health risks associated with consumption of this product. For use only by adults twenty-one and older. Keep out of the reach of children.";

export const PRODUCT_WARNING =
  "Warning: This product contains cannabis, a Schedule I controlled substance. Keep out of reach of children. For use only by adults 21 years of age and older.";

export const BRAND_NAMES = {
  flower: "Frost Farms",
  preroll: "Frost Farms",
  vaporizer: "Glacier Extracts",
  concentrate: "Glacier Extracts",
  edible: "Northern Lights Co.",
  beverage: "Northern Lights Co.",
} as const;

/* Curated Unsplash photo IDs — editorial quality */
export const PHOTOS = {
  hero: [
    "eAKDzK4lo4o", // cannabis field
    "U1gvhqVQ2kQ", // pacific northwest forest
    "5QgIuuBxKwM", // misty mountains
  ],
  categories: {
    flower: "bMyfGqUxRNs",
    preroll: "8manzosDSGM",
    vaporizer: "PDX_a_82obo",
    concentrate: "ZITCkaH1jY4",
    edible: "kPqaqug998Y",
    beverage: "zfTbMbfIcWU",
  },
  about: {
    hero: "5eLsVr5tIQE",
    greenhouse: "IVRhPJVPxkQ",
    team: "376KN_ISplE",
  },
  blog: {
    default: "Av_PNmYL9Xo",
  },
  strains: {
    hero: "vrbZVyX2k4I",
  },
} as const;

export function unsplashUrl(id: string, width = 1200, height = 800): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Strains", href: "/strains" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/blog" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { label: "Flower", href: "/products/flower" },
    { label: "Pre-Rolls", href: "/products/preroll" },
    { label: "Vaporizers", href: "/products/vaporizer" },
    { label: "Concentrates", href: "/products/concentrate" },
    { label: "Edibles", href: "/products/edible" },
    { label: "Beverages", href: "/products/beverage" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Compliance", href: "/compliance" },
  ],
} as const;
