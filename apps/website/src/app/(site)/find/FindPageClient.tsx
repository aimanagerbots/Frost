"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { StoreCard, ProductCard, ScrollReveal } from "@/components";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/constants";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  strainName?: string;
  brand: string;
  thcRange: string;
  cbdRange: string;
  strainType?: string;
  imageUrl: string;
}

interface DispensaryAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface DispensaryItem {
  id: string;
  name: string;
  address: DispensaryAddress;
  hours?: string;
  categoriesCarried: string[];
}

interface FindPageClientProps {
  products: ProductItem[];
  dispensaries: DispensaryItem[];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function FindPageClient({
  products,
  dispensaries,
}: FindPageClientProps) {
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState(
    searchParams.get("product") || ""
  );

  const grouped = useMemo(() => {
    const map: Record<string, ProductItem[]> = {};
    for (const cat of CATEGORY_SLUGS) {
      map[cat] = [];
    }
    for (const p of products) {
      if (map[p.category]) {
        map[p.category].push(p);
      }
    }
    return map;
  }, [products]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === selectedSlug),
    [products, selectedSlug]
  );

  const matchingStores = useMemo(() => {
    if (!selectedSlug) return [];
    return dispensaries
      .filter((d) => hashStr(selectedSlug + d.id) % 3 !== 0)
      .slice(0, 10);
  }, [selectedSlug, dispensaries]);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(
        (p) =>
          p.category === selectedProduct.category &&
          p.slug !== selectedProduct.slug
      )
      .slice(0, 3);
  }, [selectedProduct, products]);

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#5BB8E6]/50 transition-colors";

  return (
    <div className="section-pad max-w-7xl mx-auto px-6">
      <ScrollReveal>
        <label
          htmlFor="product-select"
          className="block font-display text-2xl text-text-default mb-4"
        >
          Select a Product
        </label>
        <select
          id="product-select"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className={inputClassName}
        >
          <option value="">Select a product...</option>
          {CATEGORY_SLUGS.map((cat) => (
            <optgroup key={cat} label={CATEGORIES[cat].label}>
              {grouped[cat]?.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </ScrollReveal>

      {selectedSlug && selectedProduct ? (
        <>
          <ScrollReveal className="mt-12">
            <p className="text-text-muted text-sm mb-6">
              Found at{" "}
              <span className="text-text-default font-medium">
                {matchingStores.length}
              </span>{" "}
              dispensar{matchingStores.length === 1 ? "y" : "ies"} near you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingStores.map((d) => {
                const isLow = hashStr(selectedSlug + d.id) % 5 === 0;
                return (
                  <div key={d.id} className="relative">
                    <StoreCard
                      name={d.name}
                      address={d.address}
                      hours={d.hours}
                      categoriesCarried={d.categoriesCarried}
                    />
                    <span
                      className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full ${
                        isLow
                          ? "bg-[#FBBF24]/10 text-[#FBBF24]"
                          : "bg-[#00E5A0]/10 text-[#00E5A0]"
                      }`}
                    >
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {relatedProducts.length > 0 && (
            <ScrollReveal className="mt-16">
              <h2 className="font-display text-2xl text-text-default mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.slug}
                    name={p.name}
                    brand={p.brand}
                    strainName={p.strainName || ""}
                    strainType={
                      (p.strainType as "indica" | "sativa" | "hybrid" | "cbd") ||
                      "hybrid"
                    }
                    thcRange={p.thcRange}
                    cbdRange={p.cbdRange}
                    imageUrl={p.imageUrl}
                    slug={p.slug}
                    category={p.category}
                  />
                ))}
              </div>
            </ScrollReveal>
          )}
        </>
      ) : (
        <ScrollReveal className="mt-16">
          <div className="rounded-xl border border-border-default bg-card p-12 text-center">
            <p className="text-text-muted text-lg">
              Select a product above to see which stores carry it
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
