"use client";

import { useState, useMemo } from "react";
import type { ProductCategory, WebsiteProduct } from "@/types";
import type { CategoryMeta } from "@/lib/constants";
import { FilterBar } from "@/components/ui/FilterBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryBanner } from "@/components/ui/CategoryBanner";

const FILTER_OPTIONS = ["All", "Indica", "Sativa", "Hybrid"];

interface CategoryPageClientProps {
  category: ProductCategory;
  meta: CategoryMeta;
  products: WebsiteProduct[];
}

export function CategoryPageClient({
  category,
  meta,
  products,
}: CategoryPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by strain type
      if (activeFilter !== "All") {
        const strainMatch =
          product.strainType?.toLowerCase() === activeFilter.toLowerCase();
        if (!strainMatch) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesStrain =
          product.strainName?.toLowerCase().includes(q) ?? false;
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesStrain && !matchesBrand) return false;
      }

      return true;
    });
  }, [products, activeFilter, searchQuery]);

  return (
    <div className="py-24 px-6">
      {/* Category banner */}
      <CategoryBanner alt={meta.label} />

      {/* Filter + Search row */}
      <div className="flex flex-row gap-4 mb-6">
        <div className="shrink-0">
          <FilterBar
            options={FILTER_OPTIONS}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${meta.label.toLowerCase()}...`}
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-6">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
      </p>

      {/* Product grid or empty state */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              brand={product.brand}
              strainName={product.strainName ?? ""}
              strainType={
                (product.strainType as "indica" | "sativa" | "hybrid" | "cbd") ??
                "hybrid"
              }
              thcRange={product.thcRange}
              cbdRange={product.cbdRange}
              imageUrl={product.imageUrl}
              slug={product.slug}
              category={category}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl text-text-default mb-2">
            No products found
          </p>
          <p className="font-sans text-sm text-text-muted">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
