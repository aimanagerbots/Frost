'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  TableIcon,
  type LucideIcon,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  hideBelow?: 'sm' | 'md' | 'lg';
}

interface EmptyStateConfig {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  accentColor?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: EmptyStateConfig;
  pageSize?: number;
  className?: string;
}

const HIDE_BELOW: Record<string, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

type SortDir = 'asc' | 'desc' | null;

function getValue<T>(row: T, accessor: keyof T | ((row: T) => unknown)): unknown {
  return typeof accessor === 'function' ? accessor(row) : row[accessor];
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  loading = false,
  emptyState,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);

  const handleSort = useCallback(
    (colIndex: number) => {
      if (sortCol === colIndex) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
        if (sortDir === 'desc') setSortCol(null);
      } else {
        setSortCol(colIndex);
        setSortDir('asc');
      }
      setPage(0);
    },
    [sortCol, sortDir]
  );

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getValue(row, col.accessor);
        return typeof val === 'string' && val.toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (sortCol === null || sortDir === null) return filtered;
    const col = columns[sortCol];
    return [...filtered].sort((a, b) => {
      const aVal = getValue(a, col.accessor);
      const bVal = getValue(b, col.accessor);
      if (aVal == null || bVal == null) return 0;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  if (loading) {
    return <LoadingSkeleton variant="table" />;
  }

  return (
    <div className={cn('rounded-xl bg-card overflow-hidden', className)}>
      {searchable && (
        <div className="border-b border-default p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-default bg-base py-2 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
            />
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState
          icon={emptyState?.icon || TableIcon}
          title={emptyState?.title || 'No results'}
          description={emptyState?.description || 'No data matches your criteria.'}
          accentColor={emptyState?.accentColor}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default">
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={cn(
                        'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted',
                        col.sortable && 'cursor-pointer select-none hover:text-text-default',
                        i === 0 && 'sticky left-0 bg-card z-10',
                        col.hideBelow && HIDE_BELOW[col.hideBelow]
                      )}
                      onClick={col.sortable ? () => handleSort(i) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {col.header}
                        {col.sortable && (
                          <span className="ml-1">
                            {sortCol === i && sortDir === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : sortCol === i && sortDir === 'desc' ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={cn(
                      'border-b border-default/50 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-accent-hover'
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn(
                          'px-4 py-3 text-text-default',
                          colIdx === 0 && 'sticky left-0 bg-card z-10',
                          col.hideBelow && HIDE_BELOW[col.hideBelow]
                        )}
                      >
                        {col.render
                          ? col.render(row)
                          : String(getValue(row, col.accessor) ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-default px-4 py-3">
            <span className="text-xs text-text-muted">
              {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-text-muted">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
