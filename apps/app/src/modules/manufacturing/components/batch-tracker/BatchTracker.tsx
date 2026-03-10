'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { useManufacturingBatches } from '../../hooks';
import { BatchRow } from './BatchRow';
import { ACCENT } from '@/design/colors';

const CATEGORY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'flower', label: 'Flower' },
  { value: 'preroll', label: 'Preroll' },
  { value: 'vaporizer', label: 'Vaporizer' },
  { value: 'concentrate', label: 'Concentrate' },
];


export function BatchTracker() {
  const { data: batches, isLoading } = useManufacturingBatches();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    if (!batches) return [];
    let result = [...batches];
    if (category) result = result.filter((b) => b.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.batchNumber.toLowerCase().includes(q) ||
          b.strainName.toLowerCase().includes(q) ||
          (b.productName && b.productName.toLowerCase().includes(q))
      );
    }
    return result;
  }, [batches, search, category]);

  if (isLoading) return <LoadingSkeleton variant="list" />;

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batch number, strain, product..."
            className="w-full rounded-xl bg-card py-2 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted"
          />
        </div>
        <div className="flex gap-1">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === f.value
                  ? 'text-text-bright'
                  : 'text-text-muted hover:text-text-default'
              }`}
              style={
                category === f.value
                  ? { backgroundColor: `${ACCENT}20`, color: ACCENT }
                  : {}
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch count */}
      <p className="text-xs text-text-muted">{filtered.length} batches</p>

      {/* Batch list */}
      <div className="space-y-2">
        {filtered.map((batch) => (
          <BatchRow key={batch.id} batch={batch} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">No batches match your search.</p>
        )}
      </div>
    </div>
  );
}
