'use client';

import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components';
import { PipelineBadge } from '@/modules/pipeline/components/PipelineBadge';
import { accounts as crmAccounts } from '@/mocks/crm';
import { useAccounts } from '../hooks';
import type { AccountListTab, SalesAccount } from '../types';

interface AccountsTableProps {
  tab: AccountListTab;
  onTabChange: (tab: AccountListTab) => void;
  onRowClick: (account: SalesAccount) => void;
}

const ACCENT = '#F59E0B';

function getHealthColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#3B82F6';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

function lookupHealthScore(clientName: string): number | null {
  const match = crmAccounts.find(
    (a) => a.name.toLowerCase() === clientName.toLowerCase()
  );
  return match ? match.healthScore : null;
}

const TABS: { key: AccountListTab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'all', label: 'All Accounts' },
];

const columns: Parameters<typeof DataTable<SalesAccount & Record<string, unknown>>>[0]['columns'] = [
  {
    header: 'Account',
    accessor: 'clientName' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    render: (row) => (
      <div>
        <div className="font-medium" style={{ color: ACCENT }}>{row.clientName as string}</div>
        <div className="text-xs text-text-muted">{row.address as string}, {row.city as string}</div>
      </div>
    ),
  },
  {
    header: 'License / UBI',
    accessor: 'licenseUBI' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    hideBelow: 'md',
  },
  {
    header: 'Email',
    accessor: 'email' as keyof (SalesAccount & Record<string, unknown>),
    hideBelow: 'lg',
    render: (row) => (
      <span className="text-text-muted">{row.email as string}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    render: (row) => (
      <StatusBadge status={row.status as 'active' | 'inactive'} />
    ),
  },
  {
    header: 'Pipeline',
    accessor: 'pipelineCode' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    hideBelow: 'md',
    render: (row) => {
      const code = row.pipelineCode as string | undefined;
      return code ? <PipelineBadge code={code} /> : <span className="text-text-muted">—</span>;
    },
  },
  {
    header: 'Health',
    accessor: 'clientName' as keyof (SalesAccount & Record<string, unknown>),
    sortable: false,
    hideBelow: 'md',
    render: (row) => {
      const score = lookupHealthScore(row.clientName as string);
      if (score === null) return <span className="text-text-muted">—</span>;
      const color = getHealthColor(score);
      return (
        <span
          className="inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {score}
        </span>
      );
    },
  },
  {
    header: 'Assigned Rep',
    accessor: 'assignedSalesRep' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    hideBelow: 'md',
    render: (row) => (
      <span className="text-text-muted">{row.assignedSalesRep as string}</span>
    ),
  },
  {
    header: 'Orders',
    accessor: 'orderCount' as keyof (SalesAccount & Record<string, unknown>),
    sortable: true,
    hideBelow: 'lg',
    render: (row) => (
      <span className="text-text-muted">{String(row.orderCount)}</span>
    ),
  },
];

export function AccountsTable({ tab, onTabChange, onRowClick }: AccountsTableProps) {
  const { data: accounts = [], isLoading } = useAccounts(tab);

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-elevated p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              tab === t.key
                ? 'text-white shadow-sm'
                : 'text-text-muted hover:text-text-default'
            )}
            style={tab === t.key ? { backgroundColor: ACCENT } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        data={accounts as (SalesAccount & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search accounts by name, city, license..."
        loading={isLoading}
        onRowClick={(row) => onRowClick(row as unknown as SalesAccount)}
        pageSize={15}
        emptyState={{
          title: 'No accounts found',
          description: 'No accounts match the current filter.',
          accentColor: ACCENT,
        }}
      />
    </div>
  );
}
