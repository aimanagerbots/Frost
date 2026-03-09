'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { getProductAvailability } from '@/mocks/store-inventory';
import type { WebsiteProduct, ProductAvailability, CartItem } from '@/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AllProductsGridProps {
  products: WebsiteProduct[];
  userLat?: number;
  userLng?: number;
}

type SortOption = 'nearest' | 'price-asc' | 'price-desc' | 'thc-desc';

const CATEGORIES = [
  'All',
  'Flower',
  'Pre-Rolls',
  'Vaporizers',
  'Concentrates',
  'Edibles',
  'Beverages',
] as const;

const CATEGORY_MAP: Record<string, string> = {
  'All': '',
  'Flower': 'flower',
  'Pre-Rolls': 'preroll',
  'Vaporizers': 'vaporizer',
  'Concentrates': 'concentrate',
  'Edibles': 'edible',
  'Beverages': 'beverage',
};

const STRAIN_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Indica', value: 'indica', color: '#8B5CF6' },
  { label: 'Sativa', value: 'sativa', color: '#F97316' },
  { label: 'Hybrid', value: 'hybrid', color: '#22C55E' },
  { label: 'CBD', value: 'cbd', color: '#5BB8E6' },
] as const;

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Nearest First', value: 'nearest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'THC: High to Low', value: 'thc-desc' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STOCK_DOT: Record<string, string> = {
  'in-stock': 'bg-green-500',
  'low-stock': 'bg-amber-500',
  'out-of-stock': 'bg-gray-500',
};

const STRAIN_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  indica: { bg: 'bg-[#8B5CF6]/15', text: 'text-[#8B5CF6]' },
  sativa: { bg: 'bg-[#F97316]/15', text: 'text-[#F97316]' },
  hybrid: { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  cbd: { bg: 'bg-[#5BB8E6]/15', text: 'text-[#5BB8E6]' },
};

const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower',
  preroll: 'Pre-Roll',
  vaporizer: 'Vaporizer',
  concentrate: 'Concentrate',
  edible: 'Edible',
  beverage: 'Beverage',
};

function parseTHC(thcRange: string): number {
  const match = thcRange.match(/(\d+(?:\.\d+)?)/g);
  if (!match) return 0;
  if (match.length >= 2) return parseFloat(match[1]);
  return parseFloat(match[0]);
}

/* ------------------------------------------------------------------ */
/*  ProductCard                                                        */
/* ------------------------------------------------------------------ */

interface ProductCardProps {
  product: WebsiteProduct;
  availability: ProductAvailability[];
  onAdd: (item: Omit<CartItem, 'quantity'>) => void;
}

function ProductCard({ product, availability, onAdd }: ProductCardProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* close picker on outside click */
  useEffect(() => {
    if (!showPicker) return;
    function handleClick(e: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  const inStockStores = availability.filter(
    (a) => a.stockStatus !== 'out-of-stock',
  );

  const displayPrice =
    inStockStores.length > 0
      ? inStockStores[0].price
      : availability.length > 0
        ? availability[0].price
        : product.price;

  const topStores = availability.slice(0, 3);
  const moreCount = Math.max(0, availability.length - 3);

  const strainBadge = product.strainType
    ? STRAIN_BADGE_COLORS[product.strainType]
    : null;

  const handleAddFromStore = useCallback(
    (store: ProductAvailability) => {
      onAdd({
        productSlug: product.slug,
        productName: product.name,
        category: product.category,
        brand: product.brand,
        price: store.price,
        storeId: store.dispensaryId,
        storeName: store.storeName,
        storeSlug: store.storeSlug,
        strainName: product.strainName,
        strainType: product.strainType,
        thcRange: product.thcRange,
        stockStatus: store.stockStatus,
      });
      setShowPicker(false);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1200);
    },
    [onAdd, product],
  );

  const handleAddClick = useCallback(() => {
    if (inStockStores.length === 0) return;
    if (inStockStores.length === 1) {
      handleAddFromStore(inStockStores[0]);
    } else {
      setShowPicker((prev) => !prev);
    }
  }, [inStockStores, handleAddFromStore]);

  return (
    <div className="bg-card rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.12] hover:bg-card-hover transition-all duration-200 flex flex-col">
      {/* badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
        {product.strainType && strainBadge && (
          <span
            className={`text-[11px] font-medium capitalize px-2 py-0.5 rounded-full ${strainBadge.bg} ${strainBadge.text}`}
          >
            {product.strainType}
          </span>
        )}
      </div>

      {/* name + brand */}
      <h3 className="font-display text-lg text-text-bright leading-tight">
        {product.name}
      </h3>
      <p className="text-sm text-text-muted mt-0.5">{product.brand}</p>

      {/* THC + flavor */}
      <div className="flex items-center gap-3 mt-3 text-xs text-text-default">
        <span className="font-medium">THC {product.thcRange}</span>
        {product.flavorNotes[0] && (
          <>
            <span className="text-white/20">|</span>
            <span className="text-text-muted">{product.flavorNotes[0]}</span>
          </>
        )}
      </div>

      {/* store availability */}
      <div className="mt-4 space-y-1.5 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
          Available at
        </p>
        {topStores.length === 0 && (
          <p className="text-xs text-text-muted italic">
            Not currently available
          </p>
        )}
        {topStores.map((store) => (
          <div
            key={store.dispensaryId}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STOCK_DOT[store.stockStatus]}`}
            />
            <span className="text-text-default truncate max-w-[140px]">
              {store.storeName}
            </span>
            {store.distance !== undefined && (
              <span className="text-text-muted ml-auto flex-shrink-0">
                {store.distance.toFixed(1)} mi
              </span>
            )}
          </div>
        ))}
        {moreCount > 0 && (
          <p className="text-[11px] text-text-muted">
            +{moreCount} more store{moreCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* price + add button */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
        <span className="text-lg font-display text-text-bright">
          ${displayPrice.toFixed(2)}
        </span>

        <div className="relative">
          {addedFeedback ? (
            <span className="text-sm font-medium text-green-400 px-4 py-1.5">
              Added!
            </span>
          ) : (
            <button
              ref={buttonRef}
              type="button"
              onClick={handleAddClick}
              disabled={inStockStores.length === 0}
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-[#5BB8E6]/10 text-[#5BB8E6] hover:bg-[#5BB8E6]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              + Add
            </button>
          )}

          {/* store picker popover */}
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute right-0 bottom-full mb-2 w-64 bg-[#0A0A0F] border border-white/[0.1] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <p className="text-[11px] uppercase tracking-wider text-text-muted px-4 pt-3 pb-2">
                Pick a store
              </p>
              <div className="max-h-48 overflow-y-auto">
                {inStockStores.map((store) => (
                  <button
                    key={store.dispensaryId}
                    type="button"
                    onClick={() => handleAddFromStore(store)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STOCK_DOT[store.stockStatus]}`}
                    />
                    <span className="text-sm text-text-default truncate flex-1">
                      {store.storeName}
                    </span>
                    {store.distance !== undefined && (
                      <span className="text-xs text-text-muted flex-shrink-0">
                        {store.distance.toFixed(1)} mi
                      </span>
                    )}
                    <span className="text-sm text-text-bright font-medium flex-shrink-0">
                      ${store.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AllProductsGrid                                                    */
/* ------------------------------------------------------------------ */

export function AllProductsGrid({
  products,
  userLat,
  userLng,
}: AllProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStrainType, setActiveStrainType] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(
    userLat !== undefined ? 'nearest' : 'price-asc',
  );

  const addItem = useOrderStore((s) => s.addItem);

  /* ── availability map: productSlug → ProductAvailability[] ── */
  const availabilityMap = useMemo(() => {
    const map = new Map<string, ProductAvailability[]>();
    for (const product of products) {
      map.set(
        product.slug,
        getProductAvailability(product.slug, userLat, userLng),
      );
    }
    return map;
  }, [products, userLat, userLng]);

  /* ── filter ── */
  const filteredProducts = useMemo(() => {
    let result = products;

    /* category filter */
    const catKey = CATEGORY_MAP[activeCategory];
    if (catKey) {
      result = result.filter((p) => p.category === catKey);
    }

    /* strain type filter */
    if (activeStrainType) {
      result = result.filter((p) => p.strainType === activeStrainType);
    }

    return result;
  }, [products, activeCategory, activeStrainType]);

  /* ── sort ── */
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'nearest': {
        sorted.sort((a, b) => {
          const aStores = availabilityMap.get(a.slug) ?? [];
          const bStores = availabilityMap.get(b.slug) ?? [];
          const aDist = aStores[0]?.distance ?? Infinity;
          const bDist = bStores[0]?.distance ?? Infinity;
          return aDist - bDist;
        });
        break;
      }
      case 'price-asc': {
        sorted.sort((a, b) => {
          const aStores = availabilityMap.get(a.slug) ?? [];
          const bStores = availabilityMap.get(b.slug) ?? [];
          const aPrice = aStores[0]?.price ?? a.price;
          const bPrice = bStores[0]?.price ?? b.price;
          return aPrice - bPrice;
        });
        break;
      }
      case 'price-desc': {
        sorted.sort((a, b) => {
          const aStores = availabilityMap.get(a.slug) ?? [];
          const bStores = availabilityMap.get(b.slug) ?? [];
          const aPrice = aStores[0]?.price ?? a.price;
          const bPrice = bStores[0]?.price ?? b.price;
          return bPrice - aPrice;
        });
        break;
      }
      case 'thc-desc': {
        sorted.sort((a, b) => parseTHC(b.thcRange) - parseTHC(a.thcRange));
        break;
      }
    }

    return sorted;
  }, [filteredProducts, sortBy, availabilityMap]);

  return (
    <div className="space-y-6">
      {/* ═══ FILTER BAR ═══ */}
      <div className="space-y-3">
        {/* category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeCategory === cat
                  ? 'bg-[#5BB8E6] text-black'
                  : 'bg-white/[0.06] text-text-default hover:bg-white/[0.1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* strain type pills + sort */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {STRAIN_TYPES.map((st) => {
              const isActive = activeStrainType === st.value;
              const color = 'color' in st ? st.color : '#5BB8E6';
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setActiveStrainType(st.value)}
                  className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${color}20`,
                          color: color,
                          borderWidth: 1,
                          borderColor: `${color}40`,
                        }
                      : {
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: 'rgba(255,255,255,0.5)',
                        }
                  }
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="flex-shrink-0 text-xs bg-white/[0.06] text-text-default border border-white/[0.06] rounded-lg px-3 py-1.5 outline-none focus:border-[#5BB8E6]/40 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.value === 'nearest' && userLat === undefined}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ═══ RESULTS COUNT ═══ */}
      <p className="text-xs text-text-muted">
        {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
      </p>

      {/* ═══ PRODUCT GRID ═══ */}
      {sortedProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-muted text-sm">
            No products match your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setActiveStrainType('');
            }}
            className="mt-3 text-sm text-[#5BB8E6] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              availability={availabilityMap.get(product.slug) ?? []}
              onAdd={addItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
