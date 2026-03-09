'use client';

import { useCallback } from 'react';
import type { StoreWithMeta } from '@/app/(site)/order/OrderBrowseClient';

interface FinderStoreCardProps {
  store: StoreWithMeta;
  isHovered: boolean;
  isSelected: boolean;
  index: number;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onNavigate: (slug: string) => void;
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
  onNavigate,
}: FinderStoreCardProps) {
  const handleClick = useCallback(() => {
    onClick(store.id);
  }, [onClick, store.id]);

  const handleViewStore = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onNavigate(store.slug);
    },
    [onNavigate, store.slug],
  );

  const handleDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const addr = [store.address.street, store.address.city, store.address.state, store.address.zip]
        .filter(Boolean)
        .join(', ');
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`,
        '_blank',
        'noopener',
      );
    },
    [store.address],
  );

  const addressLine = [store.address.city, store.address.state]
    .filter(Boolean)
    .join(', ');

  const stockInfo = store.stockStatus
    ? STOCK_STATUS_MAP[store.stockStatus]
    : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onMouseEnter={() => onHover(store.id)}
      onMouseLeave={() => onHover(null)}
      className={`
        w-full text-left rounded-xl border p-4 transition-all duration-200 group cursor-pointer
        ${
          isSelected
            ? 'bg-[#0D1520] border-[#5BB8E6]/30 shadow-[0_0_24px_rgba(91,184,230,0.08)]'
            : isHovered
              ? 'bg-white/[0.03] border-white/[0.1]'
              : 'bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.1]'
        }
      `}
      style={{
        animationDelay: `${index * 30}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* Row 1: Name + Distance */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-1 h-8 rounded-full flex-shrink-0 transition-colors duration-200 ${
              isSelected || isHovered ? 'bg-[#5BB8E6]' : 'bg-white/[0.06]'
            }`}
          />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/90 truncate leading-tight">
              {store.name}
            </h3>
            {store.address.street && (
              <p className="text-xs text-white/35 mt-0.5 truncate">{store.address.street}</p>
            )}
            <p className="text-xs text-white/35 truncate">
              {addressLine}
              {store.address.zip ? ` ${store.address.zip}` : ''}
            </p>
          </div>
        </div>

        {store.distance != null && (
          <span className="flex-shrink-0 text-xs font-semibold text-[#5BB8E6] bg-[#5BB8E6]/8 px-2.5 py-1 rounded-lg">
            {store.distance < 10
              ? store.distance.toFixed(1)
              : Math.round(store.distance)}{' '}
            mi
          </span>
        )}
      </div>

      {/* Row 2: Hours + Phone */}
      {(store.hours || store.phone) && (
        <div className="mt-2.5 ml-3.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {store.hours && (
            <span className="text-[11px] text-white/30 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {store.hours}
            </span>
          )}
          {store.phone && (
            <span className="text-[11px] text-white/30 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {store.phone}
            </span>
          )}
        </div>
      )}

      {/* Row 3: Featured deal */}
      {store.featuredDeal && (
        <div className="mt-2.5 ml-3.5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-2.5 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" /><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" /></svg>
            <span className="text-[11px] text-emerald-400/80">{store.featuredDeal}</span>
          </div>
        </div>
      )}

      {/* Row 4: Categories + stock + actions */}
      <div className="mt-3 ml-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1">
          {store.categoriesCarried.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[10px] uppercase tracking-wider text-white/25 bg-white/[0.03] px-2 py-0.5 rounded"
            >
              {cat}
            </span>
          ))}
          {store.categoriesCarried.length > 3 && (
            <span className="text-[10px] text-white/15">
              +{store.categoriesCarried.length - 3}
            </span>
          )}
          {stockInfo && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${stockInfo.className}`}>
              {stockInfo.label}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleDirections}
            title="Get directions"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
          </button>
          <button
            type="button"
            onClick={handleViewStore}
            title="View store"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#5BB8E6]/15 text-white/40 hover:text-[#5BB8E6] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
