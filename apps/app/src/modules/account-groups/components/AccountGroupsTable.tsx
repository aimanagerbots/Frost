'use client';

import { DataTable, StatusBadge } from '@/components';
import { UsersRound } from 'lucide-react';
import type { AccountGroup } from '@/modules/sales/types';

interface AccountGroupRow extends Record<string, unknown> {
  id: string;
  name: string;
  type: 'territory' | 'rep' | 'custom';
  accountCount: number;
  assignedRep?: string;
}

function toRow(group: AccountGroup): AccountGroupRow {
  return {
    id: group.id,
    name: group.name,
    type: group.type,
    accountCount: group.accountCount,
    assignedRep: group.assignedRep,
  };
}

const TYPE_VARIANT: Record<string, 'info' | 'success' | 'warning'> = {
  territory: 'info',
  rep: 'success',
  custom: 'warning',
};

const COLUMNS = [
  {
    header: 'Group Name',
    accessor: 'name' as const,
    sortable: true,
    render: (row: AccountGroupRow) => (
      <span className="font-medium text-text-bright">{row.name}</span>
    ),
  },
  {
    header: 'Type',
    accessor: 'type' as const,
    sortable: true,
    render: (row: AccountGroupRow) => (
      <StatusBadge
        variant={TYPE_VARIANT[row.type] || 'default'}
        label={row.type.charAt(0).toUpperCase() + row.type.slice(1)}
      />
    ),
  },
  {
    header: 'Accounts',
    accessor: 'accountCount' as const,
    sortable: true,
    render: (row: AccountGroupRow) => (
      <span className="tabular-nums">{row.accountCount}</span>
    ),
  },
  {
    header: 'Assigned Rep',
    accessor: 'assignedRep' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: AccountGroupRow) => (
      <span className="text-text-muted">{row.assignedRep || '—'}</span>
    ),
  },
];

interface AccountGroupsTableProps {
  groups: AccountGroup[];
  loading: boolean;
  onSelect: (group: AccountGroup) => void;
}

export function AccountGroupsTable({ groups, loading, onSelect }: AccountGroupsTableProps) {
  const rows = groups.map(toRow);

  return (
    <DataTable
      data={rows}
      columns={COLUMNS}
      searchable
      searchPlaceholder="Search groups..."
      loading={loading}
      onRowClick={(row) => {
        const original = groups.find((g) => g.id === row.id);
        if (original) onSelect(original);
      }}
      emptyState={{
        icon: UsersRound,
        title: 'No Account Groups',
        description: 'Create your first account group to organize accounts by territory, rep, or custom criteria.',
        accentColor: '#F59E0B',
      }}
    />
  );
}
