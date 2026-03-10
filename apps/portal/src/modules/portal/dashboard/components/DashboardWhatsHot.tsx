'use client';

import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalProducts } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

const SOCIAL_PROOF_LINES = [
  'Ordered by 68% of stores in your region',
  '412 stores added this month',
  'Trending #1 in your market',
  'Reordered by 74% of partners last quarter',
  '89% of top-performing stores carry this',
  'Fastest-growing SKU this month',
];

const CATEGORY_COLORS: Record<string, string> = {
  flower: '#22C55E',
  prerolls: '#F59E0B',
  vaporizers: '#3B82F6',
  concentrates: '#EF4444',
  edibles: '#EC4899',
  beverages: '#06B6D4',
};

export function DashboardWhatsHot() {
  const { data: products } = usePortalProducts();

  if (!products) return null;

  // Pick popular/new products for the trending section
  const trending = products
    .filter((p) => p.isPopular || p.isNew)
    .slice(0, 4);

  if (trending.length === 0) return null;

  return (
    <PortalCard>
      <div className="flex items-center gap-2 pb-4">
        <Flame className="h-4 w-4 text-[#F59E0B]" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Trending Across Frost Stores
        </h3>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {trending.map((product, idx) => {
          const categoryColor = CATEGORY_COLORS[product.category] ?? '#5BB8E6';
          const socialProof = SOCIAL_PROOF_LINES[idx % SOCIAL_PROOF_LINES.length];

          return (
            <div
              key={product.id}
              className={cn(
                'flex w-56 shrink-0 flex-col rounded-lg border border-border-default bg-elevated p-3',
                'transition-colors hover:border-accent-primary/30'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                  style={{
                    backgroundColor: `${categoryColor}15`,
                    color: categoryColor,
                  }}
                >
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="rounded-full bg-accent-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-accent-primary">
                    New
                  </span>
                )}
              </div>

              <p className="mb-1 text-sm font-semibold text-text-bright line-clamp-1">
                {product.name}
              </p>
              <p className="mb-3 text-xs text-text-muted line-clamp-1">
                {product.strainName} &middot; {product.packageSize}
              </p>

              {/* Social proof line */}
              <p className="mb-3 text-[11px] font-medium text-[#F59E0B]">
                {socialProof}
              </p>

              <Link
                href={`/shop/${product.id}`}
                className="mt-auto flex items-center gap-1 text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
              >
                View in Shop
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </PortalCard>
  );
}
