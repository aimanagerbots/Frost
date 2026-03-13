'use client';

import { FileSpreadsheet } from 'lucide-react';
import { DataTable } from '@/components';
import type { SalesRepReport } from '@/modules/sales/types';

const ACCENT = '#F59E0B';

interface ReportTableProps {
  data: SalesRepReport[];
  loading: boolean;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
}

type ReportRow = SalesRepReport & Record<string, unknown>;

const columns = [
  {
    header: 'Sales Person',
    accessor: 'repName' as const,
    sortable: true,
    render: (row: ReportRow) => (
      <span className="font-medium text-text-default">{row.repName}</span>
    ),
  },
  {
    header: 'Number of Orders',
    accessor: 'orderCount' as const,
    sortable: true,
    render: (row: ReportRow) => (
      <span className="tabular-nums">{row.orderCount.toLocaleString()}</span>
    ),
  },
  {
    header: 'Total Sales',
    accessor: 'totalSales' as const,
    sortable: true,
    render: (row: ReportRow) => (
      <span className="tabular-nums font-medium" style={{ color: ACCENT }}>
        {formatCurrency(row.totalSales)}
      </span>
    ),
  },
  {
    header: 'Account Count',
    accessor: 'accountCount' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: ReportRow) => (
      <span className="tabular-nums">{row.accountCount}</span>
    ),
  },
  {
    header: 'Avg Order Value',
    accessor: 'avgOrderValue' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: ReportRow) => (
      <span className="tabular-nums">{formatCurrency(row.avgOrderValue)}</span>
    ),
  },
  {
    header: 'Top Account',
    accessor: 'topAccount' as const,
    sortable: true,
    hideBelow: 'lg' as const,
    render: (row: ReportRow) => (
      <span className="text-text-muted">{row.topAccount}</span>
    ),
  },
];

function handleExport(data: SalesRepReport[]) {
  const header = 'Sales Person,Number of Orders,Total Sales,Account Count,Avg Order Value,Top Account';
  const rows = data.map(
    (r) =>
      `"${r.repName}",${r.orderCount},${r.totalSales},${r.accountCount},${r.avgOrderValue},"${r.topAccount}"`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sales-person-report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportTable({ data, loading }: ReportTableProps) {
  const grandTotal = data.reduce((sum, r) => sum + r.totalSales, 0);

  return (
    <div className="space-y-3">
      {/* Header row with export + total */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-muted">
          {data.length > 0 && (
            <span>
              Total = <span className="font-semibold text-text-default">{formatCurrency(grandTotal)}</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleExport(data)}
          disabled={data.length === 0}
          className="flex items-center gap-2 rounded-lg border border-default bg-base px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-card-hover hover:text-text-default disabled:opacity-40"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Export to Excel
        </button>
      </div>

      <DataTable<ReportRow>
        data={data as ReportRow[]}
        columns={columns}
        loading={loading}
        pageSize={10}
        emptyState={{
          title: 'No sales data',
          description: 'Adjust your filters to see sales person reports.',
          accentColor: ACCENT,
        }}
      />
    </div>
  );
}
