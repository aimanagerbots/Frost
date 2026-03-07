'use client';

import { Leaf, Cigarette, Wind, Droplets, Cookie, GlassWater } from 'lucide-react';
import type { InventoryByCategory, ProductCategory } from '@/modules/inventory/types';

interface CategoryCardsProps {
  categories: InventoryByCategory[];
  activeCategory?: ProductCategory;
  onCategoryClick?: (category: ProductCategory) => void;
}

const CATEGORY_CONFIG: Record<ProductCategory, { icon: typeof Leaf; color: string }> = {
  flower: { icon: Leaf, color: '#22C55E' },
  preroll: { icon: Cigarette, color: '#84CC16' },
  vaporizer: { icon: Wind, color: '#06B6D4' },
  concentrate: { icon: Droplets, color: '#F59E0B' },
  edible: { icon: Cookie, color: '#EC4899' },
  beverage: { icon: GlassWater, color: '#8B5CF6' },
};

export function CategoryCards({ categories, activeCategory, onCategoryClick }: CategoryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat.category];
        const Icon = config.icon;
        const isActive = activeCategory === cat.category;

        return (
          <button
            key={cat.category}
            onClick={() => onCategoryClick?.(cat.category)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              isActive
                ? 'border-hover bg-elevated'
                : 'border-default bg-card hover:bg-card-hover'
            }`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-bright">{cat.label}</p>
              <p className="text-xs text-text-muted">{cat.count} items</p>
              <p className="text-[10px] text-text-muted">
                ${cat.value >= 1000 ? `${(cat.value / 1000).toFixed(1)}K` : cat.value}
              </p>
              <p className="text-[10px] font-medium" style={{ color: config.color }}>
                {cat.percentage}%
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
