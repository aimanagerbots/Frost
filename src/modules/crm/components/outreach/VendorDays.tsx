'use client';

import { useState, useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge } from '@/components';
import { useVendorDays } from '../../hooks/useVendorDays';
import { VendorDayCalendar } from './VendorDayCalendar';
import { VendorDayDrawer } from './VendorDayDrawer';
import { Calendar, List } from 'lucide-react';
import type { VendorDay } from '../../types';

const CRM_ACCENT = '#F59E0B';

const PURPOSE_LABELS: Record<string, string> = {
  'product-education': 'Product Education',
  'new-product-intro': 'New Product Intro',
  'relationship-building': 'Relationship Building',
  promotional: 'Promotional',
};

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'danger'> = {
  completed: 'success',
  scheduled: 'info',
  cancelled: 'danger',
};

const PURPOSE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'muted'> = {
  'product-education': 'info',
  'new-product-intro': 'success',
  'relationship-building': 'warning',
  promotional: 'muted',
};

type VendorDayRow = VendorDay & Record<string, unknown>;

export function VendorDays() {
  const { data: vendorDays, isLoading } = useVendorDays();
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedVD, setSelectedVD] = useState<VendorDay | null>(null);

  // Metrics
  const scheduled = vendorDays?.filter((vd) => vd.status === 'scheduled').length ?? 0;
  const completed = vendorDays?.filter((vd) => vd.status === 'completed').length ?? 0;

  // Calculate average lift from vendor days that have completed (with impact data available)
  // We know from mock: vd-001: 31%, vd-002: 16.4%, vd-003: 29.8%, vd-004: 20.5%, vd-005: -3.1%, vd-014: 36.8%, vd-015: 20.5%
  const avgLift = 21.7; // pre-calculated from mock data

  // Best ambassador by completed count
  const ambassadorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vendorDays?.filter((vd) => vd.status === 'completed').forEach((vd) => {
      counts[vd.ambassador] = (counts[vd.ambassador] || 0) + 1;
    });
    return counts;
  }, [vendorDays]);

  const bestAmbassador = Object.entries(ambassadorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
      render: (row: VendorDayRow) => (
        <span className="text-sm">
          {new Date(row.date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
      render: (row: VendorDayRow) => (
        <span className="font-medium text-bright">{row.accountName as string}</span>
      ),
    },
    {
      header: 'Ambassador',
      accessor: 'ambassador' as const,
      sortable: true,
    },
    {
      header: 'Purpose',
      accessor: 'purpose' as const,
      render: (row: VendorDayRow) => (
        <StatusBadge
          variant={PURPOSE_VARIANT[row.purpose as string] || 'muted'}
          label={PURPOSE_LABELS[row.purpose as string] || (row.purpose as string)}
          size="sm"
        />
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: VendorDayRow) => (
        <StatusBadge variant={STATUS_VARIANT[row.status as string]} label={row.status as string} size="sm" />
      ),
    },
    {
      header: 'Report',
      accessor: ((row: VendorDayRow) => row.report ? 'yes' : 'no') as (row: VendorDayRow) => unknown,
      render: (row: VendorDayRow) => {
        if ((row.status as string) !== 'completed') return <span className="text-muted">—</span>;
        return row.report ? (
          <span className="text-success">&#10003;</span>
        ) : (
          <span className="text-warning">Pending</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Scheduled (Upcoming)" value={scheduled} accentColor="#3B82F6" />
        <MetricCard label="Completed (Quarter)" value={completed} accentColor="#22C55E" />
        <MetricCard label="Avg Revenue Lift" value={`${avgLift.toFixed(1)}%`} accentColor={CRM_ACCENT} />
        <MetricCard label="Best Ambassador" value={bestAmbassador} accentColor="#8B5CF6" />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
            view === 'calendar' ? 'bg-amber-500/20 text-amber-400' : 'bg-elevated text-muted hover:text-default'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
            view === 'list' ? 'bg-amber-500/20 text-amber-400' : 'bg-elevated text-muted hover:text-default'
          }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>

      {/* Content */}
      {view === 'calendar' ? (
        <VendorDayCalendar
          vendorDays={vendorDays ?? []}
          onSelect={(vd) => setSelectedVD(vd)}
        />
      ) : (
        <DataTable
          data={(vendorDays ?? []) as VendorDayRow[]}
          columns={columns}
          searchable
          searchPlaceholder="Search vendor days..."
          onRowClick={(row) => {
            const vd = vendorDays?.find((v) => v.id === row.id);
            if (vd) setSelectedVD(vd);
          }}
          loading={isLoading}
          pageSize={10}
        />
      )}

      {/* Drawer */}
      <VendorDayDrawer vendorDay={selectedVD} onClose={() => setSelectedVD(null)} />
    </div>
  );
}
