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

/* ── Route mapping: internal slug → URL route ── */
export const CATEGORY_ROUTE_MAP: Record<ProductCategory, string> = {
  flower: "flower",
  preroll: "pre-rolls",
  vaporizer: "vaporizers",
  concentrate: "concentrates",
  edible: "edibles",
  beverage: "drinks",
};

export const ROUTE_TO_CATEGORY: Record<string, ProductCategory> = Object.fromEntries(
  Object.entries(CATEGORY_ROUTE_MAP).map(([k, v]) => [v, k as ProductCategory]),
) as Record<string, ProductCategory>;

/* ── Sidebar filter configs ── */
export const CATEGORY_FORMAT_FILTERS: Record<ProductCategory, { label: string; slug: string }[]> = {
  flower: [
    { label: "Eighths (3.5g)", slug: "eighths" },
    { label: "Quarters (7g)", slug: "quarters" },
    { label: "Halves (14g)", slug: "halves" },
    { label: "Ounces (28g)", slug: "ounces" },
  ],
  preroll: [
    { label: "Singles", slug: "singles" },
    { label: "3-Packs", slug: "3-packs" },
    { label: "5-Packs", slug: "5-packs" },
    { label: "6-Packs", slug: "6-packs" },
    { label: "Infused", slug: "infused" },
  ],
  vaporizer: [
    { label: "Disposables", slug: "disposable" },
    { label: "Cartridges", slug: "cartridge" },
    { label: "Pods", slug: "pod" },
  ],
  concentrate: [
    { label: "Live Resin", slug: "live-resin" },
    { label: "Rosin", slug: "rosin" },
    { label: "Shatter", slug: "shatter" },
    { label: "Wax", slug: "wax" },
    { label: "Batter", slug: "batter" },
    { label: "Crumble", slug: "crumble" },
    { label: "Diamonds", slug: "diamonds" },
    { label: "Budder", slug: "budder" },
  ],
  edible: [
    { label: "Gummies", slug: "gummies" },
    { label: "Chocolates", slug: "chocolate" },
    { label: "Mints", slug: "mints" },
    { label: "Caramels", slug: "caramels" },
    { label: "Honey", slug: "honey" },
  ],
  beverage: [
    { label: "Sparkling", slug: "sparkling" },
    { label: "Tea", slug: "tea" },
    { label: "Coffee", slug: "coffee" },
    { label: "Soda", slug: "soda" },
    { label: "Kombucha", slug: "kombucha" },
    { label: "Elixir", slug: "elixir" },
  ],
};

export const EFFECT_FILTERS = [
  "Relaxed", "Energized", "Creative", "Focused",
  "Uplifted", "Sleepy", "Social", "Calm", "Euphoric", "Peaceful",
] as const;

export const PRICE_RANGE_FILTERS = [
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 – $20", min: 10, max: 20 },
  { label: "$20 – $35", min: 20, max: 35 },
  { label: "$35+", min: 35, max: Infinity },
] as const;

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

/* ── Mega Menu ── */

export interface MegaMenuCategoryItem {
  label: string;
  slug: string;
  route: string;
  brand: string;
  formats: { label: string; slug: string }[];
  featured: { name: string; slug: string };
}

export interface MegaMenuColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export type MegaMenuItem =
  | { type: "category"; label: string; category: MegaMenuCategoryItem }
  | { type: "dropdown"; label: string; columns: MegaMenuColumn[] }
  | { type: "link"; label: string; href: string }
  | { type: "cta"; label: string; href: string };

export const STRAIN_TYPES = [
  { label: "Indica", slug: "indica" },
  { label: "Sativa", slug: "sativa" },
  { label: "Hybrid", slug: "hybrid" },
] as const;

export const MEGA_MENU: MegaMenuItem[] = [
  {
    type: "category",
    label: "Flower",
    category: {
      label: "Flower",
      slug: "flower",
      route: "flower",
      brand: "Frost Farms",
      formats: [
        { label: "Eighths (3.5g)", slug: "eighths" },
        { label: "Quarters (7g)", slug: "quarters" },
        { label: "Halves (14g)", slug: "halves" },
        { label: "Ounces (28g)", slug: "ounces" },
      ],
      featured: { name: "Blue Frost OG", slug: "blue-frost-og" },
    },
  },
  {
    type: "category",
    label: "Pre-Rolls",
    category: {
      label: "Pre-Rolls",
      slug: "preroll",
      route: "pre-rolls",
      brand: "Frost Farms",
      formats: [
        { label: "Singles", slug: "singles" },
        { label: "3-Packs", slug: "3-packs" },
        { label: "5-Packs", slug: "5-packs" },
        { label: "Infused", slug: "infused" },
      ],
      featured: { name: "Glacier Infused", slug: "glacier-infused" },
    },
  },
  {
    type: "category",
    label: "Vaporizers",
    category: {
      label: "Vaporizers",
      slug: "vaporizer",
      route: "vaporizers",
      brand: "Glacier Extracts",
      formats: [
        { label: "Disposables", slug: "disposables" },
        { label: "Cartridges", slug: "cartridges" },
        { label: "Pods", slug: "pods" },
        { label: "Batteries", slug: "batteries" },
      ],
      featured: { name: "Glacier Live Resin Cart", slug: "glacier-live-resin-cart" },
    },
  },
  {
    type: "category",
    label: "Concentrates",
    category: {
      label: "Concentrates",
      slug: "concentrate",
      route: "concentrates",
      brand: "Glacier Extracts",
      formats: [
        { label: "Live Resin", slug: "live-resin" },
        { label: "Rosin", slug: "rosin" },
        { label: "Shatter", slug: "shatter" },
        { label: "Wax", slug: "wax" },
        { label: "Badder", slug: "badder" },
      ],
      featured: { name: "Northern Lights Rosin", slug: "northern-lights-rosin" },
    },
  },
  {
    type: "category",
    label: "Edibles",
    category: {
      label: "Edibles",
      slug: "edible",
      route: "edibles",
      brand: "Northern Lights Co.",
      formats: [
        { label: "Gummies", slug: "gummies" },
        { label: "Chocolates", slug: "chocolates" },
        { label: "Baked Goods", slug: "baked-goods" },
        { label: "Mints", slug: "mints" },
      ],
      featured: { name: "Frost Bite Gummies", slug: "frost-bite-gummies" },
    },
  },
  {
    type: "category",
    label: "Drinks",
    category: {
      label: "Drinks",
      slug: "beverage",
      route: "drinks",
      brand: "Northern Lights Co.",
      formats: [
        { label: "Sparkling", slug: "sparkling" },
        { label: "Teas", slug: "teas" },
        { label: "Shots", slug: "shots" },
        { label: "Mixers", slug: "mixers" },
      ],
      featured: { name: "Frost Sparkling Citrus", slug: "frost-sparkling-citrus" },
    },
  },
  {
    type: "dropdown",
    label: "Strain Library",
    columns: [
      {
        heading: "By Type",
        links: [
          { label: "Indica", href: "/strains?type=indica" },
          { label: "Sativa", href: "/strains?type=sativa" },
          { label: "Hybrid", href: "/strains?type=hybrid" },
        ],
      },
      {
        heading: "By Effect",
        links: [
          { label: "Relaxing", href: "/strains?effect=relaxing" },
          { label: "Energizing", href: "/strains?effect=energizing" },
          { label: "Creative", href: "/strains?effect=creative" },
          { label: "Pain Relief", href: "/strains?effect=pain-relief" },
          { label: "Sleep", href: "/strains?effect=sleep" },
        ],
      },
      {
        heading: "Popular Strains",
        links: [
          { label: "Blue Frost", href: "/strains/blue-frost" },
          { label: "Northern Haze", href: "/strains/northern-haze" },
          { label: "Glacier Kush", href: "/strains/glacier-kush" },
          { label: "Browse All Strains", href: "/strains" },
        ],
      },
    ],
  },
  {
    type: "link",
    label: "Blog",
    href: "/blog",
  },
  {
    type: "dropdown",
    label: "Resources",
    columns: [
      {
        heading: "Resources",
        links: [
          { label: "FAQ", href: "/faq" },
          { label: "Newsletter Signup", href: "/newsletter" },
          { label: "Contact Us", href: "/contact" },
          { label: "Wholesale", href: "/wholesale" },
        ],
      },
    ],
  },
  {
    type: "cta",
    label: "Order",
    href: "/order",
  },
];

export const FOOTER_LINKS = {
  products: [
    { label: "Flower", href: "/flower" },
    { label: "Pre-Rolls", href: "/pre-rolls" },
    { label: "Vaporizers", href: "/vaporizers" },
    { label: "Concentrates", href: "/concentrates" },
    { label: "Edibles", href: "/edibles" },
    { label: "Drinks", href: "/drinks" },
  ],
  strains: [
    { label: "Animal Face", href: "/strains/animal-face" },
    { label: "Bay Dream", href: "/strains/bay-dream" },
    { label: "Blue Runtz", href: "/strains/blue-runtz" },
    { label: "Cereal Milk", href: "/strains/cereal-milk" },
    { label: "Gelato", href: "/strains/gelato" },
    { label: "Pearl Scout Cookies", href: "/strains/pearl-scout-cookies" },
  ],
  blog: [
    { label: "A Beginner's Guide to Concentrates", href: "/blog/a-beginners-guide-to-cannabis-concentrates" },
    { label: "Blue Dream: Washington's Favorite", href: "/blog/blue-dream-why-washingtons-favorite-sativa-endures" },
    { label: "From Seed to Shelf", href: "/blog/from-seed-to-shelf-how-craft-cannabis-is-grown" },
    { label: "Our Roots: The Frost Story", href: "/blog/our-roots-the-frost-story" },
    { label: "Sustainability at Frost", href: "/blog/sustainability-at-frost-growing-green" },
    { label: "Understanding Terpenes", href: "/blog/understanding-terpenes-the-aromatherapy-of-cannabis" },
  ],
  resources: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Compliance", href: "/compliance" },
  ],
} as const;
