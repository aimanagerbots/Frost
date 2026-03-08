'use client';

import { Leaf, Cigarette, Wind, Droplets, Cookie, GlassWater, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { CategoryDistribution as CategoryDistType, ProductCategory } from '@/modules/inventory/types';

interface CategoryDistributionProps {
  categories: CategoryDistType[];
}

const CATEGORY_CONFIG: Record<ProductCategory, { icon: typeof Leaf; color: string }> = {
  flower: { icon: Leaf, color: '#5BB8E6' },
  preroll: { icon: Cigarette, color: '#5BB8E6' },
  vaporizer: { icon: Wind, color: '#5BB8E6' },
  concentrate: { icon: Droplets, color: '#5BB8E6' },
  edible: { icon: Cookie, color: '#5BB8E6' },
  beverage: { icon: GlassWater, color: '#5BB8E6' },
};

export function CategoryDistribution({ categories }: CategoryDistributionProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat.category];
        const Icon = config.icon;
        const TrendIcon = cat.trend >= 0 ? TrendingUp : TrendingDown;

        return (
          <div
            key={cat.category}
            className="flex flex-col items-center gap-2 rounded-xl border border-default bg-card p-4 transition-colors hover:bg-accent-hover"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-bright">{cat.label}</p>
              <p className="text-xs text-text-muted">{cat.count.toLocaleString()} units</p>
              <p className="text-[10px] text-text-muted">
                ${cat.value >= 1000 ? `${(cat.value / 1000).toFixed(1)}K` : cat.value}
              </p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <TrendIcon
                  className="h-3 w-3"
                  style={{ color: cat.trend >= 0 ? '#5BB8E6' : '#FB7185' }}
                />
                <span className="text-[10px]" style={{ color: cat.trend >= 0 ? '#5BB8E6' : '#FB7185' }}>
                  {cat.trend >= 0 ? '+' : ''}{cat.trend}%
                </span>
              </div>
              {cat.lowStock && (
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  <AlertTriangle className="h-2.5 w-2.5 text-warning" />
                  <span className="text-[9px] text-warning">Low Stock</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
