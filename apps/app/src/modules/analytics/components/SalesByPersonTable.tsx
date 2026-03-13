'use client';

import { DataTable, LoadingSkeleton } from '@/components';
import { useSalesByPerson } from '../hooks';
import type { SalesRepReport } from '@/modules/sales/types';

type RepRow = SalesRepReport & Record<string, unknown>;

function currency(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const columns = [
  {
    header: 'Sales Person',
    accessor: 'repName' as const,
    sortable: true,
    render: (row: RepRow) => (
      <span className="font-medium text-text-bright">{row.repName}</span>
    ),
  },
  {
    header: '# Orders',
    accessor: 'orderCount' as const,
    sortable: true,
  },
  {
    header: 'Total Sales',
    accessor: 'totalSales' as const,
    sortable: true,
    render: (row: RepRow) => (
      <span className="font-semibold text-emerald-400">{currency(row.totalSales)}</span>
    ),
  },
  {
    header: 'Accounts',
    accessor: 'accountCount' as const,
    sortable: true,
    hideBelow: 'md' as const,
  },
  {
    header: 'Avg Order Value',
    accessor: 'avgOrderValue' as const,
    sortable: true,
    render: (row: RepRow) => (
      <span className="text-text-default">{currency(row.avgOrderValue)}</span>
    ),
    hideBelow: 'md' as const,
  },
  {
    header: 'Top Account',
    accessor: 'topAccount' as const,
    sortable: true,
    hideBelow: 'lg' as const,
  },
];

export function SalesByPersonTable() {
  const { data, isLoading } = useSalesByPerson();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="table" />;
  }

  const repRows: RepRow[] = data.map((r) => ({ ...r }));

  // Grand total row
  const totals: RepRow = {
    repName: 'TOTAL',
    totalSales: data.reduce((s, r) => s + r.totalSales, 0),
    orderCount: data.reduce((s, r) => s + r.orderCount, 0),
    accountCount: data.reduce((s, r) => s + r.accountCount, 0),
    avgOrderValue: Math.round(
      data.reduce((s, r) => s + r.totalSales, 0) / data.reduce((s, r) => s + r.orderCount, 0)
    ),
    topAccount: '',
  };

  return (
    <div className="space-y-4">
      <DataTable<RepRow>
        data={repRows}
        columns={columns}
        pageSize={10}
      />

      {/* Grand total row */}
      <div className="rounded-xl border border-default bg-card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="bg-elevated/50">
              <td className="px-4 py-3 font-bold text-text-bright">TOTAL</td>
              <td className="px-4 py-3 text-text-default">{totals.orderCount}</td>
              <td className="px-4 py-3 font-semibold text-emerald-400">{currency(totals.totalSales)}</td>
              <td className="hidden px-4 py-3 text-text-default md:table-cell">{totals.accountCount}</td>
              <td className="hidden px-4 py-3 text-text-default md:table-cell">{currency(totals.avgOrderValue)}</td>
              <td className="hidden px-4 py-3 lg:table-cell" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
