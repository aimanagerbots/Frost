'use client';

import { useMemo } from 'react';
import FinderStoreCard from '@/components/find/FinderStoreCard';
import ProductFilter from '@/components/find/ProductFilter';
import type { StoreWithMeta } from '@/app/(site)/order/OrderBrowseClient';

interface StoreListPanelProps {
  stores: StoreWithMeta[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onNavigate: (slug: string) => void;
  productName?: string | null;
  products: { slug: string; name: string; category: string }[];
  selectedProduct: string | null;
  onProductSelect: (slug: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUseMyLocation: () => void;
  hasLocation: boolean;
  regions: string[];
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  compact?: boolean;
}

export default function StoreListPanel({
  stores,
  hoveredId,
  selectedId,
  onHover,
  onClick,
  onNavigate,
  productName,
  products,
  selectedProduct,
  onProductSelect,
  searchQuery,
  onSearchChange,
  onUseMyLocation,
  hasLocation,
  regions,
  selectedRegion,
  onRegionSelect,
  compact,
}: StoreListPanelProps) {
  const storeCount = stores.length;

  /* region counts for badges */
  const regionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const store of stores) {
      counts.set(store.region, (counts.get(store.region) ?? 0) + 1);
    }
    return counts;
  }, [stores]);

  return (
    <div className="flex flex-col h-full">
      {/* ═══ SEARCH & FILTERS ═══ */}
      {!compact && (
        <div className="flex-shrink-0 p-4 space-y-3 border-b border-white/[0.06]">
          {/* Search input */}
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by store name, city, or address..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white/90 text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#5BB8E6]/40 focus:border-[#5BB8E6]/30 transition-all"
            />
          </div>

          {/* Use my location button */}
          <button
            type="button"
            onClick={onUseMyLocation}
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              hasLocation
                ? 'bg-[#5BB8E6]/10 border border-[#5BB8E6]/20 text-[#5BB8E6]'
                : 'bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-[#5BB8E6] hover:border-[#5BB8E6]/20 hover:bg-[#5BB8E6]/5'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
            {hasLocation ? 'Location active — sorting by distance' : 'Use my location'}
          </button>

          {/* Product filter */}
          <ProductFilter
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
          />
        </div>
      )}

      {/* ═══ REGION PILLS ═══ */}
      {!compact && (
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06]">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <button
              type="button"
              onClick={() => onRegionSelect(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !selectedRegion
                  ? 'bg-[#5BB8E6]/15 text-[#5BB8E6] border border-[#5BB8E6]/25'
                  : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60 hover:border-white/[0.1]'
              }`}
            >
              All regions
            </button>
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => onRegionSelect(selectedRegion === region ? null : region)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedRegion === region
                    ? 'bg-[#5BB8E6]/15 text-[#5BB8E6] border border-[#5BB8E6]/25'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60 hover:border-white/[0.1]'
                }`}
              >
                {region}
                {regionCounts.has(region) && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {regionCounts.get(region)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ RESULTS HEADER ═══ */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-white/40">
          <span className="text-white/80 font-medium">{storeCount}</span>{' '}
          {productName
            ? `store${storeCount !== 1 ? 's' : ''} carry `
            : `store${storeCount !== 1 ? 's' : ''}`}
          {productName && (
            <span className="text-[#5BB8E6]">{productName}</span>
          )}
        </p>
        {(searchQuery || selectedRegion || selectedProduct) && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onRegionSelect(null);
              onProductSelect(null);
            }}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ═══ STORE LIST ═══ */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(91,184,230,0.2) transparent',
        }}
      >
        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/15"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="text-sm text-white/40 font-medium">No stores found</p>
            <p className="text-xs text-white/20 mt-1.5 max-w-[240px]">
              Try adjusting your search, changing the region filter, or clearing all filters
            </p>
          </div>
        ) : (
          stores.map((store, index) => (
            <FinderStoreCard
              key={store.id}
              store={store}
              isHovered={hoveredId === store.id}
              isSelected={selectedId === store.id}
              index={index}
              onHover={onHover}
              onClick={onClick}
              onNavigate={onNavigate}
            />
          ))
        )}
      </div>
    </div>
  );
}
