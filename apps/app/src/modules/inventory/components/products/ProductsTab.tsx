'use client';

import { useState } from 'react';
import { Plus, Search, ChevronDown, Package } from 'lucide-react';
import { useProducts } from '@/modules/inventory/hooks';
import { LoadingSkeleton, EmptyState, CategoryChip } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
import { INVENTORY_TYPE_LABELS } from '@/modules/inventory/types';
import type { Product, ProductFilterTab } from '@/modules/inventory/types';
import { ProductDetailDrawer } from './ProductDetailDrawer';

const ACCENT = '#8B5CF6';

const FILTER_TABS: { id: ProductFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'available-for-sale', label: 'Available For Sale' },
  { id: 'not-for-sale', label: 'Not For Sale' },
  { id: 'active', label: 'Active' },
  { id: 'discontinued', label: 'Discontinued' },
];

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const hasStock = product.totalInStock > 0;
  const isForSale = product.availableForSale > 0;

  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-xl border border-default bg-card text-left transition-all hover:-translate-y-0.5 hover:border-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/5 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40"
    >
      {/* Stock indicator strip */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl transition-colors"
        style={{
          backgroundColor: !hasStock ? '#ef444440' : isForSale ? '#8B5CF640' : '#f59e0b40',
          opacity: 1,
        }}
      />
      {/* Colored top accent on hover */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: ACCENT }}
      />

      <div className="p-4">
        {/* Product image placeholder */}
        <div
          className="mb-3 flex h-16 items-center justify-center rounded-lg border border-default"
          style={{
            background: hasStock
              ? 'linear-gradient(135deg, #8B5CF610, #8B5CF605)'
              : 'rgba(255,255,255,0.02)',
          }}
        >
          <Package
            size={24}
            style={{ color: hasStock ? ACCENT : 'var(--color-text-muted)' }}
            className="opacity-60"
          />
        </div>

        {/* Category + type */}
        <div className="mb-2 flex items-center justify-between gap-1">
          <CategoryChip category={product.category} />
          <span className="truncate text-right text-[10px] text-text-muted">
            {INVENTORY_TYPE_LABELS[product.inventoryType] ?? `Type ${product.inventoryType}`}
          </span>
        </div>

        {/* Product name */}
        <p className="mb-1 line-clamp-2 text-xs font-semibold leading-tight text-text-default">
          {product.name}
        </p>
        <p className="mb-3 text-[10px] text-text-muted">{product.packageSize}</p>

        {/* Cannabinoid values */}
        {product.qaValues.total > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-elevated p-2">
            <div className="text-center">
              <div className="text-[10px] text-text-muted">THC</div>
              <div className="text-xs font-semibold tabular-nums" style={{ color: ACCENT }}>
                {product.qaValues.thc.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-text-muted">CBD</div>
              <div className="text-xs font-semibold tabular-nums text-text-default">
                {product.qaValues.cbd.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-text-muted">THCA</div>
              <div className="text-xs tabular-nums text-text-muted">
                {product.qaValues.thca.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-text-muted">Total</div>
              <div className="text-xs tabular-nums text-text-muted">
                {product.qaValues.total.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Stock counts */}
        <div className="space-y-1 border-t border-default pt-3">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">For Sale</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: isForSale ? '#22c55e' : 'var(--color-text-muted)' }}
            >
              {product.availableForSale}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">Allocated</span>
            <span className="tabular-nums text-text-default">{product.allocated}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">On Hold</span>
            <span className="tabular-nums text-text-default">{product.onHold}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">Total</span>
            <span className="font-semibold tabular-nums text-text-default">{product.totalInStock}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-3">
          <InvStatusBadge status={product.status} />
        </div>
      </div>
    </button>
  );
}

export function ProductsTab() {
  const [activeFilter, setActiveFilter] = useState<ProductFilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useProducts({
    tab: activeFilter,
    search: search || undefined,
  });

  if (isLoading) return <LoadingSkeleton variant="card" />;

  const filtered = products;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={
                activeFilter === tab.id
                  ? { backgroundColor: ACCENT + '20', color: ACCENT }
                  : { color: 'var(--color-text-muted)' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + create */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter products…"
              className="h-8 rounded-lg border border-default bg-card pl-8 pr-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
          <button
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus size={14} />
            Create
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Card grid */}
      {!filtered?.length ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Adjust your filters or create a new product."
          accentColor={ACCENT}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Detail drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
