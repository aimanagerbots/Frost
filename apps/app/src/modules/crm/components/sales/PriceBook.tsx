'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { DataTable, StatusBadge, LoadingSkeleton, EmptyState } from '@/components';
import { usePriceBook } from '../../hooks';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const CATEGORIES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

function categoryVariant(cat: string) {
  switch (cat) {
    case 'flower': return 'success' as const;
    case 'preroll': return 'warning' as const;
    case 'vaporizer': return 'info' as const;
    case 'concentrate': return 'danger' as const;
    case 'edible': return 'default' as const;
    case 'beverage': return 'muted' as const;
    default: return 'default' as const;
  }
}

export function PriceBook() {
  const { data: products, isLoading } = usePriceBook();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = products ?? [];
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [products, search, selectedCategories]);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (!products?.length) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Products"
        description="Price book is empty."
        accentColor={CRM_ACCENT}
      />
    );
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const columns: { header: string; accessor: string; sortable?: boolean; render?: (row: Record<string, unknown>) => React.ReactNode }[] = [
    {
      header: 'Product',
      accessor: 'productName' as const,
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-bright">{row.productName as string}</span>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
      render: (row) => (
        <StatusBadge variant={categoryVariant(row.category as string)} label={row.category as string} size="sm" />
      ),
    },
    {
      header: 'Sub-Category',
      accessor: 'subCategory' as const,
      sortable: true,
    },
    {
      header: 'Size',
      accessor: 'packageSize' as const,
    },
    {
      header: 'Price',
      accessor: 'defaultPrice' as const,
      sortable: true,
      render: (row) => (
        <span className="text-right font-medium text-text-bright">{formatCurrency(row.defaultPrice as number)}</span>
      ),
    },
    {
      header: 'Cost',
      accessor: 'cost' as const,
      sortable: true,
      render: (row) => (
        <span className="text-right text-text-default">{formatCurrency(row.cost as number)}</span>
      ),
    },
    {
      header: 'Margin',
      accessor: 'margin' as const,
      sortable: true,
      render: (row) => {
        const m = row.margin as number;
        const color = m >= 50 ? 'text-success' : m >= 40 ? 'text-warning' : 'text-danger';
        return <span className={`text-right font-semibold ${color}`}>{m}%</span>;
      },
    },
    {
      header: 'Tier 1',
      accessor: 'tier1Price' as const,
      render: (row) => (
        <span className="text-right text-text-muted">{formatCurrency(row.tier1Price as number)}</span>
      ),
    },
    {
      header: 'Tier 2',
      accessor: 'tier2Price' as const,
      render: (row) => (
        <span className="text-right text-text-default">{formatCurrency(row.tier2Price as number)}</span>
      ),
    },
    {
      header: 'Tier 3',
      accessor: 'tier3Price' as const,
      render: (row) => (
        <span className="text-right text-text-bright">{formatCurrency(row.tier3Price as number)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-64 rounded-lg border border-default bg-card px-3 py-1.5 text-sm text-text-default placeholder:text-text-muted outline-none focus:border-hover"
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                selectedCategories.includes(cat)
                  ? 'bg-elevated text-text-bright'
                  : 'text-text-muted hover:text-text-default'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns}
        pageSize={20}
      />
    </div>
  );
}
