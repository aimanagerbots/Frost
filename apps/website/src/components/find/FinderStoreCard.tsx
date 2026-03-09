'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface StoreData {
  id: string;
  slug: string;
  name: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  distance?: number;
  stockStatus?: string;
  categoriesCarried: string[];
}

interface FinderStoreCardProps {
  store: StoreData;
  isHovered: boolean;
  isSelected: boolean;
  index: number;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const STOCK_STATUS_MAP: Record<string, { label: string; className: string }> = {
  'in-stock': {
    label: 'In Stock',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  'low-stock': {
    label: 'Low Stock',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'bg-white/[0.04] text-white/30 border-white/[0.06]',
  },
};

export default function FinderStoreCard({
  store,
  isHovered,
  isSelected,
  index,
  onHover,
  onClick,
}: FinderStoreCardProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    onClick(store.id);
    router.push(`/find/${store.slug}`);
  }, [onClick, router, store.id, store.slug]);

  const addressLine = [store.address.city, store.address.state]
    .filter(Boolean)
    .join(', ');

  const stockInfo = store.stockStatus
    ? STOCK_STATUS_MAP[store.stockStatus]
    : null;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => onHover(store.id)}
      onMouseLeave={() => onHover(null)}
      className={`
        w-full text-left rounded-xl border p-4 transition-all duration-200 group
        ${
          isSelected
            ? 'bg-[#111118] border-[#5BB8E6]/40 shadow-[0_0_20px_rgba(91,184,230,0.1)]'
            : isHovered
              ? 'bg-[#111118] border-white/[0.12]'
              : 'bg-card border-white/[0.06] hover:bg-[#111118] hover:border-white/[0.12]'
        }
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* left accent bar */}
      <div className="flex gap-3">
        <div
          className={`
            w-0.5 self-stretch rounded-full shrink-0 transition-colors duration-200
            ${isSelected || isHovered ? 'bg-[#5BB8E6]' : 'bg-transparent'}
          `}
        />

        <div className="flex-1 min-w-0">
          {/* header row: name + distance */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-sm font-medium text-white/90 truncate"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {store.name}
            </h3>

            {store.distance != null && (
              <span className="flex-shrink-0 text-xs font-medium text-[#5BB8E6] bg-[#5BB8E6]/10 px-2 py-0.5 rounded-full">
                {store.distance < 10
                  ? store.distance.toFixed(1)
                  : Math.round(store.distance)}{' '}
                mi
              </span>
            )}
          </div>

          {/* address */}
          {addressLine && (
            <p className="text-xs text-white/40 mt-1 truncate">
              {store.address.street && (
                <span className="block truncate">{store.address.street}</span>
              )}
              {addressLine}
              {store.address.zip ? ` ${store.address.zip}` : ''}
            </p>
          )}

          {/* bottom row: categories + stock status */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
            {store.categoriesCarried.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="text-[10px] uppercase tracking-wider text-white/30 bg-white/[0.04] px-2 py-0.5 rounded"
              >
                {cat}
              </span>
            ))}

            {store.categoriesCarried.length > 4 && (
              <span className="text-[10px] text-white/20">
                +{store.categoriesCarried.length - 4}
              </span>
            )}

            {stockInfo && (
              <span
                className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full border ${stockInfo.className}`}
              >
                {stockInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
