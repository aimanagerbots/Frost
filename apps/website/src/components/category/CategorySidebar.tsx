"use client";

import { useState } from "react";
import type { ProductCategory } from "@frost/types";
import { CATEGORY_FORMAT_FILTERS, EFFECT_FILTERS, PRICE_RANGE_FILTERS } from "@/lib/constants";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

interface CategorySidebarProps {
  category: ProductCategory;
  brands: string[];
  activeFormats: string[];
  activeBrands: string[];
  activeEffects: string[];
  activePriceRange: number | null;
  onFormatsChange: (formats: string[]) => void;
  onBrandsChange: (brands: string[]) => void;
  onEffectsChange: (effects: string[]) => void;
  onPriceRangeChange: (index: number | null) => void;
  onClearAll: () => void;
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-default pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-xs uppercase tracking-wider text-text-muted hover:text-text-default transition-colors"
      >
        {title}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-2 space-y-1.5">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "bg-accent-primary border-accent-primary"
            : "border-border-hover bg-transparent group-hover:border-text-muted"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-black">
            <path
              d="M2 6l3 3 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm text-text-default group-hover:text-text-default transition-colors">
        {label}
      </span>
    </label>
  );
}

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function CategorySidebar({
  category,
  brands,
  activeFormats,
  activeBrands,
  activeEffects,
  activePriceRange,
  onFormatsChange,
  onBrandsChange,
  onEffectsChange,
  onPriceRangeChange,
  onClearAll,
}: CategorySidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const formats = CATEGORY_FORMAT_FILTERS[category];
  const hasActiveFilters =
    activeFormats.length > 0 ||
    activeBrands.length > 0 ||
    activeEffects.length > 0 ||
    activePriceRange !== null;

  const sidebarContent = (
    <div className="space-y-1">
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="mb-3 flex items-center gap-1.5 text-xs text-accent-primary hover:text-text-default transition-colors"
        >
          <X className="h-3 w-3" />
          Clear all filters
        </button>
      )}

      <FilterSection title="Format">
        {formats.map((f) => (
          <Checkbox
            key={f.slug}
            label={f.label}
            checked={activeFormats.includes(f.slug)}
            onChange={() => onFormatsChange(toggleItem(activeFormats, f.slug))}
          />
        ))}
      </FilterSection>

      {brands.length > 1 && (
        <FilterSection title="Brand">
          {brands.map((b) => (
            <Checkbox
              key={b}
              label={b}
              checked={activeBrands.includes(b)}
              onChange={() => onBrandsChange(toggleItem(activeBrands, b))}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Effects" defaultOpen={false}>
        {EFFECT_FILTERS.map((e) => (
          <Checkbox
            key={e}
            label={e}
            checked={activeEffects.includes(e)}
            onChange={() => onEffectsChange(toggleItem(activeEffects, e))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price" defaultOpen={false}>
        {PRICE_RANGE_FILTERS.map((pr, idx) => (
          <label key={pr.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                activePriceRange === idx
                  ? "border-accent-primary"
                  : "border-border-hover bg-transparent group-hover:border-text-muted"
              }`}
            >
              {activePriceRange === idx && (
                <span className="h-2 w-2 rounded-full bg-accent-primary" />
              )}
            </span>
            <span className="text-sm text-text-default">{pr.label}</span>
          </label>
        ))}
        {activePriceRange !== null && (
          <button
            type="button"
            onClick={() => onPriceRangeChange(null)}
            className="text-xs text-text-muted hover:text-text-default mt-1"
          >
            Clear price filter
          </button>
        )}
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-muted hover:text-text-default hover:border-border-hover transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-[10px] text-black font-medium">
            {activeFormats.length + activeBrands.length + activeEffects.length + (activePriceRange !== null ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border-default p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-text-default">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 text-text-muted hover:text-text-default"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-28 rounded-xl border border-border-default bg-card p-5">
          <h2 className="font-display text-sm text-text-default mb-4">Filters</h2>
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
