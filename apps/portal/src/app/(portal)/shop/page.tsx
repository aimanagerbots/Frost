'use client';

import { useState, useMemo, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalProducts, usePortalCart } from '@/modules/portal/shared/hooks';
import type { PortalProduct } from '@/modules/portal/shared/types';
import {
  ShopPromoBanner,
  ShopSearchBar,
  ShopSortControls,
  ShopCategoryGrid,
  ShopFilterSidebar,
  ShopProductList,
  ShopProductDetail,
  ShopTemplates,
  ShopSaveTemplateModal,
  ShopSmartReorder,
  ShopPreviouslyOrdered,
  ShopCheckout,
} from '@/modules/portal/shop/components';
import type { ShopFilters } from '@/modules/portal/shop/components/ShopFilterSidebar';
import { DEFAULT_SHOP_FILTERS } from '@/modules/portal/shop/components/ShopFilterSidebar';
import type { ShopSortOption } from '@/modules/portal/shop/components/ShopSortControls';

export default function ShopPage() {
  const { currentAccount } = usePortalAuth();
  const { data: products, isLoading } = usePortalProducts(currentAccount?.id);
  const cart = usePortalCart();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ShopSortOption>('popular');
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_SHOP_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<PortalProduct | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.strainName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.size > 0) {
      result = result.filter((p) => filters.categories.has(p.category));
    }

    // Strain type filter
    if (filters.strainTypes.size > 0) {
      result = result.filter((p) => filters.strainTypes.has(p.strainType));
    }

    // THC range
    result = result.filter(
      (p) => p.thcMax >= filters.thcMin && p.thcMin <= filters.thcMax
    );

    // In stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // On promotion
    if (filters.onPromotion) {
      result = result.filter((p) => p.promotionId);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [products, search, sort, filters]);

  const handleAddToCart = useCallback(
    (product: PortalProduct) => {
      cart.addItem(product);
    },
    [cart]
  );

  // Checkout is a modal/overlay
  // Rendered at the bottom of the component tree

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={ShoppingCart}
        title="Shop"
        subtitle="Browse wholesale inventory and place orders"
        actions={
          <div className="flex items-center gap-2">
            <ShopTemplates onOpenSaveModal={() => setShowSaveTemplate(true)} />
            {cart.totalItems() > 0 && (
              <button
                onClick={() => setShowCheckout(true)}
                className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary-hover transition-colors"
              >
                Checkout ({cart.totalItems()})
              </button>
            )}
          </div>
        }
      />

      {/* Promo Banner */}
      <ShopPromoBanner />

      {/* Smart Reorder + Previously Ordered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShopSmartReorder />
        <ShopPreviouslyOrdered />
      </div>

      {/* Category Grid */}
      <ShopCategoryGrid
        products={products ?? []}
        selectedCategory={filters.categories.size === 1 ? ([...filters.categories][0] as PortalProduct['category']) : null}
        onSelectCategory={(cat) => {
          if (cat) {
            setFilters({ ...filters, categories: new Set([cat]) });
          } else {
            setFilters({ ...filters, categories: new Set() });
          }
        }}
      />

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <ShopSearchBar value={search} onChange={setSearch} />
        </div>
        <ShopSortControls value={sort} onChange={setSort} />
      </div>

      {/* Filter sidebar + Product grid */}
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 shrink-0">
          <ShopFilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="flex-1">
          <ShopProductList
            products={filteredProducts}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Product detail drawer */}
      <ShopProductDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Save template modal */}
      <ShopSaveTemplateModal
        isOpen={showSaveTemplate}
        onClose={() => setShowSaveTemplate(false)}
        onSave={(name) => {
          cart.saveAsTemplate(name);
          setShowSaveTemplate(false);
        }}
      />

      {/* Checkout modal */}
      <ShopCheckout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </div>
  );
}
