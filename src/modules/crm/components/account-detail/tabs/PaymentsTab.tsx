'use client';

import { useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountPayments } from '../../../hooks';
import type { AccountPayment } from '../../../types';

const CRM_ACCENT = '#F59E0B';

interface PaymentsTabProps {
  accountId: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function statusVariant(status: AccountPayment['status']) {
  switch (status) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    case 'partial': return 'info' as const;
  }
}

interface PaymentRow extends Record<string, unknown> {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  paidDate: string | null;
  method: string | null;
}

export function PaymentsTab({ accountId }: PaymentsTabProps) {
  const { data: paymentData, isLoading } = useAccountPayments(accountId);

  const rows: PaymentRow[] = useMemo(() => {
    if (!paymentData) return [];
    return paymentData.payments.map((p) => ({
      id: p.id,
      invoiceNumber: p.invoiceNumber,
      date: p.date,
      dueDate: p.dueDate,
      amount: p.amount,
      status: p.status,
      paidDate: p.paidDate,
      method: p.method,
    }));
  }, [paymentData]);

  const columns = useMemo(() => [
    {
      header: 'Invoice',
      accessor: 'invoiceNumber' as const,
      sortable: true,
      render: (row: PaymentRow) => <span className="font-medium text-text-bright">{row.invoiceNumber}</span>,
    },
    {
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
      render: (row: PaymentRow) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    {
      header: 'Due',
      accessor: 'dueDate' as const,
      sortable: true,
      render: (row: PaymentRow) => new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      sortable: true,
      render: (row: PaymentRow) => <span className="font-medium text-text-default">{formatCurrency(row.amount)}</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: PaymentRow) => (
        <StatusBadge variant={statusVariant(row.status as AccountPayment['status'])} label={row.status} size="sm" />
      ),
    },
    {
      header: 'Paid',
      accessor: 'paidDate' as const,
      sortable: true,
      render: (row: PaymentRow) => row.paidDate
        ? new Date(row.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : <span className="text-text-muted">—</span>,
    },
    {
      header: 'Method',
      accessor: 'method' as const,
      sortable: false,
      render: (row: PaymentRow) => row.method
        ? <span className="uppercase text-text-default">{row.method}</span>
        : <span className="text-text-muted">—</span>,
    },
  ], []);

  if (isLoading || !paymentData) return <LoadingSkeleton variant="card" count={2} />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Outstanding Balance"
          value={formatCurrency(paymentData.outstanding)}
          accentColor={CRM_ACCENT}
        />
        <MetricCard
          label="Reliability Score"
          value={`${paymentData.reliability}%`}
          accentColor={CRM_ACCENT}
        />
        <MetricCard
          label="Avg Days to Pay"
          value={`${paymentData.avgDaysToPay}d`}
          accentColor={CRM_ACCENT}
        />
      </div>

      <DataTable<PaymentRow>
        data={rows}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
}
