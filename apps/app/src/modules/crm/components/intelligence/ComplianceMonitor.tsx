'use client';

import { useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useComplianceLicenses } from '../../hooks/useComplianceLicenses';
import { useCompliancePayments } from '../../hooks/useCompliancePayments';
import { AlertTriangle } from 'lucide-react';
import type { ComplianceLicense, CompliancePayment } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const LICENSE_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'danger',
};

const PAYMENT_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  compliant: 'success',
  approaching: 'warning',
  overdue: 'danger',
};

type LicenseRow = ComplianceLicense & Record<string, unknown>;
type PaymentRow = CompliancePayment & Record<string, unknown>;

export function ComplianceMonitor() {
  const { data: licenses, isLoading: loadingLicenses } = useComplianceLicenses();
  const { data: payments, isLoading: loadingPayments } = useCompliancePayments();

  // Per-account compliance history
  const accountHistory = useMemo(() => {
    if (!payments) return [];
    const map: Record<string, { name: string; totalPayments: number; overdueCount: number; totalDays: number }> = {};
    payments.forEach((p) => {
      if (!map[p.accountId]) map[p.accountId] = { name: p.accountName, totalPayments: 0, overdueCount: 0, totalDays: 0 };
      map[p.accountId].totalPayments++;
      map[p.accountId].totalDays += p.daysElapsed;
      if (p.status === 'overdue') map[p.accountId].overdueCount++;
    });
    return Object.values(map)
      .map((a) => ({ ...a, avgDays: (a.totalDays / a.totalPayments).toFixed(1) }))
      .sort((a, b) => b.overdueCount - a.overdueCount);
  }, [payments]);

  if (loadingLicenses || loadingPayments) return <LoadingSkeleton variant="card" count={4} />;
  if (!licenses || !payments) return null;

  const activeLicenses = licenses.filter((l) => l.status !== 'expired').length;
  const expiringSoon = licenses.filter((l) => l.status === 'expiring' && l.daysRemaining <= 30).length;
  const expired = licenses.filter((l) => l.status === 'expired').length;
  const overduePayments = payments.filter((p) => p.status === 'overdue');
  const overdueTotal = overduePayments.reduce((s, p) => s + p.amount, 0);
  const totalOutstanding = payments.reduce((s, p) => s + p.amount, 0);
  const accountsMultipleOverdue = new Set(overduePayments.map((p) => p.accountId)).size;

  const sortedLicenses = [...licenses].sort((a, b) => a.daysRemaining - b.daysRemaining);

  const licenseColumns = [
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
      render: (row: LicenseRow) => (
        <div className="flex items-center gap-2">
          {(row.daysRemaining as number) <= 30 && (row.daysRemaining as number) >= 0 && (
            <AlertTriangle className="h-3.5 w-3.5 text-danger" />
          )}
          <span className="font-medium text-text-bright">{row.accountName as string}</span>
        </div>
      ),
    },
    { header: 'License #', accessor: 'licenseNumber' as const },
    {
      header: 'Expiration',
      accessor: 'expirationDate' as const,
      sortable: true,
      render: (row: LicenseRow) => new Date(row.expirationDate as string).toLocaleDateString(),
    },
    {
      header: 'Days Left',
      accessor: 'daysRemaining' as const,
      sortable: true,
      render: (row: LicenseRow) => {
        const days = row.daysRemaining as number;
        return (
          <span className={days < 0 ? 'text-danger font-bold' : days <= 30 ? 'text-danger' : days <= 180 ? 'text-warning' : 'text-text-default'}>
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: LicenseRow) => (
        <StatusBadge variant={LICENSE_VARIANT[row.status as string] || 'default'} label={row.status as string} size="sm" />
      ),
    },
  ];

  const sortedPayments = [...payments].sort((a, b) => {
    const order = { overdue: 0, approaching: 1, compliant: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  const paymentColumns = [
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
      render: (row: PaymentRow) => <span className="font-medium text-text-bright">{row.accountName as string}</span>,
    },
    { header: 'Order #', accessor: 'orderNumber' as const },
    {
      header: 'Delivery Date',
      accessor: 'deliveryDate' as const,
      render: (row: PaymentRow) => new Date(row.deliveryDate as string).toLocaleDateString(),
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      sortable: true,
      render: (row: PaymentRow) => <span>${Number(row.amount).toLocaleString()}</span>,
    },
    { header: 'Method', accessor: 'method' as const },
    {
      header: 'Days',
      accessor: 'daysElapsed' as const,
      sortable: true,
      render: (row: PaymentRow) => {
        const days = row.daysElapsed as number;
        const max = row.maxDays as number;
        const pct = Math.min((days / max) * 100, 100);
        const overPct = days > max ? Math.min(((days - max) / max) * 100, 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded-full bg-elevated">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(pct + overPct, 100)}%`,
                  backgroundColor: days > max ? '#EF4444' : days >= max - 1 ? '#FBBF24' : '#22C55E',
                }}
              />
            </div>
            <span className={`text-xs ${days > max ? 'text-danger font-bold' : 'text-text-default'}`}>
              {days}/{max}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: PaymentRow) => (
        <StatusBadge variant={PAYMENT_VARIANT[row.status as string]} label={row.status as string} size="sm" />
      ),
    },
  ];

  type HistoryRow = typeof accountHistory[number] & Record<string, unknown>;
  const historyColumns = [
    { header: 'Account', accessor: 'name' as const, sortable: true, render: (row: HistoryRow) => <span className="font-medium text-text-bright">{row.name}</span> },
    { header: 'Avg Days to Payment', accessor: 'avgDays' as const, sortable: true },
    {
      header: 'Violations',
      accessor: 'overdueCount' as const,
      sortable: true,
      render: (row: HistoryRow) => (
        <span className={(row.overdueCount as number) > 0 ? 'text-danger font-bold' : 'text-text-default'}>
          {row.overdueCount as number}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Active Licenses" value={activeLicenses} accentColor="#22C55E" />
        <MetricCard label="Expiring Soon (<30d)" value={expiringSoon} accentColor={CRM_ACCENT} />
        <MetricCard label="Expired" value={expired} accentColor="#EF4444" />
        <MetricCard label="Overdue Payments" value={`${overduePayments.length} ($${overdueTotal.toLocaleString()})`} accentColor="#EF4444" />
      </div>

      {/* License Tracking */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">License Tracking</h3>
        <DataTable
          data={sortedLicenses as LicenseRow[]}
          columns={licenseColumns}
          searchable
          searchPlaceholder="Search accounts..."
          pageSize={10}
        />
      </div>

      {/* Payment Compliance */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Payment Compliance</h3>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard label="Total Outstanding AR" value={`$${totalOutstanding.toLocaleString()}`} accentColor="#5BB8E6" />
          <MetricCard label="Overdue Count" value={overduePayments.length} accentColor="#EF4444" />
          <MetricCard label="Overdue Total" value={`$${overdueTotal.toLocaleString()}`} accentColor="#EF4444" />
          <MetricCard label="Accounts w/ Multiple Overdue" value={accountsMultipleOverdue} accentColor={CRM_ACCENT} />
        </div>
        <DataTable
          data={sortedPayments as PaymentRow[]}
          columns={paymentColumns}
          pageSize={10}
        />
      </div>

      {/* Compliance History */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Compliance History</h3>
        <DataTable
          data={accountHistory as HistoryRow[]}
          columns={historyColumns}
          pageSize={8}
        />
      </div>
    </div>
  );
}
