"use client";

import { useState, useMemo } from "react";
import type { ProductCategory, WebsiteProduct } from "@/types";
import type { CategoryMeta } from "@/lib/constants";
import { CATEGORY_ROUTE_MAP, PRICE_RANGE_FILTERS } from "@/lib/constants";
import { FilterBar } from "@/components/ui/FilterBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { ProductTileCard } from "@/components/ui/ProductTileCard";
import { CategoryBanner } from "@/components/ui/CategoryBanner";
import { CategorySidebar } from "@/components/category/CategorySidebar";

const STRAIN_FILTER_OPTIONS = ["All", "Indica", "Sativa", "Hybrid", "CBD"];

interface CategoryBrowseClientProps {
  category: ProductCategory;
  meta: CategoryMeta;
  products: WebsiteProduct[];
  brands: string[];
}

export function CategoryBrowseClient({
  category,
  meta,
  products,
  brands,
}: CategoryBrowseClientProps) {
  const categoryRoute = CATEGORY_ROUTE_MAP[category];

  /* ── Filter state ── */
  const [strainFilter, setStrainFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);

  const clearAll = () => {
    setActiveFormats([]);
    setActiveBrands([]);
    setActiveEffects([]);
    setActivePriceRange(null);
  };

  /* ── Filtered products ── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Strain type
      if (strainFilter !== "All") {
        const type = p.strainType?.toLowerCase() ?? "";
        if (type !== strainFilter.toLowerCase()) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.strainName?.toLowerCase().includes(q) ?? false) &&
          !p.brand.toLowerCase().includes(q)
        )
          return false;
      }

      // Format (matches subCategory slug)
      if (activeFormats.length > 0) {
        const sub = p.subCategory?.toLowerCase() ?? "";
        if (!activeFormats.some((f) => sub.includes(f.toLowerCase()))) return false;
      }

      // Brand
      if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) return false;

      // Effects (must match ALL selected)
      if (activeEffects.length > 0) {
        const pe = p.effects.map((e) => e.toLowerCase());
        if (!activeEffects.every((e) => pe.includes(e.toLowerCase()))) return false;
      }

      // Price range
      if (activePriceRange !== null) {
        const range = PRICE_RANGE_FILTERS[activePriceRange];
        if (p.price < range.min || p.price >= range.max) return false;
      }

      return true;
    });
  }, [products, strainFilter, searchQuery, activeFormats, activeBrands, activeEffects, activePriceRange]);

  const sidebarProps = {
    category,
    brands,
    activeFormats,
    activeBrands,
    activeEffects,
    activePriceRange,
    onFormatsChange: setActiveFormats,
    onBrandsChange: setActiveBrands,
    onEffectsChange: setActiveEffects,
    onPriceRangeChange: setActivePriceRange,
    onClearAll: clearAll,
  };

  return (
    <>
      {/* Category banner */}
      <CategoryBanner alt={meta.label} />

      {/* Filter bar + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <div className="shrink-0">
          <FilterBar options={STRAIN_FILTER_OPTIONS} active={strainFilter} onChange={setStrainFilter} />
        </div>
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={`Search ${meta.label.toLowerCase()}...`} />
        </div>
      </div>

      {/* Count + mobile filter button */}
      <div className="flex items-center gap-4 mb-6">
        <p className="text-sm text-text-muted">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        {/* Mobile filter toggle lives inside CategorySidebar */}
        <div className="lg:hidden">
          <CategorySidebar {...sidebarProps} />
        </div>
      </div>

      {/* Sidebar + Grid */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar {...sidebarProps} />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => (
                <ProductTileCard
                  key={p.id}
                  slug={p.slug}
                  categoryRoute={categoryRoute}
                  name={p.name}
                  imageUrl={p.imageUrl}
                  strainName={p.strainName}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  thcRange={p.thcRange}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-2xl text-text-default mb-2">No products found</p>
              <p className="text-sm text-text-muted">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
