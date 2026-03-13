'use client';

import { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { StatusBadge } from '@/components';
import type { OrderSummaryRow } from '@/modules/sales/types';
import type { DomainStatus } from '@/components';

interface SummaryTableProps {
  data: OrderSummaryRow[];
  grandTotal: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  loading?: boolean;
}

type SortDir = 'asc' | 'desc' | null;
type SortKey = keyof OrderSummaryRow;

const ACCENT = '#F59E0B';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 25, 50, 100, 250, 500, 1000];

interface ColumnDef {
  key: SortKey;
  header: string;
  sortable: boolean;
  hideBelow?: 'md' | 'lg';
  align?: 'right';
}

const COLUMNS: ColumnDef[] = [
  { key: 'orderNumber', header: 'Order #', sortable: true },
  { key: 'tradeName', header: 'Trade Name', sortable: true },
  { key: 'submittedBy', header: 'Submitted By', sortable: true },
  { key: 'submittedDate', header: 'Submitted Date', sortable: true },
  { key: 'clientName', header: 'Client', sortable: true },
  { key: 'city', header: 'City', sortable: true, hideBelow: 'md' },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'manifestedDate', header: 'Manifested Date', sortable: true, hideBelow: 'lg' },
  { key: 'estDeliveryDate', header: 'Est. Delivery Date', sortable: true, hideBelow: 'lg' },
  { key: 'releasedDate', header: 'Released Date', sortable: true, hideBelow: 'lg' },
  { key: 'orderTotal', header: 'Order Total', sortable: true, align: 'right' },
];

const HIDE_BELOW: Record<string, string> = {
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

function formatDate(d: string | undefined): string {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
}

/** Map SalesOrderStatus to StatusBadge domain status */
function mapStatus(status: string): DomainStatus {
  const map: Record<string, DomainStatus> = {
    submitted: 'pending',
    sublotted: 'processing',
    manifested: 'shipped',
    quarantined: 'failed',
    invoiced: 'invoiced',
    paid: 'paid',
    'partially-sublotted': 'processing',
  };
  return map[status] ?? 'pending';
}

function statusLabel(status: string): string {
  return status
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function downloadCSV(data: OrderSummaryRow[]) {
  const headers = ['Order #', 'Trade Name', 'Submitted By', 'Submitted Date', 'Client', 'City', 'Status', 'Manifested Date', 'Est. Delivery Date', 'Released Date', 'Order Total'];
  const rows = data.map((r) => [
    r.orderNumber, r.tradeName, r.submittedBy, r.submittedDate,
    r.clientName, r.city, statusLabel(r.status),
    r.manifestedDate ?? '', r.estDeliveryDate ?? '', r.releasedDate ?? '',
    r.orderTotal.toFixed(2),
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'order-summary.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function SummaryTable({
  data,
  grandTotal,
  pageSize,
  onPageSizeChange,
  loading,
}: SummaryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  // Reset page if it's out of bounds after filter change
  if (page >= totalPages && page > 0) {
    setPage(0);
  }

  const renderCell = (row: OrderSummaryRow, col: ColumnDef) => {
    switch (col.key) {
      case 'orderNumber':
        return (
          <span className="font-medium" style={{ color: ACCENT }}>
            {row.orderNumber}
          </span>
        );
      case 'status':
        return (
          <StatusBadge
            status={mapStatus(row.status)}
            label={statusLabel(row.status)}
          />
        );
      case 'submittedDate':
        return formatDate(row.submittedDate);
      case 'manifestedDate':
        return formatDate(row.manifestedDate);
      case 'estDeliveryDate':
        return formatDate(row.estDeliveryDate);
      case 'releasedDate':
        return formatDate(row.releasedDate);
      case 'orderTotal':
        return formatCurrency(row.orderTotal);
      default:
        return String(row[col.key] ?? '');
    }
  };

  return (
    <div className="space-y-3">
      {/* Export buttons + grand total */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCSV(data)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <FileText className="h-3.5 w-3.5" />
            Export Summary to Excel
          </button>
          <button
            onClick={() => downloadCSV(data)}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Details to Excel
          </button>
        </div>
        <div className="text-sm font-medium text-text-default">
          total: <span style={{ color: ACCENT }}>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-default bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted ${
                      col.sortable ? 'cursor-pointer select-none hover:text-text-default' : ''
                    } ${col.hideBelow ? HIDE_BELOW[col.hideBelow] : ''} ${
                      col.align === 'right' ? 'text-right' : ''
                    }`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      {col.header}
                      {col.sortable && (
                        <span className="ml-1">
                          {sortKey === col.key && sortDir === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : sortKey === col.key && sortDir === 'desc' ? (
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
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-text-muted">
                    No items to display
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-default/50 transition-colors hover:bg-card-hover"
                  >
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-text-default ${
                          col.hideBelow ? HIDE_BELOW[col.hideBelow] : ''
                        } ${col.align === 'right' ? 'text-right' : ''}`}
                      >
                        {renderCell(row, col)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between border-t border-default px-4 py-3 gap-3">
          <div className="flex items-center gap-3">
            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span
                className="flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-bold text-black"
                style={{ backgroundColor: ACCENT }}
              >
                {page + 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-default text-text-muted transition-colors hover:bg-accent-hover disabled:opacity-30"
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  onPageSizeChange(Number(e.target.value));
                  setPage(0);
                }}
                className="h-7 rounded-md border border-default bg-base px-2 text-xs text-text-default focus:border-amber-500/50 focus:outline-none"
                aria-label="Items per page"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-xs text-text-muted">items per page</span>
            </div>
          </div>

          <span className="text-xs text-text-muted">
            {data.length === 0
              ? 'No items to display'
              : `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, data.length)} of ${data.length} items`}
          </span>
        </div>
      </div>
    </div>
  );
}
