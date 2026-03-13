'use client';

import { BookOpen, Package } from 'lucide-react';
import { AccentCard, LoadingSkeleton, EmptyState } from '@/components';
import { useCatalogs } from '../hooks';

const ACCENT = '#F59E0B';

interface CatalogListProps {
  selectedId: string | null;
  onSelect: (catalogId: string) => void;
}

export function CatalogList({ selectedId, onSelect }: CatalogListProps) {
  const { data: catalogs, isLoading } = useCatalogs();

  if (isLoading) return <LoadingSkeleton variant="list" />;

  if (!catalogs?.length) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Catalogs"
        description="No product catalogs have been created yet."
        accentColor={ACCENT}
      />
    );
  }

  // Compute min/max price per catalog
  const catalogsWithPrices = catalogs.map((c) => {
    const prices = c.products.map((p) => p.price);
    return {
      ...c,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
    };
  });

  return (
    <div className="space-y-3">
      {catalogsWithPrices.map((catalog) => (
        <AccentCard
          key={catalog.id}
          accentColor={ACCENT}
          selected={selectedId === catalog.id}
          onClick={() => onSelect(catalog.id)}
          padding="md"
          className="border border-default"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <BookOpen className="h-4.5 w-4.5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-bright">
                  {catalog.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Package className="h-3 w-3" />
                    {catalog.productCount} product{catalog.productCount !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-text-muted">
                    ${catalog.minPrice.toFixed(2)} &ndash; ${catalog.maxPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AccentCard>
      ))}
    </div>
  );
}
