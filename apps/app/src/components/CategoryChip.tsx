'use client';

import { cn } from '@/lib/utils';

type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';

const CATEGORY_STYLES: Record<ProductCategory, { bg: string; text: string }> = {
  flower:      { bg: 'bg-green-500/15',  text: 'text-green-400' },
  preroll:     { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  vaporizer:   { bg: 'bg-blue-500/15',   text: 'text-blue-400' },
  concentrate: { bg: 'bg-amber-500/15',  text: 'text-amber-400' },
  edible:      { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  beverage:    { bg: 'bg-teal-500/15',   text: 'text-teal-400' },
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  flower: 'Flower',
  preroll: 'Pre-Roll',
  vaporizer: 'Vaporizer',
  concentrate: 'Concentrate',
  edible: 'Edible',
  beverage: 'Beverage',
};

interface CategoryChipProps {
  category: ProductCategory;
  className?: string;
}

export type { ProductCategory };

export function CategoryChip({ category, className }: CategoryChipProps) {
  const styles = CATEGORY_STYLES[category];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles.bg,
        styles.text,
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
