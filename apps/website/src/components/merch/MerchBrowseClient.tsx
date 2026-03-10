'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { MerchTile } from './MerchTile';
import type { MerchItem, MerchSubcategory } from '@/types/merch';

const FILTER_OPTIONS = ['All', 'Apparel', 'Accessories', 'Smoking'];

const FILTER_TO_SUBCATEGORY: Record<string, MerchSubcategory> = {
  Apparel: 'apparel',
  Accessories: 'accessories',
  Smoking: 'smoking',
};

interface MerchBrowseClientProps {
  items: MerchItem[];
  redeemMode?: boolean;
}

export function MerchBrowseClient({ items, redeemMode = false }: MerchBrowseClientProps) {
  const searchParams = useSearchParams();
  const subParam = searchParams.get('sub');

  // Derive initial filter from URL ?sub= param
  const initialFilter = (() => {
    if (!subParam) return 'All';
    // Check if it matches a subcategory
    for (const [label, sub] of Object.entries(FILTER_TO_SUBCATEGORY)) {
      if (sub === subParam) return label;
    }
    return 'All';
  })();

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  // Derive item type filter from ?sub= for specific items (e.g., ?sub=shirts)
  const itemTypeFilter = subParam && !Object.values(FILTER_TO_SUBCATEGORY).includes(subParam as MerchSubcategory)
    ? subParam
    : null;

  const filtered = useMemo(() => {
    let result = items;

    // Subcategory filter
    const subcategory = FILTER_TO_SUBCATEGORY[activeFilter];
    if (subcategory) {
      result = result.filter((item) => item.subcategory === subcategory);
    }

    // Item type filter from URL
    if (itemTypeFilter) {
      result = result.filter((item) => item.itemType === itemTypeFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.itemType.toLowerCase().includes(q),
      );
    }

    return result;
  }, [items, activeFilter, search, itemTypeFilter]);

  return (
    <div>
      {/* Banner */}
      <div className="mb-8 flex h-[100px] items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-white/60">
          Frost Merch
        </h1>
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar options={FILTER_OPTIONS} active={activeFilter} onChange={setActiveFilter} />
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search merch..."
          />
        </div>
      </div>

      {/* Count */}
      <p className="mb-4 text-sm text-white/40">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <MerchTile key={item.id} item={item} redeemMode={redeemMode} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-white/40">No merch found</p>
          <p className="mt-2 text-sm text-white/25">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}
