'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useOrderStore } from '@/stores/order-store';
import { AllProductsGrid } from '@/components/order/AllProductsGrid';
import { LocationBar } from '@/components/order/LocationBar';
import { PromoBanner } from '@/components/order/PromoBanner';
import { CartBadge } from '@/components/order/CartBadge';
import { ConciergeFAB } from '@/components/order/ConciergeFAB';
import StoreListPanel from '@/components/find/StoreListPanel';
import { getStoresCarryingProduct } from '@/mocks/store-inventory';
import { haversineDistance } from '@/lib/map-config';
import type { DispensaryLocation, WebsiteProduct } from '@/types';
import { useState } from 'react';

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

interface OrderBrowseClientProps {
  products: WebsiteProduct[];
  dispensaries: DispensaryLocation[];
}

export interface StoreWithMeta {
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
  region: string;
  phone?: string;
  hours?: string;
  featuredDeal?: string;
  distance?: number;
  stockStatus?: string;
  categoriesCarried: string[];
}

/* ---------- component ---------- */

export function OrderBrowseClient({ products, dispensaries }: OrderBrowseClientProps) {
  const router = useRouter();
  const { browseMode, userLocation, mapBounds } = useOrderStore();

  /* --- by-store mode state --- */
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mobileShowList, setMobileShowList] = useState(false);

  /* --- fly to user location when it changes (address search or geolocation) --- */
  useEffect(() => {
    if (userLocation) {
      setFlyTo({ lat: userLocation.lat, lng: userLocation.lng, zoom: 10 });
    }
  }, [userLocation]);

  /* --- derived --- */
  const activeLocation = userLocation ?? null;

  const allRegions = useMemo(() => {
    const regions = new Set(dispensaries.map((d) => d.region));
    return Array.from(regions).sort();
  }, [dispensaries]);

  const storeInventoryMap = useMemo(() => {
    if (!selectedProduct) return null;
    const entries = getStoresCarryingProduct(selectedProduct);
    const map = new Map<string, string>();
    for (const entry of entries) {
      map.set(entry.dispensaryId, entry.stockStatus);
    }
    return map;
  }, [selectedProduct]);

  const selectedProductName = useMemo(() => {
    if (!selectedProduct) return null;
    return products.find((p) => p.slug === selectedProduct)?.name ?? null;
  }, [selectedProduct, products]);

  /* Base filtered stores — used for map pins (no viewport bounds filter) */
  const baseFilteredStores: StoreWithMeta[] = useMemo(() => {
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
      region: d.region,
      phone: d.phone,
      hours: d.hours,
      featuredDeal: d.featuredDeal,
      distance: activeLocation
        ? haversineDistance(activeLocation.lat, activeLocation.lng, d.address.lat, d.address.lng)
        : undefined,
      stockStatus: storeInventoryMap ? storeInventoryMap.get(d.id) : undefined,
      categoriesCarried: d.categoriesCarried,
    }));

    if (storeInventoryMap) {
      stores = stores.filter((s) => storeInventoryMap.has(s.id));
    }
    if (selectedRegion) {
      stores = stores.filter((s) => s.region === selectedRegion);
    }
    if (activeLocation) {
      stores = [...stores].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    return stores;
  }, [dispensaries, activeLocation, storeInventoryMap, selectedRegion]);

  /* Sidebar stores — further filtered by map viewport bounds */
  const sidebarStores: StoreWithMeta[] = useMemo(() => {
    if (!mapBounds) return baseFilteredStores;
    return baseFilteredStores.filter(
      (s) =>
        s.lat >= mapBounds.south &&
        s.lat <= mapBounds.north &&
        s.lng >= mapBounds.west &&
        s.lng <= mapBounds.east,
    );
  }, [baseFilteredStores, mapBounds]);

  /* Map pins — from base filtered stores (no bounds filter to avoid feedback loop) */
  const mapPins = useMemo(
    () =>
      baseFilteredStores.map((s) => ({
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        name: s.name,
        slug: s.slug,
        address: s.address,
        hours: s.hours,
        phone: s.phone,
        featuredDeal: s.featuredDeal,
        distance: s.distance,
        categoriesCarried: s.categoriesCarried,
      })),
    [baseFilteredStores],
  );

  /* --- handlers --- */
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        useOrderStore.getState().setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'My Location',
        });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  const handleProductSelect = useCallback(
    (slug: string | null) => {
      setSelectedProduct(slug);
    },
    [],
  );

  const handlePinClick = useCallback((id: string) => setSelectedStoreId(id), []);
  const handlePinHover = useCallback((id: string | null) => setHoveredStoreId(id), []);

  const handleCardClick = useCallback(
    (id: string) => {
      setSelectedStoreId(id);
      const store = baseFilteredStores.find((s) => s.id === id);
      if (store) setFlyTo({ lat: store.lat, lng: store.lng, zoom: 13 });
    },
    [baseFilteredStores],
  );

  const handleCardHover = useCallback((id: string | null) => setHoveredStoreId(id), []);

  const handleStoreNavigate = useCallback(
    (slug: string) => router.push(`/order/store/${slug}`),
    [router],
  );

  const handleRegionSelect = useCallback(
    (region: string | null) => {
      setSelectedRegion(region);
      if (region) {
        const store = dispensaries.find((d) => d.region === region);
        if (store) setFlyTo({ lat: store.address.lat, lng: store.address.lng, zoom: 9 });
      }
    },
    [dispensaries],
  );

  const handleBoundsChange = useCallback(
    (bounds: { north: number; south: number; east: number; west: number }) => {
      useOrderStore.getState().setMapBounds(bounds);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-base">
      {/* ═══ PROMO BANNER ═══ */}
      <PromoBanner text="Find your Frost" />

      {/* ═══ CONTENT ═══ */}
      {browseMode === 'all-products' ? (
        /* ── ALL PRODUCTS MODE ── */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="py-4">
            <LocationBar />
          </div>
          <AllProductsGrid
            products={products}
            userLat={userLocation?.lat}
            userLng={userLocation?.lng}
          />
        </div>
      ) : (
        /* ── BY STORE MODE ── */
        <div id="store-finder">
          {/* LocationBar aligned with map left edge */}
          <div className="flex px-3 py-3 gap-3">
            <div className="hidden lg:block w-[420px] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <LocationBar />
            </div>
          </div>

          {/* Sidebar + Map flush */}
          <div className="flex px-3 pb-3 gap-3" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col w-[420px] flex-shrink-0 rounded-2xl border-2 border-white/[0.08] bg-[#050508] overflow-hidden">
              <StoreListPanel
                stores={sidebarStores}
                hoveredId={hoveredStoreId}
                selectedId={selectedStoreId}
                onHover={handleCardHover}
                onClick={handleCardClick}
                onNavigate={handleStoreNavigate}
                productName={selectedProductName}
                products={products}
                selectedProduct={selectedProduct}
                onProductSelect={handleProductSelect}
                onUseMyLocation={handleUseMyLocation}
                hasLocation={activeLocation !== null}
                regions={allRegions}
                selectedRegion={selectedRegion}
                onRegionSelect={handleRegionSelect}
              />
            </div>

            {/* Map */}
            <div className="flex-1 min-w-0 relative rounded-2xl border-2 border-white/[0.08] overflow-hidden">
              <FinderMap
                dispensaries={mapPins}
                selectedId={selectedStoreId}
                hoveredId={hoveredStoreId}
                onPinClick={handlePinClick}
                onPinHover={handlePinHover}
                onNavigate={handleStoreNavigate}
                flyTo={flyTo}
                onBoundsChange={handleBoundsChange}
              />

              {/* Mobile bottom sheet */}
              <div className="lg:hidden absolute bottom-0 left-0 right-0">
                {mobileShowList ? (
                  <div className="bg-[#050508] border-t border-white/[0.06] rounded-t-2xl max-h-[60vh] flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileShowList(false)}
                      className="flex items-center justify-center py-3 gap-2 text-sm text-white/50 hover:text-white/70 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                      Hide stores
                    </button>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                      <StoreListPanel
                        stores={sidebarStores}
                        hoveredId={hoveredStoreId}
                        selectedId={selectedStoreId}
                        onHover={handleCardHover}
                        onClick={handleCardClick}
                        onNavigate={handleStoreNavigate}
                        productName={selectedProductName}
                        products={products}
                        selectedProduct={selectedProduct}
                        onProductSelect={handleProductSelect}
                        onUseMyLocation={handleUseMyLocation}
                        hasLocation={activeLocation !== null}
                        regions={allRegions}
                        selectedRegion={selectedRegion}
                        onRegionSelect={handleRegionSelect}
                        compact
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMobileShowList(true)}
                    className="w-full bg-[#050508]/95 backdrop-blur-sm border-t border-white/[0.06] rounded-t-2xl py-4 px-6 flex items-center justify-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                    <span className="text-sm font-medium">
                      {sidebarStores.length} store{sidebarStores.length !== 1 ? 's' : ''} nearby
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CART BADGE + CONCIERGE (CartDrawer is in site layout) ═══ */}
      <CartBadge />
      <ConciergeFAB />
    </div>
  );
}
