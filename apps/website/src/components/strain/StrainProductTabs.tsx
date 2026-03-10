"use client";

import { useState, useMemo } from "react";
import type { ProductCategory } from "@frost/types";
import type { WebsiteProduct } from "@/types";
import ProductBrowseTile from "@/components/ui/ProductBrowseTile";
import { CATEGORY_ROUTE_MAP } from "@/lib/constants";
import { useOrderStore } from "@/stores/order-store";

/* ------------------------------------------------------------------ */
/*  Category tab labels                                                */
/* ------------------------------------------------------------------ */

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  flower: "Flower",
  preroll: "Pre-Rolls",
  vaporizer: "Vaporizers",
  concentrate: "Concentrates",
  edible: "Edibles",
  beverage: "Drinks",
};

const CATEGORY_ORDER: readonly ProductCategory[] = [
  "flower",
  "preroll",
  "vaporizer",
  "concentrate",
  "edible",
  "beverage",
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface StrainProductTabsProps {
  strainName: string;
  products: WebsiteProduct[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StrainProductTabs({
  strainName: _strainName,
  products,
}: StrainProductTabsProps) {
  /* Group products by category, preserving canonical order */
  const grouped = useMemo(() => {
    const map = new Map<ProductCategory, WebsiteProduct[]>();
    for (const product of products) {
      const existing = map.get(product.category);
      if (existing) {
        existing.push(product);
      } else {
        map.set(product.category, [product]);
      }
    }
    /* Return entries in canonical category order */
    return CATEGORY_ORDER
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, items: map.get(cat)! }));
  }, [products]);

  const [activeTab, setActiveTab] = useState<ProductCategory>(
    grouped[0]?.category ?? "flower",
  );

  if (products.length === 0) return null;

  const activeItems =
    grouped.find((g) => g.category === activeTab)?.items ?? [];

  const handleAddToCart = (product: WebsiteProduct) => {
    useOrderStore.getState().addItem({
      productSlug: product.slug,
      productName: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      strainName: product.strainName,
      strainType: product.strainType,
      thcRange: product.thcRange,
    });
  };

  return (
    <section>
      {/* Tab bar */}
      <div className="overflow-x-auto scrollbar-none border-b border-white/[0.06]">
        <div className="flex">
          {grouped.map(({ category }) => {
            const isActive = category === activeTab;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 text-sm font-display capitalize whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#5BB8E6] border-b-2 border-[#5BB8E6]"
                    : "text-text-muted hover:text-text-default"
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 pt-6">
        {activeItems.map((product) => (
          <ProductBrowseTile
            key={product.id}
            slug={product.slug}
            categoryRoute={CATEGORY_ROUTE_MAP[product.category]}
            name={product.name}
            imageUrl={product.imageUrl}
            strainName={product.strainName}
            strainType={product.strainType}
            thcRange={product.thcRange}
            price={product.price}
            rating={product.rating}
            reviewCount={product.reviewCount}
            brand={product.brand}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </section>
  );
}
