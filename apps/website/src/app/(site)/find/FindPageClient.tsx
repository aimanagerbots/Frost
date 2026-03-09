'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LocationSearch from '@/components/find/LocationSearch';
import ProductFilter from '@/components/find/ProductFilter';
import StoreListPanel from '@/components/find/StoreListPanel';
import { getStoresCarryingProduct } from '@/mocks/store-inventory';
import { haversineDistance } from '@/lib/map-config';
import type { DispensaryLocation, WebsiteProduct } from '@/types';

/* ---------- dynamic map import (no SSR) ---------- */

const FinderMap = dynamic(() => import('@/components/find/FinderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-white/30 text-sm">Loading map...</div>
    </div>
  ),
});

/* ---------- types ---------- */

interface FindPageClientProps {
  products: WebsiteProduct[];
  dispensaries: DispensaryLocation[];
}

interface StoreWithMeta {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  distance?: number;
  stockStatus?: string;
  categoriesCarried: string[];
}

/* ---------- component ---------- */

export default function FindPageClient({ products, dispensaries }: FindPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* --- state --- */
  const [selectedProduct, setSelectedProduct] = useState<string | null>(
    searchParams.get('product') ?? null,
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  /* --- derived: active location --- */
  const activeLocation = searchLocation ?? userLocation ?? null;

  /* --- product inventory lookup --- */
  const storeInventoryMap = useMemo(() => {
    if (!selectedProduct) return null;
    const entries = getStoresCarryingProduct(selectedProduct);
    const map = new Map<string, string>();
    for (const entry of entries) {
      map.set(entry.dispensaryId, entry.stockStatus);
    }
    return map;
  }, [selectedProduct]);

  /* --- selected product name for display --- */
  const selectedProductName = useMemo(() => {
    if (!selectedProduct) return null;
    const found = products.find((p) => p.slug === selectedProduct);
    return found?.name ?? null;
  }, [selectedProduct, products]);

  /* --- filter + sort stores --- */
  const filteredStores: StoreWithMeta[] = useMemo(() => {
    let stores: StoreWithMeta[] = dispensaries.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      lat: d.address.lat,
      lng: d.address.lng,
      address: {
        street: d.address.street,
        city: d.address.city,
        state: d.address.state,
        zip: d.address.zip,
      },
      categoriesCarried: d.categoriesCarried,
      distance: activeLocation
        ? haversineDistance(activeLocation.lat, activeLocation.lng, d.address.lat, d.address.lng)
        : undefined,
      stockStatus: storeInventoryMap ? storeInventoryMap.get(d.id) : undefined,
    }));

    /* filter by product if selected */
    if (storeInventoryMap) {
      stores = stores.filter((s) => storeInventoryMap.has(s.id));
    }

    /* sort by distance if we have a location */
    if (activeLocation) {
      stores = [...stores].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return stores;
  }, [dispensaries, activeLocation, storeInventoryMap]);

  /* --- map pins (just id, lat, lng, name, slug) --- */
  const mapPins = useMemo(
    () =>
      filteredStores.map((s) => ({
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        name: s.name,
        slug: s.slug,
      })),
    [filteredStores],
  );

  /* --- handlers --- */
  const handleLocationSelect = useCallback(
    (lat: number, lng: number, label: string) => {
      if (label === 'My Location') {
        setUserLocation({ lat, lng });
      } else {
        setSearchLocation({ lat, lng, label });
      }
      setFlyTo({ lat, lng, zoom: 10 });
    },
    [],
  );

  const handleProductSelect = useCallback(
    (slug: string | null) => {
      setSelectedProduct(slug);
      /* update URL search param without navigation */
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set('product', slug);
      } else {
        params.delete('product');
      }
      const qs = params.toString();
      router.replace(`/find${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePinClick = useCallback(
    (id: string) => {
      setSelectedStoreId(id);
      const store = filteredStores.find((s) => s.id === id);
      if (store) {
        router.push(`/find/${store.slug}`);
      }
    },
    [filteredStores, router],
  );

  const handlePinHover = useCallback((id: string | null) => {
    setHoveredStoreId(id);
  }, []);

  const handleCardClick = useCallback(
    (id: string) => {
      setSelectedStoreId(id);
      const store = filteredStores.find((s) => s.id === id);
      if (store) {
        setFlyTo({ lat: store.lat, lng: store.lng, zoom: 13 });
        router.push(`/find/${store.slug}`);
      }
    },
    [filteredStores, router],
  );

  const handleCardHover = useCallback((id: string | null) => {
    setHoveredStoreId(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* ═══ TOOLBAR ═══ */}
      <div className="flex-shrink-0 border-b border-white/5 bg-black/80 backdrop-blur-sm px-4 py-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* location search */}
          <div className="flex-1 min-w-0 lg:max-w-sm">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>

          {/* product filter */}
          <div className="flex-1 min-w-0 lg:max-w-xs">
            <ProductFilter
              products={products}
              selectedProduct={selectedProduct}
              onProductSelect={handleProductSelect}
            />
          </div>

          {/* store count badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-2.5">
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
                className="text-[#5BB8E6] flex-shrink-0"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm text-white/60">
                <span className="text-white/90 font-medium">{filteredStores.length}</span>{' '}
                store{filteredStores.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}

      {/* Desktop: side-by-side */}
      <div className="hidden lg:flex flex-1 min-h-0">
        {/* map */}
        <div className="flex-1 min-w-0">
          <FinderMap
            dispensaries={mapPins}
            selectedId={selectedStoreId}
            hoveredId={hoveredStoreId}
            onPinClick={handlePinClick}
            onPinHover={handlePinHover}
            flyTo={flyTo}
          />
        </div>

        {/* store list panel */}
        <div className="w-[420px] flex-shrink-0 border-l border-white/5 bg-black p-4 overflow-hidden">
          <StoreListPanel
            stores={filteredStores}
            hoveredId={hoveredStoreId}
            selectedId={selectedStoreId}
            onHover={handleCardHover}
            onClick={handleCardClick}
            productName={selectedProductName}
          />
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="flex flex-col lg:hidden flex-1 min-h-0">
        {/* map */}
        <div className="h-[50vh] flex-shrink-0">
          <FinderMap
            dispensaries={mapPins}
            selectedId={selectedStoreId}
            hoveredId={hoveredStoreId}
            onPinClick={handlePinClick}
            onPinHover={handlePinHover}
            flyTo={flyTo}
          />
        </div>

        {/* store list */}
        <div className="flex-1 overflow-y-auto p-4 bg-black">
          <StoreListPanel
            stores={filteredStores}
            hoveredId={hoveredStoreId}
            selectedId={selectedStoreId}
            onHover={handleCardHover}
            onClick={handleCardClick}
            productName={selectedProductName}
          />
        </div>
      </div>
    </div>
  );
}
