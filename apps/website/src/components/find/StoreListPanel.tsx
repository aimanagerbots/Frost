'use client';

import FinderStoreCard from '@/components/find/FinderStoreCard';

interface StoreAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface Store {
  id: string;
  slug: string;
  name: string;
  address: StoreAddress;
  distance?: number;
  stockStatus?: string;
  categoriesCarried: string[];
}

interface StoreListPanelProps {
  stores: Store[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  productName?: string | null;
}

export default function StoreListPanel({
  stores,
  hoveredId,
  selectedId,
  onHover,
  onClick,
  productName,
}: StoreListPanelProps) {
  const storeCount = stores.length;

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex-shrink-0 px-1 pb-3">
        <p className="text-sm text-white/40">
          <span className="text-white/70 font-medium">{storeCount}</span>{' '}
          {productName
            ? `store${storeCount !== 1 ? 's' : ''} carry `
            : `store${storeCount !== 1 ? 's' : ''}`}
          {productName && (
            <span className="text-[#5BB8E6]">{productName}</span>
          )}
        </p>
      </div>

      {/* scrollable list */}
      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(91,184,230,0.3) transparent',
        }}
      >
        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/20"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="text-sm text-white/40">No stores found</p>
            <p className="text-xs text-white/20 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          stores.map((store, index) => (
            <FinderStoreCard
              key={store.id}
              store={store}
              isHovered={hoveredId === store.id}
              isSelected={selectedId === store.id}
              index={index}
              onHover={onHover}
              onClick={onClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
