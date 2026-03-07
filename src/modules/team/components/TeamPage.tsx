'use client';

import { useState } from 'react';
import { UsersRound, Mail, Phone, Calendar, Shield } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
} from '@/components';
import { useTeamMembers, useTeamMetrics } from '@/modules/team/hooks';
import type { TeamMember, Division } from '@/modules/team/types';

const ACCENT = '#0D9488';

const DIVISION_TABS: { label: string; value: Division | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Sales', value: 'sales' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Packaging', value: 'packaging' },
  { label: 'Fulfillment', value: 'fulfillment' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Cultivation', value: 'cultivation' },
  { label: 'Lab', value: 'lab' },
];

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'muted'> = {
  active: 'success',
  'on-leave': 'warning',
  inactive: 'muted',
};

const DIVISION_VARIANT: Record<string, 'info' | 'default' | 'success' | 'warning' | 'danger' | 'muted'> = {
  sales: 'info',
  manufacturing: 'default',
  packaging: 'warning',
  fulfillment: 'success',
  delivery: 'muted',
  cultivation: 'success',
  lab: 'danger',
  marketing: 'info',
  management: 'default',
  admin: 'muted',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const columns = [
  {
    header: 'Name',
    accessor: 'name' as const,
    sortable: true,
    render: (row: TeamMember) => (
      <span className="font-medium text-text-bright">{row.name}</span>
    ),
  },
  {
    header: 'Role',
    accessor: 'role' as const,
    sortable: true,
  },
  {
    header: 'Division',
    accessor: 'division' as const,
    sortable: true,
    render: (row: TeamMember) => (
      <StatusBadge
        label={String(row.division)}
        variant={DIVISION_VARIANT[String(row.division)] || 'default'}
        size="sm"
      />
    ),
  },
  {
    header: 'Email',
    accessor: 'email' as const,
  },
  {
    header: 'Phone',
    accessor: 'phone' as const,
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: TeamMember) => (
      <StatusBadge
        label={String(row.status)}
        variant={STATUS_VARIANT[String(row.status)] || 'muted'}
        size="sm"
        dot
      />
    ),
  },
  {
    header: 'Start Date',
    accessor: 'startDate' as const,
    sortable: true,
    render: (row: TeamMember) => (
      <span className="text-text-muted">{formatDate(String(row.startDate))}</span>
    ),
  },
];

export function TeamPage() {
  const [division, setDivision] = useState<Division | undefined>(undefined);
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const { data: members, isLoading: membersLoading } = useTeamMembers({ division });
  const { data: metrics, isLoading: metricsLoading } = useTeamMetrics();

  if (membersLoading || metricsLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={UsersRound}
        title="Team"
        subtitle="Manage team members across all divisions"
        accentColor={ACCENT}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Team" value={metrics?.total ?? 0} accentColor={ACCENT} />
        <MetricCard label="Active" value={metrics?.active ?? 0} accentColor="#22C55E" />
        <MetricCard label="Divisions" value={metrics?.divisions ?? 0} accentColor="#3B82F6" />
        <MetricCard label="On Leave" value={metrics?.onLeave ?? 0} accentColor="#F59E0B" />
      </div>

      {/* Division Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {DIVISION_TABS.map((tab) => {
          const isActive = division === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setDivision(tab.value)}
              className={
                isActive
                  ? 'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors'
                  : 'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-text-muted hover:text-text-default hover:bg-elevated'
              }
              style={isActive ? { backgroundColor: `${ACCENT}20`, color: ACCENT } : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={members ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search by name or role..."
        onRowClick={(row) => setSelected(row)}
        pageSize={15}
        emptyState={{
          icon: UsersRound,
          title: 'No team members',
          description: 'No team members match the current filters.',
          accentColor: ACCENT,
        }}
      />

      {/* Member Detail Drawer */}
      <DrawerPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Team Member'}
        width="md"
      >
        {selected && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
              >
                {selected.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-bright">{selected.name}</h3>
                <p className="text-sm text-text-muted">{selected.role}</p>
              </div>
            </div>

            {/* Status & Division */}
            <div className="flex items-center gap-3">
              <StatusBadge
                label={selected.status}
                variant={STATUS_VARIANT[selected.status] || 'muted'}
                dot
              />
              <StatusBadge
                label={selected.division}
                variant={DIVISION_VARIANT[selected.division] || 'default'}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-3 rounded-xl border border-default bg-base p-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Contact
              </h4>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-text-muted" />
                <span className="text-text-default">{selected.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-text-muted" />
                <span className="text-text-default">{selected.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span className="text-text-default">
                  Started {formatDate(selected.startDate)}
                </span>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-3 rounded-xl border border-default bg-base p-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted">
                <Shield className="mr-1.5 inline h-3.5 w-3.5" />
                Module Access
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.modules.map((mod) => (
                  <span
                    key={mod}
                    className="rounded-full bg-elevated px-3 py-1 text-xs font-medium text-text-default"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
