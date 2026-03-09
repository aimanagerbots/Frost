'use client';

import { cn } from '@/lib/utils';
import type { PortalProduct } from '@/modules/portal/shared/types';

type ProductCategory = PortalProduct['category'];

interface CategoryDef {
  key: ProductCategory;
  label: string;
  emoji: string;
  accent: string;
  accentBg: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    key: 'flower',
    label: 'Flower',
    emoji: '🌿',
    accent: 'text-green-400',
    accentBg: 'bg-green-500/10 hover:bg-green-500/15 border-green-500/20',
  },
  {
    key: 'prerolls',
    label: 'Prerolls',
    emoji: '🚬',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500/10 hover:bg-orange-500/15 border-orange-500/20',
  },
  {
    key: 'vaporizers',
    label: 'Vaporizers',
    emoji: '💨',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20',
  },
  {
    key: 'concentrates',
    label: 'Concentrates',
    emoji: '🧪',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20',
  },
  {
    key: 'edibles',
    label: 'Edibles',
    emoji: '🍪',
    accent: 'text-violet-400',
    accentBg: 'bg-violet-500/10 hover:bg-violet-500/15 border-violet-500/20',
  },
  {
    key: 'beverages',
    label: 'Beverages',
    emoji: '🥤',
    accent: 'text-teal-400',
    accentBg: 'bg-teal-500/10 hover:bg-teal-500/15 border-teal-500/20',
  },
];

interface ShopCategoryGridProps {
  products: PortalProduct[];
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
  className?: string;
}

export function ShopCategoryGrid({
  products,
  selectedCategory,
  onSelectCategory,
  className,
}: ShopCategoryGridProps) {
  const countByCategory = (cat: ProductCategory): number =>
    products.filter((p) => p.category === cat).length;

  const cheapestByCategory = (cat: ProductCategory): number | null => {
    const categoryProducts = products.filter((p) => p.category === cat);
    if (categoryProducts.length === 0) return null;
    return Math.min(...categoryProducts.map((p) => p.unitPrice));
  };

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6',
        className
      )}
    >
      {CATEGORIES.map((cat) => {
        const count = countByCategory(cat.key);
        const cheapest = cheapestByCategory(cat.key);
        const isSelected = selectedCategory === cat.key;

        return (
          <button
            key={cat.key}
            type="button"
            onClick={() =>
              onSelectCategory(isSelected ? null : cat.key)
            }
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-all',
              isSelected
                ? cn(cat.accentBg, 'ring-1 ring-white/10')
                : 'border-border-default bg-card hover:bg-card-hover'
            )}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span
              className={cn(
                'text-sm font-semibold',
                isSelected ? cat.accent : 'text-text-bright'
              )}
            >
              {cat.label}
            </span>
            <span className="text-xs text-text-muted">
              {count} {count === 1 ? 'product' : 'products'}
            </span>
            {cheapest !== null && (
              <span className="text-[10px] font-medium text-text-muted">
                From ${cheapest.toFixed(2)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
