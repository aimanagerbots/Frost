'use client';

import { useState } from 'react';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { DataTable, LoadingSkeleton, EmptyState, CategoryChip } from '@/components';
import type { ProductCategory } from '@/components';
import { useCatalog } from '../hooks';
import { AddToCartModal } from './AddToCartModal';
import type { CatalogProduct } from '@/modules/sales/types';

const ACCENT = '#F59E0B';

const VALID_CATEGORIES = new Set<string>([
  'flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage',
]);

interface CatalogDetailProps {
  catalogId: string | null;
}

export function CatalogDetail({ catalogId }: CatalogDetailProps) {
  const { data: catalog, isLoading } = useCatalog(catalogId);
  const [cartProduct, setCartProduct] = useState<CatalogProduct | null>(null);

  if (!catalogId) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Select a Catalog"
        description="Choose a catalog from the list to view its products."
        accentColor={ACCENT}
      />
    );
  }

  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (!catalog) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Catalog Not Found"
        description="The selected catalog could not be loaded."
        accentColor={ACCENT}
      />
    );
  }

  const handleAddToCart = (_productId: string, _quantity: number) => {
    // In a real app, this would dispatch to a cart store / API
    // For now, just close the modal (mock behavior)
  };

  type ProductRow = CatalogProduct & Record<string, unknown>;
  const tableData: ProductRow[] = catalog.products.map((p) => ({ ...p }));

  const columns = [
    {
      header: 'Product',
      accessor: 'name' as const,
      sortable: true,
      render: (row: ProductRow) => (
        <span className="font-medium text-text-bright">{row.name}</span>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
      render: (row: ProductRow) =>
        VALID_CATEGORIES.has(row.category) ? (
          <CategoryChip category={row.category as ProductCategory} />
        ) : (
          <span className="text-text-muted text-xs">{row.category}</span>
        ),
    },
    {
      header: 'Strain',
      accessor: 'strain' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Price',
      accessor: 'price' as const,
      sortable: true,
      render: (row: ProductRow) => (
        <span className="font-medium">${Number(row.price).toFixed(2)}</span>
      ),
    },
    {
      header: 'Available',
      accessor: 'available' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: ProductRow) => {
        const avail = Number(row.available);
        return (
          <span className={avail === 0 ? 'text-red-400' : 'text-text-default'}>
            {avail}
          </span>
        );
      },
    },
    {
      header: '',
      accessor: 'id' as const,
      render: (row: ProductRow) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCartProduct(row as unknown as CatalogProduct);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Catalog title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-bright">{catalog.name}</h2>
          <p className="text-sm text-text-muted">
            {catalog.productCount} product{catalog.productCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        searchable
        searchPlaceholder="Search products..."
        pageSize={10}
        emptyState={{
          title: 'No Products',
          description: 'This catalog has no products yet.',
          accentColor: ACCENT,
        }}
      />

      <AddToCartModal
        product={cartProduct}
        onClose={() => setCartProduct(null)}
        onAdd={handleAddToCart}
      />
    </div>
  );
}
